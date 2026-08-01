import Link from "next/link";
import {AppCard,SectionHeader} from "./ui";

export type NextAction={label:string;href:string;description:string;primary?:boolean;disabledReason?:string};

export default function NextActions({actions}:{actions:NextAction[]}){
  return <section className="ws-section-gap" aria-labelledby="next-actions-title"><AppCard><SectionHeader title="Next Actions" description="Continue this commercial workflow using the current record context."/><div className="ws-next-actions">{actions.map(action=>action.disabledReason?<div className="ws-next-action disabled" key={action.label}><strong>{action.label}</strong><p>{action.disabledReason}</p></div>:<Link className={`ws-next-action ${action.primary?"primary":""}`} href={action.href} key={action.label}><strong>{action.label} →</strong><p>{action.description}</p></Link>)}</div></AppCard></section>
}
