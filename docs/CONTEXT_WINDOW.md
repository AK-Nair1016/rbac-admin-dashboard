# CONTEXT_WINDOW.md

> This file is the rolling memory for AI coding assistants. Update after
> every major implementation or refactor.

# Current Project

API Access Governance Platform

Current Version: v1

## Current Sprint

Phase 0 frontend refactor.

## Current Objective

Complete Frontend Milestones 2 and 3 by establishing the reusable
frontend layout system and shared UI component foundation while
preserving all existing frontend behavior.

Priority:

1. Implement responsive dashboard layout, sidebar, top navigation, page
   container, and shared content wrapper
2. Add shared reusable UI components using React, TypeScript, and CSS
   Modules
3. Standardize base button, form, card, table, badge, loading, empty, and
   error state styles
4. Preserve current routes, auth flow, RBAC behavior, API contracts, and
   page functionality

## Completed

- Documentation suite created
- Backend Phase 0 architecture refactor completed
- Frontend folder structure normalized to use `src/layouts/`
- Inconsistent frontend files renamed for clarity, including the user
  permissions page
- Dead commented code removed from the entities page and unused scaffold
  assets removed
- Vite starter branding removed from the frontend title, README, package
  name, and static assets
- UI branding updated from RBAC dashboard language to API Access
  Governance language without redesigning the interface
- Auth context responsibilities split into provider, context, types, and
  hook files to satisfy lint rules and keep Context API structure clean
- Existing entity, dashboard, login, and permission management flows
  preserved after the structural refactor
- Frontend TypeScript build passed with `npm run build`
- Frontend ESLint check passed with `npm run lint`
- Frontend Milestone 2 layout system completed with responsive dashboard
  shell, mobile sidebar behavior, top navigation/header, consistent page
  container, and shared content wrapper
- Frontend Milestone 3 shared UI component foundation completed,
  including page headers, section cards, stat cards, data tables, status
  badges, search, pagination, dialogs, form inputs, buttons, and
  loading/empty/error states
- Dashboard now consumes the shared header, section, stat, loading,
  empty, and error state components without changing its API calls,
  role-based rendering, routes, or feature behavior
- Existing entity and user permissions pages were intentionally not
  refactored during Milestones 2 and 3
- Frontend TypeScript build passed with `npm run build` after Milestones
  2 and 3
- Frontend ESLint check passed with `npm run lint` after Milestones 2
  and 3

## In Progress

- None

## Pending

- Dashboard redesign
- Existing page decomposition using shared components
- Dashboard redesign
- API Catalog
- Access Requests
- Approval Workflow
- Audit Dashboard
- Onboarding
- Offboarding

## Files Modified

- frontend/README.md
- frontend/index.html
- frontend/package.json
- frontend/package-lock.json
- frontend/src/App.tsx
- frontend/src/api/entities.ts
- frontend/src/auth/AuthContext.tsx
- frontend/src/auth/ProtectedRoute.tsx
- frontend/src/components/Sidebar.tsx
- frontend/src/components/Sidebar.module.css
- frontend/src/components/MetricCard.tsx
- frontend/src/layouts/DashboardLayout.tsx
- frontend/src/layouts/DashboardLayout.module.css
- frontend/src/pages/Dashboard.tsx
- frontend/src/pages/Dashboard.module.css
- frontend/src/pages/Login.tsx
- frontend/src/pages/entities/CreateEntity.tsx
- frontend/src/pages/entities/EntitiesList.tsx
- frontend/src/pages/entities/EntitiesList.module.css
- docs/CONTEXT_WINDOW.md
- docs/15_IMPLEMENTATION_CHECKLIST.md

## Files Added

