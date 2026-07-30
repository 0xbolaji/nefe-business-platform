"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import {getAvailableWorkspaces} from "@/app/lib/auth/workspace-context";

export async function switchWorkspace(input:unknown){const id=z.string().uuid().parse(input),available=await getAvailableWorkspaces();if(!available.some(item=>item.id===id))throw new Error("Workspace unavailable");(await cookies()).set("nefe-active-organization",id,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/"});redirect("/workspace/dashboard")}
