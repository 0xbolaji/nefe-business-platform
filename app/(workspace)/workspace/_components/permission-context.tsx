"use client";
import {createContext,useContext,type ReactNode} from "react";
type CreationPermissions={business:boolean;opportunity:boolean;campaign:boolean;journey:boolean;pilot:boolean};
const PermissionContext=createContext<CreationPermissions>({business:false,opportunity:false,campaign:false,journey:false,pilot:false});
export function PermissionProvider({value,children}:{value:CreationPermissions;children:ReactNode}){return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>}
export function useCreationPermissions(){return useContext(PermissionContext)}
