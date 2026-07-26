import Link from "next/link";
export default function AccessDeniedPage(){return <main className="auth-page"><section className="auth-card"><span>Access denied</span><h1>This workspace is unavailable.</h1><p>Your membership is disabled, removed, or does not have permission to access this resource.</p><Link className="auth-link" href="/">Return to NEFE</Link></section></main>}
