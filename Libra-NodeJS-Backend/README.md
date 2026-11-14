# Libra Backend — Node.js REST API

A standalone backend for the Libra React Library Management application. This is a real API implementation, not a mock API or endpoint-only blueprint. It is intentionally kept separate from the React frontend so reviewers can inspect each project independently.

## Stack
- Node.js 20+
- Express 5
- PostgreSQL
- Prisma ORM
- JWT access + rotating refresh tokens
- bcrypt password hashing
- Zod request validation
- Swagger UI / OpenAPI
- Helmet, CORS, rate limiting, centralized error handling

## Modules
Authentication, Dashboard, Books, Members, Authors, Publishers, Categories, Borrowings/Returns, Users/Roles, Activity Logs, Profile, Wishlist.

## Requirements
- Node.js 20 or later
- PostgreSQL 14+
- npm

## Run locally
```bash
npm install
cp .env.example .env
# Edit DATABASE_URL and JWT secrets in .env
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

API base URL: `http://localhost:5000/api`  
Health check: `http://localhost:5000/health`  
Swagger UI: `http://localhost:5000/api/docs`

## Demo account
- Email: `admin@libra.com`
- Password: `Admin@123`

Change the demo password and JWT secrets before any deployment. Seed data is for local review only.

## Authentication
Send the access token in:
```http
Authorization: Bearer <accessToken>
```
Login and registration return `{ accessToken, refreshToken, user }`. Refresh tokens are stored as SHA-256 hashes and rotated on refresh. Logout revokes the supplied refresh token.

## Frontend data mapping
The React app uses `status: 1/0` for books and `"Active"/"Inactive"` for records. This API uses explicit enums:
- Book status: `AVAILABLE` / `UNAVAILABLE`
- Member status: `ACTIVE` / `INACTIVE`
- User roles: `ADMINISTRATOR` / `LIBRARIAN` / `STAFF`

Books expose `bookAuthors` and `bookCategories` relation arrays. When wiring the React frontend, map these to `authorIds` and `categoryIds` in write requests and to the UI's expected shape in the API adapter. Borrowing status is calculated by the API from `returnDate` and `dueDate`.

## Notes
- All `/api/*` routes except `/api/auth/register`, `/api/auth/login`, and `/api/auth/refresh` require a Bearer access token.
- Register creates a Staff account. Administrator-created user accounts can have roles assigned.
- User management is Administrator-only. Catalog/circulation write operations are restricted to Administrator and Librarian; deletes are Administrator-only where configured.
- Book deletion is blocked while there is an active borrowing.
- Borrow and return operations update book availability in a database transaction.
- This backend is not connected to the deployed GitHub Pages site. GitHub Pages hosts static frontend files only; the API must be deployed separately to a Node-compatible host with PostgreSQL.

## Project structure
```text
src/
  config/          environment and Prisma client
  controllers/     HTTP controllers
  docs/            OpenAPI specification
  middleware/      auth, validation, errors, pagination
  routes/          REST route definitions
  services/        authentication and activity services
  utils/            shared helpers
  validation/       Zod schemas
prisma/
  schema.prisma
  seed.js
```
