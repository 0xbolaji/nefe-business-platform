# Architecture Principles

1. **Tenant context is server-owned.** Clients never choose an organization or role for authorization.
2. **Identity and authorization are separate.** Sessions identify a user; the current membership determines access.
3. **Default deny.** Missing context, membership, permission or tenant ownership denies the operation.
4. **One write path.** Business mutations enter through validated server-side boundaries and domain repositories.
5. **Transactions define atomic business outcomes.** Data, audit, event and notification writes that must agree commit together.
6. **History is evidence.** Audit and formal decision history are append-only and contain safe metadata.
7. **Deterministic before probabilistic.** Commercial decisions retain deterministic scoring and human accountability.
8. **Measure before distributing.** Keep a modular monolith until load, team boundaries or failure isolation justify separation.
9. **Relational before specialized storage.** PostgreSQL remains authoritative until proven graph, search or cache requirements emerge.
10. **Contracts before clients.** A stable shared API precedes native mobile and external integration work.
11. **Operational readiness is part of the product.** Restore, rollback, alerts, support and incident handling are release gates.
12. **Evidence over aspiration.** Documentation labels implemented, partial, inferred, missing and recommended behavior.
13. **Privacy by design.** Logs, events, exports and AI datasets minimize private commercial content.
14. **Compatibility is deliberate.** Schema, API and mobile changes use additive evolution, deprecation windows and tested migrations.
15. **Pilot learning constrains investment.** Build only the infrastructure necessary to safely learn from 3–5 pilot companies.

## Architecture fitness tests

- A cross-tenant identifier cannot change the active tenant or access another tenant’s record.
- A role change is effective on the next server request.
- Retrying an idempotent operation does not duplicate formal outcomes or notifications.
- A deployment can be rolled back without corrupting a forward-applied schema.
- A backup can be restored within the declared pilot objective.
- Identical deterministic inputs produce identical commercial intelligence outputs.
- A mobile or integration client receives a stable error contract without internal implementation details.

