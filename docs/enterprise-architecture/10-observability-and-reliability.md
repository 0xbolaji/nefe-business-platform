# Observability and Reliability

## Current state

[`logServerFailure`](../../app/lib/observability/server-log.ts) emits JSON with stable event/category fields and safe identifiers. Workspace error and loading boundaries exist. There is no repository evidence of centralized log retention, metrics, tracing, SLOs, alerts, synthetic monitoring or incident management.

## Logging contract

Allowed fields:

- event;
- category;
- timestamp;
- request/correlation ID;
- user ID;
- organization ID;
- entity type and ID;
- route;
- duration;
- safe database error classification.

Prohibited fields:

- passwords, hashes and invitation codes;
- cookies, tokens and authorization headers;
- database URLs;
- raw request/form bodies;
- comments, rationale, private descriptions or exports;
- unfiltered database errors.

## Initial SLIs and SLO candidates

| SLI | Pilot objective |
|---|---|
| Authentication success availability | 99.9% monthly |
| Workspace read availability | 99.5% monthly |
| Mutation success availability | 99.5% monthly |
| p95 ordinary route latency | <1.5 s |
| p95 mutation latency | <2 s |
| Scheduled job completion | 99% within 15 min |
| Backup restore verification | 100% of scheduled drills |

Objectives require staging baselines and founder acceptance before becoming commitments.

## Alerting

- Severity 1: suspected cross-tenant disclosure, active credential compromise, unrecoverable data loss.
- Severity 2: authentication unavailable, migrations blocking production, sustained >5% errors.
- Severity 3: degraded latency, job backlog, partial integration failure.
- Severity 4: non-urgent defect or capacity trend.

Alerts need an owner, response time, runbook, escalation and close criteria. Add request correlation, database/query metrics, deployment markers, synthetic sign-in/workspace checks and privacy-reviewed retention.

