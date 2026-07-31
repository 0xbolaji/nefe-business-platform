# Authentication Regression Matrix

| Scenario | Expected result | Automated test | Manual validation |
|---|---|---|---|
| Valid active user login | Allowed with current security version | `tests/authentication-session-security.test.ts`; existing auth flow | Sign in and open workspace |
| Wrong password | Generic denial | Existing credentials behavior asserted in source; `tests/internal-registration.test.ts` covers generic registration | Optional |
| Disabled user login | Generic denial | `tests/authentication-session-security.test.ts` verifies central invalid state and login wiring | Required with non-production account |
| User disabled after login | Next authoritative request rejected | `tests/authentication-session-security.test.ts` | Issue session, disable in test DB, refresh protected route |
| Active user with inactive membership | Workspace access denied | `tests/authentication-session-security.test.ts` | Disable membership and request workspace |
| User removed from one organization | Removed organization unavailable | `tests/authentication-session-security.test.ts` | Remove test membership and attempt workspace switch |
| Multi-org user retains another membership | Other organization remains usable | `tests/authentication-session-security.test.ts` | Switch to remaining organization |
| Viewer invokes mutation directly | Denied server-side | `tests/security-foundation.test.ts`, `tests/workspace-experience-hardening.test.ts` | Invoke creation action as Viewer |
| Role downgraded while signed in | Next request uses current role | `tests/authentication-session-security.test.ts` | Downgrade Owner test user and refresh |
| Current session sign-out | Current browser cookie rejected/cleared | Auth.js behavior; no repository integration harness | Required |
| Rejected JWT cookie cleanup | Auth.js clears the rejected session cookie | Installed Auth.js session action behavior; production build | Inspect response cookie after a stale-version request |
| Authentication database outage | Request fails closed and logs `authentication.database_unavailable`, never authenticates from JWT alone | `tests/authentication-session-security.test.ts` | Stop isolated test database and request a protected route |
| Proxy authentication runtime | Middleware authentication executes in Node.js, where the PostgreSQL lookup is supported | `tests/authentication-session-security.test.ts`; Next.js production functions manifest | Confirm `/_middleware` is `nodejs` in deployment build output |
| All-session invalidation | All earlier security versions rejected | `tests/authentication-session-security.test.ts` | Increment test user version, retry two browser sessions |
| Unrelated user after revocation | Remains authenticated | Version comparison is per-user; `tests/authentication-session-security.test.ts` | Keep second test user active during invalidation |
| Disabled user calls Server Action | Central `auth()` returns no session; authoritative action denied | Central callback wiring asserted in `tests/authentication-session-security.test.ts` | Invoke protected action using old cookie |
| Cross-tenant global disable attempt | Denied without success audit | `tests/authentication-session-security.test.ts` policy coverage | Use a multi-org target in isolated test data |
| Administrator targets sole Owner | Denied | `tests/authentication-session-security.test.ts` | Required with isolated organization |
| Pre-cutover JWT | Rejected; sign-in required | `tests/authentication-session-security.test.ts` | Deploy migration/code to staging with existing cookie |

Database-backed end-to-end Auth.js tests are still needed in a dedicated isolated test database. Source/unit tests do not replace the required staging manual checks.