- frontend/src/auth/context.ts
- frontend/src/auth/types.ts
- frontend/src/auth/useAuth.ts
- frontend/src/layouts/DashboardLayout.tsx
- frontend/src/layouts/DashboardLayout.module.css
- frontend/src/pages/UserPermissionsPage.tsx
- frontend/src/pages/UserPermissionsPage.module.css
- frontend/src/components/common/Button.tsx
- frontend/src/components/common/Button.module.css
- frontend/src/components/common/ConfirmDialog.tsx
- frontend/src/components/common/ConfirmDialog.module.css
- frontend/src/components/common/EmptyState.tsx
- frontend/src/components/common/ErrorState.tsx
- frontend/src/components/common/LoadingState.tsx
- frontend/src/components/common/PageHeader.tsx
- frontend/src/components/common/PageHeader.module.css
- frontend/src/components/common/Pagination.tsx
- frontend/src/components/common/Pagination.module.css
- frontend/src/components/common/SearchBar.tsx
- frontend/src/components/common/SearchBar.module.css
- frontend/src/components/common/SectionCard.tsx
- frontend/src/components/common/SectionCard.module.css
- frontend/src/components/common/StatCard.tsx
- frontend/src/components/common/StatCard.module.css
- frontend/src/components/common/State.module.css
- frontend/src/components/common/StatusBadge.tsx
- frontend/src/components/common/StatusBadge.module.css
- frontend/src/components/common/TextInput.tsx
- frontend/src/components/common/TextInput.module.css
- frontend/src/components/common/index.ts
- frontend/src/components/tables/DataTable.tsx
- frontend/src/components/tables/DataTable.module.css
- frontend/src/components/tables/index.ts

## Files Removed

- frontend/public/vite.svg
- frontend/src/App.css
- frontend/src/assets/react.svg
- frontend/src/pages/usersPermit.tsx
- frontend/src/pages/UsersPermit.module.css

## Database Changes

None.

## API Changes

None. Existing frontend API calls and backend response shapes were
preserved.

## Frontend Changes

- `src/Layouts/` was normalized to `src/layouts/`
- The user permissions page was renamed to `UserPermissionsPage`
- The app router now imports the normalized layout and page paths
- Legacy Vite scaffold files and template README content were removed
- The browser title now uses `API Access Governance Platform`
- The frontend package name now uses `api-access-governance-frontend`
- Sidebar and login branding now align with the API Access Governance
  product name
- The entities page dead commented block was removed
- Missing entities action button styles were added so the edit action has
  matching CSS module support
- Auth context internals were split so lint passes without changing the
  Context API architecture
- Dashboard layout now includes a responsive shell, sticky top
  navigation/header, mobile sidebar overlay behavior, and a consistent
  content wrapper
- Sidebar keeps existing RBAC-aware links and logout behavior while
  supporting desktop collapse and mobile open/close behavior
- Shared UI components were added under `src/components/common/` and
  `src/components/tables/`
- Dashboard now uses shared UI components for page header, section
  panels, stat cards, and loading/empty/error states
- `MetricCard` remains as a compatibility wrapper around the new
  `StatCard`

## Backend Changes

- None in this session. Backend Phase 0 refactor remains complete.

## Known Issues

- No automated frontend test suite exists yet beyond build and lint
  verification
- The current frontend still exposes legacy `Entities` and `/users`
  management pages; this was intentionally preserved during Milestone 1
  to avoid changing functionality before later governance-focused UI
  milestones
- Shared components are available but most legacy pages still use local
  CSS and should be migrated gradually during a future page decomposition
  milestone

## Decisions

- Do not redesign the UI during Frontend Milestone 1
- Do not implement API Access Governance feature pages during this
  milestone
- Preserve existing routes, auth behavior, RBAC guards, and backend
  contracts while cleaning structure and branding
- Align application naming with the documented product identity without
  renaming existing entity-based functionality yet
- Keep Context API as the frontend state approach, but split provider,
  context, hook, and types for maintainability
- Complete layout and shared component foundations before dashboard
  redesign or new governance feature pages
- Do not refactor `EntitiesList` or `UserPermissionsPage` during
  Milestones 2 and 3; preserve them for a later focused page
  decomposition milestone

## Next Recommended Task

Begin the next frontend milestone focused on dashboard redesign using
the new shared layout and UI components. Do not add new routes or
governance feature pages before that milestone is explicitly started.

## Session Summary Template

Date: 2026-07-01

Author: Codex

## Completed:

- Frontend Milestone 2 layout system completed
- Frontend Milestone 3 shared UI components completed
- Responsive dashboard shell, sidebar, top navigation, page container,
  and content wrapper implemented
- Shared common and table components added with CSS Modules
- Dashboard migrated to shared foundation components without redesigning
  or changing behavior
- Build and lint verification passed

## Problems:

- No automated browser or component test suite exists yet
- Legacy business pages still use page-local styles and should be
  migrated gradually in a later milestone

## Solutions:

- Added reusable UI primitives and a responsive app shell
- Verified TypeScript build and ESLint checks pass

## Next Step:

Proceed to dashboard redesign only after confirming the foundation
milestones are accepted.
