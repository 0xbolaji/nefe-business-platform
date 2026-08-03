import Link from "next/link";
import {SignUpForm} from "./sign-up-form";
export const metadata={title:"Create account | NEFE"};
export default async function SignUpPage({searchParams}:{searchParams:Promise<{token?:string}>}){const {token=""}=await searchParams;return <main className="auth-page"><section className="auth-card"><Link href="/" className="auth-brand">NEFE</Link><div><span>Invitation access</span><h1>Create your NEFE account</h1><p>Use the secure invitation sent by your organization to create your account.</p></div>{token?<SignUpForm invitationToken={token}/>:<div className="auth-error" role="alert">A valid organization invitation link is required.</div>}<p className="auth-secondary">Already have an account? <Link href="/sign-in">Sign in</Link></p></section></main>}
