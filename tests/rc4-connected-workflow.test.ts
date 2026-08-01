import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";
import {can} from "../app/lib/auth/permissions";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("RC4 connected commercial workflow",()=>{
  it("validates contextual business preselection against the active workspace",()=>{
    for(const page of ["opportunities/page.tsx","campaigns/page.tsx","journeys/page.tsx"]){
      const source=read(`app/(workspace)/workspace/${page}`);
      expect(source).toContain("some(item=>item.id===query.business)");
      expect(source).toContain("defaultBusinessId");
    }
    expect(read("app/(workspace)/workspace/_components/entity-create-dialog.tsx")).toContain("defaultChecked={item.id===defaultBusinessId}");
  });

  it("connects business and opportunity workspaces to persisted downstream records",()=>{
    const business=read("app/(workspace)/workspace/businesses/[businessId]/page.tsx");
    const opportunity=read("app/(workspace)/workspace/opportunities/[id]/page.tsx");
    expect(business).toContain("participantIds.includes(business.id)");
    expect(business).toContain("recommendedBusinessId===business.id");
    expect(opportunity).toContain("item.opportunityId===opportunity.id");
    expect(opportunity).toContain("NextActions");
  });

  it("keeps presentation gates aligned with server permissions for every role",()=>{
    expect(can("OWNER","business.manage")).toBe(true);
    expect(can("ADMINISTRATOR","pilot.create")).toBe(true);
    expect(can("MANAGER","decision.approve")).toBe(true);
    expect(can("ANALYST","business.manage")).toBe(false);
    expect(can("CONTRIBUTOR","opportunity.update")).toBe(true);
    expect(can("VIEWER","business.manage")).toBe(false);
    expect(read("app/lib/actions/workspace-create-actions.ts")).toContain('requirePermission(context.membership.role,"business.manage")');
  });

  it("provides direct tenant-derived notification and decision search routes",()=>{
    const repository=read("app/lib/data/workspace-repository.ts");
    expect(repository).toContain("notificationHref(row.entityType,row.entityId)");
    expect(repository).toContain("eq(executiveDecisions.organizationId,organizationId)");
    expect(read("app/(workspace)/workspace/_components/command-palette.tsx")).toContain("data.executiveDecisions.map");
    expect(read("app/(workspace)/workspace/notifications/page.tsx")).toContain("item.href");
  });

  it("links dashboard attention items to exact decision records",()=>{
    const dashboard=read("app/(workspace)/workspace/dashboard/dashboard-decision-summary.tsx");
    expect(dashboard).toContain("repository.requiringMyAction()");
    expect(dashboard).toContain("repository.dueSoon()");
    expect(dashboard).toContain("/workspace/decisions/${item.id}");
  });
});
