# 10 - Testing Strategy

## Goals

Validate correctness, security and business workflows.

## Backend Tests

Authentication - Valid login - Invalid login - Expired JWT - Missing JWT

Authorization - Platform Admin access - Team Lead restrictions -
Developer restrictions

Validation - Invalid email - Duplicate employee - Invalid expiry -
Missing reason

Business Logic - Grant access - Reject request - Revoke access -
Offboard employee

## Frontend Tests

Pages render correctly

Protected routes

Forms

Search

Pagination

Role-based navigation

## Manual Test Scenarios

### Onboarding

Create employee Assign team Assign role Verify default API access

### Access Request

Developer submits request Manager approves Security approves Verify
granted access

### Offboarding

Disable employee Revoke access Verify requests closed Verify audit
history retained

## Security Checklist

-   Password hashing
-   JWT validation
-   RBAC enforced
-   Input validation
-   SQL injection prevention
-   Rate limiting
-   CORS configured

## Performance Checklist

-   Paginated tables
-   Indexed queries
-   Optimized dashboard queries

## Regression Checklist

Existing RBAC features continue working after every sprint.
