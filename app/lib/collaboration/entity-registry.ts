import type {CollaborationEntityType} from "./domain-events";

export const collaborationEntityRegistry:Record<CollaborationEntityType,{label:string;route:(id:string)=>string}>={
  business:{label:"Business",route:id=>`/workspace/businesses/${id}`},
  opportunity:{label:"Opportunity",route:id=>`/workspace/opportunities/${id}`},
  campaign:{label:"Campaign",route:id=>`/workspace/campaigns/${id}`},
  journey:{label:"Journey",route:id=>`/workspace/journeys/${id}`},
  pilot:{label:"Pilot",route:id=>`/workspace/pilots/${id}`},
  recommendation:{label:"Recommendation",route:()=>"/workspace/recommendations"},
};
export function entityRoute(type:CollaborationEntityType,id:string){return collaborationEntityRegistry[type].route(id)}
