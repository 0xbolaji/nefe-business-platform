# NEFE Business Platform — EH1 Threat Model and Authentication Adversarial Review

**Role:** Independent security architect / adversarial reviewer
**Scope:** EH1 (Authentication and Session Hardening) readiness for controlled pilot (3–5 companies)
**Method:** Adversarial review against stated architecture claims. No repository access. All findings are labeled by evidence class.

**Evidence-class legend used throughout this document:**

- **[VERIFIED]** — stated in the prompt as current, confirmed behavior.
- **[CLAIMED]** — asserted in the EH0 architecture document as an existing control, not independently verified here.
- **[ASSUMPTION]** — a reasonable inference this review relies on, not confirmed.
- **[UNRESOLVED]** — a material open question that blocks a firm recommendation.
- **[RECOMMENDATION]** — this review's proposed action.

Nothing in this document should be read as confirming repository behavior. Section 8 and Section 10 exist specifically to close the [UNRESOLVED] items against real code.

---

## 1. Executive Assessment

*(500-word limit)*

The EH1 scope targets the correct problem area — authentication and session integrity — but as written it is incomplete and contains one structural risk that could cause the whole workstream to under-deliver.

**The scope is adequate in direction, not in coverage.** Three of the eight EH1 items (durable throttling, session revocation, disabled-user invalidation) depend on a fact this review cannot confirm: whether Auth.js is currently configured for JWT sessions or database sessions **[UNRESOLVED]**. If sessions are stateless JWTs with no server-side check, "session revocation" and "disabled-user session invalidation" cannot be implemented as stated without first adding a server-side validation step. This is not a wording problem — it changes what EH1.4 and EH1.5 actually have to build. This must be resolved before implementation, not during it.

**The most dangerous omission is invitation hardening.** The platform's entire external attack surface currently narrows to one gate: invitation-only registration. The review questions explicitly ask whether "a single shared invitation code" is defensible — the fact that this question has to be asked at all is itself a signal. If invitations are a shared, static code rather than unique, expiring, tenant-bound, single-use tokens, the "invitation-only" control is largely cosmetic: anyone holding the code can self-register with any email into a real tenant. This is not in the current 8-item EH1 list and should be added as a P0/P1 item, not deferred to EH2.

**Second most dangerous omission: account-enumeration resistance is implied, not scoped.** Login, password-reset-request, email-verification-resend, and invitation-acceptance are four distinct places a differential response can confirm whether an email or invite exists. None of the four are named explicitly in EH1.

**Third: reauthentication scope is undefined.** "Reauthentication for sensitive actions" (item 6) lists no operations. Without an explicit list — owner transfer, user disable, org deletion, MFA disable, mass session revocation, security-settings changes — this item will likely ship covering only password change, missing the operations that actually matter for a compromised-administrator scenario.

**Can the platform proceed to pilot after EH1?** Conditionally yes — a 3–5 company, invitation-only, credential-authenticated pilot without MFA is an acceptable risk posture *provided* the following are true at pilot start, not merely planned: (1) the session model is confirmed and revocation is real and immediate; (2) invitations are hardened; (3) throttling is durable and covers all four abusable endpoints, not just login; (4) enumeration resistance is applied consistently; (5) the sensitive-action list is explicit and server-side enforced, not UI-only; (6) disabling a user actually kills their session, verified by test, not assumed. MFA is not a pilot blocker for this cohort size and trust level, but it should be mandatory for Owner/Administrator roles shortly after it ships — ideally within the pilot window, not after.

**Conditions for proceeding:** Section 7 provides the binding pass/fail gate. Treat every unchecked item there as a pilot blocker, independent of calendar pressure.

---

## 2. Top Findings

