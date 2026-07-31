# EH0-R1 — EH1 Repository Reconciliation

Status: repository-grounded reconciliation  
Date: 2026-07-31  
Scope: documentation only; no EH1 implementation

## Reconciliation boundary

EH0 and the repository are available. The independent Claude review itself—including its Sections 8 and 10—is **not present in the repository or supplied attachments available to this task**. Consequently, Claude's exact wording, ordering and completeness are not verifiable. The matrix below reconciles the major security recommendations identified by the EH0 threat model and this reconciliation prompt. Any claim about an unprovided Claude passage is classified **NOT VERIFIABLE** rather than silently attributed.

Repository facts remain authoritative. Evidence links point to current source, not planned behavior.

## Authentication configuration

| Question | Repository answer | Evidence | Security implication |
|---|---|---|---|
| Auth framework | Auth.js v5 beta via `next-auth` | [`package.json`](../../package.json), [`auth.ts`](../../auth.ts) | Framework defaults must be verified against the installed version during EH1 |
| Providers | Credentials always; Google only when both Google environment values exist | [`auth.ts`](../../auth.ts) | Google is conditional, not a confirmed production provider |
| Adapter | **No adapter configured** | `NextAuth({ ... })` in [`auth.ts`](../../auth.ts) has no `adapter` property | Auth.js schema tables do not imply Auth.js persistence |
| Session strategy | Explicit `jwt` | `session:{strategy:"jwt",maxAge:60*60*8}` in [`auth.ts`](../../auth.ts) | Session state is client-cookie-backed and cannot be revoked through the unused `sessions` table |
| Session lifetime | Eight-hour configured maximum age | [`auth.ts`](../../auth.ts) | Limits exposure, but does not provide immediate revocation |
| Cookie | Production name `__Secure-nefe.session-token`; HttpOnly; SameSite Lax; path `/`; Secure in production | [`auth.ts`](../../auth.ts) | Good baseline cookie attributes; explicit domain and priority are not configured |
| JWT callback | On sign-in, copies `user.id` into `token.sub` | [`auth.ts`](../../auth.ts) | JWT carries identity, not role or organization |
| Session callback | Copies `token.sub` into `session.user.id` | [`auth.ts`](../../auth.ts) | Workspace authorization can be resolved from the database |
| Authorized callback | Requires an authenticated user for `/workspace` paths | [`auth.ts`](../../auth.ts) | Authentication gate only; domain authorization occurs later |
| Route interception | Next.js 16 `proxy.ts` matches `/workspace/:path*` | [`proxy.ts`](../../proxy.ts) | Public routes and Server Actions still need their own controls |
| Runtime declaration | No explicit `runtime` export | [`auth.ts`](../../auth.ts), [`proxy.ts`](../../proxy.ts) | Exact deployed runtime is not declared in repository configuration |
| Runtime compatibility | Auth module imports bcrypt, Drizzle/PostgreSQL and a server logger | [`auth.ts`](../../auth.ts), [`db/client.ts`](../../db/client.ts) | Current implementation requires Node-compatible APIs; it is not written as an Edge-safe auth module |

The dependency `@auth/drizzle-adapter` exists in [`package.json`](../../package.json), but it is not imported or passed to `NextAuth`. That package declaration does not contradict the explicit JWT/no-adapter configuration.

## Session behavior

