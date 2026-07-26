"use client";

import { useEffect } from "react";
import { useCollaboration, type RecentItem } from "./collaboration-state";

export function FavoriteButton({type,id}:{type:RecentItem["type"];id:string}){const {isFavorite,toggleFavorite}=useCollaboration();const active=isFavorite(type,id);return <button type="button" className={`ws-favorite ${active?"active":""}`} onClick={()=>toggleFavorite(type,id)} aria-pressed={active} aria-label={`${active?"Remove from":"Add to"} favorites`}>{active?"★":"☆"}</button>}
export function ViewTracker({type,id,title,href}:{type:RecentItem["type"];id:string;title:string;href:string}){const {recordView}=useCollaboration();useEffect(()=>recordView({type,id,title,href}),[recordView,type,id,title,href]);return null}
