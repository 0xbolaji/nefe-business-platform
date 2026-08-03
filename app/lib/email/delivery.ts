import "server-only";
import {serverEnv} from "../server-env";

export class EmailDeliveryUnavailableError extends Error{}
type AuthEmail={to:string;subject:string;heading:string;body:string;actionLabel:string;actionUrl:string};
export async function sendAuthenticationEmail(input:AuthEmail){
  const env=serverEnv();
  if(!env.RESEND_API_KEY||!env.NEFE_EMAIL_FROM)throw new EmailDeliveryUnavailableError("Email delivery is not configured.");
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:env.NEFE_EMAIL_FROM,to:[input.to],subject:input.subject,html:`<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>${escapeHtml(input.heading)}</h1><p>${escapeHtml(input.body)}</p><p><a href="${escapeAttribute(input.actionUrl)}" style="display:inline-block;background:#5e3bee;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none">${escapeHtml(input.actionLabel)}</a></p><p style="color:#746d7a;font-size:13px">If you did not request this, you can ignore this email.</p></div>`})});
  if(!response.ok)throw new EmailDeliveryUnavailableError("Email delivery failed.");
}
export function applicationUrl(){const env=serverEnv();return (env.NEFE_APP_URL??env.AUTH_URL??"http://localhost:3000").replace(/\/$/,"")}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]??char)}
function escapeAttribute(value:string){return escapeHtml(value)}
