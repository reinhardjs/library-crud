# CURL Examples

## 1. Book Endpoints:

### Create Book
```
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "quantity": 5,
  }'
```

### Get All Books
```
curl -X GET http://localhost:3000/api/books
```

### Update Book
```
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "quantity": 10,
  }'
```