| Behavior | Current behavior | Evidence | Security implication |
|---|---|---|---|
| Storage | Signed/encrypted Auth.js JWT session cookie; not the database `sessions` table | [`auth.ts`](../../auth.ts) | Database session deletion cannot revoke an issued JWT |
| Logout | UI navigates to Auth.js `/api/auth/signout`; Auth.js exports `signOut` | [`app/(workspace)/workspace/_components/app-shell.tsx`](<../../app/(workspace)/workspace/_components/app-shell.tsx>), [`auth.ts`](../../auth.ts) | Normal logout clears the browser session; repository has no evidence of server-side token invalidation or logout audit |
| Administrative revocation | No session registry, token version or denylist found | [`auth.ts`](../../auth.ts), [`db/schema.ts`](../../db/schema.ts) | Issued JWT remains potentially valid until expiry or logout |
| Disabled user at login | Credentials authorization rejects a user with `disabledAt` | [`auth.ts`](../../auth.ts) | Prevents new credentials sessions |
| Disabled user after login | Session callback does not re-read `users.disabledAt`; workspace context joins `users` but does not filter it | [`auth.ts`](../../auth.ts), [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts) | Existing JWT can continue while an active membership remains; the review's revocation concern is confirmed |
| Role change | Role is read from `organization_members` during workspace-context resolution | [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts) | Role change is fresh on the next server request; role is not stale in the JWT |
| Membership role/status in JWT | Neither is embedded | JWT/session callbacks in [`auth.ts`](../../auth.ts) | Contradicts any claim that stale JWT role claims drive authorization |
| Membership disabled/removed | Active-membership query returns no context; `requireWorkspaceContext` redirects to organization onboarding | [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts) | Access to workspace data stops on the next request, but the redirect is semantically misleading and the JWT remains authenticated |
| Request-local caching | `getWorkspaceContext` uses React `cache()` | [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts) | Repeated calls in one server render share a result; this is not a cross-request authorization cache |

## Invitation architecture

Two different concepts exist and must not be conflated:

1. [`db/schema.ts`](../../db/schema.ts) defines an `invitations` table with organization, email, role, status, inviter and optional expiry.
2. The working internal sign-up flow does **not** query that table. It uses `NEFE_INTERNAL_SIGNUP_CODE` and `NEFE_INTERNAL_ORGANIZATION_SLUG` from server environment configuration in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts) and [`app/lib/auth/internal-registration.ts`](../../app/lib/auth/internal-registration.ts).

| Property | Current internal registration behavior |
|---|---|
| Model | One shared configured code |
| Tenant binding | Server-side configured organization slug |
| Email binding | None |
| Per-invitation record | None used by registration |
| Expiry | None |
| Single use | No |
| Entropy | Not generated by repository; configuration validates only minimum 16 characters |
| Comparison | Constant-time only when byte lengths match, using `timingSafeEqual` |
| Hashing/storage | Not hashed by the app; plaintext environment value, not database storage |
| Default role | `VIEWER`, server-owned |
| Atomicity | User, membership and audit insert share one database transaction |

Therefore a claim that NEFE currently has expiring, email-bound, single-use invitations is **CONTRADICTED**. A claim that the schema anticipates per-user invitations is **CONFIRMED**, but that is not implemented registration behavior.

## Passwords and verification

- **Hashing:** bcrypt through `bcryptjs`; registration calls `hash(value, 12)` in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts).
- **Verification:** credentials login calls `compare` in [`auth.ts`](../../auth.ts).
- **Input policy:** credentials accept 12–128 characters; registration enforces the same length boundary in [`app/lib/auth/internal-registration.ts`](../../app/lib/auth/internal-registration.ts).
- **Reset:** no password-reset route, token creation, mail flow or action was found.
- **Email verification:** `users.emailVerified` and `verificationTokens` exist in [`db/schema.ts`](../../db/schema.ts), but credentials authorization does not require verification and no verification flow was found.
- **Password history/breach checking:** no repository implementation found.

## Authorization freshness: real Server Action trace

The `updateOpportunityStage` path in [`app/lib/actions/workspace-mutations.ts`](../../app/lib/actions/workspace-mutations.ts) is representative:

```text
Incoming Server Action request
↓
requireWorkspaceContext()
↓
auth() validates the Auth.js JWT session cookie
↓
session callback exposes token.sub as session.user.id
↓
getWorkspaceContext() queries active organization_members joined to users/organizations
↓
membership.role is returned from PostgreSQL
↓
requirePermission(role, "opportunity.update") evaluates rolePermissions
↓
Drizzle update includes opportunity ID and active organization ID
↓
PostgreSQL updates the tenant-owned row
↓
status history, audit and collaboration activity are emitted
```

