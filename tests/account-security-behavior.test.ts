import {beforeEach,describe,expect,it,vi} from "vitest";

const state=vi.hoisted(()=>({
  version:3,
  transaction:vi.fn(),
  auditValues:vi.fn(),
}));

vi.mock("server-only",()=>({}));
vi.mock("../db/client",()=>({database:()=>({transaction:state.transaction})}));

import {invalidateAllUserSessions} from "../app/lib/auth/account-security";
import {createJwtSessionCallback} from "../app/lib/auth/session-security-policy";

const context={
  user:{id:"user-a",name:"Amina",email:"amina@example.test"},
  organization:{id:"org-a",name:"Organization A",workspaceName:"Workspace A"},
  membership:{id:"member-a",role:"OWNER" as const,status:"ACTIVE" as const},
};

describe("all-session invalidation implementation",()=>{
  beforeEach(()=>{
    state.version=3;
    state.auditValues.mockReset().mockResolvedValue(undefined);
    state.transaction.mockReset().mockImplementation(async(callback:(tx:unknown)=>unknown)=>{
      const tx={
        update:vi.fn(()=>({set:vi.fn(()=>({where:vi.fn(()=>({returning:vi.fn(async()=>[{id:"user-a",securityVersion:++state.version}])}))}))})),
        insert:vi.fn(()=>({values:state.auditValues})),
      };
      return callback(tx);
    });
  });

  it("exercises the real transaction, version increment, and safe audit write",async()=>{
    await expect(invalidateAllUserSessions(context)).resolves.toEqual({id:"user-a",securityVersion:4});
    expect(state.transaction).toHaveBeenCalledOnce();
    expect(state.auditValues).toHaveBeenCalledWith(expect.objectContaining({
      organizationId:"org-a",
      actorId:"user-a",
      action:"session.all_invalidated",
      entityType:"user",
      entityId:"user-a",
      metadata:{targetUserId:"user-a",securityVersion:4},
    }));
    expect(JSON.stringify(state.auditValues.mock.calls)).not.toMatch(/password|cookie|token|secret/i);
  });

  it("makes prior JWT state unusable while preserving unrelated users",async()=>{
    const updated=await invalidateAllUserSessions(context);
    const revoked=createJwtSessionCallback({lookupUser:vi.fn().mockResolvedValue({...updated,disabledAt:null}),log:vi.fn(),developmentDemo:()=>false});
    const unrelated=createJwtSessionCallback({lookupUser:vi.fn().mockResolvedValue({id:"user-b",disabledAt:null,securityVersion:8}),log:vi.fn(),developmentDemo:()=>false});
    await expect(revoked({token:{sub:"user-a",securityVersion:3,authExpiresAt:Date.now()+60_000}})).resolves.toBeNull();
    await expect(unrelated({token:{sub:"user-b",securityVersion:8,authExpiresAt:Date.now()+60_000}})).resolves.toMatchObject({sub:"user-b",securityVersion:8});
  });

  it("is monotonic across repeated invalidation requests",async()=>{
    await expect(invalidateAllUserSessions(context)).resolves.toMatchObject({securityVersion:4});
    await expect(invalidateAllUserSessions(context)).resolves.toMatchObject({securityVersion:5});
  });
});
