# Platform Foundation v3.0

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

The existing frontend domain types remain the stable inputs for commercial intelligence and readiness calculations. Drizzle records stay behind repositories and mapping boundaries. Existing fixtures remain available as UI compatibility data while route-by-route persistence migration proceeds.

## Deployment controls

Deploy behind TLS and a reverse proxy or platform boundary that provides authentication rate limiting, request-size limits, malformed-request protection, and abuse monitoring. Rotate `AUTH_SECRET` through the deployment secret manager. OAuth callback URLs must be allowlisted with the provider. Database credentials require least privilege, encrypted transport, backups, and migration access separated from runtime access where practical.
