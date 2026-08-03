# Authentication and Sessions

## Current state

- **Implemented:** Auth.js v5 beta with credentials and optional Google OAuth in [`auth.ts`](../../auth.ts).
- **Implemented:** normalized email, 12–128 character input boundary, bcrypt comparison, disabled-user rejection.
- **Implemented:** JWT session with an eight-hour standard or explicit 30-day remembered logical lifetime, secure production cookie named `__Secure-nefe.session-token`, HttpOnly, SameSite=Lax.
- **Implemented:** session contains user ID; workspace role is not embedded.
- **Implemented:** managed tenant invitations, required email verification, bcrypt cost 12 and atomic user/membership/invitation/token/audit registration in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts).
- **Implemented:** hashed single-use password recovery, PostgreSQL-backed authentication throttling, and a revocable JWT session registry.
- **Partial:** optional Google provider is environment-triggered; account linking and enterprise administration are not documented.
- **Missing:** MFA, sensitive-action reauthentication, suspicious-login detection, SSO administration and service accounts.

Although `sessions`, `accounts` and `verification_tokens` exist in [`db/schema.ts`](../../db/schema.ts), Auth.js is configured for JWT sessions. Their presence does not prove database session use.

## Immediate target

1. Require reauthentication for owner role changes, sensitive exports and security-setting changes.
2. Add MFA for Owner and Administrator before broader rollout.
3. Add authentication risk signals and administrator-enforced session policy when operating requirements are defined.

## Later target

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

**Sprint 2:** migration `0007_conscious_arclight.sql` adds managed invitations, verification/reset tokens, durable throttling and an opaque session registry. Email verification gates new memberships, resets invalidate prior authentication, and Security Settings exposes password/session controls.

**Deferred:** reauthentication, MFA, enterprise federation and risk-based authentication.
