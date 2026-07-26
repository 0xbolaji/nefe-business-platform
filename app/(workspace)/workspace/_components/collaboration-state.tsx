"use client";

import { createContext, useCallback, useContext, useMemo, useState, useTransition, type ReactNode } from "react";
import {useRouter} from "next/navigation";
import type { Decision, OpportunityStage } from "../../_lib/models";
import type {WorkspaceData} from "@/app/lib/data/workspace-repository";
import {recordRecentlyViewed,toggleFavorite as persistFavorite,updateOpportunityStage,updateRecommendationStatus} from "@/app/lib/actions/workspace-mutations";

type FavoriteType = "business" | "campaign" | "opportunity" | "journey";
export type RecentItem = { id: string; type: FavoriteType; title: string; href: string; viewedAt: string };
type CollaborationContextValue = {
  data:WorkspaceData;
  favorites: Record<FavoriteType,string[]>;
  recentlyViewed: RecentItem[];
  recentSearches: string[];
  opportunityStages: Record<string,OpportunityStage>;
  recommendationStates: Record<string,"saved"|"dismissed"|"reviewing">;
  whatIfBusinessIds: string[];
  decisions: Decision[];
  toggleFavorite: (type:FavoriteType,id:string)=>void;
  isFavorite: (type:FavoriteType,id:string)=>boolean;
  recordView: (item:Omit<RecentItem,"viewedAt">)=>void;
  recordSearch: (query:string)=>void;
  moveOpportunity: (id:string,stage:OpportunityStage)=>void;
  setRecommendationState: (id:string,state:"saved"|"dismissed"|"reviewing")=>void;
  toggleWhatIfPartner: (id:string)=>void;
  resetWhatIf: ()=>void;
  addDecision: (decision:Omit<Decision,"id"|"createdAt">)=>void;
};
const emptyFavorites:Record<FavoriteType,string[]>={business:[],campaign:[],opportunity:[],journey:[]};
const CollaborationContext=createContext<CollaborationContextValue|null>(null);

export function CollaborationProvider({children,initialData}:{children:ReactNode;initialData:WorkspaceData}){
  const router=useRouter();
  const [,startTransition]=useTransition();
  const [favorites,setFavorites]=useState(initialData.favorites??emptyFavorites);
  const [recentlyViewed,setRecentlyViewed]=useState<RecentItem[]>(initialData.recentlyViewed);
  const [recentSearches,setRecentSearches]=useState<string[]>([]);
  const [opportunityStages,setOpportunityStages]=useState<Record<string,OpportunityStage>>(()=>Object.fromEntries(initialData.opportunities.map(item=>[item.id,item.stage])));
  const [recommendationStates,setRecommendationStates]=useState<Record<string,"saved"|"dismissed"|"reviewing">>(()=>Object.fromEntries(initialData.recommendations.filter(item=>item.status!=="OPEN").map(item=>[item.id,item.status==="SAVED"?"saved":item.status==="DISMISSED"?"dismissed":"reviewing"])));
  const [whatIfBusinessIds,setWhatIfBusinessIds]=useState<string[]>(()=>initialData.businesses.slice(0,4).map(item=>item.id));
  const [decisions,setDecisions]=useState<Decision[]>([]);
  const toggleFavorite=useCallback((type:FavoriteType,id:string)=>{setFavorites(current=>({...current,[type]:current[type].includes(id)?current[type].filter(item=>item!==id):[...current[type],id]}));startTransition(async()=>{await persistFavorite({entityType:type,entityId:id});router.refresh()})},[router]);
  const recordView=useCallback((item:Omit<RecentItem,"viewedAt">)=>{setRecentlyViewed(current=>[{...item,viewedAt:"Just now"},...current.filter(existing=>!(existing.id===item.id&&existing.type===item.type))].slice(0,8));startTransition(async()=>{await recordRecentlyViewed({entityType:item.type,entityId:item.id,title:item.title,href:item.href})})},[]);
  const recordSearch=useCallback((query:string)=>{const clean=query.trim();if(clean)setRecentSearches(current=>[clean,...current.filter(item=>item!==clean)].slice(0,6))},[]);
  const addDecision=useCallback((decision:Omit<Decision,"id"|"createdAt">)=>setDecisions(current=>[{...decision,id:`decision-${current.length+1}`,createdAt:"Just now"},...current].slice(0,20)),[]);
  const moveOpportunity=useCallback((id:string,stage:OpportunityStage)=>{setOpportunityStages(current=>({...current,[id]:stage}));addDecision({action:"Opportunity promoted",detail:`${initialData.opportunities.find(item=>item.id===id)?.title??id} moved to ${stage}.`,type:"opportunity"});startTransition(async()=>{await updateOpportunityStage({id,stage:stage.toUpperCase().replaceAll(" ","_")});router.refresh()})},[addDecision,initialData.opportunities,router]);
  const setRecommendationStateWithDecision=useCallback((id:string,state:"saved"|"dismissed"|"reviewing")=>{setRecommendationStates(current=>({...current,[id]:state}));addDecision({action:state==="dismissed"?"Partner dismissed":state==="reviewing"?"Recommendation accepted":"Recommendation saved",detail:`Recommendation ${id} is now ${state}.`,type:"recommendation"});startTransition(async()=>{await updateRecommendationStatus({id,status:state==="reviewing"?"REVIEWING":state.toUpperCase()});router.refresh()})},[addDecision,router]);
  const toggleWhatIfPartner=useCallback((id:string)=>{const removing=whatIfBusinessIds.includes(id);setWhatIfBusinessIds(removing?whatIfBusinessIds.filter(item=>item!==id):[...whatIfBusinessIds,id]);addDecision({action:removing?"Partner removed from scenario":"Partner added to scenario",detail:`${initialData.businesses.find(item=>item.id===id)?.name??id} ${removing?"removed from":"added to"} the temporary ecosystem.`,type:"partner"})},[addDecision,whatIfBusinessIds,initialData.businesses]);
  const resetWhatIf=useCallback(()=>setWhatIfBusinessIds(initialData.businesses.slice(0,4).map(item=>item.id)),[initialData.businesses]);
  const value=useMemo<CollaborationContextValue>(()=>({data:initialData,favorites,recentlyViewed,recentSearches,opportunityStages,recommendationStates,whatIfBusinessIds,decisions,toggleFavorite,isFavorite:(type,id)=>favorites[type].includes(id),recordView,recordSearch,moveOpportunity,setRecommendationState:setRecommendationStateWithDecision,toggleWhatIfPartner,resetWhatIf,addDecision}),[initialData,favorites,recentlyViewed,recentSearches,opportunityStages,recommendationStates,whatIfBusinessIds,decisions,toggleFavorite,recordView,recordSearch,moveOpportunity,setRecommendationStateWithDecision,toggleWhatIfPartner,resetWhatIf,addDecision]);
  return <CollaborationContext.Provider value={value}>{children}</CollaborationContext.Provider>;
}
export function useCollaboration(){const value=useContext(CollaborationContext);if(!value)throw new Error("useCollaboration must be used within CollaborationProvider");return value}
