import type { Metadata } from "next";
import BusinessesWorkspace from "./businesses-workspace";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
import {getBusinessDirectoryReferences,listBusinessSummaries} from "@/app/lib/data/business-repository";
export const metadata: Metadata={title:"Businesses"};
export default async function BusinessesPage(){const context=await requireWorkspaceContext(),[businesses,references]=await Promise.all([listBusinessSummaries(context),getBusinessDirectoryReferences()]);return <BusinessesWorkspace businesses={businesses} industries={references.industries} regions={references.regions} canCreate={can(context.membership.role,"business.manage")}/>}
