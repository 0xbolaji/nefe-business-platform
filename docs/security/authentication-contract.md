# Authentication Security Contract

Status: EH1.0–EH1.1 engineering contract  
Evidence: [`auth.ts`](../../auth.ts), [`workspace-context.ts`](../../app/lib/auth/workspace-context.ts), [`account-security.ts`](../../app/lib/auth/account-security.ts), [`db/schema.ts`](../../db/schema.ts)

## Implemented identity invariants

- A globally disabled user cannot authenticate with credentials.
- Every JWT-backed authoritative authentication resolution compares the token security version with the persisted user and rejects missing, deleted, disabled, or version-mismatched users.
- User status is server-authoritative.
- Global user status and organization-membership status are separate controls.
- Disabling/removing one membership does not disable the global user or invalidate access to another active organization.
- Display names are presentation values, never identity keys.
- Authentication normalizes email to lowercase. Repository uniqueness is enforced by `users_email_uq`; existing stored mixed-case values remain a data-governance consideration because the database index itself is case-sensitive.

## Implemented session invariants

- Auth.js remains on JWT transport with an eight-hour maximum lifetime.
- The JWT contains user identity and a security version; it does not contain workspace role, organization ID, or permissions.
- Every authoritative Auth.js resolution reads current global user status and security version from PostgreSQL.
- Workspace role and active organization membership are freshly resolved from `organization_members` per server request and are only deduplicated within one render.
- Signing out invalidates the current browser cookie according to Auth.js JWT behavior.
- Incrementing `users.security_version` invalidates all previously issued JWT authentication states for that user.
- Global disablement and all-session invalidation share the same authoritative version mechanism.
- Pre-EH1 JWTs contain no security version and are rejected after rollout. This is a one-time cutover behavior: users with an existing pre-deployment cookie must sign in once, while newly issued versioned JWTs continue normally.
- Future password reset must increment the security version in the same transaction as password replacement.

Individual-session/device revocation is deferred. EH1.1 provides all-session invalidation only.

## Membership invariants

- Role changes take effect on the next authoritative request.
- Disabled memberships are excluded from workspace selection.
- A user with prior inactive membership and no active workspace receives access denied rather than onboarding.
- Removing one organization membership cannot restore access to that organization.
- Another active organization membership remains selectable.

## Administrative security invariants

- No client-facing global-disable action is exposed in EH1.1. The membership disable/remove and all-session invalidation primitives are also server-only domain operations with no exposed Server Action or UI in this increment.
- The server-only global-disable primitive requires current `team.manage` permission, a same-organization target, non-self action, final-owner protection, and Administrator-versus-Owner protection.
- A workspace administrator cannot globally disable/revoke a user who has another active organization membership; a future platform-level authority requires a separate decision.
- Global disablement, security-version increment, and audit writes are atomic.
- Membership disable/remove events are separate from global account disablement and do not increment global session security version.

## Security-event invariants

- Global disablement emits `user.globally_disabled`.
- All-session invalidation emits `session.all_invalidated`.
- Membership controls emit `membership.disabled` and `membership.removed`; role changes continue to emit `member.role_changed`.
- Audit events preserve actor, target user, active organization, action, timestamp and safe metadata.
- Logs/audit must never contain raw JWTs, cookies, passwords, password hashes, invitation codes, reset/verification tokens, MFA secrets or recovery codes.

## Deferred controls

Password reset, email verification, managed invitations, durable throttling, sensitive-action reauthentication, MFA, session inventory, device revocation and email delivery remain unimplemented.
