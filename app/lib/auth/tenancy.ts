export function belongsToOrganization(resource:{organizationId:string}|null|undefined,organizationId:string){return Boolean(resource&&resource.organizationId===organizationId)}
