# Enterprise-Readiness Roadmap

## EH0 — Enterprise Architecture Blueprint

- Purpose: repository-grounded baseline and decisions.
- Gate: all cited paths and links validated; founder reviews decisions.

## EH1 — Authentication and Session Hardening

- Purpose: make account and session lifecycle safe for controlled pilots.
- Prerequisites: founder decisions on session storage, MFA timing and registration model.
- Scope: durable login/registration throttling; email verification; password reset/recovery; session revocation/versioning; disabled-user next-request denial; reauthentication for sensitive operations; safe auth events; Owner/Admin MFA design and first increment.
- Exclusions: enterprise SSO, service accounts and mobile tokens.
- Areas: [`auth.ts`](../../auth.ts), [`app/sign-up`](../../app/sign-up), [`app/lib/auth`](../../app/lib/auth), identity schema/migrations, auth tests.
- Tests/tools: multi-instance abuse model, token expiry/replay, session invalidation, Gitleaks, dependency scan.
- Gate: all recovery/revocation/rate-limit acceptance tests pass in staging; runbooks documented.
- Risks: account lockout, migration/session compatibility.
- Claude review: adversarial threat-model packet.
- Founder decisions: JWT+session-version versus database sessions; MFA provider; managed email provider.

## EH2 — Authorization and Tenant Isolation

- Purpose: prove and strengthen tenant boundaries.
- Scope: action/repository inventory, relationship validation, two-tenant integration tests, permission matrix, RLS prototype/decision.
- Exclusions: new roles/features.
- Areas: auth permissions/context, actions, repositories, schema.
- Gate: no tested cross-tenant path succeeds.
- Claude review: authorization packet.

## EH3 — Data Integrity and Database Hardening

- Scope: resolve validated relationship gaps, mutation atomicity, timestamp/soft-delete policy, indexes, DB roles and migration standards.
- Exclusions: speculative graph schema.
- Gate: constraints/migrations pass staging restore and compatibility rehearsal.

## EH4 — API and Shared-Client Foundation

- Scope: `/api/v1` façade, DTOs, error envelope, idempotency, pagination, OpenAPI and token architecture.
- Exclusions: native apps and public partner marketplace.
- Gate: one end-to-end read/write vertical slice consumed by contract tests.
- Claude review: mobile packet.

## EH5 — Performance and Scalability

- Scope: instrumentation, route-specific data reads, bounded pagination, query/index tuning, pilot load tests.
- Exclusions: microservices, external cache/search without evidence.
- Gate: accepted pilot SLOs pass representative k6 profile.

## EH6 — Background Jobs and Event Reliability

- Scope: outbox, worker lease/retry/dead letters, expiry and notification jobs.
- Exclusions: streaming platform.
- Gate: retry/idempotency/failure-recovery tests pass.

## EH7 — Observability, Backup and Disaster Recovery

- Scope: logs, metrics, traces, alerts, SLOs, incidents, backups and restore drills.
- Gate: alert exercise and restore drill meet pilot objectives.
- Claude review: DR packet.

## EH8 — Security Testing and Adversarial Validation

- Scope: SAST, dependency/secret scans, authorized ZAP staging test, tenant abuse cases and remediation.
- Gate: no unresolved critical/high pre-pilot finding.

## EH9 — Pilot Readiness

- Scope: operating model, support, acceptance, data handling, training, synthetic monitoring and rollback rehearsal.
- Gate: [pilot infrastructure](14-pilot-infrastructure.md) checklist accepted.
- Claude review: pilot operating-model packet.

## EH10 — Production Acceptance

- Scope: final end-to-end, role, tenant, load, restore, deployment and support acceptance.
- Gate: signed founder release decision with residual risks.

High-risk workstreams should be delivered as small vertical increments, each independently testable and reversible.

