import Link from "next/link";
import {SignUpForm} from "./sign-up-form";
export const metadata={title:"Create account | NEFE"};
export default function SignUpPage(){return <main className="auth-page"><section className="auth-card"><Link href="/" className="auth-brand">NEFE</Link><div><span>Internal access</span><h1>Create your NEFE account</h1><p>Join the designated internal testing workspace with your individual credentials.</p></div><SignUpForm/></section></main>}
