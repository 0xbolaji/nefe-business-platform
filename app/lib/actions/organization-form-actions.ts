"use server";
import {updateMemberRole,updateWorkspaceSettings} from "./organization-mutations";
export async function updateMemberRoleForm(formData:FormData){await updateMemberRole({memberId:formData.get("memberId"),role:formData.get("role")})}
export async function updateWorkspaceSettingsForm(formData:FormData){await updateWorkspaceSettings({name:formData.get("name"),timezone:formData.get("timezone"),appearance:formData.get("appearance")})}
