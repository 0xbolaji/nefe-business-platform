export const collaborationEntityTypes=["business","opportunity","campaign","journey","pilot","recommendation"] as const;
export type CollaborationEntityType=(typeof collaborationEntityTypes)[number];
export const collaborationEventTypes=["business.created","business.updated","opportunity.created","opportunity.status_changed","campaign.created","campaign.status_changed","journey.created","journey.updated","pilot.created","pilot.lifecycle_changed","recommendation.accepted","recommendation.rejected","assignment.created","assignment.removed","comment.added","comment.edited","comment.deleted","mention.created","entity.followed","entity.unfollowed"] as const;
export type CollaborationEventType=(typeof collaborationEventTypes)[number];

const summaries:Record<CollaborationEventType,string>={
  "business.created":"Business created",
  "business.updated":"Business updated",
  "opportunity.created":"Opportunity created",
  "opportunity.status_changed":"Opportunity status changed",
  "campaign.created":"Campaign created",
  "campaign.status_changed":"Campaign status changed",
  "journey.created":"Journey created",
  "journey.updated":"Journey updated",
  "pilot.created":"Pilot created",
  "pilot.lifecycle_changed":"Pilot lifecycle changed",
  "recommendation.accepted":"Recommendation accepted",
  "recommendation.rejected":"Recommendation rejected",
  "assignment.created":"User assigned",
  "assignment.removed":"Assignment removed",
  "comment.added":"Comment added",
  "comment.edited":"Comment edited",
  "comment.deleted":"Comment deleted",
  "mention.created":"User mentioned",
  "entity.followed":"Entity followed",
  "entity.unfollowed":"Entity unfollowed",
};
export function activityEvent(eventType:CollaborationEventType,entityType:CollaborationEntityType,entityId:string,metadata:Record<string,unknown>={}){return {eventType,entityType,entityId,summary:summaries[eventType],metadata}}

export function parseMentionEmails(body:string){const matches=body.matchAll(/(^|\s)@([a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+)/gi);return [...new Set([...matches].map(match=>match[2].toLowerCase()))]}
