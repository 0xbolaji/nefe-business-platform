"use client";
import {useEffect} from "react";

let locks=0;
let scrollY=0;

function lock(){
 if(locks++>0)return;
 scrollY=window.scrollY;
 const body=document.body;
 body.style.setProperty("--ws-scroll-lock-top",`-${scrollY}px`);
 body.classList.add("ws-scroll-locked");
}

function unlock(){
 if(locks===0||--locks>0)return;
 const body=document.body;
 body.classList.remove("ws-scroll-locked");
 body.style.removeProperty("--ws-scroll-lock-top");
 window.scrollTo({top:scrollY,left:0,behavior:"instant"});
}

export function useBodyScrollLock(active:boolean){useEffect(()=>{if(!active)return;lock();return unlock},[active])}
