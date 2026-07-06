"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const pageName=(pathname:string)=>{
  if(pathname==="/") return "home";
  if(pathname.startsWith("/merchants/")) return "merchant";
  return pathname.split("/").filter(Boolean)[0]||"home";
};

export default function MotionSystem({children}:{children:ReactNode}){
  const pathname=usePathname();
  const reduced=useReducedMotion();

  useEffect(()=>{
    const root=document.documentElement;
    root.dataset.nefePage=pageName(pathname);
    let frame=0;
    const pointer=(event:PointerEvent)=>{
      if(reduced) return;
      window.cancelAnimationFrame(frame);
      frame=window.requestAnimationFrame(()=>{
        root.style.setProperty("--pointer-x",`${event.clientX}px`);
        root.style.setProperty("--pointer-y",`${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove",pointer,{passive:true});

    const reveal=window.requestAnimationFrame(()=>{
      const targets=Array.from(document.querySelectorAll<HTMLElement>("main > section, .page-shell > section")).filter((target,index,list)=>!list.some((parent,parentIndex)=>parentIndex<index&&parent.contains(target)));
      if(reduced){
        targets.forEach(target=>target.classList.add("nefe-revealed"));
        return;
      }
      targets.forEach((target,index)=>{
        target.classList.add("nefe-reveal-target");
        target.style.setProperty("--reveal-order",String(index%3));
      });
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add("nefe-revealed");
            observer.unobserve(entry.target);
          }
        });
      },{threshold:.08,rootMargin:"0px 0px -7% 0px"});
      targets.forEach(target=>observer.observe(target));
      (root as HTMLElement & {__nefeObserver?:IntersectionObserver}).__nefeObserver=observer;
    });

    return()=>{
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(reveal);
      window.removeEventListener("pointermove",pointer);
      const observer=(root as HTMLElement & {__nefeObserver?:IntersectionObserver}).__nefeObserver;
      observer?.disconnect();
    };
  },[pathname,reduced]);

  const transition=reduced?{duration:0}:{duration:.42,ease:[.22,1,.36,1] as [number,number,number,number]};
  return <>
    <div className="nefe-environment" aria-hidden="true">
      <div className="nefe-environment-grid"/>
      <div className="nefe-environment-light"/>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none"><path d="M-40 680 C260 560 330 760 610 610 S980 470 1480 590"/><path d="M-80 250 C280 390 500 170 790 315 S1170 390 1510 205"/></svg>
      <i className="particle one"/><i className="particle two"/><i className="particle three"/>
    </div>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} className="nefe-page-stage" initial={reduced?false:{opacity:0,scale:.992,y:8,filter:"blur(2px)"}} animate={{opacity:1,scale:1,y:0,filter:"blur(0px)"}} exit={reduced?undefined:{opacity:0,scale:.994,y:-4,filter:"blur(2px)"}} transition={transition}>
        {children}
      </motion.div>
    </AnimatePresence>
  </>;
}

