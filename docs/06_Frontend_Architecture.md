# 06 - Frontend Architecture

## Objective

Provide a modern, minimal enterprise dashboard for API Access Governance
while keeping the codebase simple and maintainable.

## Tech Stack

-   React
-   TypeScript
-   React Router
-   Context API
-   CSS Modules

## Folder Structure

``` text
src/
├── api/
├── auth/
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── forms/
│   ├── tables/
│   └── charts/
├── layouts/
├── pages/
├── hooks/
├── types/
└── utils/
```

## Pages

-   Login
-   Dashboard
-   Users
-   Teams
-   API Catalog
-   Access Requests
-   Granted Access
-   Audit Logs
-   Settings
-   Profile

## Shared Components

-   DataTable
-   SearchBar
-   StatusBadge
-   ConfirmDialog
-   StatCard
-   EmptyState
-   LoadingSpinner
-   PageHeader

## Layout

Sidebar Top Navbar Breadcrumb Main Content Footer

## Navigation

Dashboard Users Teams API Catalog Access Requests Granted Access Audit
Logs Settings

## State Management

Context: - AuthContext

Local state: - Forms - Tables - Filters

## UI Principles

-   Consistent spacing
-   Responsive layout
-   Minimal animations
-   Accessible colors
-   Reusable components
-   No duplicated CRUD pages
