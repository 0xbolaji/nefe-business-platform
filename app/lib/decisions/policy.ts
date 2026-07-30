import type {AppRole} from "@/app/lib/auth/types";

export const decisionStatuses=["draft","pending_review","pending_approval","approved","rejected","changes_requested","cancelled","expired"] as const;
export const decisionPriorities=["low","medium","high","critical"] as const;
export const approvalModes=["parallel","sequential"] as const;
export const responseStates=["approved","rejected","changes_requested","abstained"] as const;
export type DecisionStatus=(typeof decisionStatuses)[number];
export type DecisionPriority=(typeof decisionPriorities)[number];
export type ApprovalMode=(typeof approvalModes)[number];
export type ResponseState=(typeof responseStates)[number];
export type ApprovalEvidence={userId:string;order:number|null;state:ResponseState};

const transitions:Record<DecisionStatus,ReadonlySet<DecisionStatus>>={
  draft:new Set(["pending_review","pending_approval","cancelled"]),
  pending_review:new Set(["draft","pending_approval","changes_requested","cancelled","expired"]),
  pending_approval:new Set(["approved","rejected","changes_requested","cancelled","expired"]),
  approved:new Set(),rejected:new Set(["draft"]),changes_requested:new Set(["draft"]),cancelled:new Set(["draft"]),expired:new Set(["draft"]),
};
export function canTransition(from:DecisionStatus,to:DecisionStatus){return transitions[from].has(to)}
export function assertTransition(from:DecisionStatus,to:DecisionStatus){if(!canTransition(from,to))throw new DecisionPolicyError("INVALID_TRANSITION","This decision cannot move to the requested status.")}
export function canAdminister(role:AppRole){return role==="OWNER"||role==="ADMINISTRATOR"}
export function canCreate(role:AppRole){return role!=="VIEWER"}
export function canSubmit(role:AppRole){return role==="OWNER"||role==="ADMINISTRATOR"||role==="MANAGER"}
export function canReview(role:AppRole){return role!=="VIEWER"}
export function canApprove(role:AppRole){return role==="OWNER"||role==="ADMINISTRATOR"||role==="MANAGER"}
export function currentSequentialApprover(approvers:Array<{userId:string;order:number|null}>,responses:ApprovalEvidence[]){const completed=new Set(responses.filter(item=>item.state==="approved"||item.state==="abstained").map(item=>item.userId));return [...approvers].sort((a,b)=>(a.order??Number.MAX_SAFE_INTEGER)-(b.order??Number.MAX_SAFE_INTEGER)).find(item=>!completed.has(item.userId))?.userId??null}
export function assertApproverMayRespond(input:{actorId:string;mode:ApprovalMode;approvers:Array<{userId:string;order:number|null}>;responses:ApprovalEvidence[]}){if(!input.approvers.some(item=>item.userId===input.actorId))throw new DecisionPolicyError("NOT_APPROVER","Only an active required approver may act.");if(input.responses.some(item=>item.userId===input.actorId))throw new DecisionPolicyError("ALREADY_RESPONDED","Your response is already recorded.");if(input.mode==="sequential"&&currentSequentialApprover(input.approvers,input.responses)!==input.actorId)throw new DecisionPolicyError("OUT_OF_ORDER","A prior approver must complete their step first.")}
export function evaluateApproval(approvers:Array<{userId:string;order:number|null}>,responses:ApprovalEvidence[]):DecisionStatus|"pending_approval"{if(responses.some(item=>item.state==="rejected"))return "rejected";if(responses.some(item=>item.state==="changes_requested"))return "changes_requested";const approved=new Set(responses.filter(item=>item.state==="approved").map(item=>item.userId));return approvers.length>0&&approvers.every(item=>approved.has(item.userId))?"approved":"pending_approval"}
export function isExpired(dueAt:Date|null,now=new Date()){return Boolean(dueAt&&dueAt.getTime()<now.getTime())}
export class DecisionPolicyError extends Error{constructor(public code:string,message:string){super(message);this.name="DecisionPolicyError"}}
