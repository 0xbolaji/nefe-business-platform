# Authentication and Sessions

## Current state

- **Implemented:** Auth.js v5 beta with credentials and optional Google OAuth in [`auth.ts`](../../auth.ts).
- **Implemented:** normalized email, 12–128 character input boundary, bcrypt comparison, disabled-user rejection.
- **Implemented:** JWT session, eight-hour maximum age, secure production cookie named `__Secure-nefe.session-token`, HttpOnly, SameSite=Lax.
- **Implemented:** session contains user ID; workspace role is not embedded.
- **Implemented:** internal registration uses a server-side invitation code, least-privileged `VIEWER` role, bcrypt cost 12 and an atomic user/membership/audit transaction in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts).
- **Partial:** optional Google provider is environment-triggered; account linking and enterprise administration are not documented.
- **Missing:** email verification enforcement, password reset, recovery, MFA, session/device management, JWT revocation, suspicious-login detection, SSO administration and service accounts.

Although `sessions`, `accounts` and `verification_tokens` exist in [`db/schema.ts`](../../db/schema.ts), Auth.js is configured for JWT sessions. Their presence does not prove database session use.

## Immediate target

1. Define authentication policy: password requirements, failed-attempt limits, session idle/absolute lifetime, disabled-user behavior and reauthentication events.
2. Replace process-local registration throttling in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts) with a deployment-compatible durable control or edge/platform rate limit.
3. Add password reset and recovery with single-use, hashed, expiring tokens and non-enumerating responses.
4. Enforce verified email for non-demo production users.
5. Add a session version or database-backed session registry so password, role-security events and disablement can revoke access.
6. Require reauthentication for owner role changes, sensitive exports and security-setting changes.
7. Add MFA for Owner and Administrator before broader rollout.

## Later target

- Managed invitations rather than a shared code.
- OIDC first for enterprise federation; SAML through an identity broker when customer demand is proven.
- Service accounts with scoped credentials, expiry, rotation and separate audit identity.
- Mobile authorization-code flow with PKCE, secure OS keychain storage, rotating refresh tokens and per-device revocation.

## Acceptance gates

- Five failed attempts cannot be distributed across instances without throttling.
- Disabling a user terminates effective access on the next request.
- Password reset tokens are hashed at rest, single-use and expire.
- Owner/Admin MFA is enforced and recovery is tested.
- Authentication logs contain category and safe identifiers, never credentials or tokens.

## EH1.0–EH1.1 implementation status

**Implemented:** JWT plus authoritative user security version, selected in [ADR-0001](../architecture-decisions/ADR-0001-authentication-session-revocation.md). `users.security_version` is compared with the JWT security version on every authoritative Auth.js resolution, together with current `disabled_at`. A mismatch, missing user or disabled user fails closed.

**Cutover:** migration `0005_wet_firelord.sql` must be applied before the code deployment. JWTs issued before this change lack the security version and require one new sign-in.

**Preserved:** role and organization membership remain database-resolved per request and are not placed in JWT claims.

**Deferred:** individual-session/device revocation, password reset, email verification, managed invitations, durable throttling, reauthentication and MFA.
