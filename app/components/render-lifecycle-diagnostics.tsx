"use client";

import {usePathname} from "next/navigation";
import {useEffect,useLayoutEffect,useRef,useState,type ReactNode} from "react";

const enabled=process.env.NODE_ENV!=="production"||process.env.NEXT_PUBLIC_WORKSPACE_RENDER_DIAGNOSTICS==="true";
let instanceSequence=0;

function metrics(event:string,component:string,pathname:string,detail?:Record<string,unknown>){
  if(!enabled||typeof window==="undefined")return;
  const root=document.documentElement,body=document.body,viewport=window.visualViewport;
  console.info("[workspace-render]",{
    event,component,pathname,
    timestamp:new Date().toISOString(),frameTime:Math.round(performance.now()*100)/100,
    scrollX:window.scrollX,scrollY:window.scrollY,innerWidth:window.innerWidth,innerHeight:window.innerHeight,
    clientWidth:root.clientWidth,clientHeight:root.clientHeight,documentScrollWidth:root.scrollWidth,
    documentScrollHeight:root.scrollHeight,bodyScrollWidth:body.scrollWidth,bodyScrollHeight:body.scrollHeight,
    visualViewport:viewport?{width:viewport.width,height:viewport.height,offsetLeft:viewport.offsetLeft,offsetTop:viewport.offsetTop,scale:viewport.scale}:null,
    ...detail,
  });
}

function frames(component:string,pathname:string,event:string){
  metrics(event,component,pathname,{phase:"synchronous"});
  queueMicrotask(()=>metrics(event,component,pathname,{phase:"microtask"}));
  requestAnimationFrame(()=>{
    metrics(event,component,pathname,{phase:"animation-frame-1"});
    requestAnimationFrame(()=>metrics(event,component,pathname,{phase:"animation-frame-2"}));
  });
  window.setTimeout(()=>metrics(event,component,pathname,{phase:"timeout-50ms"}),50);
  window.setTimeout(()=>metrics(event,component,pathname,{phase:"timeout-250ms"}),250);
}

export function logWorkspaceRenderEvent(event:string,component:string,detail?:Record<string,unknown>){
  metrics(event,component,typeof window==="undefined"?"server":window.location.pathname,detail);
}

export function useRenderLifecycleDiagnostics(component:string){
  const pathname=usePathname(),mountedPath=useRef(pathname);
  const [instanceId]=useState(()=>++instanceSequence);
  useLayoutEffect(()=>{
    const mountedAtPathname=mountedPath.current;
    metrics("mount",component,mountedAtPathname,{instanceId});
    return()=>metrics("unmount",component,mountedAtPathname,{instanceId});
  },[component,instanceId]);
  useLayoutEffect(()=>{metrics("pathname_commit",component,pathname,{instanceId});frames(component,pathname,"pathname_frames")},[component,instanceId,pathname]);
}

export function WorkspaceRouteCommitProbe({children}:{children:ReactNode}){
  const pathname=usePathname(),previous=useRef(pathname);
  useRenderLifecycleDiagnostics("WorkspaceRouteSlot");
  useLayoutEffect(()=>{
    const from=previous.current;
    metrics("route_children_commit","WorkspaceRouteSlot",pathname,{fromPathname:from,toPathname:pathname,pathnameChanged:from!==pathname});
    previous.current=pathname;
  });
  useEffect(()=>{
    if(!enabled)return;
    const reportFallback=(node:Element,event:string)=>metrics(event,"SuspenseFallback",pathname,{tagName:node.tagName,className:node.className});
    document.querySelectorAll("[data-workspace-suspense-fallback]").forEach(node=>reportFallback(node,"fallback_present"));
    const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
      if(!(node instanceof Element))return;
      if(node.matches("[data-workspace-suspense-fallback]"))reportFallback(node,"fallback_mount");
      node.querySelectorAll("[data-workspace-suspense-fallback]").forEach(match=>reportFallback(match,"fallback_mount"));
    })));
    observer.observe(document.body,{childList:true,subtree:true});
    const viewport=window.visualViewport;
    const resize=()=>metrics("viewport_change","WorkspaceRouteSlot",window.location.pathname);
    window.addEventListener("resize",resize);window.addEventListener("popstate",resize);window.addEventListener("pageshow",resize);
    viewport?.addEventListener("resize",resize);viewport?.addEventListener("scroll",resize);
    return()=>{observer.disconnect();window.removeEventListener("resize",resize);window.removeEventListener("popstate",resize);window.removeEventListener("pageshow",resize);viewport?.removeEventListener("resize",resize);viewport?.removeEventListener("scroll",resize)};
  },[pathname]);
  return children;
}
