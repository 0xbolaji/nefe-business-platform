# Security Architecture

## Trust boundaries

The browser, authentication boundary, workspace context, Server Actions/routes, repository layer, PostgreSQL, deployment control plane and external providers are distinct trust zones. Current controls are strongest between browser and application; database defense in depth and deployment operations are not verified.

## Threat model

| Asset | Attacker/path | Existing control and evidence | Weakness | Recommendation | Priority | Validation |
|---|---|---|---|---|---|---|
| Tenant records | Authenticated user submits another tenant ID | Server-owned context and organization predicates in [`workspace-context.ts`](../../app/lib/auth/workspace-context.ts) and repositories | Application-only enforcement; broad audit not proven | EH2 adversarial tests; evaluate RLS | Critical | DB integration tests with two tenants |
| Privileged actions | Viewer invokes Server Action directly | `requirePermission` in action modules | Coverage must be continuously audited | Generate permission/action matrix | Critical | Test each role/action pair |
| Account | Credential stuffing/brute force | bcrypt and generic failures in [`auth.ts`](../../auth.ts) | No durable login throttling or suspicious-login controls | Durable rate limits and alerting | Critical | Controlled auth load/abuse tests |
| Session | Stolen JWT cookie | Secure, HttpOnly, SameSite=Lax cookie; 8-hour lifetime | No revocation/device inventory/rotation | Session revocation and reauthentication | Critical | Disable user and prove next-request denial |
| Registration | Invitation leakage/abuse | Server-only code, timing-safe comparison, 64 KB action limit | Process-local limiter; shared static code | Durable limiter, rotation runbook, later managed invites | High | Multi-instance retry test |
| Passwords | Database disclosure | bcrypt cost 12 | No reset/recovery policy | Tokenized expiring reset, breach response | High | Token replay/expiry tests |
| Actions | CSRF/cross-origin invocation | Auth.js cookies and Next Server Actions framework controls | Explicit origin policy not documented | Verify allowed origins and CSRF behavior | High | Cross-origin test |
| Inputs | Injection/malformed payload | Zod and parameterized Drizzle queries | Coverage varies by action | Boundary schema inventory and fuzz tests | High | Malformed payload suite |
| Secrets | Source/log exposure | `.env.example` contains placeholders; safe log allowlist | No secret manager/rotation evidence | Managed secrets, scanning, rotation | Critical | Gitleaks plus rotation drill |
| Audit evidence | Tampering/deletion | Append-only behavior by convention; restricted FK deletion | DB actor may alter rows; retention undefined | Restricted DB roles, retention/export controls | High | Privilege test and integrity review |
| Exports | Cross-tenant data exfiltration | Tenant context and `analytics.view`; private/no-store response | CSV formula injection not addressed | Escape dangerous spreadsheet prefixes | High | Malicious cell export test |
| Notifications/comments | Private content in logs | Logger excludes content; audit sanitizer blocks secret-like keys | Review comments can enter structured decision metadata | Explicit privacy classification and field allowlists | High | Log snapshot tests |
| Availability | Query amplification | Connection maximum 10 | Full workspace fan-out and no rate controls | Query budgets, pagination, load test | High | k6 pilot profile |
| Supply chain | Compromised package | Lockfile assumed through npm workflow | No CI dependency scan evidence | Dependabot/OSV and reviewed updates | High | CI gate |
| Deployment | Unsafe migration/release | Drizzle migration ledger | No verified CI/staging/rollback process | EH7 release gates and expand/contract rules | Critical | Staging rehearsal |
| Data loss | Operator/provider failure | Managed PostgreSQL inferred only | Backup/restore unverified | Declare and test RPO/RTO | Critical | Restore drill |

## Security posture

Security maturity is **foundational, not enterprise**. Authorization and input validation are credible application controls. Identity lifecycle, abuse protection, database defense, operational security and evidence collection require hardening before pilot onboarding.

No compliance certification or legal conformance is claimed by this blueprint.

