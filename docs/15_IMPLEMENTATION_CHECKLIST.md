# 15_IMPLEMENTATION_CHECKLIST.md

## Phase 0 -- Existing System Refactor

### Backend

-   [x] Auth slice refactored
-   [x] RBAC role enforcement fixed
-   [x] Permissions slice refactored
-   [x] Entities slice refactored
-   [x] Users slice refactored
-   [x] Dashboard / metrics slice refactored
-   [x] Service layer cleanup
-   [x] Thin controllers
-   [ ] Validation middleware
-   [x] Global error handler
-   [x] Response wrapper
-   [x] Structured logging
-   [ ] Query layer cleanup
-   [x] Update CONTEXT_WINDOW

### Frontend

-   [ ] Layout cleanup
-   [ ] Sidebar polish
-   [ ] Dashboard redesign
-   [ ] Shared components
-   [ ] Tables
-   [ ] Forms
-   [ ] Loading/Empty states
-   [ ] Update CONTEXT_WINDOW

## Phase 1 -- Organization

-   [ ] Departments
-   [ ] Teams
-   [ ] Employee profile improvements

## Phase 2 -- API Catalog

-   [ ] CRUD
-   [ ] Ownership
-   [ ] Search
-   [ ] Pagination

## Phase 3 -- Access Governance

-   [ ] Access Requests
-   [ ] Manager Approval
-   [ ] Security Approval
-   [ ] Grant Access
-   [ ] Reject Access

## Phase 4 -- Access Management

-   [ ] Granted Access
-   [ ] Revoke
-   [ ] Extend
-   [ ] Expiry

## Phase 5 -- Audit Center

-   [ ] Audit Timeline
-   [ ] Filters
-   [ ] Dashboard Metrics

## Phase 6 -- Employee Lifecycle

-   [ ] Onboarding
-   [ ] Offboarding

## Before Every Merge

-   [x] Documentation updated
-   [x] CONTEXT_WINDOW updated
-   [ ] Tests pass
-   [ ] No architecture violations
