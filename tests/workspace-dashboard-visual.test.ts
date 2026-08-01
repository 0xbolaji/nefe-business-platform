import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("workspace dashboard visual system",()=>{
  const dashboard=read("app/(workspace)/workspace/dashboard/dashboard-workspace.tsx");
  const decisions=read("app/(workspace)/workspace/dashboard/dashboard-decision-summary.tsx");
  const ui=read("app/(workspace)/workspace/_components/ui.tsx");
  const styles=read("app/(workspace)/workspace/workspace.css");

  it("uses shared empty states for every dashboard collection",()=>{
    expect(dashboard).toContain("EmptyState");
    expect(dashboard).not.toContain('<div className="ws-empty">');
    expect(decisions).toContain("EmptyState");
  });

  it("keeps metrics on the shared card primitive with optional icon and trend support",()=>{
    expect(dashboard.match(/<MetricCard/g)?.length).toBe(4);
    expect(ui).toContain("icon?:ReactNode");
    expect(ui).toContain('trend?:{label:string;tone?:"positive"|"neutral"|"negative"}');
    expect(ui).toContain("ws-metric-footer");
  });

  it("defines responsive dashboard grids and dedicated activity hierarchy",()=>{
    expect(styles).toContain(".ws-dashboard-grid");
    expect(styles).toContain(".ws-dashboard-timeline");
    expect(styles).toContain(".ws-dashboard-attention-list");
    expect(styles).toContain("@media(max-width:430px)");
  });
});
