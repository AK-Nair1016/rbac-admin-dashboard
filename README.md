# RBAC Admin Dashboard

A full-stack administrative dashboard demonstrating secure, backend-enforced Role-Based Access Control (RBAC) using React, Express, PostgreSQL, and JWT authentication.

This project simulates real-world internal systems such as CRM tools, HR platforms, and operations dashboards where different users require different levels of access to shared data.

The system ensures that all authorization decisions are enforced on the server, preventing privilege escalation and unauthorized data access.

---

## 🚀 Overview

This application implements a structured access control system with:

- Secure authentication using JWT
- Role-based authorization (Admin, Manager, User)
- Ownership-based access filtering
- Entity-level permission matrix (READ / WRITE / READ_WRITE)
- Backend-driven enforcement (no UI-only security)

The focus of this project is correctness, security, and architectural clarity.

---

## 🛡 Security Model

The system clearly separates **authentication** from **authorization**.

### Authentication
- JWT-based login
- Password hashing using bcrypt
- Token expiration (2 hours)
- Verification middleware

### Authorization
- Role-based validation
- Ownership checks (user → resource relationship)
- Entity-level permission enforcement
- Centralized authorization middleware

Every protected route must pass through backend validation before accessing data.

If authorization fails, the request is rejected server-side.

This prevents:
- Privilege escalation
- Unauthorized data exposure
- UI bypass attacks

---

## 🧩 Core Features

### 🔐 Authentication
- Secure login endpoint
- Token persistence on frontend
- Reload-safe authentication state

### 🗄 Entity Management
- Create entities
- Update entity details
- Toggle entity status (ACTIVE / INACTIVE)
- Assign users to entities
- Pagination and search filtering

### 🔑 Permission Matrix
- `entity_assignments` table
- `entity_permissions` table
- Fine-grained permissions:
  - READ
  - WRITE
  - READ_WRITE
- Admin role override
- Permission-aware UI rendering

### ⚙ Production Considerations
- Rate limiting
- Helmet security headers
- Strict CORS configuration
- JSON body size limits
- Centralized error handling
- 404 route handling

---

## 🏗 System Architecture

### Frontend
- React + TypeScript + Vite
- Context-based authentication state
- Protected routes
- Role-aware rendering
- Permission-aware UI components

### Backend
- Express + TypeScript
- PostgreSQL (UUID-based identifiers)
- JWT authentication
- Middleware-driven authorization
- Centralized error handling

### Database Design

#### `users`
- id (UUID)
- employee_id
- role
- password (hashed)

#### `entities`
- id (UUID)
- owner_id (FK → users)
- status
- created_at

#### `entity_assignments`
- entity_id (FK)
- user_id (FK)

#### `entity_permissions`
- entity_id (FK)
- user_id (FK)
- permission (READ / WRITE / READ_WRITE)

---

## 🔄 Request Flow (Authorization Lifecycle)

1. User logs in → JWT issued.
2. JWT is attached to subsequent requests.
3. Backend middleware verifies token.
4. Authorization middleware checks:
   - Role
   - Ownership
   - Entity-level permissions
5. Request proceeds only if validation passes.

All critical access decisions are enforced server-side.

---

## 🧠 What This Project Demonstrates

- Clear separation between authentication and authorization
- Backend-enforced security (not UI-only protection)
- Proper use of middleware for centralized control
- Entity-level permission modeling
- Structured TypeScript architecture
- Secure API design patterns

This project reflects how access control is implemented in small-to-mid scale production systems.

---

## ⚙️ Local Setup

### Backend Setup

1. Create a `.env` file inside the `backend` directory:

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

2. Install dependencies:

```
cd backend
npm install
```

3. Start development server:

```
npx ts-node-dev --files src/server.ts
```

---

### Frontend Setup

1. Install dependencies:

```
cd frontend
npm install
```

2. Start development server:

```
npm run dev
```

---

## 📌 Future Improvements

- Improve permission synchronization across views
- UI refinement and UX enhancements
- Cloud deployment configuration
- Expand metrics dashboard

---

## 📄 Resume Summary

Designed and implemented a secure full-stack admin dashboard with backend-enforced role-based access control, entity-level permissions, and centralized authorization middleware using React, Express, PostgreSQL, and JWT.

## 📌 Future Improvements

- Permission update synchronization improvements
- UI refinement and UX enhancements
- Deployment to cloud infrastructure
- Metrics dashboard expansion

---

## 📄 Resume Summary

Designed and implemented a secure full-stack admin dashboard with backend-enforced role-based access control, entity-level permissions, and centralized authorization middleware using React, Express, PostgreSQL, and JWT.

---
