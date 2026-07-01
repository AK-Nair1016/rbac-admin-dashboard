# 07 - RBAC and Access Model

## Roles

### Platform Admin

Full platform control.

### Security Admin

Approve sensitive requests, audit, revoke access.

### Team Lead

Approve requests for team members.

### Developer

Request and view assigned APIs.

## Permission Codes

user:create user:update user:delete team:manage api:create api:update
api:delete request:create request:approve access:grant access:revoke
audit:view

## Approval Flow

Developer → Team Lead → Security Admin (optional) → Platform Admin
(optional) → Access Granted

## Access Levels

READ

WRITE

ADMIN

## Lifecycle

Onboard → Default Access → Request Additional Access → Approval → Grant
→ Review → Revoke → Offboard

## Permission Matrix

  Feature            Platform Admin   Security Admin   Team Lead   Developer
  ----------------- ---------------- ---------------- ----------- -----------
  Manage Users             ✓                                      
  Manage APIs              ✓                                      
  Request API                                              ✓           ✓
  Approve Request          ✓                ✓              ✓      
  Grant Access             ✓                ✓                     
  View Audit               ✓                ✓                     
  Offboard User            ✓                                      

## Business Rules

-   Offboarded users cannot request access.
-   Expired access cannot be used.
-   Revoked access requires a new request.
-   Every approval creates an audit event.
-   Every revoke creates an audit event.
