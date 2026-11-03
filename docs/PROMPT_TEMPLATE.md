# PROMPT_TEMPLATE.md

Use this prompt at the beginning of every Codex session.

------------------------------------------------------------------------

Read the following in order:

1.  docs/AGENT.md
2.  docs/PROJECT_RULES.md
3.  docs/CONTEXT_WINDOW.md
4.  Relevant documentation under /docs based on the requested feature.

Repository goal: Refactor the existing RBAC dashboard into an API Access
Governance Platform.

Current priority: 1. Improve existing backend architecture. 2. Improve
existing frontend architecture. 3. Preserve working authentication and
RBAC. 4. Only after refactoring, implement new governance features.

Rules:

-   Do not hallucinate features.
-   Do not invent endpoints or tables.
-   Stay within documented scope.
-   Preserve backward compatibility whenever possible.
-   Keep controllers thin.
-   Put business logic in services.
-   Keep SQL in db layer.
-   Keep React architecture modular.
-   Do not migrate frameworks.

Workflow:

1.  Explain the implementation plan.
2.  List impacted files.
3.  Implement incrementally.
4.  Verify no regressions.
5.  Update docs/CONTEXT_WINDOW.md.
6.  Recommend the next logical task.

If documentation conflicts with code: Stop and explain the conflict
instead of guessing.
