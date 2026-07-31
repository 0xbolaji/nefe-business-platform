import "server-only";

type SafeLog={event:string;category:string;userId?:string;organizationId?:string;entityType?:string;entityId?:string};

export function logServerFailure(input:SafeLog){
  console.error(JSON.stringify({...input,timestamp:new Date().toISOString()}));
}
