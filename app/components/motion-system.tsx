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
      window.cancelAnimationFrame(reveal);
      const observer=(root as HTMLElement & {__nefeObserver?:IntersectionObserver}).__nefeObserver;
      observer?.disconnect();
    };
  },[pathname,reduced]);

  const transition=reduced?{duration:0}:{duration:.42,ease:[.22,1,.36,1] as [number,number,number,number]};
  return <AnimatePresence initial={false}>
      <motion.div key={pathname} className="nefe-page-stage" initial={reduced?false:{opacity:0,scale:.996,y:6}} animate={{opacity:1,scale:1,y:0}} exit={reduced?undefined:{opacity:0,scale:.997,y:-3}} transition={transition}>
        {children}
      </motion.div>
    </AnimatePresence>;
}
