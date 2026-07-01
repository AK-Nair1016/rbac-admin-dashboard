# AGENT.md

# AI Agent Operating Instructions

## Purpose

This repository contains a complete implementation plan for the **API
Access Governance Platform**.

Your responsibility is to implement features while preserving
architectural consistency.

------------------------------------------------------------------------

# Primary Rules

1.  Never invent new features unless explicitly requested by the project
    owner.
2.  Never replace an existing architecture with a different pattern.
3.  Never rename business concepts without updating documentation.
4.  Treat the documentation inside `/docs` as the source of truth.
5.  If implementation and documentation conflict, stop and recommend
    updating the documentation first.

------------------------------------------------------------------------

# Documentation Reading Order

Read these files before making any code changes.

Priority 1

1.  docs/00_Project_Vision.md
2.  docs/01_Product_Requirements.md

These define WHY the product exists.

Priority 2

3.  docs/02_System_Architecture.md
4.  docs/03_Database_Design.md

These define HOW the system is designed.

Priority 3

5.  docs/04_Backend_Architecture.md
6.  docs/05_REST_API_Specification.md

These define backend implementation.

Priority 4

7.  docs/06_Frontend_Architecture.md
8.  docs/07_RBAC_and_Access_Model.md
9.  docs/08_UI_UX_Guidelines.md

These define frontend and permission behavior.

Priority 5

10. docs/09_Development_Roadmap.md
11. docs/10_Testing_Strategy.md
12. docs/11_Deployment_Guide.md

These define implementation order and quality requirements.

Reference

13. docs/12_Future_Enhancements.md
14. docs/14_Architecture_Decision_Records.md

Use only for future planning.

------------------------------------------------------------------------

# Product Scope

Current Product

API Access Governance Platform

Core capabilities

-   Authentication
-   RBAC
-   User Management
-   Teams
-   API Catalog (metadata only)
-   Access Requests
-   Approval Workflow
-   Granted Access
-   Audit Logs
-   Dashboard Analytics
-   Employee Onboarding
-   Employee Offboarding

Out of Scope

-   Live API Monitoring
-   API Gateway
-   API Proxy
-   API Traffic Analytics
-   Production API Key Storage
-   SSO

Do not implement out-of-scope features unless explicitly requested.

------------------------------------------------------------------------

# Architectural Constraints

Backend

Routes → Controllers → Services → Database

Controllers remain thin.

Business logic belongs in Services.

SQL belongs in db/.

Validation belongs in validators/.

Do not introduce: - CQRS - DDD - Microservices - Event Bus - Heavy
Dependency Injection

------------------------------------------------------------------------

# Frontend Constraints

Maintain

-   React
-   TypeScript
-   Context API
-   CSS Modules

Prefer reusable components over duplicated CRUD pages.

Keep UI minimal and enterprise-focused.

------------------------------------------------------------------------

# Consistency Rules

Before implementing any feature verify:

1.  Does it match the Product Vision?
2.  Does it satisfy Product Requirements?
3.  Does it respect the Database Design?
4.  Does it follow Backend Architecture?
5.  Does it follow RBAC rules?
6.  Does it stay within project scope?

If any answer is "No", pause implementation and explain the conflict.

------------------------------------------------------------------------

# Hallucination Prevention

Never:

-   Invent endpoints
-   Invent database tables
-   Invent permissions
-   Invent user roles
-   Invent dashboard pages
-   Invent business workflows

Only use documented requirements.

If information is missing:

1.  Search the documentation.
2.  Search existing implementation.
3.  Ask for clarification.

Do not guess.

------------------------------------------------------------------------

# Code Quality Expectations

-   Small commits
-   Incremental changes
-   Preserve existing behavior unless refactoring
-   Update documentation if architecture changes
-   Maintain TypeScript types
-   Preserve API contracts

------------------------------------------------------------------------

# Context Window Memory

Maintain a project memory document.

Create (if missing):

docs/CONTEXT_WINDOW.md

Update it after every meaningful implementation.

Structure:

## Current Sprint

## Completed Features

## Files Modified

## Outstanding Tasks

## Current Database Changes

## API Changes

## Frontend Changes

## Known Issues

## Next Recommended Task

This file serves as a rolling project memory to recover context in
future sessions.

------------------------------------------------------------------------

# Working Mode

For every task:

1.  Read relevant documentation.
2.  Explain the implementation plan.
3.  Implement only the requested scope.
4.  Verify consistency.
5.  Update CONTEXT_WINDOW.md.
6.  Suggest the next logical task.

Do not skip documentation review.

------------------------------------------------------------------------

# Definition of Success

The implementation should always remain consistent with the documented
architecture, business goals, and scope while avoiding unnecessary
complexity. When uncertain, prefer clarification over assumption.
