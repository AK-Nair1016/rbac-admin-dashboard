# 02 - System Architecture

# High-Level Architecture

    React (Vite)
        │
    Protected Routes
        │
    REST API
        │
    Express Controllers
        │
    Services
        │
    Database Layer
        │
    PostgreSQL

## Core Components

-   Authentication Service
-   User Service
-   Team Service
-   API Catalog Service
-   Access Request Service
-   Access Management Service
-   Audit Service
-   Dashboard Service

## Request Flow

Client → Route → Middleware (JWT/RBAC) → Controller → Service → DB →
Response

## Authentication Flow

Login → Validate Credentials → Generate JWT → Store Client Token →
Access Protected APIs

## Authorization Flow

JWT → Decode User → Load Role → Verify Permission → Continue / 403

## Access Request Lifecycle

Developer → Submit Request → Team Lead Approval → Security Approval
(optional/configurable) → Grant Access → Audit Event

## Onboarding

Create User → Assign Department → Assign Team → Assign Role → Assign
Default API Access → Audit

## Offboarding

Disable User → Revoke API Access → Remove Team Membership → Close
Pending Requests → Audit → Archive

# Backend Folder Structure

``` text
src/
  config/
  controllers/
  services/
  db/
  middleware/
  validators/
  routes/
  utils/
  errors/
  types/
```

Service responsibilities: - Controllers: HTTP only - Services: business
rules - DB: SQL access - Middleware: auth, RBAC, validation - Utils:
reusable helpers

# Frontend Structure

``` text
src/
 pages/
 layouts/
 components/
 api/
 auth/
 hooks/
 types/
 utils/
```

# Dashboard Modules

Dashboard Users Teams API Catalog Access Requests Granted Access Audit
Logs Settings

# Design Principles

-   Thin controllers
-   Business logic in services
-   Centralized error handling
-   Standard API responses
-   Feature growth without major restructuring
