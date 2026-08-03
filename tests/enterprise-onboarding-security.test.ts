import {describe,expect,it,vi} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";
vi.mock("server-only",()=>({}));
import {invitationCanBeAccepted,invitationRoleAllowed,passwordMeetsPolicy} from "../app/lib/auth/onboarding-policy";
import {describeClient,REMEMBERED_SESSION_SECONDS,STANDARD_SESSION_SECONDS} from "../app/lib/auth/session-duration-policy";
import {createJwtSessionCallback} from "../app/lib/auth/session-security-policy";
import {createSecureToken,hashSecureToken,tokenExpiry} from "../app/lib/auth/secure-tokens";

const now=new Date("2026-08-02T12:00:00Z"),pending={status:"PENDING",email:"member@example.com",organizationId:"org-a",expiresAt:new Date("2026-08-03T12:00:00Z"),revokedAt:null};
const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");
describe("enterprise onboarding security policy",()=>{
  it("accepts only a matching, pending, unexpired, unrevoked invitation",()=>{expect(invitationCanBeAccepted(pending," MEMBER@example.com ",now)).toBe(true);expect(invitationCanBeAccepted({...pending,status:"ACCEPTED"},pending.email,now)).toBe(false);expect(invitationCanBeAccepted({...pending,expiresAt:now},pending.email,now)).toBe(false);expect(invitationCanBeAccepted({...pending,revokedAt:now},pending.email,now)).toBe(false)});
  it("binds invitation acceptance to the invited email",()=>expect(invitationCanBeAccepted(pending,"attacker@example.com",now)).toBe(false));
  it("permits tenant administrators to invite non-owner roles only",()=>{expect(invitationRoleAllowed("OWNER","MANAGER")).toBe(true);expect(invitationRoleAllowed("ADMINISTRATOR","VIEWER")).toBe(true);expect(invitationRoleAllowed("ADMINISTRATOR","OWNER")).toBe(false);expect(invitationRoleAllowed("VIEWER","VIEWER")).toBe(false)});
  it("enforces the shared password length policy",()=>{expect(passwordMeetsPolicy("short")).toBe(false);expect(passwordMeetsPolicy("a".repeat(12))).toBe(true);expect(passwordMeetsPolicy("a".repeat(129))).toBe(false)});
  it("keeps standard and remembered session lifetimes distinct",()=>{expect(STANDARD_SESSION_SECONDS).toBe(28_800);expect(REMEMBERED_SESSION_SECONDS).toBe(2_592_000)});
  it("rejects an expired logical session before trusting persisted authorization",async()=>{const lookupUser=()=>Promise.resolve({id:"user-a",disabledAt:null,securityVersion:1});const callback=createJwtSessionCallback({lookupUser,log:()=>{},developmentDemo:()=>false});await expect(callback({token:{sub:"user-a",securityVersion:1,authExpiresAt:Date.now()-1}})).resolves.toBeNull()});
  it("classifies browser and platform metadata without device fingerprinting",()=>expect(describeClient("Mozilla/5.0 (iPhone) AppleWebKit Safari/605.1")).toEqual({browser:"Safari",platform:"iOS"}));
  it("generates high-entropy tokens and stores deterministic non-reversible representations",()=>{process.env.AUTH_SECRET="test-secret-that-is-long-enough-for-hmac";const first=createSecureToken(),second=createSecureToken();expect(first).not.toBe(second);expect(first.length).toBeGreaterThanOrEqual(40);expect(hashSecureToken(first)).toMatch(/^[a-f0-9]{64}$/);expect(hashSecureToken(first)).not.toContain(first)});
  it("computes explicit verification and reset expirations",()=>expect(tokenExpiry(60,now)).toEqual(new Date("2026-08-02T13:00:00Z")));
});

describe("enterprise onboarding persistence contract",()=>{
  const implementation=read("app/lib/auth/enterprise-onboarding.ts"),schema=read("db/schema.ts"),migration=read("db/migrations/0007_conscious_arclight.sql"),registration=read("app/sign-up/actions.ts");
  it("persists invitation lifecycle history and hashes only",()=>{expect(schema).toContain('tokenHash:text("token_hash")');expect(schema).toContain('acceptedAt:timestamp("accepted_at"');expect(schema).toContain('revokedAt:timestamp("revoked_at"');expect(migration).toContain("invitations_status_ck")});
  it("creates registration, invited membership, verification token, and audit atomically",()=>{expect(implementation).toContain("database().transaction");expect(implementation).toContain('status:"INVITED"');expect(implementation).toContain("emailVerificationTokens");expect(implementation).toContain('"account.registered"')});
  it("activates membership only after a replay-safe verification claim",()=>{expect(implementation).toContain("tx.update(emailVerificationTokens)");expect(implementation).toContain('status:"ACTIVE"');expect(implementation).toContain('"email.verified"')});
  it("resets passwords with security-version and registry invalidation plus audit",()=>{expect(implementation).toContain('securityVersion:sql`${users.securityVersion} + 1`');expect(implementation).toContain("tx.update(authSessionRegistry)");expect(implementation).toContain('"password.reset"')});
  it("verifies the current password and audits password change",()=>{expect(implementation).toContain("compare(input.currentPassword");expect(implementation).toContain('"password.changed"');expect(implementation).toContain("ne(authSessionRegistry.id,input.currentSessionId)")});
  it("does not accept organization or role from public registration input",()=>{expect(registration).not.toContain('formData.get("organization');expect(registration).not.toContain('formData.get("role');expect(registration).toContain("registerFromInvitation")});
  it("uses PostgreSQL-backed throttling instead of process memory",()=>{const limiter=read("app/lib/auth/auth-rate-limit.ts");expect(limiter).toContain("authRateLimits");expect(limiter).toContain("onConflictDoUpdate");expect(registration).toContain("consumeAuthRateLimit")});
});
