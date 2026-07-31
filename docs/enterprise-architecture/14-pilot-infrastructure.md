# Pilot Infrastructure

## Scope

A controlled pilot supports 3–5 initial companies inside a small number of organizations with named operators and bounded support hours. It is not general public availability.

## Minimum infrastructure

- Production and staging deployments with isolated databases.
- Managed PostgreSQL with verified backups and restore drill.
- Managed secrets, named production access and MFA.
- Migration gate and release checklist.
- Centralized logs, error-rate/latency/database alerts and deployment markers.
- Durable authentication/registration rate limiting.
- Incident, support, access-removal and data-export procedures.
- Tenant/role acceptance tests and audit review.

## Pilot gate

| Gate | Evidence required |
|---|---|
| Identity | Reset/recovery, revocation, rate limits and Owner/Admin MFA tested |
| Tenancy | Two-tenant integration suite and relationship-input tests pass |
| Data | Migrations rehearsed; backup restore succeeds |
| Performance | Pilot load profile meets accepted objectives |
| Reliability | Alerts route to named responder; incident tabletop completed |
| Product | End-to-end commercial workflow acceptance passes |
| Support | Named owner, escalation, response windows and feedback channel |
| Privacy | Data classification, retention and export handling accepted |

## Operating model

- Weekly pilot health review.
- Daily automated synthetic checks.
- Named customer and technical owner for each organization.
- Change freeze during critical pilot events.
- Incident and learning log.
- Explicit exit criteria: safety, adoption, workflow completion, data quality and support burden.

The pilot must test the actual assumptions that affect mobile and scale: high-frequency roles, required offline behavior, notification usefulness, record volumes and cross-company governance.

