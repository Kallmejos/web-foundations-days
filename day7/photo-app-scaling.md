# SnapShare: Photo-App Scaling Plan

## 1. Assumptions and daily active users

- SnapShare has **10 million registered users**.
- **10% of registered users are active each day**.
- Each daily active user uploads **1 photo per day** and views **50 feed pages per day**.
- Each original photo averages **2 MB** and each thumbnail averages **50 KB**.
- Use 86,400 seconds per day and 365 days per year. Storage estimates use decimal units (1 GB = 1,000 MB; 1 TB = 1,000 GB).
- The calculations below are daily averages. Peak feed traffic is estimated as **5 times the average**. Real traffic can vary, so production capacity should be monitored and tested.

Daily active users = 10,000,000 × 10% = **1,000,000 daily active users**.

## 2. Uploads, feed views and storage

### Uploads per second

- Uploads per day = 1,000,000 active users × 1 photo = **1,000,000 uploads/day**.
- Average uploads per second = 1,000,000 ÷ 86,400 = **about 11.6 uploads/second**.
- The 5× peak assumption would be about **58 uploads/second** if applied to upload traffic as well.

### Feed views per second

- Feed-page views per day = 1,000,000 active users × 50 pages = **50,000,000 feed-page views/day**.
- Average feed views per second = 50,000,000 ÷ 86,400 = **about 579 views/second**.
- Peak feed views per second = 579 × 5 = **about 2,895 views/second**.

A feed-page view is counted as one feed request; each page can include several photo thumbnails or images.

### Photo storage per year

- Original photos per year = 1,000,000 × 365 = **365,000,000 photos**.
- Original photo storage = 365,000,000 × 2 MB = 730,000,000 MB = **730 TB/year**.
- Thumbnail storage = 365,000,000 × 50 KB = 18,250,000,000 KB = **18.25 TB/year**.
- Total new image storage = 730 TB + 18.25 TB = **about 748.25 TB/year**, excluding replicas, backups, metadata and storage overhead.

## 3. Read-heavy or write-heavy?

SnapShare is **read-heavy**. The average is about 579 feed-page views per second compared with about 11.6 uploads per second, and peak feed traffic is estimated at about 2,895 views per second. This means the design should optimize frequent reads using a CDN, cache and database read replica, while still making uploads reliable and processing them without slowing the user-facing request.

## 4. Where photo files should be stored

Photo files should **not be stored as large binary files inside the relational database**. Doing so can make database backups, replication and queries heavier and more expensive, while consuming resources meant for structured data. Instead, store original photos and thumbnails in **object storage**; keep only metadata (such as photo ID, owner, timestamps, object keys and processing status) in the database. A CDN can then cache and deliver images efficiently to users.

## 5. Architecture diagram

```text
                   Users / Mobile Apps / Browsers
                    |                       ^
              API / upload                   | Feed data / images
                    v                       |
               [Load Balancer] <-------------+
                    |
                [App Servers]
                 /    |     \
                /     |      \ enqueue thumbnail job
           [Cache] [Primary DB] -------> [Queue]
              |        |                   |
              |        +--> [Read Replica] v
              |                     [Thumbnail Worker]
              |                            |
              +----------------------------+
                                           v
                                    [Object Storage]
                                           ^
                                           |
                                      [CDN] +----> Users
```

App servers store photo metadata in the database and photo files in object storage. The thumbnail worker creates thumbnails asynchronously and stores them in object storage. The CDN delivers image files from nearby edge locations.

## 6. Components: one sentence each

- **CDN:** Delivers frequently viewed photos and thumbnails from locations close to users, reducing latency and origin bandwidth.
- **Load balancer:** Distributes incoming API requests across healthy app servers so a single server does not become a bottleneck.
- **App servers:** Handle authentication, permissions, upload coordination, feed generation and API requests.
- **Cache:** Keeps popular feed data and metadata in memory to reduce database queries and speed up feed loading.
- **Primary database:** Stores structured, durable data such as users, follows, photo metadata, object keys and processing status.
- **Read replica:** Handles read queries separately from writes, reducing the read workload on the primary database.
- **Object storage:** Stores original photos and thumbnails durably and cost-effectively without putting large image files inside the relational database.
- **Queue:** Buffers thumbnail jobs so image processing can happen asynchronously and upload requests can return quickly.
- **Thumbnail worker:** Takes queued jobs, creates compressed 50 KB thumbnails and saves them to object storage.

## 7. Photo upload flow

1. A signed-in user selects a photo and starts an upload.
2. The load balancer routes the API request to a healthy app server.
3. The app server checks the user's permissions, file type and file size.
4. The app server creates a photo metadata record in the primary database with a unique object key and a status such as `processing`.
5. The original photo is uploaded to object storage. A short-lived pre-signed URL can allow the client to upload the large file directly, rather than sending all image bytes through the app server.
6. After the original upload succeeds, the app server or a storage-event handler adds a thumbnail job to the queue.
7. The app responds that the upload has been received and is processing, so the user does not need to wait for thumbnail generation.
8. A thumbnail worker takes the job, reads the original photo from object storage and generates a smaller thumbnail.
9. The worker saves the thumbnail in object storage and updates the photo record to mark processing as complete and record the thumbnail object key.
10. When followers load their feeds, app servers get feed metadata from cache or the read replica, while the CDN delivers image files from object storage.

## 8. Trade-offs

- **Cache speed vs. freshness:** Caching speeds up feeds and reduces database load, but a feed can briefly be out of date after a new upload or follow; invalidation and short time-to-live settings help but add complexity.
- **Read replica scale vs. consistency:** A read replica increases read capacity, but replication lag can delay visibility of a new photo; the app may need to read recent changes from the primary database.
- **Asynchronous thumbnails vs. immediate completeness:** A queue keeps uploads responsive, but a photo's thumbnail may not be ready immediately; the interface should show a placeholder and failed jobs should be retried.
- **CDN performance vs. complexity:** A CDN speeds up image delivery, but cache invalidation, access permissions and monitoring require additional work.