Permissions are re-read from membership on each server request. They are request-locally deduplicated by React `cache()`, not stored across requests, not embedded in the JWT and not accepted from the client. Any Claude finding that roles remain stale because they are JWT claims is **CONTRADICTED**. The distinct finding that an issued JWT survives user disablement is **CONFIRMED**.

## Security headers

| Header/control | Repository status | Configuration |
|---|---|---|
| Content-Security-Policy | Not configured in application repository | No `headers()` entry in [`next.config.ts`](../../next.config.ts) and no middleware/proxy header code found |
| Strict-Transport-Security | Not configured in application repository | Hosting-layer behavior is unknown |
| X-Frame-Options | Not configured in application repository | Hosting-layer behavior is unknown |
| Referrer-Policy | Not configured in application repository | No application configuration found |
| Permissions-Policy | Not configured in application repository | No application configuration found |
| SameSite | Confirmed `lax` for session cookie | [`auth.ts`](../../auth.ts) |
| Secure | Confirmed only when `NODE_ENV === "production"` | [`auth.ts`](../../auth.ts) |
| HttpOnly | Confirmed | [`auth.ts`](../../auth.ts) |

Framework or hosting defaults may add headers at runtime, but that is **NOT VERIFIABLE** from this repository and is not treated as an application guarantee.

## Rate limiting

The only explicit registration limiter is a module-level `Map<string, number[]>` in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts). It hashes normalized email as the key, retains attempts for ten minutes and rejects after five recent attempts.

- Storage: process memory.
- Durability: none across restart, deployment or instance.
- Scope: email-keyed internal registration submissions within one runtime process.
- Missing: durable/distributed login throttling, IP/device dimensions, shared capacity controls and administrative visibility.

No Redis dependency or integration exists.

## Audit architecture

The `audit_logs` table in [`db/schema.ts`](../../db/schema.ts) stores:

- ID;
- organization ID;
- nullable actor ID;
- action;
- entity type;
- entity ID as text;
- JSON metadata;
- created timestamp.

Emitters include:

- `appendAuditLog` and metadata sanitization in [`app/lib/data/audit.ts`](../../app/lib/data/audit.ts);
- transactional collaboration audit writes in [`app/lib/data/collaboration-repository.ts`](../../app/lib/data/collaboration-repository.ts);
- transactional executive-decision audit writes in [`app/lib/data/decision-repository.ts`](../../app/lib/data/decision-repository.ts);
- internal registration, organization creation/administration and workspace mutation actions.

Gaps:

- authentication failures use safe server logs, not `audit_logs`;
- logout and session lifecycle are not audited;
- some primary mutations commit before subsequent audit/activity writes, so atomicity is uneven;
- audit rows are append-only by convention, not protected by a repository-proven restricted database role;
- no request ID, source IP, user agent, retention, export/archive or integrity-chain fields;
- read/access auditing is selective rather than comprehensive.

## Email

- Provider: none found.
- Abstraction: none found.
- Missing: verification delivery, password-reset delivery, invitation delivery, templates, bounce handling, sender-domain configuration and delivery observability.

Optional Google OAuth is authentication, not an email provider.

## Runtime and infrastructure evidence

The repository declares no Edge runtime. Auth imports bcrypt and PostgreSQL-backed code, so the implemented auth path requires a Node-compatible runtime. The exact production runtime/region is **NOT VERIFIABLE** because no deployment manifest is present.

| Capability | Repository evidence |
|---|---|
| Redis | None; no dependency/configuration |
| Staging | None |
| Backups/PITR | None |
| Monitoring vendor/metrics/tracing | None; only JSON server failure logs |
| CI | No `.github` workflow or other pipeline configuration found |
| Deployment provider/configuration | None found |
| PostgreSQL | Confirmed through Drizzle/postgres-js and `DATABASE_URL` |
| Migration workflow | Confirmed through Drizzle config, migration files and package scripts |

