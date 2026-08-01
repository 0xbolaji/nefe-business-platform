"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Auth.js sign-out endpoint is an HTTP auth flow, not an application page. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import {createPortal} from "react-dom";
import {switchWorkspace} from "@/app/lib/actions/workspace-switch";
import BrandLogo from "../../../components/brand-logo";
import ThemeToggle from "../../../components/theme-toggle";
import CommandPalette from "./command-palette";
import {useBodyScrollLock} from "./use-body-scroll-lock";
import {logWorkspaceRenderEvent,useRenderLifecycleDiagnostics,WorkspaceRouteCommitProbe} from "@/app/components/render-lifecycle-diagnostics";

const primary = [
  ["Overview","/workspace/dashboard"],["Businesses","/workspace/businesses"],["Opportunities","/workspace/opportunities"],["Decisions","/workspace/decisions"],["Pilots","/workspace/pilots"],["Campaigns","/workspace/campaigns"],["Journeys","/workspace/journeys"],["Analytics","/workspace/analytics"],
];
const secondary = [["Notifications","/workspace/notifications"],["Help","/workspace/help"],["Settings","/workspace/settings"]];

function SidebarItem({ label, href, pathname, onSelect }: { label:string; href:string; pathname:string; onSelect:()=>void }) {
  const active=pathname===href||(href!=="/workspace/dashboard"&&pathname.startsWith(`${href}/`));
  return <Link href={href} onClick={()=>{logWorkspaceRenderEvent("navigation_selected","WorkspaceSidebar",{fromPathname:pathname,toPathname:href});onSelect()}} aria-current={active?"page":undefined} className={`ws-sidebar-item ${active?"active":""}`}><span aria-hidden="true">{label.slice(0,1)}</span><b>{label}</b></Link>;
}

