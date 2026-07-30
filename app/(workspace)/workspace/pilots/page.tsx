import type { Metadata } from "next";
import PilotPortfolio from "./pilot-portfolio";
import {requireWorkspaceContext} from "@/app/lib/auth/workspace-context";
import {can} from "@/app/lib/auth/permissions";
export const metadata:Metadata={title:"Pilots"};
export default async function PilotsPage(){const context=await requireWorkspaceContext();return <PilotPortfolio canCreate={can(context.membership.role,"pilot.create")}/>}
