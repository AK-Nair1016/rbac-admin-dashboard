# PROJECT_RULES.md

# Repository Constitution

## Project Identity

This project is an **API Access Governance Platform**, evolved from an
RBAC Admin Dashboard.

Do NOT convert it into: - CMS - ERP - CRM - API Gateway - IAM
replacement

## Current Development Strategy

Phase 1 (Current) - Refactor existing backend - Refactor existing
frontend - Preserve working authentication and RBAC

Phase 2 - Build API Catalog - Build Access Governance - Build Approval
Workflow - Build Audit

## Existing Code Rules

Always refactor before rewriting.

Preserve: - JWT Authentication - Existing RBAC - Existing routing -
Existing PostgreSQL schema unless documentation requires changes.

## Backend Rules

Controllers: - Thin - No business logic

Services: - Own business logic

DB Layer: - SQL only

Validation: - Middleware

Every important action MUST create an audit event.

## Frontend Rules

Keep: - React - TypeScript - CSS Modules - Context API

Goal: Minimal, enterprise, consistent UI.

No unnecessary animations.

## Scope Rules

Only implement features documented in /docs.

Do not introduce: - Live API Monitoring - API Gateway - API Proxy - SSO
unless explicitly requested.

## Documentation Rules

Before coding: 1. Read docs/AGENT.md 2. Read docs/CONTEXT_WINDOW.md 3.
Read relevant docs.

After major work: - Update CONTEXT_WINDOW.md - Update docs if
architecture changes.
