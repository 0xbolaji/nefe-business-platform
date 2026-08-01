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

});
