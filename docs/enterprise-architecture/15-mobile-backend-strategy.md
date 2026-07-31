# Mobile Backend Strategy

## Current readiness

The product has reusable domain concepts and server-side repositories, but its external contract is coupled to Next.js Server Actions and large web view models. Mobile-backend readiness is therefore **early**.

## Experiences to validate

- Executive: approvals, risks, high-value opportunities, pilot status and concise alerts.
- Operator: comments, assignments, milestones, journey updates and record lookup.

Pilot research must determine which experience merits native delivery, offline behavior, camera/location needs, notification urgency and device-management expectations.

## Framework options

| Option | Advantage | Constraint |
|---|---|---|
| Native Swift/Kotlin | Best platform integration | Two teams/codebases |
| React Native | TypeScript skills and shared contracts | Native dependency/release discipline |
| Flutter | Consistent UI and performance | New language/toolchain |

Framework choice is postponed pending pilot evidence and team capability.

## Backend prerequisites

- Versioned API and OpenAPI contract.
- OAuth/OIDC authorization code with PKCE.
- Short-lived access and rotating refresh tokens.
- Device/session listing and revocation.
- Secure keychain/keystore rules.
- Cursor pagination and network-efficient DTOs.
- Idempotent mutations and conflict behavior.
- Mobile telemetry and minimum-supported-version policy.
- Push-notification privacy design, when push is introduced.
- Offline data classification and remote-wipe expectations.

The web JWT cookie is not a mobile token strategy.

