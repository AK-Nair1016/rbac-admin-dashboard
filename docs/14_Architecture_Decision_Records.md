# 14 - Architecture Decision Records (ADR)

## ADR-001 Express over NestJS

Decision: Use Express.

Reason: Smaller learning curve, aligns with existing codebase, easier to
explain in interviews.

## ADR-002 PostgreSQL over MongoDB

Decision: Use PostgreSQL.

Reason: The application relies on relational data such as users, teams,
APIs, permissions and audit logs.

## ADR-003 JWT Authentication

Decision: JWT access tokens.

Reason: Simple, stateless authentication suitable for the project's
scope.

## ADR-004 Service Layer

Decision: Separate controllers from business logic.

Reason: Improves maintainability and testability without
overengineering.

## ADR-005 API Metadata

Decision: Store API metadata only.

Reason: The product focuses on governance, not API execution.

## ADR-006 Audit Log

Decision: Create immutable audit records for critical actions.

Reason: Supports traceability and compliance.

## ADR-007 RBAC

Decision: Role-based authorization with permission codes.

Reason: Matches enterprise access governance while remaining
understandable for a junior-level project.

## ADR-008 Future Evolution

Decision: Design extension points for live monitoring and SSO without
implementing them in v1.

Reason: Keeps MVP achievable while demonstrating architectural
foresight.
