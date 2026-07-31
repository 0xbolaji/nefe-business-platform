# Integration Platform

## Current state

No general partner API, webhook delivery system, connector framework or service-account model was found. Google authentication is optional but is not a business-data integration.

## Target capabilities

1. Versioned API contracts using the shared domain service layer.
2. Tenant-admin managed integration identities with least privilege.
3. Outbound webhooks backed by a transactional outbox.
4. Signed requests, timestamp/replay protection and secret rotation.
5. Idempotency and delivery attempt visibility.
6. Per-tenant quotas, rate limits and suspension.
7. Import validation, dry run, reconciliation and provenance.
8. Integration audit trail without private payload logging.

## Phased approach

- Pilot: manual CSV import/export with validation and named operator.
- Early: narrowly scoped read API and one evidence-backed connector.
- Later: webhook subscriptions, managed credentials and self-service integration administration.

Do not promise Salesforce, payment, tourism, government or identity connectors until a pilot workflow and data-owner agreement exists.

## Contract rules

- External IDs are namespaced by source and tenant.
- Imports never choose authorization context.
- Every mapping has owner, version and conflict policy.
- Failed deliveries are retryable, observable and idempotent.
- Data minimization and retention are part of connector approval.

