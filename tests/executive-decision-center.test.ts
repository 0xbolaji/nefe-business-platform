import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {can} from "../app/lib/auth/permissions";
import {collaborationDecisionActivity,decisionEventTypes,decisionSummary} from "../app/lib/decisions/events";
import {assertApproverMayRespond,assertTransition,canTransition,currentSequentialApprover,evaluateApproval,isExpired,DecisionPolicyError} from "../app/lib/decisions/policy";

const approvers=[{userId:"manager-a",order:1},{userId:"manager-b",order:2}];
describe("executive decision policy",()=>{
  it("allows the governed lifecycle and rejects invalid transitions",()=>{expect(canTransition("draft","pending_approval")).toBe(true);expect(canTransition("pending_approval","approved")).toBe(true);expect(canTransition("approved","draft")).toBe(false);expect(()=>assertTransition("approved","draft")).toThrow(DecisionPolicyError)});
  it("approves parallel decisions only after every required approval",()=>{expect(evaluateApproval(approvers,[{userId:"manager-a",order:1,state:"approved"}])).toBe("pending_approval");expect(evaluateApproval(approvers,[{userId:"manager-a",order:1,state:"approved"},{userId:"manager-b",order:2,state:"approved"}])).toBe("approved")});
  it("rejects the decision deterministically on required rejection",()=>{expect(evaluateApproval(approvers,[{userId:"manager-a",order:1,state:"rejected"}])).toBe("rejected")});
  it("moves a decision to changes requested",()=>{expect(evaluateApproval(approvers,[{userId:"manager-a",order:1,state:"changes_requested"}])).toBe("changes_requested")});
  it("enforces sequential order",()=>{expect(currentSequentialApprover(approvers,[])).toBe("manager-a");expect(()=>assertApproverMayRespond({actorId:"manager-b",mode:"sequential",approvers,responses:[]})).toThrowError(/prior approver/i);expect(()=>assertApproverMayRespond({actorId:"manager-b",mode:"sequential",approvers,responses:[{userId:"manager-a",order:1,state:"approved"}]})).not.toThrow()});
  it("rejects non-approvers and duplicate responses",()=>{expect(()=>assertApproverMayRespond({actorId:"reviewer",mode:"parallel",approvers,responses:[]})).toThrowError(/required approver/i);expect(()=>assertApproverMayRespond({actorId:"manager-a",mode:"parallel",approvers,responses:[{userId:"manager-a",order:1,state:"approved"}]})).toThrowError(/already recorded/i)});
  it("does not count abstention as approval",()=>{expect(evaluateApproval(approvers,[{userId:"manager-a",order:1,state:"abstained"},{userId:"manager-b",order:2,state:"approved"}])).toBe("pending_approval")});
  it("uses deterministic deadline evaluation",()=>{const now=new Date("2026-07-29T12:00:00Z");expect(isExpired(new Date("2026-07-29T11:59:59Z"),now)).toBe(true);expect(isExpired(new Date("2026-07-29T12:00:01Z"),now)).toBe(false);expect(isExpired(null,now)).toBe(false)});
});

describe("executive decision authorization",()=>{
  it("keeps viewers read-only",()=>{expect(can("VIEWER","decision.read")).toBe(true);expect(can("VIEWER","decision.create")).toBe(false);expect(can("VIEWER","decision.approve")).toBe(false)});
  it("allows analysts and contributors to draft but not approve",()=>{for(const role of ["ANALYST","CONTRIBUTOR"] as const){expect(can(role,"decision.create")).toBe(true);expect(can(role,"decision.review")).toBe(true);expect(can(role,"decision.submit")).toBe(false);expect(can(role,"decision.approve")).toBe(false)}});
  it("allows managers to submit and approve without administration",()=>{expect(can("MANAGER","decision.submit")).toBe(true);expect(can("MANAGER","decision.approve")).toBe(true);expect(can("MANAGER","decision.admin")).toBe(false)});
  it("reserves administration for owners and administrators",()=>{expect(can("OWNER","decision.admin")).toBe(true);expect(can("ADMINISTRATOR","decision.admin")).toBe(true)});
});

