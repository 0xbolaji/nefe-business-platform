# Risk Register

| Risk | Probability | Impact | Existing control | Mitigation | Trigger | Owner | Target phase |
|---|---:|---:|---|---|---|---|---|
| Cross-tenant access defect | 2 | 5 | Server context and predicates | EH2 two-tenant suite/RLS decision | Any failed isolation test | Backend/security | EH2 |
| Session theft cannot be revoked | 2 | 5 | 8h secure cookie plus authoritative security version and all-session invalidation | Add reauth and later session inventory if justified | Version invalidation fails or is bypassed | Identity owner | EH1.1 implemented; residual EH1 |
| Brute-force/registration abuse | 4 | 4 | Generic errors, local limiter | Durable rate limit/alerts | Distributed attempts | Identity owner | EH1 |
| Data loss/failed restore | 3 | 5 | Unverified managed controls | Backup confirmation/drills | Restore misses objective | Operations | EH7 |
| Bad migration outage | 3 | 5 | Drizzle ledger | Staging rehearsal/expand-contract | Lock/failure in staging | Backend/ops | EH3/EH7 |
| Workspace query saturation | 4 | 4 | Parallel reads/indexes | Route-specific reads/pagination | p95 or connections exceed budget | Backend | EH5 |
| Inaccurate analytics | 3 | 4 | Deterministic code/tests | Definitions, provenance, reconciliation | Customer disputes metric | Product/data | EH3/EH9 |
| Availability without alerts | 4 | 4 | Error boundary/logging | SLOs, metrics, synthetic checks | User reports before alert | Operations | EH7 |
| Mobile architecture chosen early | 3 | 3 | No mobile build yet | Pilot research/API first | Framework work before evidence | Founder/product | EH4/EH9 |
| Integration data leakage | 2 | 5 | No platform integrations yet | Scoped service identities/contracts | First connector proposal | Security/product | EH4+ |
| Pilot adoption/support burden | 4 | 4 | Existing product workflow | Bounded cohort, owners, support metrics | Support exceeds capacity | Product/founder | EH9 |
| Premature microservices/cache/search | 3 | 3 | Modular monolith | Architecture gates/measurement | Tool proposed without SLI | Architecture owner | Continuous |
| Founder dependency | 4 | 4 | Decision register | Named deputies/runbooks/decision SLAs | Release waits on one person | Founder | EH9 |
| Vendor lock-in | 3 | 3 | Portable PostgreSQL/app code | Contract boundaries/export/exit plan | Proprietary core dependency | Architecture owner | Decision time |
| Compliance assumptions | 3 | 5 | No compliance claims in EH0 | Legal/privacy review and evidence | Customer asks for certification | Founder/legal | Pre-contract |
| Secret exposure | 2 | 5 | env placeholders/safe logger | Secret scan/managed rotation | Scan or access anomaly | Operations | EH1/EH8 |
| Private content in telemetry/AI | 3 | 5 | safe logger fields | Classification/allowlists/evaluation | New telemetry/model feature | Security/data | EH7/EH10 |
| Per-request session validation depends on PostgreSQL | 2 | 4 | Fail-closed security-version check | Monitor auth query latency/availability; retain bounded DB connections | Authentication error/latency budget exceeded | Identity/operations | EH1.1/EH5 |

Probability and impact use a 1–5 qualitative scale and require owner review before pilot.
