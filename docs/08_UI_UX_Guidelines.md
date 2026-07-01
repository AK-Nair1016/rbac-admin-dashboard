# 08 - UI / UX Guidelines

## Design Goal

Minimal, modern enterprise dashboard focused on operational visibility.

## Dashboard KPIs

-   Active Employees
-   APIs Managed
-   Active API Access
-   Pending Requests
-   Expiring Access
-   Revoked Today

## Charts

### Access by Team

Type: Bar

### Request Trend

Type: Line

### Access Status

Type: Doughnut Segments: - Active - Expired - Revoked

### Top Requested APIs

Horizontal Bar

## Audit Panel

Timeline:

-   User requested access
-   Team Lead approved
-   Security approved
-   Access granted
-   Access revoked
-   User offboarded

Newest first.

## Tables

Every table should support:

-   Search
-   Sort
-   Pagination
-   Status badge
-   Row actions
-   Empty state
-   Loading state

## Colors

Green: Approved / Active

Yellow: Pending / Expiring

Red: Rejected / Revoked

Gray: Inactive

## Dashboard Layout

Top: KPI Cards

Middle: Charts

Bottom Left: Recent Requests

Bottom Right: Audit Timeline

## User Profile

Show: - Team - Role - Assigned APIs - Recent Activity

## Visual Consistency

-   8px spacing scale
-   Rounded cards
-   Consistent icon set
-   Same button hierarchy
-   Same modal behavior

## Future UX

Reserved widgets: - Live API Monitoring - API Health - Token Expiry
Alerts - Compliance Score
