# 03 - Database Design

# Core Tables

## users

-   id (PK)
-   employee_id
-   name
-   email
-   role_id (FK)
-   team_id (FK)
-   department_id (FK)
-   manager_id (FK)
-   status
-   joined_at

## roles

-   id
-   name
-   description

## permissions

-   id
-   code
-   description

## role_permissions

-   role_id
-   permission_id

## teams

-   id
-   name
-   lead_id

## departments

-   id
-   name

## apis

-   id
-   name
-   owner_team_id
-   environment
-   version
-   status

## access_requests

-   id
-   user_id
-   api_id
-   permission
-   reason
-   expiry_date
-   status
-   manager_comment
-   security_comment
-   created_at

## user_api_access

-   id
-   user_id
-   api_id
-   permission
-   granted_by
-   granted_at
-   expires_at
-   status

## audit_logs

-   id
-   actor_id
-   action
-   entity
-   entity_id
-   metadata(JSON)
-   created_at

# Relationships

departments 1:N teams

teams 1:N users

roles N:M permissions

users 1:N access_requests

users N:M apis (through user_api_access)

apis 1:N access_requests

users 1:N audit_logs (actor)

# Recommended Indexes

-   users(email)
-   users(employee_id)
-   access_requests(status)
-   access_requests(user_id)
-   user_api_access(user_id)
-   user_api_access(api_id)
-   audit_logs(created_at)
-   audit_logs(actor_id)

# Data Integrity

-   Foreign keys enforced
-   Soft delete for users
-   Immutable audit logs
-   Cascade rules only where appropriate

# Future Tables

notifications

access_reviews

api_keys_metadata

approval_history

live_api_metrics

# Notes

Never store actual production API secrets in v1. Store only metadata
required for governance.
