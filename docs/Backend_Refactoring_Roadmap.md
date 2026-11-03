# Backend_Refactoring_Roadmap.md

# Purpose

Refactor the existing RBAC backend into the foundation of an **API
Access Governance Platform** while preserving all working functionality.

## Project Evolution

RBAC Admin Dashboard ↓ API Access Governance Platform

Refactor first. Add new features only after the existing backend is
clean.

# Refactoring Principles

-   Preserve JWT authentication.
-   Preserve RBAC behavior.
-   Do not break existing API contracts unless documented.
-   Refactor before rewriting.
-   Every new business action must create an audit event.

# Phase 0 -- Existing Backend Refactor

## Controllers

-   Thin controllers
-   Delegate business logic to services

## Services

-   Consolidate business logic
-   Standardize naming
-   Remove duplicated logic

## Validation

-   Route-level validation middleware
-   Shared validators

## Error Handling

-   Global AppError
-   Consistent API responses

## Logging

-   Structured logging (Pino)
-   Authentication events
-   Access events
-   Errors

## Database

-   Organize SQL/query layer
-   Transactions where appropriate

# Phase 1 -- Existing Feature Cleanup

-   Improve Users
-   Improve Roles
-   Improve Permissions
-   Improve Auth
-   Improve Dashboard endpoints

# Phase 2 -- New Governance Domains

-   Departments
-   Teams
-   API Catalog (metadata)
-   Access Requests
-   Granted Access
-   Audit Center
-   Onboarding
-   Offboarding

# Done Criteria

-   Existing tests pass
-   Documentation updated
-   CONTEXT_WINDOW updated
