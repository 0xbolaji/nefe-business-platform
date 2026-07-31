# Architecture Decision Register

| ID | Decision | Status | Recommendation | Evidence | Alternatives | Risk | Founder approval |
|---|---|---|---|---|---|---|---|
| ADR-001 | Modular monolith | Proposed | Retain through pilot/early scale | Next.js + shared repositories | Microservices | Premature distribution | Required |
| ADR-002 | Web Actions plus shared API | Proposed | Keep Actions; add versioned REST before mobile | Server Actions dominate current app | RPC, GraphQL | Rule duplication | Required |
| ADR-003 | Queue timing | Test before accepting | PostgreSQL outbox when first durable async case lands | No queue today | Managed queue | Reliability/vendor tradeoff | Required |
| ADR-004 | Cache timing | Postponed | Optimize reads before distributed cache | Broad workspace hydration | Redis | Stale authorization | No |
| ADR-005 | External search | Postponed | PostgreSQL search first | Current persisted in-app search | OpenSearch | Cost/complexity | No |
| ADR-006 | Database RLS | Requires founder decision | Prototype after EH2 tests | Application predicates only | App-only isolation | Defense versus complexity | Required |
| ADR-007 | Mobile framework | Postponed | Decide after pilot research/API | No native client | Native, RN, Flutter | Wrong product investment | Required |
| ADR-008 | Graph database | Rejected for current phase | Relational graph first | Existing relational relationships | Neo4j/other | Premature specialization | Required to reverse |
| ADR-009 | Observability vendor | Requires founder decision | Select after telemetry requirements | Logger only | Provider-native/open standard/SaaS | Lock-in/cost | Required |
| ADR-010 | Staging environment | Proposed | Required before pilot | No repository evidence | Preview-only | Unsafe releases | Required |
| ADR-011 | Pilot scale | Proposed | First 3–5 companies, bounded support | Product objective | Broader launch | Support/security overload | Required |
| ADR-012 | MFA timing | Proposed | Owner/Admin before pilot expansion | MFA missing | Later | Account takeover | Required |
| ADR-013 | SSO timing | Postponed | Evidence-backed enterprise demand | Optional Google only | OIDC/SAML now | Complexity | Required |
| ADR-014 | Backup objectives | Requires founder decision | Pilot RPO ≤24h target 1h; RTO 8h | No verified backup evidence | Stricter/looser | Loss/cost | Required |
| ADR-015 | Session architecture | Requires founder decision | DB sessions or JWT session version/revocation | JWT 8h now | Short JWT only | Revocation gap | Required |
| ADR-016 | Hosting/data region | Requires founder decision | Choose against residency and latency | Not verified in repo | Provider options | Compliance/latency/lock-in | Required |

Accepted decisions should become individual ADRs with context, decision, consequences, owner, date and review trigger.

