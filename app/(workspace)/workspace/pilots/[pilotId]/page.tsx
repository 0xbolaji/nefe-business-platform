import PilotDetail from "./pilot-detail";
export default async function PilotDetailPage({params}:{params:Promise<{pilotId:string}>}){const {pilotId}=await params;return <PilotDetail pilotId={pilotId}/>}
