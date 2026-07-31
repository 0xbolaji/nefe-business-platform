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
  const workspace=pathname==="/workspace"||pathname.startsWith("/workspace/");

  useEffect(()=>{
    const root=document.documentElement;
    root.dataset.nefePage=pageName(pathname);
  },[pathname]);

  // Workspace navigation owns its mobile drawer and must remain one stable
  // compositing surface while authenticated routes stream and replace content.
  if(workspace) return <div className="nefe-page-stage nefe-workspace-stage">{children}</div>;

  const transition=reduced?{duration:0}:{duration:.42,ease:[.22,1,.36,1] as [number,number,number,number]};
  return <AnimatePresence initial={false}>
      <motion.div key={pathname} className="nefe-page-stage" initial={reduced?false:{opacity:.96,scale:.998,y:3}} animate={{opacity:1,scale:1,y:0}} exit={reduced?undefined:{opacity:.96,scale:.998,y:-2}} transition={transition}>
        {children}
      </motion.div>
    </AnimatePresence>;
}