describe("decision evidence and repository safety",()=>{
  const schema=readFileSync(join(process.cwd(),"db/schema.ts"),"utf8");
  const repository=readFileSync(join(process.cwd(),"app/lib/data/decision-repository.ts"),"utf8");
  const actions=readFileSync(join(process.cwd(),"app/lib/actions/decision-actions.ts"),"utf8");
  it("defines every formal event deterministically",()=>{expect(decisionEventTypes).toContain("decision.approved");expect(decisionSummary("Amina","decision.submitted","Launch pilot")).toBe("Amina submitted the decision for approval “Launch pilot”.");expect(collaborationDecisionActivity("decision.approved","pilot","00000000-0000-0000-0000-000000000001","Approved", "00000000-0000-0000-0000-000000000002",2).metadata).toEqual({decisionId:"00000000-0000-0000-0000-000000000002",versionNumber:2})});
  it("places organization IDs and tenant indexes on all five tables",()=>{for(const table of ["executiveDecisions","decisionParticipants","decisionResponses","decisionVersions","decisionEvents"]){const start=schema.indexOf(`export const ${table}`);expect(start).toBeGreaterThan(-1);expect(schema.slice(start,start+900)).toContain("organizationId")};expect(schema).toContain("exec_decisions_org_entity_idx");expect(schema).toContain("decision_events_org_decision_created_idx")});
  it("enforces database status, priority, entity, version and response checks",()=>{for(const check of ["exec_decisions_status_ck","exec_decisions_priority_ck","exec_decisions_entity_type_ck","exec_decisions_version_ck","decision_responses_state_ck","decision_versions_mode_ck"]){expect(schema).toContain(check)}});
  it("prevents duplicate participants and approval retries",()=>{expect(schema).toContain("decision_participants_decision_user_role_uq");expect(schema).toContain("decision_responses_version_user_uq");expect(schema).toContain("decision_responses_org_idempotency_uq")});
  it("preserves historical responses by version",()=>{expect(schema).toContain("versionId:uuid(\"version_id\")");expect(schema).toContain("versionNumber:integer(\"version_number\")");expect(repository).toContain("snapshot(tx,decision)")});
  it("uses optimistic concurrency checks for stale writes",()=>{expect(repository.match(/eq\(executiveDecisions\.versionNumber,expectedVersion\)/g)?.length).toBeGreaterThanOrEqual(4);expect(repository).toContain("STALE_VERSION")});
  it("validates entities and active same-tenant participants server-side",()=>{expect(repository).toContain("eq(table.organizationId,organizationId)");expect(repository).toContain('eq(organizationMembers.status,"ACTIVE")');expect(repository).toContain("isNull(users.disabledAt)")});
  it("does not accept organization IDs or roles in public decision action inputs",()=>{expect(actions).not.toMatch(/organizationId\s*:/);expect(actions).not.toMatch(/actorRole|memberRole/);expect(actions).toContain("requireWorkspaceContext")});
  it("writes audit, formal decision events and collaboration activity within repositories",()=>{expect(repository).toContain("tx.insert(auditLogs)");expect(repository).toContain("tx.insert(decisionEvents)");expect(repository).toContain("tx.insert(collaborationActivityEvents)")});
  it("deduplicates deterministic decision notifications",()=>{expect(repository).toContain("dedupeKey:`decision:");expect(repository).toContain("onConflictDoNothing")});
  it("keeps response authority on the authenticated actor",()=>{expect(repository).toContain("actorId");expect(repository).toContain("assertApproverMayRespond({actorId")});
  it("creates new versions when decisions reopen",()=>{expect(repository).toContain("versionNumber:reopening?decision.versionNumber+1");expect(repository).toContain('"decision.version_created"')});
  it("keeps every repository read tenant-scoped",()=>{expect(repository.match(/executiveDecisions\.organizationId,organizationId/g)?.length).toBeGreaterThanOrEqual(8);expect(repository).not.toContain("input.organizationId")});
});
