export type AppRole="OWNER"|"ADMINISTRATOR"|"MANAGER"|"ANALYST"|"CONTRIBUTOR"|"VIEWER";
export type Permission="workspace.settings"|"team.manage"|"business.manage"|"opportunity.update"|"pilot.create"|"pilot.approve"|"kpi.update"|"risk.update"|"recommendation.decide"|"analytics.view"|"audit.view";
export type WorkspaceContext={user:{id:string;name:string;email:string};organization:{id:string;name:string;workspaceName:string};membership:{id:string;role:AppRole;status:"ACTIVE"|"INVITED"|"DISABLED"}};
