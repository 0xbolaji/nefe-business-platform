import type { Metadata } from "next";
import AppShell from "./_components/app-shell";
import { CollaborationProvider } from "./_components/collaboration-state";
import { PilotProvider } from "./_components/pilot-state";
import { requireWorkspaceContext } from "../../lib/auth/workspace-context";
import {getWorkspaceData} from "../../lib/data/workspace-repository";
import "./workspace.css";

export const metadata: Metadata = { title: { default: "Workspace | NEFE", template: "%s | NEFE Workspace" }, robots: { index: false, follow: false } };
export const dynamic="force-dynamic";
export default async function WorkspaceLayout({children}:{children:React.ReactNode}) { const context=await requireWorkspaceContext();const data=await getWorkspaceData();return <CollaborationProvider initialData={data}><PilotProvider initialPilots={data.pilots}><AppShell identity={{name:context.user.name,email:context.user.email,initials:context.user.name.split(" ").map(part=>part[0]).join("").slice(0,2).toUpperCase(),role:context.membership.role}} workspaceName={context.organization.workspaceName} unreadNotifications={data.unreadNotifications}>{children}</AppShell></PilotProvider></CollaborationProvider>; }