export default function AppShell({ children,identity,workspaceName,activeWorkspaceId,workspaces,permissions,unreadNotifications }: { children: ReactNode;identity:{name:string;email:string;initials:string;role:string};workspaceName:string;activeWorkspaceId:string;workspaces:Array<{id:string;name:string;workspaceName:string}>;permissions:{manage:boolean};unreadNotifications:number }) {
  useRenderLifecycleDiagnostics("AppShell");
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [openPathname,setOpenPathname]=useState(pathname);
  const [profileOpen,setProfileOpen]=useState(false);
  const [workspaceOpen,setWorkspaceOpen]=useState(false);
  const [switching,startSwitch]=useTransition();
  const switcherRef=useRef<HTMLDivElement>(null);
  const menuButtonRef=useRef<HTMLButtonElement>(null);
  const sidebarRef=useRef<HTMLElement>(null);
  const closeMenu=useCallback((restoreFocus=false)=>{setOpen(false);if(restoreFocus)requestAnimationFrame(()=>menuButtonRef.current?.focus())},[]);
  const menuOpen=open&&openPathname===pathname;
  useBodyScrollLock(menuOpen);
  useEffect(()=>{if(menuOpen)requestAnimationFrame(()=>sidebarRef.current?.querySelector<HTMLElement>("button,a")?.focus())},[menuOpen]);
  useEffect(()=>{const close=(event:MouseEvent)=>{if(!switcherRef.current?.contains(event.target as Node))setWorkspaceOpen(false)},escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){setWorkspaceOpen(false);setProfileOpen(false);closeMenu(true)}};document.addEventListener("pointerdown",close);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("pointerdown",close);document.removeEventListener("keydown",escape)}},[closeMenu]);
  const current=[...primary,...secondary].find(([,href])=>href===pathname)?.[0]??"Workspace";
  const sidebar=<aside ref={sidebarRef} className={`ws-sidebar ${menuOpen?"open":""}`} aria-label="Workspace navigation" onKeyDown={event=>{if(event.key!=="Tab"||!menuOpen)return;const focusable=[...event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')],first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}}>
      <div className="ws-sidebar-top">
        <div className="ws-sidebar-brand"><BrandLogo size="sm" priority/><button type="button" onClick={()=>closeMenu(true)} aria-label="Close workspace menu">×</button></div>
        <div className="ws-workspace-switcher" ref={switcherRef}><button type="button" className="ws-workspace-switch" onClick={()=>setWorkspaceOpen(value=>!value)} aria-expanded={workspaceOpen} aria-haspopup="menu"><span>{workspaceName.slice(0,3).toUpperCase()}</span><div><small>{switching?"Switching workspace…":"Workspace"}</small><strong>{workspaceName}</strong></div>{workspaces.length>1&&<i aria-hidden="true">⌄</i>}</button>{workspaceOpen&&<div className="ws-workspace-menu" role="menu" aria-label="Available workspaces"><strong>Available workspaces</strong>{workspaces.length===1?<p role="status">Only one workspace available.</p>:workspaces.map(item=><button role="menuitem" type="button" className={item.id===activeWorkspaceId?"active":""} aria-current={item.id===activeWorkspaceId?"true":undefined} disabled={switching||item.id===activeWorkspaceId} key={item.id} onClick={()=>startSwitch(async()=>switchWorkspace(item.id))}><span>{item.workspaceName}</span><small>{item.id===activeWorkspaceId?"Active workspace":item.name}</small></button>)}</div>}</div>
      </div>
      <div className="ws-sidebar-navigation" role="region" tabIndex={0} aria-label="Workspace sections">
        <nav><p>Operate</p>{primary.map(([label,href])=><SidebarItem key={href} label={label} href={href} pathname={pathname} onSelect={()=>closeMenu()}/>)}</nav>
        <nav className="ws-sidebar-secondary"><p>Manage</p>{secondary.filter(([label])=>permissions.manage||label!=="Settings").map(([label,href])=><SidebarItem key={href} label={label} href={href} pathname={pathname} onSelect={()=>closeMenu()}/>)}</nav>
      </div>
      <div className="ws-sidebar-foot"><span>{identity.initials}</span><div><strong>{identity.name}</strong><small>{identity.role}</small></div></div>
    </aside>;
  const mobileLayer=menuOpen?createPortal(<div className="ws-mobile-navigation-layer"><button type="button" aria-label="Close workspace menu" className="ws-backdrop" onClick={()=>closeMenu(true)}/>{sidebar}</div>,document.body):null;
  return <div className="ws-root">
    <a className="ws-skip" href="#workspace-content">Skip to workspace content</a>
    {!menuOpen&&sidebar}
    {mobileLayer}
    <div className="ws-stage" inert={menuOpen?true:undefined}>
      <header className="ws-topbar">
        <div className="ws-topbar-start"><button ref={menuButtonRef} className="ws-menu-button" type="button" onClick={()=>{setOpenPathname(pathname);setOpen(true)}} aria-label="Open workspace menu" aria-expanded={menuOpen}>☰</button><div className="ws-breadcrumb"><span>{workspaceName}</span><i>/</i><strong>{current}</strong></div></div>
        <div className="ws-topbar-actions"><CommandPalette/><ThemeToggle/><Link href="/workspace/notifications" className="ws-notification-button" aria-label={`${unreadNotifications} unread notifications`}>◌<span>{unreadNotifications}</span></Link><div className="ws-profile"><button type="button" onClick={()=>setProfileOpen(value=>!value)} aria-expanded={profileOpen} aria-haspopup="menu"><span>{identity.initials}</span><b>{identity.name.split(" ")[0]}</b><i>⌄</i></button>{profileOpen&&<div role="menu"><p>{identity.email}</p><Link role="menuitem" href="/workspace/settings" onClick={()=>setProfileOpen(false)}>Workspace settings</Link><Link role="menuitem" href="/" onClick={()=>setProfileOpen(false)}>View public website</Link><a role="menuitem" href="/api/auth/signout">Sign out</a></div>}</div></div>
      </header>
      <main id="workspace-content" className="ws-content" tabIndex={-1}><WorkspaceRouteCommitProbe>{children}</WorkspaceRouteCommitProbe></main>
    </div>
  </div>;
}
