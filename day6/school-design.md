# School Database Design

## Tables

- **students**: Stores each student's ID, name and unique email address. `student_id` is the primary key.
- **courses**: Stores each course's ID, course code and course name. `course_id` is the primary key.
- **enrolments**: Connects students to courses and stores the student's grade. It has foreign keys to both tables. `UNIQUE(student_id, course_id)` prevents the same student from enrolling in the same course twice.

## Relationships

- **Student → enrolments: one-to-many.** One student can have many enrolment records, while each enrolment belongs to one student.
- **Course → enrolments: one-to-many.** One course can have many enrolment records, while each enrolment belongs to one course.
- **Student ↔ course: many-to-many.** A student can take many courses and a course can have many students. The `enrolments` join table is needed to represent this relationship and to store relationship-specific data such as the grade.

## Index

I would add an index on `enrolments(course_id)` because queries that find all students enrolled in a particular course will frequently search by `course_id`. The index can make those lookups faster as the number of enrolments grows.

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
```

## SQL or NoSQL?

I would choose **SQL** for this school system. Students, courses and enrolments have clear, structured relationships, and the system needs primary keys, foreign keys, uniqueness rules, joins and aggregate queries. A relational SQL database is therefore a good fit because it supports these relationships and data-integrity rules directly. NoSQL would be more useful if the data were highly unstructured or the schema changed very frequently.
