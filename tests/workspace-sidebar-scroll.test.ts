import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe,expect,it} from "vitest";

const read=(path:string)=>readFileSync(join(process.cwd(),path),"utf8");

describe("workspace sidebar scrolling",()=>{
  const shell=read("app/(workspace)/workspace/_components/app-shell.tsx");
  const styles=read("app/(workspace)/workspace/workspace.css");
  const desktopStyles=styles.slice(
    styles.indexOf("/* Desktop sidebar:"),
    styles.indexOf("/* Dashboard operating-view refinements */"),
  );

  it("keeps all navigation links, including Settings, inside one scroll region",()=>{
    const navigation=shell.slice(
      shell.indexOf('className="ws-sidebar-navigation"'),
      shell.indexOf('className="ws-sidebar-foot"'),
    );

    expect(navigation).toContain("primary.map");
    expect(navigation).toContain("secondary.filter");
    expect(shell).toContain('["Settings","/workspace/settings"]');
  });

  it("keeps the selector and profile outside the navigation scroll region",()=>{
    const navigationStart=shell.indexOf('className="ws-sidebar-navigation"');
    const navigationEnd=shell.indexOf('className="ws-sidebar-foot"');

    expect(shell.indexOf('className="ws-sidebar-top"')).toBeLessThan(navigationStart);
    expect(shell.indexOf('className="ws-workspace-switcher"')).toBeLessThan(navigationStart);
    expect(navigationEnd).toBeGreaterThan(navigationStart);
  });

  it("constrains the shell to the viewport and makes only navigation scrollable",()=>{
    expect(styles).toMatch(/\.ws-sidebar\{position:fixed;inset:0 auto 0 0;[\s\S]*?display:flex;[\s\S]*?flex-direction:column;/);
    expect(desktopStyles).toMatch(/\.ws-sidebar\{[\s\S]*?height:100vh;[\s\S]*?height:100dvh;[\s\S]*?min-height:0;[\s\S]*?overflow:hidden;[\s\S]*?\}/);
    expect(desktopStyles).toMatch(/\.ws-sidebar-navigation\{[\s\S]*?position:relative;[\s\S]*?z-index:1;[\s\S]*?height:0;[\s\S]*?width:100%;[\s\S]*?flex:1 1 auto;[\s\S]*?min-height:0;[\s\S]*?overflow-y:scroll;[\s\S]*?overscroll-behavior-y:contain;[\s\S]*?pointer-events:auto;[\s\S]*?\}/);
    expect(desktopStyles).toContain(".ws-sidebar-top,.ws-sidebar-foot{flex:0 0 auto}");
  });

  it("establishes a bounded scrollport even on a deliberately short desktop viewport",()=>{
    const navigationRule=desktopStyles.match(/\.ws-sidebar-navigation\{([\s\S]*?)\}/)?.[1]??"";

    expect(navigationRule).toContain("height:0");
    expect(navigationRule).toContain("max-height:100%");
    expect(navigationRule).toContain("overflow-y:scroll");
  });

  it("keeps the Chrome desktop scrollport above non-mobile hit-test layers",()=>{
    expect(desktopStyles).toContain("position:relative");
    expect(desktopStyles).toContain("z-index:1");
    expect(desktopStyles).toContain("pointer-events:auto");
    expect(desktopStyles).toContain(".ws-sidebar-navigation nav,.ws-sidebar-navigation .ws-sidebar-item{position:relative;pointer-events:auto}");
    expect(styles).toContain(".ws-backdrop{display:none}");
    expect(shell).toContain("const mobileLayer=menuOpen?createPortal");
  });

  it("overflows at a Chrome-style short desktop height so Settings remains scroll-reachable",()=>{
    const chromeViewportHeight=600;
    const fixedRegionsAndSidebarPadding=235;
    const primarySource=shell.slice(shell.indexOf("const primary"),shell.indexOf("const secondary"));
    const secondarySource=shell.slice(shell.indexOf("const secondary"),shell.indexOf("function SidebarItem"));
    const navigationItemCount=(primarySource.match(/\/workspace\//g)?.length??0)+(secondarySource.match(/\/workspace\//g)?.length??0);
    const minimumNavigationContent=navigationItemCount*42;

    expect(chromeViewportHeight-fixedRegionsAndSidebarPadding).toBeLessThan(minimumNavigationContent);
    expect(shell).toContain('["Settings","/workspace/settings"]');
  });

  it("leaves the working mobile drawer on its existing outer scroll boundary",()=>{
    expect(styles).toMatch(/@media\(max-width:900px\)\{\.ws-sidebar\{height:100dvh;max-height:100dvh;overflow-y:auto;/);
    expect(styles).toMatch(/@media\(max-width:900px\)\{\.ws-sidebar\{inset:0 auto auto 0;height:100svh;height:100dvh;[\s\S]*?overflow-y:auto;/);
    expect(styles).toContain("@media(max-width:900px){.ws-sidebar-top{display:contents}}");
  });
});
