import type { Metadata } from "next";
import AppShell from "./_components/app-shell";
import { CollaborationProvider } from "./_components/collaboration-state";
import { PilotProvider } from "./_components/pilot-state";
import { getAvailableWorkspaces,requireWorkspaceContext } from "../../lib/auth/workspace-context";
import {can} from "../../lib/auth/permissions";
import {getWorkspaceData} from "../../lib/data/workspace-repository";
import "./workspace.css";
import {PermissionProvider} from "./_components/permission-context";

export const metadata: Metadata = { title: { default: "Workspace | NEFE", template: "%s | NEFE Workspace" }, robots: { index: false, follow: false } };
export const dynamic="force-dynamic";
export default async function WorkspaceLayout({children}:{children:React.ReactNode}) { const context=await requireWorkspaceContext();const [data,workspaces]=await Promise.all([getWorkspaceData(),getAvailableWorkspaces()]);const permissions={manage:can(context.membership.role,"workspace.settings")||can(context.membership.role,"team.manage")},creation={business:can(context.membership.role,"business.manage"),opportunity:can(context.membership.role,"opportunity.update"),campaign:can(context.membership.role,"business.manage"),journey:can(context.membership.role,"business.manage"),pilot:can(context.membership.role,"pilot.create")};return <PermissionProvider value={creation}><CollaborationProvider initialData={data}><PilotProvider initialPilots={data.pilots}><AppShell identity={{name:context.user.name,email:context.user.email,initials:context.user.name.split(" ").map(part=>part[0]).join("").slice(0,2).toUpperCase(),role:context.membership.role}} activeWorkspaceId={context.organization.id} workspaces={workspaces.length?workspaces:[{id:context.organization.id,name:context.organization.name,workspaceName:context.organization.workspaceName}]} permissions={permissions} workspaceName={context.organization.workspaceName} unreadNotifications={data.unreadNotifications}>{children}</AppShell></PilotProvider></CollaborationProvider></PermissionProvider>; }
