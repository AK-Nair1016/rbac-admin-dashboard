# API Access Governance Platform

## Product Specification & Development Blueprint

> **Version:** v1.0 **Purpose:** Transform the existing RBAC Admin
> Dashboard into an API Access Governance Platform that manages the
> complete employee API access lifecycle.

# Vision

Manage **who has access to which APIs**, **who approved it**, **when it
expires**, and **how access is revoked during offboarding**.

**Not in scope (v1):** - API Gateway - Live API monitoring - Traffic
analytics - API proxy

These remain future enhancements.

# High-Level Architecture (HLD)

    React Admin Dashboard
            │
     REST API (Express)
            │
     Business Services
            │
     PostgreSQL

Core domains:

-   Authentication
-   Authorization (RBAC)
-   Users
-   Teams
-   API Catalog
-   Access Requests
-   API Access
-   Audit Logs

# Low-Level Architecture (LLD)

    Client
      │
    Routes
      │
    Controllers
      │
    Services
      │
    DB Queries
      │
    PostgreSQL

Suggested backend:

    src/
     config/
     controllers/
     services/
     db/
     middleware/
     validators/
     routes/
     types/
     errors/
     utils/

# Modules

## 1. Authentication

Reuse existing JWT authentication.

## 2. User Management

Reuse current CRUD.

Additional fields:

-   employeeId
-   departmentId
-   teamId
-   managerId
-   status
-   joiningDate

Status:

-   Active
-   On Leave
-   Inactive
-   Offboarded

## 3. Teams

Fields

-   id
-   name
-   leadId
-   description

## 4. API Catalog

Metadata only.

Fields

-   id
-   name
-   description
-   ownerTeamId
-   environment
-   version
-   status

Status:

-   Active
-   Deprecated
-   Disabled

## 5. Access Requests

Lifecycle

Pending → Manager Approved → Security Approved → Granted

Rejected can occur at any stage.

Fields

-   id
-   userId
-   apiId
-   reason
-   requestedPermission
-   expiryDate
-   status
-   managerComment
-   securityComment

## 6. User API Access

Stores actual granted access.

Fields

-   id
-   userId
-   apiId
-   permission
-   grantedBy
-   grantedAt
-   expiresAt
-   status

Status

-   Active
-   Expired
-   Revoked

## 7. Audit Logs

Every action creates an immutable log.

Fields

-   id
-   actorId
-   action
-   entity
-   entityId
-   timestamp
-   metadata

# Suggested Database Tables

users

roles

permissions

teams

departments

apis

access_requests

user_api_access

audit_logs

# REST API

## Authentication

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me

## Users

GET /api/users

POST /api/users

PUT /api/users/:id

DELETE /api/users/:id

POST /api/users/:id/offboard

## Teams

GET /api/teams

POST /api/teams

PUT /api/teams/:id

DELETE /api/teams/:id

## API Catalog

GET /api/apis

POST /api/apis

PUT /api/apis/:id

DELETE /api/apis/:id

GET /api/apis/:id/access

## Access Requests

GET /api/access-requests

POST /api/access-requests

PUT /api/access-requests/:id/manager-approve

PUT /api/access-requests/:id/security-approve

PUT /api/access-requests/:id/reject

## Granted Access

GET /api/access

POST /api/access/grant

PUT /api/access/:id/revoke

PUT /api/access/:id/extend

GET /api/users/:id/access

GET /api/apis/:id/users

## Audit

GET /api/audit

GET /api/audit/user/:id

GET /api/audit/api/:id

# Core Workflows

## Employee Onboarding

Create Employee

→ Assign Department

→ Assign Team

→ Assign Role

→ Assign Default API Access

→ Audit Log

## API Access Request

User

→ Request API

→ Manager Approval

→ Security Approval

→ Access Granted

→ Audit Log

## Offboarding

Deactivate Employee

→ Revoke Active API Access

→ Close Pending Requests

→ Remove Team Membership

→ Archive Audit History

→ Status = Offboarded

# Dashboard

Replace generic CRUD charts with business dashboards.

## KPI Cards

-   Active Employees
-   Registered APIs
-   Active API Access
-   Pending Requests
-   Expiring Access

## Charts

1.  API Access by Team (Bar)
2.  Active vs Revoked Access (Donut)
3.  Access Requests Trend (Line)
4.  Top Requested APIs (Horizontal Bar)

## Tables

Recent Access Requests

Recent Approvals

Recent Revocations

## Audit Timeline

-   User requested Payments API
-   Manager approved
-   Security approved
-   Access revoked
-   Employee offboarded

## Permission Matrix

Rows: Users

Columns: APIs

Cell: Read / Write / Admin

# Existing RBAC Mapping

Current Users -\> Employee Directory

Current Roles -\> Platform Roles

Authentication -\> Reuse

Authorization -\> Reuse

Dashboard -\> Enhanced Metrics

# Future Scope (v2)

-   Live API usage monitoring
-   API key inventory
-   API token rotation reminders
-   Integration with API gateways
-   Email notifications
-   Slack approvals
-   Scheduled access reviews
-   SSO (Azure AD/Okta)
-   SIEM integration
-   Compliance reports

# Development Sprints

Sprint 1 - Refactor backend - Keep auth - Keep RBAC

Sprint 2 - Teams - Departments - API Catalog

Sprint 3 - Access Requests - Approval Workflow

Sprint 4 - Grant/Revoke Access

Sprint 5 - Dashboard & Audit

Sprint 6 - Onboarding - Offboarding

# Success Criteria

The project should demonstrate:

-   JWT Authentication
-   Role-Based Access Control
-   API Access Governance
-   Approval Workflow
-   Employee Lifecycle Management
-   Audit Logging
-   Dashboard Analytics
-   Clean Service-Oriented Architecture

This is intentionally scoped for a junior software engineering portfolio
while solving a realistic enterprise problem.
