# 13 - Interview Guide

## 30-Second Introduction

'I built an API Access Governance Platform that manages the lifecycle of
employee access to internal APIs. It focuses on authentication,
role-based authorization, approval workflows, onboarding, offboarding,
and audit logging rather than live API traffic.'

## Business Problem

Organizations often manage API access through email or chat, making
approvals difficult to audit and revoke. This platform centralizes the
process.

## Architecture Summary

Frontend: - React - TypeScript - CSS Modules

Backend: - Node.js - Express - PostgreSQL - JWT - Service-oriented
architecture

## Common Questions

### Why PostgreSQL?

Strong relational model for users, APIs, approvals, and audit logs.

### Why JWT?

Simple stateless authentication suitable for internal systems.

### Why not MongoDB?

Relationships are central to this domain.

### Why not live API monitoring?

Out of scope for v1. Governance was prioritized over infrastructure
complexity.

### Biggest Challenge

Designing a permission workflow that remained simple while supporting
future expansion.

### Future Improvements

-   Live API monitoring
-   SSO
-   API gateway integration
-   Compliance reporting

## Key Concepts to Explain

-   Authentication vs Authorization
-   RBAC
-   Approval workflow
-   Audit logging
-   Onboarding and offboarding
-   Service layer
-   REST API design

## Resume Summary

Developed an API Access Governance Platform using React, Express,
PostgreSQL and TypeScript featuring JWT authentication, RBAC, approval
workflows, audit logging, onboarding/offboarding automation, and
dashboard analytics.
