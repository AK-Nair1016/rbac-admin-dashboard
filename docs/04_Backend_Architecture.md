# 04 - Backend Architecture

# Purpose

This document defines the backend architecture for the API Access
Governance Platform.

## Technology Stack

-   Node.js
-   Express.js
-   TypeScript
-   PostgreSQL
-   JWT Authentication

## Architectural Principles

-   Thin Controllers
-   Service-Oriented Business Logic
-   Raw SQL isolated in `db/`
-   Centralized Error Handling
-   Request Validation Middleware
-   Consistent API Response Format

## Folder Structure

``` text
src/
├── config/
├── controllers/
├── services/
├── db/
├── routes/
├── middleware/
├── validators/
├── errors/
├── types/
├── utils/
├── app.ts
└── server.ts
```

## Layer Responsibilities

### Routes

Map HTTP endpoints to controllers.

### Controllers

-   Parse request
-   Call service
-   Return response
-   No business logic

### Services

Responsible for: - Onboarding - Offboarding - API Access - Approval
workflow - Audit creation

### Database Layer

Files: - userQueries.ts - apiQueries.ts - accessQueries.ts -
auditQueries.ts

Contains SQL only.

### Middleware

-   authenticateJWT
-   authorizeRole
-   validateRequest
-   errorHandler
-   rateLimiter

## Standard API Response

Success

``` json
{
  "success": true,
  "message": "Access granted",
  "data": {}
}
```

Failure

``` json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Error Strategy

Create `AppError`.

Examples:

-   Unauthorized
-   Forbidden
-   ValidationError
-   NotFound
-   Conflict

Global middleware converts exceptions into HTTP responses.

## Logging

Use Pino.

Log: - Login attempts - Access approvals - Revocations - Offboarding -
Unexpected errors

## Security

-   Password hashing
-   JWT expiration
-   Helmet
-   CORS
-   Rate limiting
-   Input validation

## Service Responsibilities

AuthService

UserService

TeamService

ApiCatalogService

AccessRequestService

AccessService

AuditService

DashboardService

## Future Extension Points

-   NotificationService
-   ReviewService
-   LiveMonitoringService
-   EmailService