| # | Finding | Priority | Confidence | Why it matters | Recommended action |
|---|---|---|---|---|---|
| 1 | Session strategy (JWT vs. database) is unconfirmed, and EH1's revocation goals cannot be designed without it | P0 | High | Session revocation and disabled-user invalidation — two named EH1 deliverables — are architecturally impossible to build correctly without knowing this first | Verify via Codex (Section 8, Q1) before any EH1.4/EH1.5 work starts |
| 2 | Invitation hardening (unique, expiring, tenant-bound, single-use) is absent from the EH1 item list | P0 | Medium (repo behavior unconfirmed) | Invitation-only registration is the platform's only external gate; a static/shared code makes it cosmetic | Add as explicit EH1 increment (EH1.3) |
| 3 | Account-enumeration resistance is not named as its own workstream | P1 (P0 specifically for reset/invite-acceptance responses) | High | Differential responses on login/reset/verify/invite let an attacker map which emails and companies are pilot participants — directly useful for phishing pilot customers | Standardize generic responses across all four flows |
| 4 | "Reauthentication for sensitive actions" has no defined operation list | P0 | High | Undefined scope reliably ships covering only the easy case (password change), missing owner transfer, mass revoke, org deletion, MFA disable | Adopt the explicit list in Section on sensitive actions; enforce server-side, verify by direct Server Action test, not UI test |
| 5 | Durable throttling (item 1) does not explicitly state which endpoints it covers | P0 | Medium | Password-reset-request and email-verification-resend are equally abusable as login and are common DoS/enumeration vectors if unthrottled | Explicitly scope throttling to login, reset-request, verify-resend, invite-accept |
| 6 | Multi-org session/authorization staleness after membership change is not addressed for the case where a user remains valid in one org but is removed from another | P1 | Medium | A user removed from Org A but still active in Org B should lose Org A access immediately; ambiguous today whether this is a full-session or per-org invalidation | Clarify and test both single-org disable and multi-org membership removal as distinct cases (EH1.5) |
| 7 | Password-reset token delivery is vulnerable to corporate email-link scanners consuming single-use tokens before the real user clicks | P1 | High (well-documented industry failure mode) | A GET-consumes-token design will silently break resets for any pilot company using Safe Links–style email security gateways | Require GET to render a confirmation/form, POST to consume the token |
| 8 | No explicit control preventing an administrator from using "revoke all sessions" or "disable user" to cover up account takeover or lock out the legitimate owner | P0 | Medium | Explicitly listed threat ("locking the legitimate Owner out"); currently no reauth or notification requirement named for this class of action | Require reauth + audit + user-visible notification for all admin-initiated account/session actions against another user |
| 9 | Security headers and cookie-flag hardening (SameSite/Secure/HttpOnly, clickjacking, no-cache on authenticated pages) are absent from EH1 entirely | P0 | Medium | Cheapest, lowest-risk mitigation for session theft and clickjacking threats explicitly in scope for this review; omitting it is disproportionate to its cost | Add as EH1.1, ship first, independent of session-model decision |
| 10 | Email verification's role is unclear — is it a login gate or only a prerequisite for enabling reset? | P1 | High | Hard-gating login before verification adds pilot friction for admin-curated invited users; but reset must not be sent to an unverified address | Treat as reset-safety prerequisite (P0 for that purpose), not a hard login gate (P2) for pilot |
| 11 | No confirmation of whether "role and permission resolution" re-reads from Postgres per request or is cached/embedded in the session payload | P0 | Medium | Determines whether role downgrades and membership removals take effect immediately or only at next token/cache refresh — a core claim ("centralized role permissions") depends on this | Verify via Codex (Section 8, Q8) |
| 12 | MFA scope for "Owner and Administrator" preparation does not specify method | P1 | High | Silent drift toward SMS or email-OTP (both weak) is common if not specified up front | Specify TOTP as the EH1 target method; WebAuthn as fast-follow, not first release |
| 13 | Recovery-code and admin-assisted-MFA-reset paths are not mentioned, but are the most common real-world MFA bypass vector | P1 | High | An admin-assisted "reset my MFA" flow that skips equivalent verification rigor defeats MFA entirely | Design recovery-code handling and admin-assisted MFA reset with the same reauth+audit+notify pattern as other sensitive actions, before MFA ships |
| 14 | No named requirement that password-reset revokes all existing sessions | P0 | High | Explicit threat in scope ("stale sessions after password reset"); a reset that doesn't revoke prior sessions leaves an attacker's stolen session valid even after the legitimate user "secures" their account | Make this an explicit, tested requirement of EH1.6 |
| 15 | Audit-log field safety (what must never be recorded) is not addressed anywhere in current controls or EH1 scope | P0 | Medium | Structured auth event logging (item 7) could easily leak tokens/secrets into logs if field safety isn't specified before implementation | Publish an explicit "never record" field list before EH1.9 implementation, not after |

---

## 3. Threat Model

Only the highest-value, distinct threats are tabulated below (closely related items — e.g., brute force / password spraying / credential stuffing — are consolidated where the control is shared, split where the root cause and mitigation genuinely differ).

