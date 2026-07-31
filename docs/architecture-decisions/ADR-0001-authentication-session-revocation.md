# ADR-0001 — Authentication Session Revocation

Status: Accepted for EH1.1  
Date: 2026-07-31

## Context

NEFE uses Auth.js `5.0.0-beta.32`, credentials authentication, explicit JWT sessions with an eight-hour maximum age, no configured adapter, and a Node/PostgreSQL runtime. JWTs previously contained only user identity and could not be invalidated before expiry.

The installed Auth.js assertion logic states that credentials-only authentication is supported only with JWT strategy. Database sessions additionally require an adapter. Although NEFE has Auth.js-compatible database tables and an installed Drizzle adapter package, no adapter is configured and switching the current credentials-only configuration to database sessions would produce `UnsupportedStrategy` in the installed package.

## Options evaluated

### A — Database-backed Auth.js sessions

Rejected for this increment. The installed credentials-provider constraint prevents a clean switch, and custom session behavior would be fragile.

### B — JWT plus authoritative security version

Selected. Add a monotonic `users.security_version`, place its current value in the JWT at sign-in, and compare it with persisted user status/version on every authoritative Auth.js JWT resolution.

### C — JWT plus server-side session registry

Deferred. It enables individual-session revocation but requires opaque session IDs, lifecycle storage and inventory semantics beyond EH1.1.

### D — Version plus registry

Rejected for now as unnecessary complexity. All-session invalidation satisfies this increment.

## Decision

Select Option B.

- PostgreSQL remains authoritative for global user state.
- JWT is transport, not authorization authority.
- Workspace role and organization remain absent from long-lived JWT state.
- A version mismatch, deleted user or global disablement rejects the authentication state.
- Incrementing the version invalidates all prior JWTs for that user without affecting others.

## Migration and cutover

Migration `0005_wet_firelord.sql` adds a non-null integer defaulting to `1` and a check requiring values of at least `1`. Existing users are compatible. Existing JWTs have no version and intentionally fail closed after the new code is deployed, requiring all signed-in users to authenticate once.

Safe order:

1. Apply migration 0005.
2. Deploy code that issues/checks the version.
3. Verify active login, old-cookie rejection and disablement in staging.

Deploying code before the migration would cause authentication database queries to fail. Rollback after code deployment requires rolling back application code; retaining the additive column is safe. Do not drop it during emergency rollback.

## Implications

- Forced login: one time for all pre-cutover sessions.
- Web: one user-status query per authoritative JWT resolution; monitor latency and connection use.
- Future password reset: increment the same version transactionally.
- Future API/mobile: security version is transport-agnostic, but mobile token design remains separate.
- Individual device/session revocation: unavailable until a registry is deliberately added.
- Availability: database availability is now required to validate authenticated requests; fail-closed behavior is intentional.

## Security limitations

- A stolen current-version JWT remains usable until version increment, logout or eight-hour expiry.
- No self-service revoke-all UI is included.
- No device inventory exists.
- Durable throttling, MFA and reauthentication are later increments.

