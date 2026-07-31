# Backup and Disaster Recovery

## Current evidence

No backup policy, point-in-time recovery configuration, restore script or restore-drill record exists in the repository. Managed PostgreSQL may provide provider backups, but EH0 does not claim that they are enabled or sufficient.

## Proposed objectives

| Tier | RPO | RTO | Notes |
|---|---:|---:|---|
| Pilot | 24 hours maximum; target 1 hour | 8 hours | Validate with provider capability and drills |
| Early commercial | 15 minutes | 4 hours | Requires tested PITR and operational coverage |
| Regional | 5 minutes | 1 hour | Requires dedicated reliability investment |

## Required pilot controls

- Confirm automated backup/PITR settings and retention.
- Encrypt backups and restrict restore authority.
- Monthly restore to an isolated environment.
- Validate schema ledger, row counts, tenant sample integrity and authentication after restore.
- Document database loss, accidental deletion, credential compromise and bad migration procedures.
- Keep an off-provider metadata/runbook copy where practical.
- Record drill date, operator, duration, RPO achieved, RTO achieved and remediation.

## Recovery sequence

```text
declare incident
→ stop unsafe writes if required
→ identify recovery point
→ restore to isolated target
→ validate migration ledger and tenant integrity
→ rotate compromised credentials where relevant
→ cut over
→ monitor
→ post-incident review
```

Rollback is not assumed to mean “down migrate.” Forward fixes or database restore are often safer after schema changes.

