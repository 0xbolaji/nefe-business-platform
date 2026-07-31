# Security and Load-Testing Toolchain

| Tool | Problem | When/environment | Output | False-positive handling | Owner | Pre-pilot? |
|---|---|---|---|---|---|---|
| npm audit + Dependabot/OSV | Vulnerable dependencies | PR/weekly CI | Advisories and upgrade PRs | Triage reachability/severity; documented exceptions | Engineering | Yes |
| Semgrep or CodeQL | Static security defects | PR CI | Findings with locations | Baseline then block high-confidence criticals | Engineering/security reviewer | Yes |
| Gitleaks | Committed secrets | Pre-commit/CI/history scan | Secret candidates | Allowlist only documented test values | Engineering | Yes |
| OWASP ZAP | Web auth/tenant flaws | Staging only, test tenants/roles | Reproducible findings | Manual verification; never intrusive production scan | Security tester | Yes |
| PostgreSQL EXPLAIN | Query/index cost | Staging with representative data | Plan, buffers, timing | Compare warm/cold; avoid production `ANALYZE` risk | Backend | Yes |
| k6 | Concurrency/latency | Staging pilot profile | p50/p95/errors/throughput | Repeat runs; exclude setup noise | Backend/ops | Yes |
| Lighthouse | Web performance/accessibility | Preview/staging | Route reports | Treat as signal plus manual review | Frontend | Yes |
| Bundle analyzer | Client payload | CI/release review | Bundle composition | Budget by route; justified exceptions | Frontend | Recommended |
| Synthetic checks | Availability and key flows | Staging/production safe account | Success/latency | Multi-sample alerting | Operations | Yes |
| Restore drill | Data recovery | Isolated environment | Achieved RPO/RTO | Failure is action item, not waived | Operations | Yes |

## Rules

- Obtain written scope for active security testing.
- Use synthetic tenants and non-sensitive data.
- Never run destructive or high-volume scans against production.
- Retain reports with access control and remediation owner.
- Re-test fixes and close findings with evidence.
- Add tools incrementally; EH0 installs none.