## Claude recommendation matrix

Because the Claude artifact is unavailable, “Claude Recommendation” labels describe the recommendations named or implied by the reconciliation brief; exact attribution remains unverified.

| Claude Recommendation | Repository Status | Evidence | Recommendation |
|---|---|---|---|
| Replace database sessions with hardened JWTs | CONTRADICTED — there are no database sessions in use | Explicit JWT strategy and no adapter in [`auth.ts`](../../auth.ts) | Reject |
| Add immediate session revocation | CONFIRMED — missing | JWT-only callbacks have no version/denylist check | Accept |
| Re-read role on every request | CONFIRMED — already implemented | [`app/lib/auth/workspace-context.ts`](../../app/lib/auth/workspace-context.ts) | Reject |
| Fix stale JWT role claims | CONTRADICTED — role is not in JWT | JWT/session callbacks in [`auth.ts`](../../auth.ts) | Reject |
| Deny already-authenticated disabled users | CONFIRMED — gap exists | Login checks `disabledAt`; workspace context does not | Accept |
| Replace shared code with per-invitation tokens | CONFIRMED — current flow is shared-code based | [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts) | Accept with modification |
| Add invitation expiry, email binding, single use and hashed tokens | CONFIRMED — absent from active flow | [`app/lib/auth/internal-registration.ts`](../../app/lib/auth/internal-registration.ts) | Accept |
| Introduce durable/distributed auth throttling | CONFIRMED — process-local limiter only | module-level Map in [`app/sign-up/actions.ts`](../../app/sign-up/actions.ts) | Accept |
| Add password reset and email verification | CONFIRMED — schema fields exist, flows do not | [`db/schema.ts`](../../db/schema.ts), [`auth.ts`](../../auth.ts) | Accept |
| Add MFA for privileged roles | CONFIRMED — absent | no MFA dependency/schema/flow found | Accept with modification |
| Add CSP/HSTS/frame/referrer/permissions headers | PARTIALLY CONFIRMED — app config absent; hosting behavior unknown | [`next.config.ts`](../../next.config.ts) | Accept with modification |
| Configure Redis immediately | CONTRADICTED as a proven requirement | no Redis; scale/runtime need unverified | Defer |
| Move auth to Edge runtime | CONTRADICTED by current Node-dependent implementation | bcrypt/PostgreSQL imports in [`auth.ts`](../../auth.ts) | Reject |
| Add auth/session audit coverage | CONFIRMED — coverage gaps exist | audit emitters and `logServerFailure` | Accept |
| Adopt SSO immediately | NOT VERIFIABLE as a customer requirement | optional Google only; no demand evidence | Defer |
| Claim staging/backups/monitoring are present | CONTRADICTED as a repository claim | no repository configuration/evidence | Reject |
| Select a specific email, MFA, rate-limit or observability vendor | NOT VERIFIABLE | requirements and infrastructure constraints absent | Defer |

## Unknowns

### Repository unknowns

- Auth.js framework-default CSRF, JWT encryption and cookie expiry behavior for the exact beta release without runtime inspection.
- Whether every mutation emitter is audit-complete; current review sampled principal paths rather than proving exhaustive coverage.
- Whether the unused `invitations`, `sessions` and verification-token tables are intended future architecture or stale schema.

### Infrastructure unknowns

- Hosting provider, Node version and region.
- Reverse-proxy/WAF headers and rate limiting.
- TLS/HSTS configuration.
- Secret manager and rotation process.
- Production database roles, Neon branch topology, backups, PITR and retention.
- Central log destination, monitoring, alerting and incident response.
- CI/CD, staging, preview isolation and deployment approval controls.
- Email delivery and domain ownership.

### Founder decisions

