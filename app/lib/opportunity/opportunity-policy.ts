export const OPPORTUNITY_STAGES=["IDENTIFIED","QUALIFIED","NEGOTIATING","APPROVED","PILOT","ACTIVE","COMPLETED"] as const;
export type OpportunityStageValue=(typeof OPPORTUNITY_STAGES)[number];

export const opportunityStageLabel=(stage:string)=>stage.toLowerCase().replaceAll("_"," ").replace(/(^|\s)\S/g,letter=>letter.toUpperCase());

export function deriveOpportunityHealth(input:{confidence:number;stage:string;recommendationCount:number}):"Strong"|"Developing"|"Needs attention"{
  if(input.confidence>=82&&["APPROVED","PILOT","ACTIVE","COMPLETED"].includes(input.stage))return "Strong";
  if(input.confidence<60||input.recommendationCount===0)return "Needs attention";
  return "Developing";
}
