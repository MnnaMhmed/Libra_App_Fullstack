# Libra — Library Management System

A modern Library Management System featuring a responsive **React frontend** and a structured **Node.js backend**. The project demonstrates a complete full-stack application structure, covering library operations, user management, authentication, and RESTful API development.

The repository contains both frontend and backend source code, organized into separate directories for easier development, maintenance, and review.

## Project Overview

Libra is designed to simplify library operations through an intuitive dashboard and a collection of management modules. It provides features for managing books, members, authors, publishers, categories, borrowing records, and user accounts.

### Technology Stack

**Frontend**
- React
- JavaScript
- HTML5 & CSS3
- Vite
- Browser Local Storage

**Backend**
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- RESTful API Architecture

## Frontend — React

The frontend provides a responsive and interactive user interface with the following features:

### Dashboard
- Overview of library collection statistics.
- Borrowing trends and activity insights.
- Category distribution.
- Recent library activities.
- Popular books.

### Book Management
- Browse and search books.
- Filter books by relevant criteria.
- View detailed book information.
- Add, edit, and delete books.
- Borrow books.

### Library Management
- Manage members and their information.
- Manage authors and publishers.
- Organize book categories.
- Manage user accounts.
- Search, filter, and update records.

### Borrowing Management
- Create and manage borrowing records.
- Update borrowing due dates.
- Process book returns.
- Track borrowed, returned, and overdue books.
- Search and filter borrowing records.

### Additional Features
- User registration and login.
- Profile editing.
- Wishlist management.
- Activity logs.
- Light and dark themes.
- Responsive navigation and layouts.

### Frontend Data Storage
The current frontend demo operates independently using browser `localStorage`.

- Sample data is initialized on the first launch.
- Application changes persist in the browser.
- Authentication and user roles are simulated locally.
- No backend API connection is currently configured.

## Backend — Node.js

The backend is organized as a separate API project, designed to provide server-side functionality for the Libra application.

### Backend Structure

- **Controllers:** Handle incoming API requests and responses.
- **Routes:** Define and organize API endpoints.
- **Services:** Separate application logic from request handling.
- **Middleware:** Handle shared request-processing functionality.
- **Validation:** Organize request validation schemas.
- **Configuration:** Centralize application configuration.
- **Prisma:** Define the database schema and seed data.
- **API Documentation:** Include OpenAPI documentation and API reference.

### Backend Capabilities
- RESTful API structure.
- Server-side application organization.
- Database modeling with Prisma ORM.
- PostgreSQL database integration.
- Request validation and middleware organization.
- Authentication-related utilities and token handling.
- API documentation structure.

## Project Structure

```text
Libra_App_Fullstack/
│
├── src/                         # React frontend
├── public/
├── package.json
├── vite.config.js
│
└── Libra-NodeJS-Backend/        # Node.js backend
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── services/
    │   ├── middleware/
    │   ├── validation/
    │   ├── config/
    │   ├── utils/
    │   └── docs/
    │
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    │
    ├── package.json
    ├── .env.example
    ├── README.md
    └── API-REFERENCE.md
```

## Getting Started

### Frontend Setup

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Open the local URL provided by Vite.

### Demo Account

```text
Email: admin@libra.com
Password: Admin@123
```

You can also create a local account through the Register screen.

### Backend Setup

Navigate to the backend directory:

```bash
cd Libra-NodeJS-Backend
npm install
```

Configure your environment variables using `.env.example`, including the PostgreSQL connection settings.

Then configure Prisma and run the backend according to the scripts defined in the backend `package.json`.

## Live Demo

**Frontend:** [View Libra Live](https://mnnamhmed.github.io/Libra_App_Fullstack/)

**GitHub Repository:** [Libra_App_Fullstack](https://github.com/MnnaMhmed/Libra_App_Fullstack)

## Important Notes

- The React frontend and Node.js backend are currently maintained as separate parts of the same repository.
- The frontend currently uses browser local storage and does not consume the backend APIs.
- Frontend authentication and roles are demonstration-only and should not be considered production-secure.
- The backend source code is included for architecture review and further development.
- GitHub Pages is used to deploy the frontend only; it does not host or execute the Node.js backend.

---

**Libra — A Full-Stack Library Management System built with React and Node.js.**
