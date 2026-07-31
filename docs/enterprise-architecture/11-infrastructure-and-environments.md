# Infrastructure and Environments

## Verified repository state

The application validates database/auth settings in [`app/lib/server-env.ts`](../../app/lib/server-env.ts), documents variables in [`.env.example`](../../.env.example), and uses Drizzle migrations. No infrastructure-as-code, staging configuration, hosting manifest, domain/TLS configuration or provider-specific deployment policy was found.

Production hosting, runtime region and Neon branch topology are therefore unverified.

## Required environments

| Environment | Data | Purpose |
|---|---|---|
| Local | Developer-owned synthetic data | Development |
| Test | Ephemeral isolated DB | Automated tests |
| Preview | Synthetic/sanitized | Review deploys |
| Staging | Production-like, never production secrets | Migrations, load and acceptance |
| Production | Customer data | Controlled service |

## Controls

- Separate database credentials and secrets per environment.
- No development fixtures or demo auth in production.
- Least-privilege runtime and migration database roles.
- Managed secret storage with access logs and rotation.
- Migration ledger check before deploy.
- Preview deployments cannot reach production databases.
- Domain, TLS, DNS and certificate renewal ownership documented.
- Production access requires named accounts, MFA and time-bounded elevation.
- Environment validation fails closed without printing secrets.

## Founder decisions

- Hosting/runtime provider and region.
- Data residency constraints.
- Staging cost and topology.
- Secret-management authority.
- Database role separation.

