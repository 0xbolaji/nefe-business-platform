import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("workspace render diagnostics",()=>{
  const diagnostics=read("app/components/render-lifecycle-diagnostics.tsx");

  it("captures lifecycle, route, viewport, and overflow evidence",()=>{
    for(const field of ["mount","unmount","pathname_commit","route_children_commit","scrollY","clientWidth","documentScrollWidth","bodyScrollWidth","visualViewport"]){
      expect(diagnostics).toContain(field);
    }
  });

  it("observes marked Suspense fallbacks without introducing one",()=>{
    expect(diagnostics).toContain("data-workspace-suspense-fallback");
    expect(diagnostics).toContain("fallback_mount");
    expect(read("app/(workspace)/workspace/_components/app-shell.tsx")).toContain("WorkspaceRouteCommitProbe");
  });

  it("instruments the real workspace providers and shell",()=>{
    expect(read("app/(workspace)/workspace/_components/collaboration-state.tsx")).toContain('useRenderLifecycleDiagnostics("CollaborationProvider")');
    expect(read("app/(workspace)/workspace/_components/pilot-state.tsx")).toContain('useRenderLifecycleDiagnostics("PilotProvider")');
    expect(read("app/(workspace)/workspace/_components/app-shell.tsx")).toContain('useRenderLifecycleDiagnostics("AppShell")');
    expect(read("app/components/motion-system.tsx")).toContain('useRenderLifecycleDiagnostics("MotionSystem")');
  });
});
