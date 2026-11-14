export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Libra Library Management API",
    version: "1.0.0",
    description: "REST API for the Libra React library management frontend. Authentication uses Bearer access tokens."
  },
  servers: [{ url: "http://localhost:5000/api", description: "Local development" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      ApiError: { type: "object", properties: { success: { type: "boolean", example: false }, message: { type: "string" } } },
      PaginatedResponse: { type: "object", properties: { success: { type: "boolean" }, data: { type: "array", items: { type: "object" } }, pagination: { type: "object", properties: { page: { type: "integer" }, limit: { type: "integer" }, total: { type: "integer" }, totalPages: { type: "integer" } } } } }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": { post: { security: [], summary: "Create a staff account", responses: { 201: { description: "Created" }, 400: { description: "Validation error" } } } },
    "/auth/login": { post: { security: [], summary: "Login", responses: { 200: { description: "Tokens and user" }, 401: { description: "Invalid credentials" } } } },
    "/auth/refresh": { post: { security: [], summary: "Rotate refresh token", responses: { 200: { description: "New token pair" } } } },
    "/auth/logout": { post: { summary: "Revoke refresh token", responses: { 200: { description: "Logged out" } } } },
    "/auth/me": { get: { summary: "Current user", responses: { 200: { description: "Current user profile" } } } },
    "/auth/change-password": { patch: { summary: "Change password", responses: { 200: { description: "Password changed" } } } },
    "/dashboard": { get: { summary: "Dashboard statistics and widgets", responses: { 200: { description: "Dashboard data" } } } },
    "/books": {
      get: { summary: "List/search/filter books", parameters: [{ in: "query", name: "search", schema: { type: "string" } }, { in: "query", name: "status", schema: { type: "string", enum: ["AVAILABLE", "UNAVAILABLE"] } }, { in: "query", name: "categoryId", schema: { type: "integer" } }, { in: "query", name: "publisherId", schema: { type: "integer" } }, { in: "query", name: "page", schema: { type: "integer" } }, { in: "query", name: "limit", schema: { type: "integer" } }], responses: { 200: { description: "Paginated books" } } },
      post: { summary: "Create book", responses: { 201: { description: "Created" } } }
    },
    "/books/{id}": { get: { summary: "Book details", parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Book details" } } }, put: { summary: "Update book", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete book", responses: { 200: { description: "Deleted" }, 409: { description: "Active borrowing conflict" } } } },
    "/members": { get: { summary: "List/search members", responses: { 200: { description: "Members" } } }, post: { summary: "Create member", responses: { 201: { description: "Created" } } } },
    "/members/{id}": { get: { summary: "Member details", responses: { 200: { description: "Member" } } }, put: { summary: "Update member", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete member", responses: { 200: { description: "Deleted" } } } },
    "/authors": { get: { summary: "List authors", responses: { 200: { description: "Authors" } } }, post: { summary: "Create author", responses: { 201: { description: "Created" } } } },
    "/authors/{id}": { get: { summary: "Author details", responses: { 200: { description: "Author" } } }, put: { summary: "Update author", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete author", responses: { 200: { description: "Deleted" } } } },
    "/publishers": { get: { summary: "List publishers", responses: { 200: { description: "Publishers" } } }, post: { summary: "Create publisher", responses: { 201: { description: "Created" } } } },
    "/publishers/{id}": { get: { summary: "Publisher details", responses: { 200: { description: "Publisher" } } }, put: { summary: "Update publisher", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete publisher", responses: { 200: { description: "Deleted" } } } },
    "/categories": { get: { summary: "List categories", responses: { 200: { description: "Categories" } } }, post: { summary: "Create category", responses: { 201: { description: "Created" } } } },
    "/categories/{id}": { get: { summary: "Category details", responses: { 200: { description: "Category" } } }, put: { summary: "Update category", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete category", responses: { 200: { description: "Deleted" } } } },
    "/borrowings": { get: { summary: "List borrowings and calculated status", responses: { 200: { description: "Borrowings" } } }, post: { summary: "Borrow available book", responses: { 201: { description: "Borrowed" }, 409: { description: "Book unavailable" } } } },
    "/borrowings/{id}/return": { patch: { summary: "Return a borrowed book", responses: { 200: { description: "Returned" } } } },
    "/borrowings/{id}": { patch: { summary: "Update borrowing due date/member", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete borrowing record", responses: { 200: { description: "Deleted" } } } },
    "/users": { get: { summary: "List users (Administrator)", responses: { 200: { description: "Users" } } }, post: { summary: "Create user (Administrator)", responses: { 201: { description: "Created" } } } },
    "/users/{id}": { put: { summary: "Update user and role", responses: { 200: { description: "Updated" } } }, delete: { summary: "Delete user", responses: { 200: { description: "Deleted" } } } },
    "/profile": { get: { summary: "Get current profile", responses: { 200: { description: "Profile" } } }, patch: { summary: "Update current profile", responses: { 200: { description: "Updated" } } } },
    "/wishlist": { get: { summary: "Get current user's wishlist", responses: { 200: { description: "Wishlist" } } } },
    "/wishlist/{bookId}": { post: { summary: "Add book to wishlist", responses: { 201: { description: "Added" } } }, delete: { summary: "Remove book from wishlist", responses: { 200: { description: "Removed" } } } },
    "/activity-logs": { get: { summary: "Search/filter activity logs", responses: { 200: { description: "Activity log page" } } } }
  }
};
