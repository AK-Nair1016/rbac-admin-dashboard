# CONTEXT_WINDOW.md

> This file is the rolling memory for AI coding assistants. Update after
> every major implementation or refactor.

# Current Project

API Access Governance Platform

Current Version: v1

## Current Sprint

Phase 0 backend architecture refactor.

## Current Objective

Refactor the existing RBAC dashboard backend while preserving functionality.

Priority:

1. Thin controllers
2. Service layer cleanup
3. Validation
4. Error handling
5. Standard API response
6. Logging

## Completed

- Documentation suite created
- Product vision finalized
- Auth login refactored into controller, validator, service, and database query layers
- Centralized 404 and error handling middleware added
- RBAC role authorization fixed to enforce allowed roles
- Permissions refactored into controller, validator, service, and database query layers
- Entities refactored into controller, validator, service, and database query layers

## In Progress

- Backend refactoring

## Pending

- Continue controller/service cleanup for users and metrics
- Validation middleware for remaining routes
- Standard API response helper without breaking existing frontend contracts
- Structured logging
- Frontend refactor
- API Catalog
- Access Requests
- Approval Workflow
- Audit Dashboard
- Onboarding
- Offboarding

## Files Modified

- backend/src/app.ts
- backend/src/controllers/auth.controller.ts
- backend/src/controllers/entity.controller.ts
- backend/src/controllers/permission.controller.ts
- backend/src/middleware/rbac.middleware.ts
- backend/src/routes/entity.routes.ts
- backend/src/routes/permission.routes.ts
- backend/src/routes/auth.routes.ts
- backend/src/utils/userQueries.ts
- docs/15_IMPLEMENTATION_CHECKLIST.md
- docs/CONTEXT_WINDOW.md
- docs/startup file/CONTEXT_WINDOW.md

## Files Added

- backend/src/db/user.queries.ts
- backend/src/db/permission.queries.ts
- backend/src/db/entity.queries.ts
- backend/src/errors/AppError.ts
- backend/src/middleware/error.middleware.ts
- backend/src/services/auth.service.ts
- backend/src/services/permission.service.ts
- backend/src/services/entity.service.ts
- backend/src/utils/asyncHandler.ts
- backend/src/validators/auth.validator.ts
- backend/src/validators/permission.validator.ts
- backend/src/validators/entity.validator.ts

## Database Changes

None.

## API Changes

No endpoint or response contract changes. `/auth/login` still returns
`success`, `message`, `token`, and `user` at the top level for frontend
compatibility. Existing `/permissions` endpoints and success response
payloads are preserved. Existing `/entities` endpoints and success response
payloads are preserved.

## Frontend Changes

None.

## Backend Changes

- Login request validation moved to route middleware.
- Login business logic moved to `auth.service.ts`.
- Login SQL moved to `db/user.queries.ts`.
- Auth controller now delegates to the service and formats the HTTP response.
- App-level 404 and error handling moved into reusable middleware.
- `authorizeRoles` now checks `allowedRoles.includes(req.user.role)`.
- Permission request validation moved to route middleware.
- Permission business flow moved to `permission.service.ts`.
- Permission SQL moved to `db/permission.queries.ts`.
- Permission controller now delegates to the service and formats HTTP responses.
- Entity request validation moved to route middleware.
- Entity business flow moved to `entity.service.ts`.
- Entity SQL moved to `db/entity.queries.ts`.
- Entity controller now delegates to the service and formats HTTP responses.

## Known Issues

- Existing package lock changes were already present in the working tree and were not part of this refactor.
- No automated test script exists in `backend/package.json`.
- Users, metrics, ownership, and entity-permission middleware still contain SQL and validation logic.

## Decisions

- Preserve the existing `/auth/login` response shape instead of adopting the documented nested `data` response during this refactor, because the current frontend reads `res.data.token`.
- Keep metrics queries in `utils/userQueries.ts` until a later query-layer cleanup milestone.
- Preserve existing `/permissions` response payloads during refactor to avoid frontend contract drift.
- Preserve existing `/entities` response payloads during refactor to avoid frontend contract drift.

## Next Recommended Task

Refactor the metrics backend slice into service and db query layers while preserving existing `/metrics` endpoint and response payloads.

## Session Summary Template

Date: 2026-07-01

Author: Codex

## Completed:

- Auth login controller made thin.
- Auth service, DB query, and validator layers introduced.
- Centralized error middleware introduced.
- RBAC allowed-role enforcement fixed.
- Permissions controller made thin.
- Permission service, DB query, and validator layers introduced.
- Entities controller made thin.
- Entity service, DB query, and validator layers introduced.
- TypeScript compiler check passed with `npx tsc --noEmit`.

## Problems:

- No automated backend test script exists beyond the placeholder failing `npm test`.

## Solutions:

- Verified with TypeScript compiler check and preserved endpoint contracts.

## Next Step:

Refactor metrics backend slice next.
