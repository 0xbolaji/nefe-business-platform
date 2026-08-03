import type { Metadata } from "next";
import SettingsWorkspace from "./settings-workspace";
import PersistedAdministration from "./persisted-administration";
import InvitationManager from "./invitation-manager";
export const metadata:Metadata={title:"Settings"};
export default function SettingsPage(){return <><SettingsWorkspace/><PersistedAdministration/><InvitationManager/></>}
