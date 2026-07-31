# Claude Expansion and Review Packets

## Reconciliation process

```text
Codex repository-grounded baseline
→ Claude expansion or adversarial review
→ compare disagreements
→ verify against repository
→ founder decision
→ ADR
→ focused implementation prompt
```

Codex remains authoritative for repository facts. Claude is used for expansion, critique, alternative architecture, adversarial thinking and risk identification. No external recommendation is accepted without repository verification.

## Shared instructions for every packet

Use only the verified facts and explicitly labeled assumptions below. Do not invent repository behavior, deployed controls, compliance status, capacity or vendor configuration. Separate: confirmed issue, plausible risk, question and recommendation. Label each recommendation with urgency (`before pilot`, `during pilot`, `later`) and confidence (`high`, `medium`, `low`). Cite the supplied repository paths when relying on a fact.

## Packet 1 — Threat-model adversarial review

**Context:** NEFE is a multi-tenant commercial workspace handling businesses, opportunities, pilots, collaboration and executive decisions.

**Verified facts:** Next.js/Auth.js/PostgreSQL/Drizzle are declared in `package.json`; JWT credentials auth and secure cookie are in `auth.ts`; server workspace context is in `app/lib/auth/workspace-context.ts`; authorization is in `app/lib/auth/permissions.ts`; registration throttling is an in-memory Map in `app/sign-up/actions.ts`; safe structured logging is minimal.

**Assumptions:** Internet-accessible production and commercially sensitive data. Deployment controls are unknown.

**Unresolved questions:** Hosting/region, WAF/rate limit, backup, secret manager, operator access and incident process.

**Review request:** Attack the trust boundaries for unauthenticated, authenticated, malicious tenant member, compromised operator and supply-chain actors. Prioritize practical exploit chains and missing evidence.

**Required output:** threat table (asset, actor, precondition, path, impact, current control, evidence gap, mitigation, test, urgency, confidence); top five pre-pilot blockers; rejected speculative threats.

## Packet 2 — Authorization and tenant-isolation critique

**Context:** Session identifies user; active membership supplies role and organization; repositories apply organization predicates.

**Verified facts:** `getWorkspaceContext` reads active memberships and an authorized active-workspace cookie choice; `rolePermissions` centralizes RBAC; actions use `requirePermission`; tenant IDs exist throughout `db/schema.ts`; no RLS migrations were found.

**Assumptions:** Users may belong to multiple organizations and can tamper with all client input.

**Unresolved questions:** Complete query coverage and deployment DB privileges.

**Review request:** Find confused-deputy, IDOR, relationship-validation, stale-role, export/search and multi-organization-switching risks. Critique app-only enforcement and propose a staged RLS evaluation.

**Required output:** invariant matrix, likely bypass attempts, test cases for two tenants/six roles, RLS benefits/costs, recommended decision and urgency/confidence.

## Packet 3 — Database scalability critique

**Context:** PostgreSQL is authoritative; the shared workspace layout loads a broad tenant snapshot.

**Verified facts:** `db/client.ts` uses postgres-js max 10; `getWorkspaceData` in `app/lib/data/workspace-repository.ts` executes a large Promise.all query fan-out and in-memory joins; schema has common tenant indexes; pagination is uneven.

**Assumptions:** Pilot 3–10 organizations/250 users/10k businesses; early target 100/5k/250k. These are untested planning bands.

**Unresolved questions:** Production data distribution, query plans, latency and instance concurrency.

**Review request:** Challenge the scale plan without recommending premature distribution. Identify measurement design, highest-risk queries, pagination/index strategy and connection-budget tests.

**Required output:** bottleneck hypotheses ranked by evidence, measurement plan, query remediation order, load profile, thresholds that would justify cache/search/replicas, urgency/confidence.

## Packet 4 — Mobile backend architecture critique

**Context:** Web uses Server Components/Actions; native iOS/Android is future.

**Verified facts:** Only Auth.js and analytics export HTTP routes are evident; there is no general versioned API; web auth uses a JWT cookie; domain repositories exist server-side.

**Assumptions:** Mobile may serve executives and operators, but usage/offline requirements are unknown.

**Unresolved questions:** device management, offline, push, biometrics, framework and app-store ownership.

**Review request:** Critique REST + existing Actions as the recommended hybrid. Define minimum mobile auth, versioning, idempotency, pagination, offline and telemetry contracts. Do not choose a framework without evidence.

**Required output:** readiness gaps, API vertical slice, auth sequence, compatibility policy, pilot research questions, framework decision criteria, urgency/confidence.

## Packet 5 — Pilot operating-model critique

**Context:** Proposed controlled pilot is 3–5 companies with a bounded operating model.

**Verified facts:** Product workflows, RBAC, audit, collaboration and decisions exist; CI, staging, restore drills, SLOs and support runbooks are not evidenced in the repository.

**Assumptions:** Small team and founder involvement.

**Unresolved questions:** Support hours, contracts, data classification, pilot dates and customer administrators.

**Review request:** Adversarially test the pilot gate for customer trust, support load, onboarding, access removal, incident response, data correction and exit.

**Required output:** operating model, RACI, acceptance gates, daily/weekly cadence, incident tabletop, stop conditions, learnings required before scale/mobile, urgency/confidence.

## Packet 6 — Disaster-recovery critique

**Context:** PostgreSQL persistence is central; repository has no verified backup/restore controls.

**Verified facts:** Drizzle migrations 0000–0004 exist; no restore scripts/drill evidence or infrastructure manifests were found.

**Assumptions:** Managed PostgreSQL may support PITR, but configuration is unknown.

**Unresolved questions:** provider retention, database size, regions, replica/branch options and contractual objectives.

**Review request:** Challenge proposed pilot RPO ≤24h (target 1h) and RTO 8h. Cover accidental deletion, bad migration, provider outage, credential compromise and application corruption.

**Required output:** scenario matrix, realistic objectives, backup/control checklist, restore validation, drill script, evidence register, urgency/confidence.

## Packet 7 — Commercial Graph data-model critique

**Context:** NEFE wants a Commercial Graph after relational foundations mature.

**Verified facts:** `db/schema.ts` models businesses, business relationships, participants, journey stages, pilots and recommendations; campaign ownership and some cross-workflow relationships are absent/partial; no graph database exists.

**Assumptions:** Graph value depends on provenance, time and trusted entity resolution.

**Unresolved questions:** cross-organization sharing, legal basis, source systems and principal graph queries.

**Review request:** Critique the relational-first strategy. Define the minimum canonical identity, edge, provenance, temporal and quality model and measurable triggers for specialized graph storage.

**Required output:** conceptual model, invariants, sample query workload, quality metrics, migration path, privacy risks, “do not build yet” list, urgency/confidence.

## Packet 8 — AI governance critique

**Context:** Current intelligence is deterministic; future AI must not make autonomous commercial decisions.

**Verified facts:** deterministic functions/tests exist in `app/(workspace)/_lib/*intelligence.ts` and `tests/deterministic-intelligence.test.ts`; no production model integration or vector store was found.

**Assumptions:** Future use may include summaries, retrieval and recommendations over sensitive tenant data.

**Unresolved questions:** provider, residency, training policy, evaluation ownership and acceptable error rate.

**Review request:** Build an adversarial governance framework for privacy, prompt injection, retrieval authorization, hallucination, bias, evaluation, human review, traceability, fallback and kill switches.

**Required output:** use-case risk tiers, prohibited uses, control matrix, evaluation plan, incident/rollback plan, minimum data prerequisites, urgency/confidence.