1. Session revocation design: database sessions versus JWT plus server-checked session version/registry.
2. Invitation transition: preserve controlled shared-code signup temporarily or move directly to per-user managed invitations.
3. MFA pilot gate: require Owner/Administrator MFA before first pilot or before pilot expansion.
4. Durable throttling platform: deployment-native control versus a dedicated shared backend.
5. Email provider and verified sender ownership for reset/verification.
6. Security-header policy and rollout/report-only period for CSP.
7. Audit retention and privileged access policy.

Role freshness, modular-monolith architecture and current JWT session strategy are repository facts, not open questions. Whether to retain JWT after adding revocation is still a decision.

## Revised EH1 sequence

### EH1.0 — Authentication contract and regression harness

- Freeze confirmed current behavior in tests: JWT identity-only claims, eight-hour lifetime, cookie attributes, current membership role lookup and safe error responses.
- Add tests for disabled users, removed/disabled memberships and role freshness.
- Completion gate: tests demonstrate current behavior without changing it.

### EH1.1 — Disabled-user and session invalidation foundation

- Implement the founder-selected revocation architecture.
- Deny disabled users on every authenticated request, not only new credential login.
- Define logout, password-change and security-event invalidation.
- Completion gate: an issued session becomes unusable within the accepted bound.

### EH1.2 — Durable authentication abuse controls

- Replace process-local registration throttling.
- Add credential-login throttling with safe, non-enumerating behavior.
- Record safe categories and operational metrics without credentials or raw input.
- Completion gate: controls work across two runtime instances and restarts.

### EH1.3 — Password recovery and email verification

- Add a reviewed email abstraction and provider.
- Add hashed, expiring, single-use reset/verification tokens.
- Enforce verified-email policy selected for production accounts.
- Completion gate: expiry, replay, enumeration and session-invalidation tests pass.

### EH1.4 — Managed invitation lifecycle

- Reconcile or replace the currently unused `invitations` schema.
- Add server-generated high-entropy, hashed, expiring, email- and tenant-bound, single-use invitations.
- Preserve server-owned role/organization selection and atomic membership/audit creation.
- Completion gate: cross-tenant, replay, expiry and wrong-email tests pass.

### EH1.5 — Security headers and sensitive-action reauthentication

- Add explicit headers with CSP report-only rollout before enforcement.
- Require recent authentication for high-risk role/security changes and sensitive exports as selected.
- Completion gate: browser/header tests and reauthentication tests pass.

### EH1.6 — Privileged MFA increment

- Implement the selected MFA approach for Owner/Administrator with recovery and reset controls.
- Completion gate: enrollment, challenge, recovery, revocation and administrative support tests pass.

### EH1.7 — Auth audit, runbooks and production acceptance

- Add safe lifecycle audit/events, retention decision and incident runbooks.
- Validate production environment, secrets, throttling, email, monitoring and rollback in staging.
- Completion gate: adversarial review findings are reconciled and production acceptance is signed.

SSO, service accounts and native-mobile tokens remain outside EH1 unless a separate founder decision changes scope.

## ADR candidates

- ADR-EH1-001: JWT plus revocation/versioning versus Auth.js database sessions.
- ADR-EH1-002: Shared internal code deprecation and managed invitation lifecycle.
- ADR-EH1-003: Privileged-role MFA timing and recovery model.
- ADR-EH1-004: Durable throttling backend and ownership.
- ADR-EH1-005: Email provider and token-delivery boundary.
- ADR-EH1-006: CSP/security-header rollout policy.
- ADR-EH1-007: Authentication audit retention and privacy boundary.

## Reconciliation conclusion

The biggest confirmed risk is not stale role authorization: that was already corrected architecturally by resolving membership on each request. The larger identity gap is that a valid JWT remains independent of current user disablement and has no administrative revocation mechanism. The biggest architectural surprise is the divergence between schema capability and active behavior: session, verification-token and invitation tables exist, while the running system uses JWT sessions, no verification/reset workflow and a shared environment invitation code.

