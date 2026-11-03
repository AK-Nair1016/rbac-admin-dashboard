# CONTEXT_WINDOW.md

Rolling memory for AI coding assistants. Keep this file compact and only
record current project state.

## Current Project Phase

API Access Governance Platform, Phase 0 frontend refactoring.

## Completed Milestones

- Backend Phase 0 refactor complete.
- Frontend Milestone 1 complete: folder normalization, dead-code
  cleanup, Vite scaffold removal, and product naming alignment.
- Frontend Milestone 2 complete: responsive dashboard shell, sidebar,
  top navigation, page container, and shared content wrapper.
- Frontend Milestone 3 complete: shared UI foundation including page
  headers, section cards, stat cards, data tables, status badges,
  search, pagination, dialogs, form inputs, buttons, loading, empty, and
  error states.
- Frontend Milestone 4 complete: dashboard redesigned with existing
  metrics, improved KPI hierarchy, status chart placement, workspace
  health panel, responsive layout, and placeholder recent activity.
- Frontend Milestone 5 complete: Entities and User Permissions pages
  decomposed into reusable table, toolbar, filter, matrix, and action
  components while preserving routes, API calls, RBAC checks, and
  workflows.
- Frontend Milestone 6 complete: final polish pass for shared feedback,
  loading/empty/error states, responsive behavior, button/table/status
  consistency, API base URL environment configuration, and alert removal.

## Architecture Decisions

- Preserve React, TypeScript, React Router, Context API, and CSS Modules.
- Preserve existing backend APIs and response shapes.
- Keep authentication and RBAC behavior unchanged.
- Use `VITE_API_BASE_URL` for frontend API configuration; omit it to use
  same-origin relative requests.
- Do not add API Access Governance feature routes or widgets during
  Phase 0.

## Verification

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.

## Remaining Work

- No remaining Phase 0 frontend refactoring work.
- No automated frontend browser/component test suite exists yet.

## Next Milestone

Begin API Access Governance implementation only after the frontend
refactoring completion report is reviewed.
