"use client";
import {useActionState,useState} from "react";
import {useFormStatus} from "react-dom";
import {registerInternalUser,type RegistrationState} from "./actions";

const initialState:RegistrationState={ok:false,error:""};
function Submit(){const {pending}=useFormStatus();return <button type="submit" disabled={pending} aria-disabled={pending}>{pending?"Creating account…":"Create account"}</button>}
export function SignUpForm({invitationToken}:{invitationToken:string}){const [state,action]=useActionState(registerInternalUser,initialState);const [visible,setVisible]=useState(false);const error=(field:string)=>state.fieldErrors?.[field];return <>
  {state.error&&<p className="auth-error" role="alert">{state.error}</p>}
  <form action={action} noValidate>
    <input type="hidden" name="invitationToken" value={invitationToken}/>
    <label><span>Full name <b className="auth-required" aria-hidden="true">*</b></span><input name="fullName" autoComplete="name" required maxLength={100} aria-invalid={Boolean(error("fullName"))}/>{error("fullName")&&<small className="auth-field-error">{error("fullName")}</small>}</label>
    <label><span>Email address <b className="auth-required" aria-hidden="true">*</b></span><input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(error("email"))}/>{error("email")&&<small className="auth-field-error">{error("email")}</small>}</label>
    <label><span>Password <b className="auth-required" aria-hidden="true">*</b></span><span className="auth-password"><input name="password" type={visible?"text":"password"} autoComplete="new-password" required minLength={12} maxLength={128} aria-describedby="password-requirements"/><button type="button" onClick={()=>setVisible(value=>!value)} aria-pressed={visible}>{visible?"Hide":"Show"}</button></span><small id="password-requirements" className="auth-help">Use 12–128 characters.</small>{error("password")&&<small className="auth-field-error">{error("password")}</small>}</label>
    <label><span>Confirm password <b className="auth-required" aria-hidden="true">*</b></span><input name="confirmPassword" type={visible?"text":"password"} autoComplete="new-password" required minLength={12} maxLength={128} aria-invalid={Boolean(error("confirmPassword"))}/>{error("confirmPassword")&&<small className="auth-field-error">{error("confirmPassword")}</small>}</label>
    <label className="auth-check"><input name="termsAccepted" type="checkbox" required/><span>I acknowledge the internal testing terms and acceptable-use requirements. <b className="auth-required" aria-hidden="true">*</b></span></label>{error("termsAccepted")&&<small className="auth-field-error">{error("termsAccepted")}</small>}
    <Submit/>
  </form>
  </>}
