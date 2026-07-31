# CI/CD and Release Management

## Current state

Package scripts provide lint, type-check, Vitest, production build, migration generation/application and seed commands in [`package.json`](../../package.json). No repository CI workflow was found.

## Required pipeline

1. Install from lockfile.
2. Secret scan.
3. Lint and type-check.
4. Unit and policy tests.
5. Isolated PostgreSQL migration plus repository integration tests.
6. Production fixture-import and client tenant/role audits.
7. Production build.
8. Preview deploy and smoke tests.
9. Staging migration rehearsal and acceptance.
10. Manual production approval.
11. Migration ledger verification.
12. Deploy, smoke, monitor and record release.

## Release policy

- Protected main branch and reviewed pull requests.
- Small additive migrations using expand/contract.
- Release notes include schema, environment and rollback impact.
- Feature flags only with owner, expiry and safe default.
- Rollback compatibility is tested before release.
- Production seed is prohibited; [`db/seed.ts`](../../db/seed.ts) already fails in production.
- Emergency changes are reviewed retrospectively and receive tests.

## Migration deployment

Run the existing `npm run db:migrate` against the intended environment only after confirming the connection identity, backup status and Drizzle ledger. Do not generate migrations during deployment.

