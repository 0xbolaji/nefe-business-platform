# Authorization and Tenant Isolation

## Canonical path

```text
users.id from session
→ active organization_members row
→ WorkspaceContext.membership.role
→ rolePermissions
→ action/repository tenant predicate
```

This path is implemented in [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts), [`app/lib/auth/permissions.ts`](../../app/lib/auth/permissions.ts), and action/repository modules. The session identifies the user only.

## Invariants

| Invariant | Current state | Evidence | Required proof |
|---|---|---|---|
| Client cannot choose authorization organization | Implemented | Context reads membership and active-workspace cookie | Tampered cookie selects only an authorized membership |
| Role comes from current membership | Implemented | `getWorkspaceContext` | Role change takes effect next request |
| Inactive membership is denied | Implemented | active query and `requireWorkspaceContext` | Disabled membership integration test |
| Resource reads are tenant-scoped | Partial/strong | repositories use `organizationId` | Automated query-path audit |
| Resource writes are tenant-scoped | Partial/strong | actions use organization predicates | Two-tenant integration suite |
| Related IDs belong to tenant | Partial | business/owner validation in create actions | All foreign relationship inputs covered |
| DB independently enforces tenant boundary | Missing | no RLS policies in migrations | Founder decision after EH2 test |
| Permissions are centralized | Implemented | `rolePermissions` | Prevent domain policy drift |

## RLS decision

PostgreSQL row-level security would provide defense in depth but adds connection-context, migration and test complexity. Do not enable it casually.

Recommended sequence:

1. Complete an action/repository inventory.
2. Add database-backed two-tenant tests.
3. Establish transaction-local tenant identity if RLS is selected.
4. Prototype RLS on the highest-risk tables.
5. Measure operational complexity and query behavior.
6. Seek founder approval before broad adoption.

Until then, application predicates remain authoritative and every table/query must be treated as security-sensitive.

## Permission governance

Changes to [`app/lib/auth/permissions.ts`](../../app/lib/auth/permissions.ts) require:

- explicit business justification;
- role/action acceptance tests;
- owner-boundary and final-owner tests;
- Server Action and repository review;
- audit event verification;
- documentation update.

