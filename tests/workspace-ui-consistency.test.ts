import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("workspace visual consistency",()=>{
  it("uses one shared metric-card implementation across workspace routes",()=>{
    const routes=[
      "app/(workspace)/workspace/decisions/page.tsx",
      "app/(workspace)/workspace/decisions/[id]/page.tsx",
      "app/(workspace)/workspace/campaigns/[id]/page.tsx",
      "app/(workspace)/workspace/journeys/[id]/page.tsx",
      "app/(workspace)/workspace/opportunities/[id]/page.tsx",
    ];
    for(const route of routes){
      const source=read(route);
      expect(source).toContain("MetricCard");
      expect(source).not.toContain('<AppCard className="ws-metric">');
    }
  });

  it("keeps progress values in the same layout row as their tracks",()=>{
    const ui=read("app/(workspace)/workspace/_components/ui.tsx");
    const styles=read("app/(workspace)/workspace/workspace.css");
    expect(ui).toContain('className="ws-progress-track"');
    expect(styles).toContain("grid-template-columns:minmax(0,1fr) auto");
    expect(styles).toContain(".ws-progress>strong");
  });

  it("defines shared typography, control, card, and spacing tokens",()=>{
    const styles=read("app/(workspace)/workspace/workspace.css");
    for(const token of ["--ws-type-caption","--ws-type-label","--ws-type-body","--ws-type-card-title","--ws-control-height","--ws-card-padding","--ws-card-radius"]){
      expect(styles).toContain(token);
    }
  });
});
