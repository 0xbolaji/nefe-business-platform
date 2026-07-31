import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it,vi} from "vitest";

vi.mock("server-only",()=>({}));

import {administrativeAccountActionAllowed,authenticationStateIsValid,createJwtSessionCallback,selectActiveMembership,type PersistedUserSecurity} from "../app/lib/auth/session-security-policy";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("authoritative session security",()=>{
  const active={id:"user-a",disabledAt:null,securityVersion:3};

  function callback(current:PersistedUserSecurity|null=active){
    const lookupUser=vi.fn().mockResolvedValue(current);
    const log=vi.fn();
    return {run:createJwtSessionCallback({lookupUser,log,developmentDemo:()=>false}),lookupUser,log};
  }

  it("accepts only current authentication state",()=>{
    expect(authenticationStateIsValid(3,active)).toBe(true);
    expect(authenticationStateIsValid(2,active)).toBe(false);
    expect(authenticationStateIsValid(undefined,active)).toBe(false);
    expect(authenticationStateIsValid(3,{...active,disabledAt:new Date()})).toBe(false);
    expect(authenticationStateIsValid(3,null)).toBe(false);
  });

  it("executes the real JWT callback and accepts the current persisted version",async()=>{
    const {run,lookupUser,log}=callback();
    const token={sub:"user-a",securityVersion:3};
    await expect(run({token})).resolves.toBe(token);
    expect(lookupUser).toHaveBeenCalledWith("user-a");
    expect(log).not.toHaveBeenCalled();
  });

  it("rejects a stale version through the real JWT callback",async()=>{
    const {run,log}=callback({...active,securityVersion:4});
    await expect(run({token:{sub:"user-a",securityVersion:3}})).resolves.toBeNull();
    expect(log).toHaveBeenCalledWith(expect.objectContaining({event:"authentication.session_rejected",category:"security_version_mismatch",userId:"user-a"}));
  });

  it("rejects disabled, deleted, and unversioned authentication states",async()=>{
    await expect(callback({...active,disabledAt:new Date()}).run({token:{sub:"user-a",securityVersion:3}})).resolves.toBeNull();
    await expect(callback(null).run({token:{sub:"user-a",securityVersion:3}})).resolves.toBeNull();
    await expect(callback().run({token:{sub:"user-a"}})).resolves.toBeNull();
  });

  it("fails closed and classifies a database outage separately",async()=>{
    const log=vi.fn();
    const run=createJwtSessionCallback({lookupUser:vi.fn().mockRejectedValue(new Error("connection failed")),log,developmentDemo:()=>false});
    await expect(run({token:{sub:"user-a",securityVersion:3}})).resolves.toBeNull();
    expect(log).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith({event:"authentication.database_unavailable",category:"user_security_lookup_failed",userId:"user-a"});
    expect(JSON.stringify(log.mock.calls)).not.toContain("connection failed");
  });

  it("does not invalidate an unrelated user's current authentication state",async()=>{
    const revoked=callback({id:"user-a",disabledAt:null,securityVersion:4});
    const unrelated=createJwtSessionCallback({lookupUser:vi.fn().mockResolvedValue({id:"user-b",disabledAt:null,securityVersion:7}),log:vi.fn(),developmentDemo:()=>false});
    await expect(revoked.run({token:{sub:"user-a",securityVersion:3}})).resolves.toBeNull();
    await expect(unrelated({token:{sub:"user-b",securityVersion:7}})).resolves.toMatchObject({sub:"user-b",securityVersion:7});
  });
});

describe("authorization freshness",()=>{
  const owner={organizationId:"org-a",role:"OWNER",status:"ACTIVE"};
  const viewer={organizationId:"org-a",role:"VIEWER",status:"ACTIVE"};
  const other={organizationId:"org-b",role:"CONTRIBUTOR",status:"ACTIVE"};

  it("uses a role downgrade on the next membership resolution",()=>{
    expect(selectActiveMembership([owner],"org-a")?.role).toBe("OWNER");
    expect(selectActiveMembership([viewer],"org-a")?.role).toBe("VIEWER");
  });

  it("rejects inactive and removed memberships",()=>{
    expect(selectActiveMembership([{...owner,status:"DISABLED"}],"org-a")).toBeNull();
    expect(selectActiveMembership([],"org-a")).toBeNull();
  });

  it("preserves another active organization without restoring removed access",()=>{
    expect(selectActiveMembership([other],"org-a")).toEqual(other);
    expect(selectActiveMembership([other],"org-b")).toEqual(other);
  });

  it("keeps the workspace context database-authoritative and request-local",()=>{
    const context=read("app/lib/auth/workspace-context.ts");
    expect(context).toContain("organizationMembers.role");
    expect(context).toContain('eq(organizationMembers.status,"ACTIVE")');
    expect(context).toContain('redirect(priorMembership[0]?"/access-denied":"/onboarding/organization")');
  });
});

describe("tenant-safe account administration",()=>{
  it("allows only privileged, non-self, non-cross-organization targets",()=>{
    expect(administrativeAccountActionAllowed({actorRole:"OWNER",targetRole:"VIEWER",isSelf:false,activeOwnerCount:1,outsideActiveMemberships:0,global:true})).toBe(true);
    expect(administrativeAccountActionAllowed({actorRole:"VIEWER",targetRole:"VIEWER",isSelf:false,activeOwnerCount:1,outsideActiveMemberships:0,global:true})).toBe(false);
    expect(administrativeAccountActionAllowed({actorRole:"OWNER",targetRole:"VIEWER",isSelf:true,activeOwnerCount:1,outsideActiveMemberships:0,global:true})).toBe(false);
    expect(administrativeAccountActionAllowed({actorRole:"OWNER",targetRole:"VIEWER",isSelf:false,activeOwnerCount:1,outsideActiveMemberships:1,global:true})).toBe(false);
    expect(administrativeAccountActionAllowed({actorRole:"ADMINISTRATOR",targetRole:"OWNER",isSelf:false,activeOwnerCount:2,outsideActiveMemberships:0,global:true})).toBe(false);
    expect(administrativeAccountActionAllowed({actorRole:"OWNER",targetRole:"OWNER",isSelf:false,activeOwnerCount:1,outsideActiveMemberships:0,global:false})).toBe(false);
  });

  it("does not expose a broad global-disable Server Action",()=>{
    const actions=["app/lib/actions/organization-mutations.ts","app/lib/actions/workspace-mutations.ts","app/lib/actions/workspace-create-actions.ts"].map(read).join("\n");
    expect(actions).not.toContain("globallyDisableUser");
    expect(actions).not.toContain("invalidateAllUserSessions");
  });
});

describe("proxy runtime contract",()=>{
  it("uses the installed Next.js Node-only Proxy runtime contract",()=>{
    const analyzer=read("node_modules/next/dist/esm/build/analysis/get-page-static-info.js");
    expect(analyzer).toContain("Proxy always runs on Node.js runtime");
    expect(read("proxy.ts")).not.toMatch(/export const runtime/);
  });
});
