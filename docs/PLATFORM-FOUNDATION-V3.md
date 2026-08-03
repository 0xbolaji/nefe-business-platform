# Platform Foundation RC1

## Selected stack

- Next.js 16 App Router and React 19
- Auth.js v5 with secure JWT sessions and a PostgreSQL-ready identity schema
- PostgreSQL with Drizzle ORM and generated SQL migrations
- Zod for untrusted mutation and environment input
- bcrypt for development credential password hashes
- Vitest for focused security and deterministic-domain tests

The development credential provider is enabled only when `NODE_ENV` is not `production` and `NEFE_DEMO_AUTH_ENABLED=true`. Production requires `DATABASE_URL` and a minimum 32-character `AUTH_SECRET`; production startup rejects the demo bypass.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set a PostgreSQL URL, authentication secret, and a development demo password of at least 12 characters.
3. Start PostgreSQL using any local installation or managed development database. Docker is not required.
4. Run `npm run db:generate` after schema changes.
5. Run `npm run db:migrate` to apply migrations.
6. Run `npm run db:seed` to create the idempotent RAK demonstration workspace.
7. Run `npm run dev`.
8. Validate with `npm run lint`, `npm run type-check`, `npm test`, and `npm run build`.

To reset local data, drop and recreate only the development database identified by `DATABASE_URL`, then rerun migration and seed commands. No automated reset command is provided because an unresolved or production database target must never be destructively modified.

## Data boundaries

All workspace records are organization-owned. Server-side context resolves the authenticated user, validates active membership, and accepts an active-organization cookie only when that user has a matching active membership. Repositories and mutations receive the resolved organization rather than trusting form or URL organization identifiers.

The existing frontend domain types remain the stable inputs for commercial intelligence and readiness calculations. Drizzle records stay behind the authenticated repository and mapping boundary. Production workspace routes do not import fixture view models; fixtures are retained only for development seed generation and deterministic automated tests.

## Runtime architecture

- The workspace layout resolves the authenticated user and active organization before loading workspace data.
- `getWorkspaceData` performs request-cached, organization-scoped reads and maps database records into stable domain models.
- Client providers receive serialized tenant data for optimistic interactions. Server Actions independently resolve authentication, membership, permissions, and organization ownership before every write.
- Commercial and pilot intelligence are deterministic, side-effect-free calculations. Persisted data is supplied as input; the scoring engines do not query the database or make autonomous decisions.
- Significant administrative and execution mutations append organization-scoped audit records.

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string used by Drizzle and Auth.js. Required in production.
- `AUTH_SECRET`: secret of at least 32 characters. Required in production and stored in the deployment secret manager.
- `AUTH_URL`: canonical application URL, including HTTPS in production.
- `NEFE_DEMO_AUTH_ENABLED`: development credential switch. It must be `false` in production.
- `NEFE_DEMO_EMAIL` and `NEFE_DEMO_PASSWORD`: development seed/login values. The password must contain at least 12 characters.
- `NEFE_APP_URL`: canonical origin used to build invitation, verification and password-reset links.
- `RESEND_API_KEY` and `NEFE_EMAIL_FROM`: server-only transactional-email configuration.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: optional Google OAuth credentials.

Do not commit `.env.local` or production values. Start from `.env.example` and inject production secrets through the hosting environment.

## Migration and seed workflow

1. Change `db/schema.ts` only when persistence correctness requires it.
2. Run `npm run db:generate` and review the generated SQL before committing it.
3. Apply migrations in a non-production environment with `npm run db:migrate`.
4. Run the validation suite and exercise authenticated tenant reads and mutations.
5. Apply the reviewed migration as a separate deployment step before starting the new application version.

`npm run db:seed` is development-only and creates the demonstration workspace in a freshly migrated development database. It imports fixture data solely as seed input and refuses to run when `NODE_ENV=production`. Do not use the seed command as a production migration or data-reconciliation process.

## Deployment controls

Deploy behind TLS and a proxy or platform boundary that provides authentication rate limiting, request-size limits, malformed-request protection, and abuse monitoring. Rotate `AUTH_SECRET` through the deployment secret manager. OAuth callback URLs must be allowlisted with the provider. Database credentials require least privilege, encrypted transport, point-in-time recovery or tested backups, and migration access separated from runtime access where practical.

Before promotion, run `npm run lint`, `npm run type-check`, `npm run test`, `npm run build`, and `git diff --check`. Confirm migrations are current, production demo authentication is disabled, Auth.js callback URLs match the public origin, and the runtime database role cannot alter schemas. Monitor authentication failures, server-action errors, database saturation, and audit-write failures after deployment.

## Internal registration

`/sign-up` accepts only a managed organization invitation. Owners and Administrators create tenant-scoped, expiring invitations in Settings; only a token hash is persisted. Registration consumes the invitation once, creates an `INVITED` membership and sends email verification. The membership becomes active only after verification.

Password recovery uses generic responses and hashed, expiring, single-use tokens. PostgreSQL-backed throttles coordinate abuse protection across application instances. JWT transport remains in place, augmented by a revocable server-side session registry and the existing security-version invalidation control. Operational setup and rollout details are in [`docs/security/enterprise-onboarding.md`](security/enterprise-onboarding.md).
