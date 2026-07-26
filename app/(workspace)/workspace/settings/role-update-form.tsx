"use client";

import {useRef} from "react";
import {useFormStatus} from "react-dom";
import {updateMemberRoleForm} from "@/app/lib/actions/organization-form-actions";
import type {AppRole} from "@/app/lib/auth/types";

const roles:AppRole[]=["OWNER","ADMINISTRATOR","MANAGER","ANALYST","CONTRIBUTOR","VIEWER"];

function PendingIndicator(){const {pending}=useFormStatus();return <span className="sr-only" role="status" aria-live="polite">{pending?"Updating role":"Role ready"}</span>}

export default function RoleUpdateForm({memberId,role}:{memberId:string;role:AppRole}){
  const formRef=useRef<HTMLFormElement>(null);
  return <form ref={formRef} action={updateMemberRoleForm}>
    <input type="hidden" name="memberId" value={memberId}/>
    <label className="sr-only" htmlFor={`member-role-${memberId}`}>Member role</label>
    <select id={`member-role-${memberId}`} name="role" defaultValue={role} onChange={()=>formRef.current?.requestSubmit()}>
      {roles.map(item=><option key={item}>{item}</option>)}
    </select>
    <PendingIndicator/>
  </form>
}
