# Current State

## Repository facts

| Area | State | Evidence | Assessment |
|---|---|---|---|
| Runtime | Implemented | [`package.json`](../../package.json), [`next.config.ts`](../../next.config.ts) | Next.js 16, React 19, TypeScript |
| Auth | Implemented/partial | [`auth.ts`](../../auth.ts) | Auth.js JWT session, credentials, optional Google |
| Route protection | Implemented | [`proxy.ts`](../../proxy.ts) | `/workspace/:path*` requires authentication |
| Workspace context | Implemented | [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts) | Active organization selected from active memberships |
| RBAC | Implemented | [`app/lib/auth/permissions.ts`](../../app/lib/auth/permissions.ts) | Six roles and explicit permissions |
| Persistence | Implemented | [`db/client.ts`](../../db/client.ts), [`db/schema.ts`](../../db/schema.ts) | PostgreSQL, Drizzle, connection maximum 10 |
| Migrations | Implemented | [`db/migrations`](../../db/migrations) | Ledger-backed migrations 0000–0004 |
| Audit/activity | Implemented | [`app/lib/data/audit.ts`](../../app/lib/data/audit.ts), [`app/lib/data/collaboration-repository.ts`](../../app/lib/data/collaboration-repository.ts) | Audit plus user-facing activity |
| Observability | Partial | [`app/lib/observability/server-log.ts`](../../app/lib/observability/server-log.ts) | Safe structured failures only; no metrics/traces/SLOs |
| CI/staging/backup | Missing | repository inventory | No repository evidence |

## Actual authenticated request path

```text
Browser
→ Next.js route or Server Action
→ Auth.js session (`auth.ts`)
→ `requireWorkspaceContext()`
→ active `organization_members` row
→ `requirePermission()` where mutation/sensitive read requires it
→ tenant-scoped repository/query
→ PostgreSQL
→ transaction-bound or subsequent audit/activity/notification writes
→ revalidation/response
```

Examples:

- Workspace render: [`app/(workspace)/workspace/layout.tsx`](<../../app/(workspace)/workspace/layout.tsx>) → `requireWorkspaceContext` → `getWorkspaceData`.
- Opportunity mutation: [`app/lib/actions/workspace-mutations.ts`](../../app/lib/actions/workspace-mutations.ts) → permission → organization predicates → audit/activity.
- Decision lifecycle: [`app/lib/actions/decision-actions.ts`](../../app/lib/actions/decision-actions.ts) → decision repository transaction → decision event, notification and audit.
- Export: [`app/(workspace)/workspace/analytics/export/route.ts`](<../../app/(workspace)/workspace/analytics/export/route.ts>) → context → analytics permission → tenant-scoped CSV.

## Strengths

- Session carries user identity rather than workspace role; current role comes from the active membership.
- Most production writes validate with Zod and resolve organization context server-side.
- Domain records generally carry `organization_id`, with useful organization-oriented indexes.
- Collaboration and executive decisions preserve formal history and use transactions for multi-write mutations.
- Seed-only fixture imports are guarded against production execution in [`db/seed.ts`](../../db/seed.ts).
- Deterministic intelligence is tested in [`tests/deterministic-intelligence.test.ts`](../../tests/deterministic-intelligence.test.ts).

## Weaknesses and uncertainties

- `getWorkspaceData()` issues a broad Promise.all fan-out and returns a large workspace view model for every workspace layout.
- Regions and industries are globally read; this is reasonable reference data but is not documented as such.
- Tenant isolation is application-enforced. PostgreSQL row-level security is not configured.
- Some writes append audit/activity after the primary transaction, permitting partial side-effect failure.
- JWT sessions have no verified revocation list, device management, forced logout after role/user disable, or refresh rotation.
- Registration rate limiting uses an in-memory `Map` and is not reliable across instances.
- No password reset, verified email workflow, MFA, SSO administration, service accounts or recovery codes were found.
- No repository evidence of CI, staging, infrastructure-as-code, backup policy, restore drill, production alerting or incident runbooks.
- Tests are predominantly source/unit tests; database-backed cross-tenant integration coverage is limited.
- Existing model gaps include campaign ownership, direct campaign-to-opportunity/pilot association beyond pilot references, journey-to-campaign links, and inconsistent use of update timestamps in all mutation paths.

## Current deployment confidence

Production deployment has been discussed operationally, but the repository contains no deployment manifest or provider configuration. Hosting provider, region, database branch strategy, backup retention, TLS ownership and runtime scaling are therefore **unverified**.
