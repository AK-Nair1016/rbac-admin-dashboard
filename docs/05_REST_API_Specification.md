# 05 - REST API Specification

# Authentication

POST /api/auth/login

Request

``` json
{
  "email":"user@company.com",
  "password":"******"
}
```

Response

``` json
{
  "success":true,
  "data":{
    "token":"jwt",
    "user":{}
  }
}
```

------------------------------------------------------------------------

GET /api/auth/me

Returns authenticated user.

------------------------------------------------------------------------

POST /api/auth/logout

Invalidates current session (client-side JWT removal in v1).

# Users

GET /api/users

POST /api/users

PUT /api/users/{id}

DELETE /api/users/{id}

POST /api/users/{id}/offboard

Permission: Platform Admin

# Teams

GET /api/teams

POST /api/teams

PUT /api/teams/{id}

DELETE /api/teams/{id}

# API Catalog

GET /api/apis

POST /api/apis

PUT /api/apis/{id}

DELETE /api/apis/{id}

GET /api/apis/{id}/users

Returns every employee currently granted access.

# Access Requests

POST /api/access-requests

Payload

``` json
{
 "apiId":1,
 "permission":"READ",
 "reason":"Need integration work",
 "expiryDate":"2027-01-31"
}
```

GET /api/access-requests

PUT /api/access-requests/{id}/manager-approve

PUT /api/access-requests/{id}/security-approve

PUT /api/access-requests/{id}/reject

# Granted Access

POST /api/access/grant

PUT /api/access/{id}/revoke

PUT /api/access/{id}/extend

GET /api/users/{id}/access

GET /api/apis/{id}/access

# Dashboard

GET /api/dashboard/summary

Returns KPI cards.

GET /api/dashboard/charts

Returns:

-   Access by Team
-   Pending Requests
-   Access Trend
-   Revocations

GET /api/dashboard/recent-activity

Returns latest audit events.

# Audit

GET /api/audit

GET /api/audit/user/{id}

GET /api/audit/api/{id}

Filters:

-   date
-   actor
-   action
-   entity

# HTTP Status Codes

200 OK

201 Created

400 Validation Error

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

# Validation Rules

-   Email unique
-   API name unique
-   Expiry must be future date
-   Reason required for access request
-   Offboarded users cannot request access
-   Revoked access cannot be extended