| Threat | Asset | Attack path | Current control | Gap | Impact | Recommendation | Priority | Validation |
|---|---|---|---|---|---|---|---|---|
| Brute-force / password-spraying login | User credentials, tenant data | Repeated login attempts against known or guessed emails | Process-local throttling **[CLAIMED]** | Not durable across restarts/instances **[VERIFIED gap]** | Account takeover | Durable, shared-store throttling keyed by account + IP + action | P0 | Scripted repeated-attempt test across app restart/multiple instances |
| Credential stuffing (reused breached passwords) | User credentials | Attacker replays breached email/password pairs | Strong password hashing **[CLAIMED]** | No breached-password screening, no MFA | Account takeover, especially for reused corporate passwords | Add MFA for Owner/Admin (P1); consider breached-password check at signup/reset (P2) | P1 | Manual test with known-bad test password list in staging |
| Email/account enumeration | User & tenant existence data | Differential responses on login, reset-request, verify-resend, invite-accept | None confirmed **[UNRESOLVED]** | Reveals which emails/orgs are pilot participants | Targeted phishing of pilot companies | Generic, identical responses regardless of account existence, across all four flows | P0 (reset/invite), P1 (general) | Response-diffing test: valid vs. invalid email on each endpoint |
| Registration-code guessing/leakage | Tenant boundary | Guess or leak a shared invitation code | Invitation-only registration **[VERIFIED]**; uniqueness/expiry unconfirmed **[UNRESOLVED]** | Possible static/shared code defeats tenant boundary at signup | Unauthorized tenant entry | Unique, expiring, tenant-bound, single-use invitation tokens | P0 | Attempt reuse/cross-tenant use of a consumed or foreign invite |
| Password-reset takeover via compromised email | User account | Attacker with access to victim's email requests reset | None beyond generic reset flow (not yet built **[CLAIMED gap]**) | No described control mitigates this scenario specifically | Full account takeover | Full session revocation on reset; step-up to MFA for reset when enrolled; notify old-session context of reset | P1 | Manual walkthrough with a test account with active sessions |
| Reset/verification token replay | User account | Token intercepted or reused after consumption | Not yet implemented **[gap]** | No described single-use/hash-at-rest guarantee | Account takeover or lockout | Hash tokens at rest, atomic single-use consumption, short expiry | P0 | Attempt to reuse a consumed token; attempt concurrent use (race test) |
| Race condition in reset/verification consumption | User account | Two near-simultaneous requests both consume the same token | Not addressed **[gap]** | No described atomic consumption guarantee | Double-use of a one-time token | Atomic conditional update (`WHERE used_at IS NULL`) as the consuming operation | P0 | Concurrent-request test against the same token |
| Email-link scanner pre-consumption | User account | Corporate email gateway auto-fetches reset/verify link | Not addressed **[gap]** | GET-consumes-token pattern is a known failure mode | Legitimate user locked out of own reset | GET renders confirmation/form; POST consumes token | P1 | Simulate HEAD/GET-only fetch of the link, confirm token still valid |
| Session/cookie theft (XSS or physical access) | Active session | Attacker exfiltrates session cookie via XSS or shared device | Secure auth cookies **[CLAIMED]**; specific flags unconfirmed **[UNRESOLVED]** | HttpOnly/Secure/SameSite configuration unverified | Session hijack | Confirm/enforce HttpOnly, Secure, SameSite=Lax or Strict; add baseline CSP | P0 | Inspect actual cookie attributes in staging; header-presence test |
| Session fixation | Active session | Attacker pre-sets a session identifier before victim authenticates | Not addressed **[gap]** | Depends on Auth.js session-issuance behavior, unconfirmed | Session hijack | Confirm Auth.js regenerates session identifier on login (standard behavior for most adapters, but verify) | P1 | Verify session id changes between pre-auth and post-auth state |
| Stale session after role/membership change | Authorization boundary | User's role is downgraded or membership removed while session remains active | Server-side role/permission resolution claimed **[CLAIMED]**; freshness of that resolution unconfirmed **[UNRESOLVED]** | If role is cached/embedded rather than re-read per request, downgrade doesn't take effect until refresh | Privilege persists past intended removal | Confirm per-request DB resolution; if cached, invalidate cache on role/membership change | P0 | Downgrade a test user mid-session, confirm next request reflects new role |
| Stale session after suspension | Authentication boundary | Disabled user's existing session continues to authenticate | Not addressed **[VERIFIED gap]** | No described invalidation trigger | Disabled user retains full access | Immediate session kill on user-disable (EH1.5) | P0 | Disable a test user mid-session, confirm next request rejected |
| Logout clears only current browser | Session set | User logs out on one device; other active sessions persist | Expected default Auth.js behavior **[ASSUMPTION]** | No "log out everywhere" capability described | Stolen/forgotten session on another device remains valid | Provide at least a "revoke all other sessions" self-service action | P1 | Confirm logout scope in a two-device manual test |
| Multi-device session abuse / no session inventory | Session set | Attacker maintains a hidden concurrent session | None | No visibility for user or admin into active sessions | Undetected long-term unauthorized access | Minimal self-service revoke-all; full inventory UI deferred to EH2 | P2 | N/A for EH1; defer |
| Long-lived JWT compromise (if JWT strategy in use) | Active session | Stolen JWT remains valid until natural expiry, cannot be revoked early | Unconfirmed session strategy **[UNRESOLVED]** | If JWT without server-side check, no revocation is possible at all | Attacker-controlled access window bounded only by token TTL | Move to (or confirm) database-backed sessions; if JWT must remain, add version/security-stamp check per request | P0 | Directly dependent on Q1 in Section 8 |
| CSRF against Server Actions | State-changing operations | Cross-site request triggers a state change using victim's cookies | Next.js Server Actions have some built-in origin checks depending on version/config **[ASSUMPTION, unconfirmed]** | Configuration/version not verified | Unauthorized state change | Confirm Server Action origin-checking is active; add explicit CSRF defense if not | P0 | Attempt a cross-origin Server Action invocation in staging |
| XSS leading to session theft | Active session | Stored or reflected XSS reads/exfiltrates session cookie | Server Actions/typed inputs reduce some surface **[CLAIMED validation]** | CSP/output-encoding posture unconfirmed | Full session hijack | HttpOnly cookies (defense-in-depth even if XSS exists) + baseline CSP | P0 | Header/config review; standard XSS test payloads in staging only |
| Open redirect via callback URL | Authentication flow | Attacker crafts a login/callback URL redirecting to attacker-controlled site post-auth | Not addressed **[gap]** | Auth.js callback URL allow-listing unconfirmed | Credential phishing, token leakage via referrer | Confirm/enforce callback URL allow-list restricted to known origins | P1 | Attempt login with an external callback/redirect parameter |
| Sensitive data in URLs (tokens in query strings) | Reset/verification tokens | Token passed via URL ends up in browser history, logs, referrer headers, analytics | Not addressed **[gap]** | Common default pattern for email links | Token leakage via logs/analytics/referrer | Treat link tokens as sensitive: avoid analytics on token-bearing routes, avoid outbound links from the confirmation page, short expiry as compensating control | P1 | Review confirmation-page markup for outbound links/analytics scripts |
| Compromised Administrator account | Entire tenant(s) the admin manages | Attacker takes over an Administrator session or credentials | Centralized RBAC **[CLAIMED]** | No reauth/notify/audit specifically for admin-initiated actions against other users | Mass disablement, mass revocation, data exfiltration, owner lockout | Reauth + audit + notify for all admin actions targeting other users' accounts/sessions | P0 | Attempt each listed admin action with a stale/non-fresh session, confirm reauth is enforced |
| Owner lockout by malicious/compromised admin | Tenant continuity | Admin disables or demotes the Owner, or transfers ownership without consent | RBAC exists **[CLAIMED]**; no described safeguard for this specific case | No dual-control or Owner-notification requirement | Legitimate Owner loses control of their own workspace | Require reauth for owner-role changes; notify affected Owner via verified email on any ownership change | P0 | Attempt owner-role change as Administrator, confirm reauth + notification |
| Reused/guessable invitation across tenants | Tenant boundary | Invite intended for one org accepted to establish access elsewhere, or reused after consumption | Unconfirmed **[UNRESOLVED]** | See invitation-hardening finding above | Cross-tenant unauthorized access | Tenant-bound, single-use, email-bound invitations | P0 | Attempt reuse of a consumed invite against a different tenant/email |
| Leaked environment variables / secrets in source control | All tenants | Secrets exposed via repo history, logs, or misconfigured deployment | Environment-variable validation **[CLAIMED]** | Validation ≠ leak prevention; git-history and log-exposure unconfirmed | Full platform compromise | Confirm no secrets in git history; confirm structured logs exclude secret-bearing env values | P0 | Repo history scan (non-intrusive, static); log-sample review |
| Deployment preview environment exposed publicly | All tenants | Preview/staging deployment indexed or accessible without auth | Unconfirmed | Common Next.js/Vercel-style misconfiguration | Full data exposure via lower-security environment | Confirm preview environments require auth or are not publicly routable | P0 | Direct check of deployment configuration (non-intrusive) |
| Rate limiting fails across instances | Login/reset/verify endpoints | Horizontal scaling causes per-instance counters to under-count attempts | Process-local throttling **[VERIFIED gap]** | Directly named as a known gap | Brute force/spray succeeds despite "throttling" existing | Shared-store (Postgres or confirmed cache) throttling | P0 | Multi-instance or restart-persistence test |
| Email delivery failure during reset/verification | Account recovery | Email provider outage or misconfiguration silently drops reset/verify emails | Unaddressed | No described fallback | Users unable to recover accounts; support burden | Alertable delivery-failure monitoring (internal only, not user-facing detail); admin-assisted fallback path | P1 | Simulate provider failure in staging, confirm internal alert fires |
| Clock skew affecting token expiry | Reset/verification tokens | Server/client clock drift causes premature or extended token validity | Low likelihood in managed hosting **[ASSUMPTION]** | Not addressed | Minor — mostly a reliability, not security, issue | Use server-authoritative timestamps only for expiry checks (never client-supplied) | P2 | Code-level review during EH1.6 implementation |
| Future mobile: session model baked into cookie-only assumptions | Future iOS/Android auth | EH1 hardens web session handling in a way that assumes cookies everywhere | Not yet a risk, but a design-time constraint | EH1 could couple authorization resolution directly to request cookies rather than a portable session/user context | Costly rework when mobile/API auth is added later | Keep authorization resolution logic decoupled from the transport (cookie vs. bearer token) even while only cookies are used today | P1 (design constraint, not new work) | Code-level review: confirm auth context resolution doesn't assume cookie presence deep in business logic |
| Future SSO/OIDC/SAML: invitation and role model not portable | Future enterprise auth | Current invitation/role model assumes direct credential registration, not federated identity | Not yet a risk | EH1 should not hard-code assumptions that every user has a local password | Rework required when SSO is added | Ensure user/session model can represent a user without a local password (e.g., nullable password field, auth-method flag) without redesigning now | P2 (design awareness only) | Confirm data model doesn't strictly require a password hash on every user row |

