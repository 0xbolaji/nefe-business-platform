import Link from "next/link";
import {eq} from "drizzle-orm";
import {database} from "@/db/client";
import {organizationMembers,organizations,users} from "@/db/schema";
import {can} from "@/app/lib/auth/permissions";
import type {AppRole} from "@/app/lib/auth/types";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {updateWorkspaceSettingsForm} from "@/app/lib/actions/organization-form-actions";
import {AppCard,DataTable,SectionHeader,StatusBadge} from "../_components/ui";
import RoleUpdateForm from "./role-update-form";

export default async function PersistedAdministration(){
  const context=await requireWorkspaceContext();
  if(!process.env.DATABASE_URL)return <AppCard className="ws-section-gap"><SectionHeader title="Persistence-ready administration" description="Local demo bypass is active. Configure PostgreSQL to persist team roles and workspace settings."/></AppCard>;
  const db=database();
  const [organization,team]=await Promise.all([
    db.select().from(organizations).where(eq(organizations.id,context.organization.id)).limit(1).then(rows=>rows[0]),
    db.select({id:organizationMembers.id,userId:users.id,name:users.name,email:users.email,role:organizationMembers.role,status:organizationMembers.status}).from(organizationMembers).innerJoin(users,eq(users.id,organizationMembers.userId)).where(eq(organizationMembers.organizationId,context.organization.id)),
  ]);
  const canManageTeam=can(context.membership.role,"team.manage");
  return <div className="ws-layout-2">
    <AppCard>
      <SectionHeader title="Persisted workspace settings" description="Organization-owned values stored in PostgreSQL."/>
      <form action={updateWorkspaceSettingsForm} className="ws-form-grid">
        <label className="ws-field"><span>Workspace name</span><input name="name" defaultValue={organization.workspaceName}/></label>
        <label className="ws-field"><span>Timezone</span><input name="timezone" defaultValue={organization.timezone}/></label>
        <label className="ws-field"><span>Appearance</span><select name="appearance" defaultValue="SYSTEM"><option>LIGHT</option><option>DARK</option><option>SYSTEM</option></select></label>
        <button className="ws-button primary" disabled={!can(context.membership.role,"workspace.settings")}>Save settings</button>
      </form>
    </AppCard>
    <AppCard>
      <SectionHeader title="Persisted team access" description="Role changes are tenant-scoped, audited, and protect the final Owner." action={can(context.membership.role,"audit.view")?<Link href="/workspace/settings/audit">Audit log</Link>:undefined}/>
      <DataTable label="Organization team" headers={["Member","Role","Status"]}>
        {team.map(member=><tr key={member.id}>
          <td><strong>{member.name??member.email}</strong><small className="ws-table-subcopy">{member.email}</small></td>
          <td>{canManageTeam?<RoleUpdateForm memberId={member.id} role={member.role as AppRole}/>:member.role}</td>
          <td><StatusBadge tone={member.status}>{member.status}</StatusBadge></td>
        </tr>)}
      </DataTable>
    </AppCard>
  </div>
}
