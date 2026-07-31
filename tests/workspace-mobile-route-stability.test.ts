import {existsSync,readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("workspace mobile route compositing",()=>{
  it("keeps workspace routes outside keyed transform transitions",()=>{
    const motion=read("app/components/motion-system.tsx");
    expect(motion).toContain('pathname.startsWith("/workspace/")');
    expect(motion).toContain('if(workspace) return <div className="nefe-page-stage nefe-workspace-stage">{children}</div>');
    expect(motion.indexOf("if(workspace) return")).toBeLessThan(motion.indexOf("<AnimatePresence"));
  });

  it("retains the committed route until destination Server Components resolve",()=>{
    expect(existsSync(join(process.cwd(),"app/(workspace)/workspace/loading.tsx"))).toBe(false);
    expect(read("app/globals.css")).toContain(".nefe-workspace-stage{transform:none;will-change:auto}");
  });

  it("declares a safe-area-compatible device viewport without restricting zoom",()=>{
    const layout=read("app/layout.tsx");
    expect(layout).toContain('width: "device-width"');
    expect(layout).toContain("initialScale: 1");
    expect(layout).toContain('viewportFit: "cover"');
    expect(layout).not.toContain("maximumScale");
    expect(layout).not.toContain("userScalable");
  });

  it("avoids mobile backdrop blur and fixed-body scroll restoration",()=>{
    const styles=read("app/(workspace)/workspace/workspace.css");
    const lock=read("app/(workspace)/workspace/_components/use-body-scroll-lock.ts");
    expect(styles).toContain(".ws-mobile-navigation-layer .ws-backdrop{position:absolute;background:rgba(12,8,17,.32);backdrop-filter:none}");
    expect(styles).toContain("max-width:100%");
    expect(styles).toContain(".ws-mobile-navigation-layer,.ws-mobile-navigation-layer *{box-sizing:border-box}");
    expect(lock).not.toContain("window.scrollTo");
  });
});
