# Libra API Reference

Base URL: `/api`  
Authentication: `Authorization: Bearer <accessToken>` except public auth endpoints.

All responses use JSON. Paginated list response:
```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 0, "totalPages": 0 }
}
```

## Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create Staff account |
| POST | `/auth/login` | Login and issue tokens |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke refresh token |
| GET | `/auth/me` | Current authenticated user |
| PATCH | `/auth/change-password` | Change current password |

## Dashboard
| GET | `/dashboard` | Counts, category distribution, recent borrowings, popular books and monthly trend |

## Books
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/books?search=&status=&categoryId=&publisherId=&page=&limit=` | Search, filter and paginate |
| GET | `/books/:id` | Full details, publisher, authors, categories, recent borrowing records |
| POST | `/books` | Create book |
| PUT | `/books/:id` | Update book and relations |
| DELETE | `/books/:id` | Delete if no active borrowing |

Book write example:
```json
{
  "title": "Clean Architecture",
  "isbn": "9780134494166",
  "edition": "1st Edition",
  "publicationYear": 2017,
  "language": "English",
  "publisherId": 1,
  "authorIds": [1],
  "categoryIds": [3],
  "status": "AVAILABLE",
  "coverImageUrl": "",
  "summary": "A software architecture book."
}
```

## Members, Authors, Publishers, Categories
Each resource has:
- `GET /members`, `GET /members/:id`, `POST /members`, `PUT /members/:id`, `DELETE /members/:id`
- Same route pattern for `/authors`, `/publishers`, `/categories`
- Lists support `search`, `page`, `limit`.
- Member create example: `{ "firstName":"Sara", "lastName":"Ali", "email":"sara@example.com", "phoneNumber":"+201000000000", "status":"ACTIVE" }`
- Author create example: `{ "name":"Author Name", "biography":"Biography..." }`
- Publisher create example: `{ "name":"Publisher Name", "address":"City", "email":"contact@example.com" }`
- Category create example: `{ "name":"Technology", "parentCategoryId":null }`

## Borrowings
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/borrowings?search=&page=&limit=` | List with book/member and calculated status |
| POST | `/borrowings` | Borrow available book |
| PATCH | `/borrowings/:id` | Update due date or member |
| PATCH | `/borrowings/:id/return` | Return book |
| DELETE | `/borrowings/:id` | Delete borrowing record |

Create borrowing:
```json
{ "bookId": 1, "memberId": 1, "dueDate": "2026-12-01T00:00:00.000Z" }
```

## Users
Administrator-only:
- `GET /users?search=&page=&limit=`
- `POST /users` — `{ "fullName":"Librarian", "email":"librarian@example.com", "password":"StrongPass123", "role":"LIBRARIAN" }`
- `PUT /users/:id` — update name, email, role, status
- `DELETE /users/:id`

## Activity Logs
- `GET /activity-logs?search=&action=&entityName=&page=&limit=`
- Returns user details, action, entity name/id, details and timestamp.

## Profile
- `GET /profile`
- `PATCH /profile` — `{ "fullName":"New Name", "email":"new@example.com" }`
- `PATCH /auth/change-password` — `{ "currentPassword":"old", "newPassword":"new-password" }`

## Wishlist
- `GET /wishlist`
- `POST /wishlist/:bookId`
- `DELETE /wishlist/:bookId`

## Health and docs
- `GET /health` (outside `/api`)
- `GET /api/docs` Swagger UI

## Error response
```json
{ "success": false, "message": "Validation failed.", "details": {} }
```
