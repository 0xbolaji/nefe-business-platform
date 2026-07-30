import type { Metadata } from "next";
import BusinessesWorkspace from "./businesses-workspace";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
export const metadata: Metadata={title:"Businesses"};
export default async function BusinessesPage(){const context=await requireWorkspaceContext();return <BusinessesWorkspace canCreate={can(context.membership.role,"business.manage")}/>}
