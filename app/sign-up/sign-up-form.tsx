"use client";
import Link from "next/link";
import {useActionState,useEffect,useRef,useState} from "react";
import {useFormStatus} from "react-dom";
import {registerInternalUser,type RegistrationState} from "./actions";

const initialState:RegistrationState={ok:false,error:"",attempt:0};
function Submit(){const {pending}=useFormStatus();return <button type="submit" disabled={pending} aria-disabled={pending}>{pending?"Creating account…":"Create account"}</button>}
export function SignUpForm(){const [state,action]=useActionState(registerInternalUser,initialState);const codeRef=useRef<HTMLInputElement>(null);const [visible,setVisible]=useState(false);useEffect(()=>{if(codeRef.current)codeRef.current.value=""},[state.attempt]);const error=(field:keyof NonNullable<Extract<RegistrationState,{ok:false}>["fieldErrors"]>)=>!state.ok?state.fieldErrors?.[field]:undefined;return <>
  {!state.ok&&state.error&&<p className="auth-error" role="alert">{state.error}</p>}
  <form action={action} noValidate>
    <label><span>Full name</span><input name="fullName" autoComplete="name" required maxLength={100} aria-invalid={Boolean(error("fullName"))}/>{error("fullName")&&<small className="auth-field-error">{error("fullName")}</small>}</label>
    <label><span>Email address</span><input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(error("email"))}/>{error("email")&&<small className="auth-field-error">{error("email")}</small>}</label>
    <label><span>Password</span><span className="auth-password"><input name="password" type={visible?"text":"password"} autoComplete="new-password" required minLength={12} maxLength={128}/><button type="button" onClick={()=>setVisible(value=>!value)} aria-pressed={visible}>{visible?"Hide":"Show"}</button></span>{error("password")&&<small className="auth-field-error">{error("password")}</small>}</label>
    <label><span>Confirm password</span><input name="confirmPassword" type={visible?"text":"password"} autoComplete="new-password" required minLength={12} maxLength={128} aria-invalid={Boolean(error("confirmPassword"))}/>{error("confirmPassword")&&<small className="auth-field-error">{error("confirmPassword")}</small>}</label>
    <label><span>Internal invitation code</span><input ref={codeRef} name="invitationCode" type="password" autoComplete="off" required maxLength={256}/></label>
    <label className="auth-check"><input name="termsAccepted" type="checkbox" required/><span>I acknowledge the internal testing terms and acceptable-use requirements.</span></label>{error("termsAccepted")&&<small className="auth-field-error">{error("termsAccepted")}</small>}
    <Submit/>
  </form>
  <p className="auth-secondary">Already have an account? <Link href="/sign-in">Sign in</Link></p>
  </>}
