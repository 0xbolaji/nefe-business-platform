import Link from "next/link";
export default function WorkspaceBreadcrumbs({section,href,current}:{section:string;href:string;current:string}){return <nav className="ws-detail-breadcrumbs" aria-label="Breadcrumb"><Link href={href}>{section}</Link><span aria-hidden="true">›</span><span aria-current="page">{current}</span></nav>}
