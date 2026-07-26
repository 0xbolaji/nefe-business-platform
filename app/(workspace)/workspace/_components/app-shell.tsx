"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Auth.js sign-out endpoint is an HTTP auth flow, not an application page. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import BrandLogo from "../../../components/brand-logo";
import ThemeToggle from "../../../components/theme-toggle";
import CommandPalette from "./command-palette";

const primary = [
  ["Overview","/workspace/dashboard"],["Businesses","/workspace/businesses"],["Opportunities","/workspace/opportunities"],["Pilots","/workspace/pilots"],["Campaigns","/workspace/campaigns"],["Journeys","/workspace/journeys"],["Analytics","/workspace/analytics"],
];
const secondary = [["Notifications","/workspace/notifications"],["Settings","/workspace/settings"],["Help","/workspace/help"]];

function SidebarItem({ label, href, pathname, onSelect }: { label:string; href:string; pathname:string; onSelect:()=>void }) {
  const active=pathname===href||(href!=="/workspace/dashboard"&&pathname.startsWith(`${href}/`));
  return <Link href={href} onClick={onSelect} aria-current={active?"page":undefined} className={`ws-sidebar-item ${active?"active":""}`}><span aria-hidden="true">{label.slice(0,1)}</span><b>{label}</b></Link>;
}

export default function AppShell({ children,identity,workspaceName,unreadNotifications }: { children: ReactNode;identity:{name:string;email:string;initials:string;role:string};workspaceName:string;unreadNotifications:number }) {
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  useEffect(()=>{document.body.classList.toggle("ws-menu-open",open);return()=>document.body.classList.remove("ws-menu-open")},[open]);
  const current=[...primary,...secondary].find(([,href])=>href===pathname)?.[0]??"Workspace";
  return <div className="ws-root">
    <a className="ws-skip" href="#workspace-content">Skip to workspace content</a>
    <aside className={`ws-sidebar ${open?"open":""}`} aria-label="Workspace navigation">
      <div className="ws-sidebar-brand"><BrandLogo size="sm" priority/><button type="button" onClick={()=>setOpen(false)} aria-label="Close workspace menu">×</button></div>
      <div className="ws-workspace-switch"><span>RAK</span><div><small>Workspace</small><strong>{workspaceName}</strong></div><i>⌄</i></div>
      <nav><p>Operate</p>{primary.map(([label,href])=><SidebarItem key={href} label={label} href={href} pathname={pathname} onSelect={()=>setOpen(false)}/>)}</nav>
      <nav className="ws-sidebar-secondary"><p>Manage</p>{secondary.map(([label,href])=><SidebarItem key={href} label={label} href={href} pathname={pathname} onSelect={()=>setOpen(false)}/>)}</nav>
      <div className="ws-sidebar-foot"><span>{identity.initials}</span><div><strong>{identity.name}</strong><small>{identity.role}</small></div></div>
    </aside>
    {open&&<button type="button" aria-label="Close workspace menu" className="ws-backdrop" onClick={()=>setOpen(false)}/>} 
    <div className="ws-stage">
      <header className="ws-topbar">
        <div className="ws-topbar-start"><button className="ws-menu-button" type="button" onClick={()=>setOpen(true)} aria-label="Open workspace menu" aria-expanded={open}>☰</button><div className="ws-breadcrumb"><span>{workspaceName}</span><i>/</i><strong>{current}</strong></div></div>
        <div className="ws-topbar-actions"><CommandPalette/><ThemeToggle/><Link href="/workspace/notifications" className="ws-notification-button" aria-label={`${unreadNotifications} unread notifications`}>◌<span>{unreadNotifications}</span></Link><div className="ws-profile"><button type="button" onClick={()=>setProfileOpen(value=>!value)} aria-expanded={profileOpen} aria-haspopup="menu"><span>{identity.initials}</span><b>{identity.name.split(" ")[0]}</b><i>⌄</i></button>{profileOpen&&<div role="menu"><p>{identity.email}</p><Link role="menuitem" href="/workspace/settings" onClick={()=>setProfileOpen(false)}>Workspace settings</Link><Link role="menuitem" href="/" onClick={()=>setProfileOpen(false)}>View public website</Link><a role="menuitem" href="/api/auth/signout">Sign out</a></div>}</div></div>
      </header>
      <main id="workspace-content" className="ws-content" tabIndex={-1}>{children}</main>
    </div>
  </div>;
}
