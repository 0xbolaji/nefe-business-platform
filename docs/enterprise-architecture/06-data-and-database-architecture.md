# Data and Database Architecture

## Current state

PostgreSQL is authoritative, accessed with Drizzle over `postgres-js` in [`db/client.ts`](../../db/client.ts). The client is process-cached, uses `max: 10`, disables prepared statements and applies a 10-second connect timeout. Schema and migrations are in [`db/schema.ts`](../../db/schema.ts) and [`db/migrations`](../../db/migrations).

Core data domains:

- identity: users, accounts, sessions, verification tokens;
- tenancy: organizations, members, invitations, preferences;
- commerce: businesses, relationships, opportunities, campaigns, journeys, recommendations;
- execution: pilots, milestones, tasks, KPIs, approvals, risks, updates, decisions;
- collaboration: comments, mentions, assignments, watchers, activity;
- executive decisions: decisions, participants, responses, versions, events;
- operations: notifications, favorites, recently viewed and audit logs.

## Integrity strengths

- Organization IDs appear on primary tenant-owned records.
- Foreign keys, uniqueness and tenant-oriented indexes are common.
- Collaboration entity types and decision state/priority values have database checks.
- Decision response idempotency and immutable version evidence are modeled.
- Migrations 0000–0004 are ordered in Drizzle’s journal.

## Gaps

| Gap | Classification | Consequence | Target |
|---|---|---|---|
| Campaign has no owner | Missing persistence | Accountability cannot be represented | EH3 additive column after workflow decision |
| Campaign direct source opportunity/pilot is limited | Partial | Connected workflow depends on indirect links | Normalize validated relationship model |
| Journey-to-campaign relationship absent | Missing | Cannot persist association | Confirm pilot need before schema change |
| Some child tables lack organization-aware composite FK | Partial | App validates, DB cannot prove same tenant | Evaluate composite keys/constraints |
| `updated_at` relies on mutation discipline | Partial | Stale or misleading recency | Repository consistency tests |
| Soft deletion is inconsistent | Partial | Retention semantics vary | Domain retention policy |
| Audit retention/immutability not enforced by DB role | Missing | Privileged modification possible | Operational DB roles and archival |
| No schema compatibility policy | Missing | Risky deploy/migration coupling | Expand-contract standard |

## Migration policy

- Never reset, squash or edit applied migrations.
- Generate additive migrations from reviewed schema changes.
- Test against a production-like snapshot in staging.
- Use expand/contract for incompatible changes.
- Apply migrations before code only when old code tolerates the expansion.
- Record migration ledger, duration, locks and rollback/forward-fix procedure.
- Backup and restore-test before high-risk data transformations.

## Commercial Graph preparation

Keep graph semantics relational initially. Add stable identifiers, relationship type, direction, provenance, effective dates, confidence and source-system keys before considering a graph store. See [Commercial Graph foundation](17-commercial-graph-foundation.md).