---

## 4. EH1 Scope Critique

**Keep unchanged**
- Item 2 — Email verification (core concept correct; scope clarified below under "strengthen")
- Item 3 — Secure password reset and account recovery (core concept correct; split below for reviewability)
- Item 7 — Safe structured authentication security events (correct as a category; field-safety rules must be defined before, not after, implementation)

**Strengthen**
- Item 1 (durable throttling) — must explicitly name the four endpoints it covers: login, password-reset-request, email-verification-resend, invitation-acceptance. As written it reads as login-only.
- Item 4 (session revocation) — must specify both "revoke one session" and "revoke all sessions for a user," and must specify the automatic triggers (reset, suspension, suspected compromise) rather than only a manual admin action.
- Item 5 (disabled-user invalidation) — must explicitly distinguish user-level disable (full logout) from org-membership-level removal for multi-org users (loss of that org's access only).
- Item 6 (reauthentication) — must ship with the explicit operation list from this review (Section "Sensitive-action reauthentication"), not a vague "sensitive actions" label.
- Item 8 (MFA preparation) — must specify TOTP as the target method now, and must scaffold the recovery-code data model at the same time, even though neither is enforced in EH1.

**Split into smaller increments**
- Item 3 splits into three reviewable pieces: (a) reset-token lifecycle and consumption, (b) scanner-safe delivery pattern, (c) session revocation on successful reset. See EH1.6 below.
- Items 4 and 5 depend on a session-model decision that must be made *before* either is built — treat "confirm/implement session model" as its own preceding increment (EH1.4), not bundled invisibly inside "session revocation."

**Move to EH2 or later**
- Full session inventory / device-management UI (self-service list-and-revoke-individually) — valuable, not pilot-blocking; a minimal "revoke all other sessions" action satisfies EH1.
- WebAuthn/passkey support — correct long-term direction, wrong first release; TOTP ships faster with acceptable assurance for pilot scale.
- Any cross-tenant "platform staff" authentication model — out of scope until Section 8 confirms whether such a role even exists.
- Risk-based/adaptive authentication (impossible-travel detection, device fingerprinting) — disproportionate sophistication for a 3–5 company pilot; explicitly avoid per the review's own instruction not to over-engineer.

**Missing and must add**
- Invitation hardening (unique, expiring, tenant-bound, single-use tokens) — the single most important addition; see Finding #2.
- Account-enumeration resistance as its own named workstream across login, reset, verify, and invite-acceptance responses.
- Explicit "reset revokes all sessions" and "suspension kills sessions immediately" requirements, named and tested, not assumed as a side effect of item 4/5.
- Minimal admin-abuse safeguards: reauthentication + audit + user notification for any admin action targeting another user's account, role, or sessions.
- Baseline security headers and cookie-flag hardening (SameSite/Secure/HttpOnly, clickjacking protection, no-store on authenticated pages) — currently absent from the 8-item list despite being cheap and directly responsive to threats explicitly in scope for this review.

---

## 5. Recommended EH1 Implementation Sequence

Precondition for the whole sequence: the Codex reconciliation brief (Section 10) must be answered before EH1.4 begins. EH1.1–EH1.3 do not depend on the session-model answer and can start immediately.

### EH1.1 — Cookie and Security Header Hardening
- **Purpose:** Close cheap, high-value gaps independent of the session-model decision: cookie flags (HttpOnly, Secure, SameSite), baseline CSP, clickjacking protection, no-store on authenticated pages.
- **Dependencies:** None.
- **Code areas likely affected:** Auth.js cookie configuration, Next.js middleware/response headers.
- **Persistence changes:** None.
- **Tests:** Automated header-presence checks on key routes; manual cookie-attribute inspection in-browser.
- **Security validation:** Confirm no authenticated page is servable from a shared/proxy cache; confirm cross-site cookie behavior matches SameSite setting.
- **Rollback considerations:** Low risk — config-only revert.
- **Completion gate:** Headers/cookie flags verified present on 100% of authenticated routes with no regression to existing login/session flows.

### EH1.2 — Durable Authentication Throttling
- **Purpose:** Replace process-local throttling with a durable, shared-store mechanism covering login, password-reset-request, email-verification-resend, and invitation-acceptance.
- **Dependencies:** None (independent of session-model decision). Requires Section 8 answer on available shared-store infrastructure (Postgres vs. cache).
- **Code areas likely affected:** Login Server Action, reset-request Server Action, verify-resend Server Action, invite-accept Server Action.
- **Persistence changes:** New attempt/throttle-tracking table(s) or counters in Postgres (or confirmed shared cache).
- **Tests:** Scripted repeated-attempt tests across process restart and, if applicable, multiple instances.
- **Security validation:** Confirm lockout/backoff persists across restart; confirm no legitimate-user false-positive lockouts in a normal-use test pass.
- **Rollback considerations:** Feature-flaggable; disable without code revert if false positives spike.
- **Completion gate:** Durable throttling confirmed across restart (minimum) or multiple instances (if applicable); no regression to legitimate login success rate in test pass.

### EH1.3 — Invitation Hardening
- **Purpose:** Ensure invitations are unique, expiring, tenant-bound, single-use, and (where feasible) email-bound.
- **Dependencies:** None blocking; should land early given it protects the registration front door.
- **Code areas likely affected:** Invitation-creation Server Action, invitation-acceptance flow.
- **Persistence changes:** Invitations table with hashed token, organization id, target email, expiry, `used_at`.
- **Tests:** Attempt reuse of a consumed invite; attempt use of an expired invite; attempt cross-tenant or mismatched-email use if binding is enforced.
- **Security validation:** Confirm token entropy is sufficient to resist guessing; confirm consumed/expired invites are rejected server-side.
- **Rollback considerations:** Keep any legacy invitation path behind a flag until the new model is confirmed stable, then remove it entirely.
- **Completion gate:** 100% of active invitations use the hardened model; no shared/static invitation code remains reachable.

### EH1.4 — Session Model Confirmation and Revocation Primitive
- **Purpose:** Implement the confirmed session-model decision (Section 6) — recommended: confirm or migrate to database-backed sessions; add a revocation primitive (revoke by user id, revoke by session id).
- **Dependencies:** **Blocking** — requires Codex reconciliation of current Auth.js session strategy and deployment runtime (Section 8, Q1–Q2), and founder sign-off on Section 6.
- **Code areas likely affected:** Auth.js configuration, session adapter/table, authorization-resolution path used by every Server Action.
- **Persistence changes:** Sessions table (if not already present via an existing adapter); possibly a security-stamp/epoch column on the user table as defense-in-depth.
- **Tests:** Revoke a session and confirm the next request is rejected within one request cycle; confirm unrelated sessions are unaffected.
- **Security validation:** Two-browser manual test — log in on both, revoke one, confirm only the revoked one is logged out immediately.
- **Rollback considerations:** Highest-risk migration in the sequence. Requires a staged rollout, a defined cutover window, and a tested rollback migration script. Expect forced re-login for existing users at cutover.
- **Completion gate:** Revocation demonstrably immediate and reliable; no regression in existing Server Action authorization checks.

### EH1.5 — Disabled-User and Membership Invalidation
- **Purpose:** Disabling a user immediately invalidates all of that user's sessions; removing or disabling a single organization membership invalidates access to that organization only, for users active in more than one.
- **Dependencies:** EH1.4 (requires a working revocation primitive).
- **Code areas likely affected:** User-disable Server Action, membership-removal Server Action, session/authorization resolution middleware.
- **Persistence changes:** None beyond EH1.4, unless partial (per-organization) invalidation requires additional session-context metadata.
- **Tests:** Disable a user mid-session and confirm the next request is rejected; remove one membership of a multi-org test user and confirm only that organization's access is lost.
- **Security validation:** Manual walkthrough of both the single-org and multi-org scenarios with real test accounts.
- **Rollback considerations:** Reverting leaves manual revocation (from EH1.4) intact; only the automatic triggers are lost.
- **Completion gate:** Both scenarios verified by direct test, not by code inspection alone.

### EH1.6 — Password Reset and Account Recovery
- **Purpose:** Hashed, single-use, short-expiry reset tokens; scanner-safe GET-renders/POST-consumes delivery pattern; automatic full session revocation on successful reset; generic, non-enumerating responses.
- **Dependencies:** EH1.4 (for session revocation on reset); EH1.2 (throttling must already cover the reset-request endpoint).
- **Code areas likely affected:** Reset-request Server Action, reset-confirmation Server Action/page, email-sending integration.
- **Persistence changes:** Reset-tokens table (hashed token, user id, expiry, `used_at`).
- **Tests:** Attempt token reuse; attempt an expired token; simulate an automated GET-only fetch (scanner behavior) and confirm the token is still valid afterward; confirm all sessions are revoked after a successful reset.
- **Security validation:** Full manual reset cycle including a simulated email-scanner prefetch.
- **Rollback considerations:** Feature-flaggable; fallback to admin-assisted-only reset (closer to current state) if issues surface.
- **Completion gate:** Full cycle works end-to-end with no enumeration leakage and confirmed session revocation.

### EH1.7 — Email Verification Workflow
- **Purpose:** Verification for newly invited users and for email-change events, reusing the token-lifecycle pattern from EH1.6 rather than duplicating it.
- **Dependencies:** Shares utilities with EH1.6.
- **Code areas likely affected:** Invitation-acceptance flow, email-change flow.
- **Persistence changes:** Verification-tokens table (may share schema/utility with reset tokens).
- **Tests:** Verification-link reuse and expiry tests; confirm an email-change requires reverification of the new address before it becomes authoritative for reset delivery or notifications.
- **Security validation:** Confirm verification tokens cannot be reused; confirm the old email remains authoritative until the new one is verified.
- **Rollback considerations:** Can ship as a live workflow without hard-enforcing it as a login gate initially.
- **Completion gate:** Verification flow live; email-change requires reverification before taking effect.

### EH1.8 — Sensitive-Action Reauthentication
- **Purpose:** Require fresh authentication before: owner-role transfer, disabling a user, deleting/archiving an organization, changing the authentication email, disabling MFA (once it exists), mass session revocation, changing security settings.
- **Dependencies:** EH1.4 (session-freshness tracking); benefits from EH1.6's password-verification utility.
- **Code areas likely affected:** Each listed Server Action; a shared reauthentication guard/helper.
- **Persistence changes:** Track last-authenticated-at (or last-reauthenticated-at) on the session record.
- **Tests:** Attempt each listed action with a stale (beyond-freshness-window) session and confirm a reauth challenge is enforced; confirm the action succeeds after reauth.
- **Security validation:** Attempt each action by direct Server Action invocation (not just through the UI) to confirm server-side enforcement.
- **Rollback considerations:** Guard is per-action feature-flaggable; no schema rollback required.
- **Completion gate:** All listed actions verified to enforce server-side reauthentication via direct testing, bypassing the UI.

### EH1.9 — Structured Authentication Security Events and Minimal Alerting
- **Purpose:** Implement the event taxonomy (Section on security events) across operational logs, immutable audit records, and user-visible history where applicable; wire minimal alerting for the highest-value events.
- **Dependencies:** Benefits from EH1.2–EH1.8 being in place, since most events originate from them.
- **Code areas likely affected:** Shared audit/event-emission utility; hooks into each relevant Server Action.
- **Persistence changes:** Extend the existing audit mechanism to cover the new event types; explicitly exclude tokens/secrets from any recorded payload.
- **Tests:** Confirm each event fires exactly once per action; confirm sensitive fields are absent from stored records.
- **Security validation:** Manual review of a sample of recorded events per type for field-safety compliance.
- **Rollback considerations:** Additive, low risk; individual event emissions can be disabled via flag if noisy.
- **Completion gate:** Full taxonomy emitting correctly with a confirmed field-safety review.

### EH1.10 — MFA Preparation (TOTP Scaffolding, No Enforcement)
- **Purpose:** Schema and enrollment scaffolding for TOTP; recovery-code data model; no login enforcement yet.
- **Dependencies:** Benefits from EH1.8 (enrollment itself should require reauth) and EH1.9 (MFA-enrolled/disabled events).
- **Code areas likely affected:** New MFA enrollment Server Actions/pages, TOTP verification utility.
- **Persistence changes:** MFA-secrets table (encrypted at rest), recovery-codes table (hashed).
- **Tests:** Enroll and verify TOTP in a test flow; confirm recovery codes are single-use and stored hashed.
- **Security validation:** Confirm the TOTP secret is never logged or re-displayed after initial enrollment; confirm recovery codes are hashed at rest.
- **Rollback considerations:** Fully feature-flaggable; no effect on the default login path for unenrolled users.
- **Completion gate:** TOTP enrollment functional in staging; no change to default login behavior.

---

## 6. Session-Architecture Recommendation

**Recommended model:** Confirm and, if not already the case, migrate to **Auth.js database-backed sessions** on the existing Postgres/Drizzle stack, with a per-user security-stamp/epoch column as defense-in-depth.

**Why:** The platform already treats Postgres as its system of record for every other authorization-relevant fact (memberships, roles, audit records). Database-backed sessions make revocation, disabled-user invalidation, and future session-inventory features a matter of a row delete or flag update — mechanisms that already exist in this stack — rather than inventing a parallel token-versioning system. Given that two of the eight EH1 items (session revocation, disabled-user invalidation) explicitly require immediate server-side invalidation, and a third (reauthentication) requires tracking session freshness, database-backed sessions are the lowest-complexity way to satisfy all three at once.

**Rejected alternatives:**
- *Stateless JWT with no server-side check* — rejected outright. It cannot support session revocation or disabled-user invalidation as EH1 requires, without adding a server-side check on every request — at which point it has given up its main advantage (avoiding a DB lookup) while keeping its main disadvantages (larger cookies, harder-to-reason-about expiry, no clean single-session revocation).
- *JWT plus a version/security-stamp check* — a legitimate fallback, but only if Codex confirms a real constraint that makes per-request database session lookups infeasible (for example, session validation running in an edge runtime without a viable database connection path). Absent that confirmed constraint, this approach is strictly more complex than database sessions for no corresponding benefit.
- *Full OAuth2 access/refresh token hybrid* — appropriate for the *future* shared backend API and mobile clients, not for the current single web client. Building it now is premature complexity; defer to the phase where a shared API and mobile clients actually exist.

**Pilot implications:** Migrating session strategy is the highest-risk item in the EH1 sequence. It should be scheduled early (EH1.4) specifically so any issues surface well before pilot onboarding, not during it. Expect to force re-login for any existing users at cutover — acceptable now, unacceptable once pilot companies are live.

**Mobile implications:** This recommendation does not block future mobile authentication. iOS and Android clients will reasonably want short-lived access tokens plus refresh tokens rather than a browser cookie — that is a separate token issuance and validation concern layered on top of the same underlying revocation-capable persistence model (the future shared backend API can issue and revoke mobile tokens using the same tables and patterns established here). The one hard constraint EH1 must respect: authorization-resolution logic (role/permission checks inside Server Actions and the future API) must not be written in a way that assumes a cookie is always present — it should resolve from an abstracted "authenticated session/user context," so a bearer-token-based mobile path can plug into the same resolution logic later without rework.

**Migration risks:** Requires confirming Auth.js Drizzle adapter compatibility for database sessions if not already configured this way; requires confirming the runtime (Node vs. Edge) at every point session validation occurs, since database session lookups generally require a Node-compatible database connection path; requires a defined cutover window and a tested rollback migration.

**Founder decision required:** Sign off on database-backed sessions as the target model *after* Codex confirms current session strategy and runtime constraints (Section 8, Q1–Q2). If Codex reveals an edge-runtime constraint that makes this impractical, the fallback (JWT + version check) must be explicitly re-approved, since it carries different tradeoffs than presented here.

---

## 7. Pilot Security Gate

Every item must pass before the first pilot user is onboarded. Any unchecked item blocks onboarding regardless of schedule pressure.

- [ ] Durable, restart/instance-persistent authentication throttling active on: login, password-reset-request, email-verification-resend, invitation-acceptance
- [ ] Invitations are unique, expiring, tenant-bound, and single-use — no shared or guessable invitation code remains reachable
- [ ] Password hashing algorithm and cost parameters explicitly reverified (not assumed) as adequate for current guidance
- [ ] Session model confirmed (JWT vs. database); revocation capability implemented and demonstrated effective within one request cycle
- [ ] Disabling a user immediately invalidates that user's active session(s), verified by test
- [ ] Removing/disabling a single organization membership invalidates access to that organization only, for multi-org users, verified by test
- [ ] Password-reset tokens are hashed at rest, single-use (atomically consumed), short-expiry, and scanner-safe (GET does not consume)
- [ ] Successful password reset revokes all existing sessions for that user
- [ ] Login, password-reset-request, email-verification-resend, and invitation-acceptance all return enumeration-resistant (generic, identical) responses regardless of account/invite existence
- [ ] Server-side (not UI-only) reauthentication enforced for: owner-role transfer, user disable, organization delete/archive, authentication-email change, MFA disable (if shipped), mass session revocation, security-settings changes
- [ ] Structured authentication security events recorded for at minimum: login success/failure, throttling triggered, reset requested/completed, verification sent/completed, sessions revoked (self- and admin-initiated), user suspended
- [ ] No raw passwords, tokens, secrets, or session identifiers appear in logs or audit records — confirmed by manual sample review
- [ ] Baseline security headers present: cookie flags (HttpOnly, Secure, SameSite), clickjacking protection, no-store on authenticated pages
- [ ] Admin-initiated suspension, disablement, or revocation actions against another user are audited, reauthenticated, and trigger a notification to the affected user
- [ ] Environment-variable and secret handling reverified specifically for the pilot deployment target (not only local/dev)
- [ ] Founder sign-off recorded on the confirmed session-model decision and its migration, with no unresolved regressions

---

## 8. Open Questions for Codex

Repository facts that must be verified before EH1 implementation proceeds. None of these should be assumed based on this review.

1. What Auth.js session strategy is currently configured — JWT or database? If database, which adapter, and does a `sessions` table already exist in the Drizzle schema?
2. Is any authentication-relevant code (middleware, session validation) currently executed on Next.js Edge Runtime, or exclusively on Node.js runtime?
3. What does "invitation-only internal registration" actually look like in code today? Is it a single shared code/environment variable, or per-invite database records? If per-invite, do current records have expiry, single-use enforcement, or email-binding?
4. What does "authentication throttling is process-local" mean concretely — an in-memory counter, a library in memory mode, something else — and which endpoints does it currently cover (login only, or also reset/verification/invite)?
5. Does any password-reset-token table or mechanism already exist, even partially built or unused?
6. Does the user model have an existing email-verification field/flag, and is it enforced anywhere today?
7. What password-hashing library and parameters (algorithm, cost factor) are actually in use?
8. Where and how is role/permission resolution performed on each Server Action — re-queried from Postgres per request, cached in the session/JWT payload, or cached elsewhere with a TTL?
9. Does the existing audit-log mechanism have a defined schema/table today, and what fields does it currently capture for "important mutations"?
10. Are any security-related HTTP headers or a Content-Security-Policy currently configured in `next.config` or middleware?
11. Is a shared cache/store (e.g., Redis) available in current or planned pilot infrastructure, or is Postgres the only shared persistence layer?
12. Does any "platform staff/support" account type or cross-tenant elevated-access role exist in the code, distinct from the six workspace roles?
13. How is "disabled user" represented in the data model — boolean flag, status enum, soft-delete — and is it checked at authentication time, authorization time, or both?
14. What email-sending provider/integration is in use or planned, and does it expose delivery-failure signals the application can act on?
15. What is the actual current configuration of the session cookie (SameSite value, Secure flag, HttpOnly flag) — as set in code today, not as assumed?

---

## 9. Founder Decisions

| Decision | Recommendation | Alternatives | Risk | Decision deadline |
|---|---|---|---|---|
| Session model: JWT vs. database-backed | Database-backed sessions | JWT + version/security-stamp check (only if edge-runtime constraint confirmed) | Migration effort, forced re-login at cutover | Before EH1.4 starts |
| Invitation model | Unique, expiring, tenant-bound, single-use tokens | Keep a shared code with heavy monitoring (not recommended) | Registration-gate compromise if deferred | Before EH1.3 starts |
| Email verification as login gate vs. reset-safety prerequisite | Soft gate: required before enabling reset, not a hard block on invited-user login | Hard gate on all logins | Pilot onboarding friction if hard-gated | Before EH1.7 starts |
| MFA mandatory scope at pilot launch | Optional at launch; mandatory for Owner/Administrator shortly after MFA ships, within the pilot window | Mandatory for all users from day one | Onboarding friction vs. residual admin-compromise risk | Before EH1.10 reaches production |
| MFA method | TOTP first; WebAuthn/passkeys as fast-follow | WebAuthn/passkeys first | WebAuthn-first likely delays MFA availability given team size and timeline | Before EH1.10 starts |
| Reauthentication freshness window | 15 minutes | 5 minutes (stricter) or 30 minutes (looser) | Too short frustrates admins performing multiple actions; too long weakens protection | Before EH1.8 starts |
| Self-service session-revocation UI scope for EH1 | Minimal "revoke all other sessions" action only | Full session inventory/device-management UI now | Scope creep delaying EH1 completion | Before EH1 scope is frozen |
| Audit/security-record retention during pilot | Founder-defined explicit period (e.g., 12 months) rather than left undefined | Indefinite retention | Undefined retention creates ambiguity for later compliance conversations | Before EH1.9 starts |

---

## 10. Revised Codex Brief

The following is a self-contained brief for handoff to Codex. It requests verification only — no implementation.

```
BRIEF: Repository Verification for NEFE Business Platform EH1 (Authentication and
Session Hardening)

Context: A security review (attached/preceding this brief) was conducted without
repository access, based solely on architecture-document claims and known/suspected
gaps as described by the engineering team. That review makes a number of
recommendations that depend on specific repository facts which are currently
UNCONFIRMED. Your task is to verify or refute each claim below against the actual
codebase, and flag any disagreement explicitly. Do not implement any EH1 changes.
Do not redesign anything. This is a fact-finding pass only.

For each item below, report: (a) what the repository actually does, with file/
function references, (b) whether this confirms, partially confirms, or contradicts
the reviewer's assumption, and (c) any additional relevant behavior the reviewer did
not anticipate.

1. Session strategy: Is Auth.js configured for JWT sessions or database sessions?
   If database, which adapter, and does a `sessions` table exist in the Drizzle
   schema today? Quote the relevant Auth.js configuration.

2. Runtime: Is any authentication-relevant code (session validation, middleware)
   executed on Next.js Edge Runtime, or exclusively on Node.js runtime? Identify
   the relevant middleware/config.

3. Invitation mechanism: Is registration currently gated by a single shared code
   (e.g., an environment variable) or by per-invitation database records? If
   per-invitation, do records currently have: unique tokens, expiry, single-use
   enforcement, email-binding, tenant-binding? Quote the relevant schema and
   Server Action(s).

4. Current throttling: What implements "process-local" authentication throttling
   today (library, in-memory structure, etc.)? Which specific endpoints does it
   currently protect — login only, or also password-reset-request, email-
   verification-resend, invitation-acceptance?

5. Password-reset mechanism: Does any reset-token table, Server Action, or email-
   sending logic already exist, even partially built or currently unused? If so,
   describe token generation, storage (hashed or plaintext), expiry, and
   consumption logic exactly as implemented.

6. Email verification: Does the user model have an email-verification field/flag?
   Is it checked/enforced anywhere in the current codebase (login, reset, or
   elsewhere)?

7. Password hashing: What library and parameters (algorithm, cost/work factor)
   are used for password hashing? Quote the relevant code.

8. Role/permission resolution: For a representative Server Action, trace exactly
   how the user's role and permissions are resolved — is it queried fresh from
   Postgres on every invocation, cached in the JWT/session payload, or cached
   elsewhere (in-memory, edge cache) with a TTL? This is the single most
   important item in this brief — the reviewer's recommendations on stale-
   session-after-role-change depend entirely on the answer.

9. Audit logging: What schema/table currently backs "audit records for important
   mutations"? List the fields currently captured and the list of mutation types
   currently audited.

10. Security headers: Are any security headers or a Content-Security-Policy
    configured today in `next.config`, middleware, or elsewhere? Quote the
    configuration if present.

11. Shared infrastructure: Is Redis or another shared cache available in current
    or planned pilot infrastructure, or is Postgres the only shared persistence
    layer available to the application?

12. Cross-tenant roles: Does any "platform staff" or cross-tenant elevated-access
    account type exist in the code, distinct from the six documented workspace
    roles (Owner, Administrator, Manager, Analyst, Contributor, Viewer)?

13. Disabled-user representation: How is a disabled/suspended user represented in
    the data model (boolean flag, status enum, soft-delete, other)? Is this state
    checked at authentication time, authorization time, both, or neither
    currently?

14. Email delivery: What email-sending provider or integration is currently used
    or configured? Does it expose delivery-failure signals (webhooks, error
    responses) that application code currently handles or could handle?

15. Cookie configuration: What are the actual current values for the session
    cookie's SameSite, Secure, and HttpOnly attributes, as configured in code?

Deliverable: A point-by-point response to all 15 items, each marked CONFIRMED,
PARTIALLY CONFIRMED, or CONTRADICTED relative to the reviewer's assumptions, with
file/function references. Explicitly list any repository behavior relevant to
authentication or session security that this brief did not think to ask about.

Do not proceed to EH1 implementation planning until this brief is answered and
reconciled with the security review's recommendations.
```

---

*End of review. This document intentionally stops short of a final EH1 coding prompt — that should be produced only after the Codex brief above is answered and any disagreements between this review's assumptions and actual repository behavior are resolved.*
