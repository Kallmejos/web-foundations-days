# Library Books REST API

This API manages a library's **books** resource. The base URL is assumed to be:

`https://api.example.com`

## Endpoints

### 1. List all books

- **Method:** `GET`
- **Path:** `/books`
- **Description:** Returns a list of all books in the library.
- **Success status:** `200 OK`

### 2. Get one book

- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Returns one book using its unique ID.
- **Success status:** `200 OK`

### 3. Create a book

- **Method:** `POST`
- **Path:** `/books`
- **Description:** Creates a new book in the library.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

- **Success status:** `201 Created`

### 4. Update a book

- **Method:** `PUT`
- **Path:** `/books/{id}`
- **Description:** Updates the details of an existing book.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

- **Success status:** `200 OK`

### 5. Delete a book

- **Method:** `DELETE`
- **Path:** `/books/{id}`
- **Description:** Deletes a book from the library.
- **Success status:** `204 No Content`

### 6. List books by author

- **Method:** `GET`
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books whose author matches the `author` query parameter.
- **Success status:** `200 OK`

## Error Codes

- **400 Bad Request:** Happens when the client sends invalid or incomplete data, such as creating a book without a required title or author.
- **404 Not Found:** Happens when a requested book ID does not exist, such as requesting `GET /books/9999` when book `9999` is not in the library.
