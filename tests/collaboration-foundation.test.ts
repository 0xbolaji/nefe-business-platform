import {describe,expect,it} from "vitest";
import {activityEvent,collaborationEventTypes,parseMentionEmails} from "../app/lib/collaboration/domain-events";
import {can} from "../app/lib/auth/permissions";
import {canChangeComment,isSupportedEntity,pageWindow,resolveMentionCandidates,uniqueNotificationRecipients} from "../app/lib/collaboration/policy";

describe("collaboration domain events",()=>{
  it("provides every required deterministic event",()=>{expect(collaborationEventTypes).toEqual(expect.arrayContaining(["business.created","business.updated","opportunity.created","opportunity.status_changed","campaign.created","campaign.status_changed","pilot.created","pilot.lifecycle_changed","recommendation.accepted","recommendation.rejected","assignment.created","assignment.removed","comment.added","comment.edited","comment.deleted","mention.created","entity.followed","entity.unfollowed"]))});
  it("produces identical output for identical inputs",()=>{const first=activityEvent("opportunity.status_changed","opportunity","00000000-0000-4000-8000-000000000001",{stage:"PILOT"});const second=activityEvent("opportunity.status_changed","opportunity","00000000-0000-4000-8000-000000000001",{stage:"PILOT"});expect(first).toEqual(second);expect(first.summary).toBe("Opportunity status changed")});
});
describe("collaboration permissions",()=>{it("permits active working roles without expanding read-only access",()=>{expect(can("OWNER","collaboration.write")).toBe(true);expect(can("MANAGER","collaboration.write")).toBe(true);expect(can("ANALYST","collaboration.write")).toBe(true);expect(can("CONTRIBUTOR","collaboration.write")).toBe(true);expect(can("VIEWER","collaboration.write")).toBe(false)})});
describe("collaboration policy",()=>{
  it("allows own-comment changes and owner or administrator moderation only",()=>{expect(canChangeComment({id:"author",role:"CONTRIBUTOR"},"author")).toBe(true);expect(canChangeComment({id:"other",role:"ADMINISTRATOR"},"author")).toBe(true);expect(canChangeComment({id:"other",role:"OWNER"},"author")).toBe(true);expect(canChangeComment({id:"other",role:"MANAGER"},"author")).toBe(false)});
  it("parses and deduplicates plain-text email mentions",()=>{expect(parseMentionEmails("Please ask @Amina@example.com and @amina@example.com.")).toEqual(["amina@example.com"])});
  it("rejects cross-tenant, inactive and self mentions",()=>{const members=[{id:"self",email:"self@nefe.test",organizationId:"org-a",status:"ACTIVE" as const},{id:"active",email:"active@nefe.test",organizationId:"org-a",status:"ACTIVE" as const},{id:"external",email:"external@nefe.test",organizationId:"org-b",status:"ACTIVE" as const},{id:"inactive",email:"inactive@nefe.test",organizationId:"org-a",status:"DISABLED" as const}];expect(resolveMentionCandidates(members.map(item=>item.email),members,"org-a","self").map(item=>item.id)).toEqual(["active"])});
  it("deduplicates watcher and mention notification recipients and excludes the actor",()=>{expect(uniqueNotificationRecipients(["a","b"],["b","c","actor"],"actor")).toEqual(["a","b","c"])});
  it("provides bounded activity pagination",()=>{expect(pageWindow(3,25)).toEqual({limit:25,offset:50});expect(pageWindow(0,500)).toEqual({limit:50,offset:0})});
  it("rejects unsupported entity types",()=>{expect(isSupportedEntity("opportunity")).toBe(true);expect(isSupportedEntity("invoice")).toBe(false)});
});
