# Frontend_Refactoring_Roadmap.md

# Purpose

Transform the current CRUD-style RBAC dashboard into a modern
**Enterprise API Access Governance Console** without changing existing
functionality.

## Phase 0 -- UI Cleanup

-   Improve spacing
-   Standardize typography
-   Responsive layout
-   Consistent button hierarchy
-   Empty/loading/error states

## Phase 1 -- Shared Components

-   DataTable
-   PageHeader
-   StatusBadge
-   ConfirmDialog
-   StatCard
-   SearchBar
-   Pagination
-   Filters

## Phase 2 -- Dashboard Transformation

Replace CRUD dashboard with governance dashboard.

### KPI Cards

-   Active Employees
-   Managed APIs
-   Active API Access
-   Pending Approvals
-   Expiring Access
-   Revoked Today
-   Users Pending Offboarding

### Dashboard Sections

-   Approval Queue
-   Audit Timeline
-   API Ownership
-   Top Requested APIs
-   Users with Expiring Access

## Phase 3 -- Navigation

Dashboard Employee Directory Teams API Catalog Access Requests Granted
Access Audit Center Reports Settings

## Phase 4 -- Existing Pages

Refactor existing pages before adding new ones.

## Phase 5 -- New Pages

-   API Catalog
-   Access Requests
-   Granted Access
-   Audit Center
-   Employee Lifecycle

## UI Principles

-   Enterprise appearance
-   Minimal animations
-   Reusable components
-   CSS Modules
-   Accessibility
