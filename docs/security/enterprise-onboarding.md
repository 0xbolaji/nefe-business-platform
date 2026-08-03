# Enterprise Onboarding Operations

## Configuration

Apply migration `0007_conscious_arclight.sql`, then configure these server-only environment variables:

- `AUTH_SECRET`: also provides the HMAC key for stored token hashes.
- `NEFE_APP_URL`: canonical origin used in verification, invitation and reset links.
- `RESEND_API_KEY`: transactional-email API credential.
- `NEFE_EMAIL_FROM`: verified sender address.

The former shared `NEFE_INTERNAL_SIGNUP_CODE` and fixed organization slug are no longer used.

## Invitation and registration flow

An Owner or Administrator creates an invitation from Settings. The server derives the active organization, creates a 256-bit token, stores only its hash, and emails the link. The recipient registers with the invited email. Registration atomically creates the user, an `INVITED` membership, consumes the invitation and creates an email-verification token. Verification activates the membership.

Administrators can revoke pending invitations. Expired invitations are marked `EXPIRED` when invitation history is read. Invitation history is retained.

## Recovery and sessions

Password-reset requests always return the same result. Valid requests receive a one-hour link. Completing a reset replaces the bcrypt hash, increments `users.security_version`, revokes registered sessions and writes organization audit events.

Security Settings supports password change and session review. Location is approximate and shown only when deployment headers provide it. Session records contain no cookie or JWT value.

## Deployment order

1. Apply all prior migrations through `0006`.
2. Apply `0007_conscious_arclight.sql`.
3. Configure email and application URL variables.
4. Deploy the application. Existing users are backfilled as verified; existing JWTs must sign in once because they do not contain a registry ID or logical expiry.

Rollback is application-only: return to the prior application build. The forward migration adds tables/columns and backfills verification timestamps; it does not delete business data.
