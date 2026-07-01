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
- Users assignable lookup refactored into controller, validator, service, and database query layers
- Dashboard / metrics refactored into controller, service, and database query layers
- Reusable API response helpers introduced and applied incrementally to refactored backend slices
- Structured logging introduced with Pino across auth, authorization, errors, and key business operations
- Startup documentation was consolidated into `docs/`, and the duplicate startup context window was removed
- Remaining middleware database access was extracted into query and service layers
- Backend ESLint configuration and lint script were added

## In Progress

- None

## Pending

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
- backend/src/controllers/metrics.controller.ts
- backend/src/controllers/permission.controller.ts
- backend/src/controllers/users.controller.ts
- backend/src/config/db.ts
- backend/src/middleware/auth.middleware.ts
- backend/src/middleware/ownership.middleware.ts
- backend/src/middleware/permission.middleware.ts
- backend/src/db/entity.queries.ts
- backend/src/db/permission.queries.ts
- backend/src/db/dashboard.queries.ts
- backend/src/db/user.queries.ts
- backend/src/middleware/rbac.middleware.ts
- backend/src/middleware/error.middleware.ts
- backend/package.json
- backend/package-lock.json
- backend/eslint.config.mjs
- backend/src/routes/entity.routes.ts
- backend/src/routes/permission.routes.ts
- backend/src/routes/auth.routes.ts
- backend/src/routes/users.routes.ts
- backend/src/services/dashboard.service.ts
- backend/src/services/auth.service.ts
- backend/src/services/entity.service.ts
- backend/src/services/permission.service.ts
- backend/src/utils/apiResponse.ts
- docs/15_IMPLEMENTATION_CHECKLIST.md
- docs/CONTEXT_WINDOW.md
- docs/AGENT.md
- docs/PROJECT_RULES.md
- docs/Backend_Refactoring_Roadmap.md
- docs/Frontend_Refactoring_Roadmap.md
- docs/API_Access_Governance_Blueprint.md
- docs/PROMPT_TEMPLATE.md

## Files Added

- backend/src/db/user.queries.ts
- backend/src/db/permission.queries.ts
- backend/src/db/entity.queries.ts
- backend/src/db/dashboard.queries.ts
- backend/src/errors/AppError.ts
- backend/src/middleware/error.middleware.ts
- backend/src/services/auth.service.ts
- backend/src/services/dashboard.service.ts
- backend/src/services/permission.service.ts
- backend/src/services/entity.service.ts
- backend/src/services/user.service.ts
- backend/src/utils/asyncHandler.ts
- backend/src/validators/auth.validator.ts
- backend/src/validators/permission.validator.ts
- backend/src/validators/entity.validator.ts
- backend/src/validators/user.validator.ts
- backend/src/utils/apiResponse.ts
- backend/src/utils/logger.ts

## Database Changes

None.

## API Changes

No endpoint or response contract changes. `/auth/login` still returns
`success`, `message`, `token`, and `user` at the top level for frontend
compatibility. Existing `/permissions` endpoints and success response
payloads are preserved. Existing `/entities` endpoints and success response
payloads are preserved. Existing `/users/assignable` continues to return
`{ data: [...] }` for frontend compatibility. Existing `/metrics` continues
to return the current role-based payloads consumed by the dashboard UI.
Response construction is now centralized without changing those payloads.
Structured logging was added without changing endpoint contracts.

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
- Assignable user lookup remains at `/users/assignable` and now uses `user.service.ts`.
- Assignable user SQL moved out of `users.controller.ts` into `db/user.queries.ts`.
- Users route now applies route-level validation middleware before the controller.
- Users controller now delegates to the service layer and relies on shared async error handling.
- Metrics role-based business logic moved into `dashboard.service.ts`.
- Metrics SQL moved from `utils/userQueries.ts` into `db/dashboard.queries.ts`.
- Metrics controller now delegates to the service layer while preserving existing admin, manager, and user response payloads.
- `utils/apiResponse.ts` now centralizes reusable success and error response formatting.
- Auth, entities, permissions, users, metrics, and the global error middleware now use the shared response helper incrementally.
- `pino` was added as a backend dependency and configured in `utils/logger.ts`.
- Authentication events are now logged for login success, invalid credentials, and invalid JWT access attempts.
- Authorization failures are now logged in RBAC, ownership, and entity-permission middleware.
- Unexpected and application errors are now logged through the global error middleware.
- Important business operations are now logged for entity create/update/assignment and permission changes.
- Repository startup/reference markdown files were moved into `docs/` so all project documentation now lives in one place.
- The temporary database connection SQL check was removed from `config/db.ts`.
- Ownership lookup SQL now lives in `db/entity.queries.ts`, and ownership middleware delegates to `entity.service.ts`.
- Entity permission lookup SQL now lives in `db/permission.queries.ts`, and permission middleware delegates to `permission.service.ts`.
- All current POST, PUT, and PATCH routes use validation middleware.
- Backend linting is now available through `npm run lint`.

## Known Issues

- Existing package lock changes were already present in the working tree and were not part of this refactor.
- `backend/package.json` still uses the placeholder failing `npm test` script, so no automated backend test suite exists yet.

## Decisions

- Preserve the existing `/auth/login` response shape instead of adopting the documented nested `data` response during this refactor, because the current frontend reads `res.data.token`.
- Preserve existing `/permissions` response payloads during refactor to avoid frontend contract drift.
- Preserve existing `/entities` response payloads during refactor to avoid frontend contract drift.
- Preserve the existing `/users/assignable` response shape of `{ data: [...] }` to avoid breaking the entity assignment UI.
- Keep the Users validator lightweight because the current `/users/assignable` endpoint accepts no request body or query contract beyond authenticated access control.
- Preserve the existing `/metrics` response payloads by role instead of adopting a new dashboard response wrapper during this milestone.
- Build the response helper to support both standardized metadata (`success`, `message`, `errors`) and existing top-level payload keys so frontend contracts remain stable during the refactor.
- Keep structured logging intentionally lightweight: one shared Pino logger and targeted logs for auth, authz, errors, and key write operations.

## Next Recommended Task

Begin frontend refactoring, or first replace the placeholder backend `npm test` script with real automated tests if you want stronger regression coverage before frontend work.

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
- Users controller made thin for the assignable users endpoint.
- User service, DB query, and validator layers introduced for `/users/assignable`.
- Metrics controller made thin.
- Dashboard service and DB query layers introduced for `/metrics`.
- Shared API response helpers introduced and applied without changing current frontend payload shapes.
- Structured logging introduced with Pino across auth, authorization, errors, and key business operations.
- Remaining middleware SQL extracted into `db/` and delegated through services.
- Backend lint script and ESLint config added.
- TypeScript compiler check passed with `npx tsc --noEmit`.
- ESLint check passed with `npm run lint`.

## Problems:

- No automated backend test script exists beyond the placeholder failing `npm test`.

## Solutions:

- Verified with TypeScript compiler check and preserved endpoint contracts.

## Next Step:

Frontend refactor or backend test automation next, depending on whether you want UI progress or stronger regression safety first.
