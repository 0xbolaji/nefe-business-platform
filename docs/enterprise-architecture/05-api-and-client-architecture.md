# API and Client Architecture

## Current state

The web application primarily uses Server Components and Server Actions. Auth.js exposes its route and analytics exposes a tenant-scoped CSV route. There is no general versioned product API. This is effective for the current web client but is not an adequate stable contract for native mobile or partners.

## Options

| Option | Strength | Weakness | Decision |
|---|---|---|---|
| Server Actions only | Tight Next.js integration | Web/runtime coupled; poor external contract | Keep for web UI orchestration |
| REST | Broad tooling, cache semantics, mobile friendly | More explicit DTO/version work | Recommended shared-client façade |
| Typed RPC | Strong TypeScript ergonomics | Client/framework coupling | Consider internally, not sole public contract |
| GraphQL | Flexible graph-shaped reads | Authorization/cost complexity | Postpone |
| Hybrid | Fit-for-purpose | Requires strict ownership | Recommended: Actions + versioned REST |

## Target

Use Server Actions for first-party web interactions and add `/api/v1` REST resources before mobile or external integrations. Both call the same domain services and repositories; neither duplicates business rules.

The contract must define:

- authentication and token lifecycle;
- server-resolved tenant context;
- permission checks;
- Zod-derived request/response DTOs;
- opaque cursors and bounded pagination;
- idempotency keys for retried mutations;
- stable error envelope and correlation ID;
- rate-limit headers/policy;
- audit attribution;
- backwards compatibility and deprecation windows;
- no internal database fields or raw errors;
- OpenAPI generated from reviewed contracts.

## Mobile prerequisites

Do not begin native implementation until authentication PKCE/refresh behavior, device revocation, API versioning, pagination, offline conflict policy, telemetry, release compatibility and secure storage requirements are accepted and tested.

