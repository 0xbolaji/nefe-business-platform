import type {User} from "next-auth";
import type {JWT} from "@auth/core/jwt";

export type PersistedUserSecurity={id:string;disabledAt:Date|null;securityVersion:number};

type JwtInput={token:JWT;user?:User};
type SafeAuthenticationLog={event:string;category:string;userId?:string};
type JwtSecurityDependencies={lookupUser:(userId:string)=>Promise<PersistedUserSecurity|null>;log:(input:SafeAuthenticationLog)=>void;developmentDemo:()=>boolean};

export function createJwtSessionCallback(dependencies:JwtSecurityDependencies){
  return async({token,user}:JwtInput):Promise<JWT|null>=>{
    if(user?.id){token.sub=user.id;token.securityVersion=user.securityVersion;token.authSessionId=user.authSessionId;token.authExpiresAt=user.authExpiresAt}
    if(!token.sub)return null;
    if(dependencies.developmentDemo())return token;
    if(!token.authExpiresAt||token.authExpiresAt<=Date.now())return null;
    let current:PersistedUserSecurity|null;
    try{current=await dependencies.lookupUser(token.sub)}catch{
      dependencies.log({event:"authentication.database_unavailable",category:"user_security_lookup_failed",userId:token.sub});
      return null;
    }
    if(!authenticationStateIsValid(token.securityVersion,current)){
      dependencies.log({event:"authentication.session_rejected",category:current?.disabledAt?"disabled_account":current?"security_version_mismatch":"missing_account",userId:current?.id??token.sub});
      return null;
    }
    return token;
  };
}

export function authenticationStateIsValid(tokenVersion:number|undefined,user:PersistedUserSecurity|null){
  return Boolean(user&&!user.disabledAt&&Number.isInteger(tokenVersion)&&tokenVersion===user.securityVersion);
}

export type ActiveMembershipCandidate={organizationId:string;role:string;status:string};

export function selectActiveMembership<T extends ActiveMembershipCandidate>(members:T[],requestedOrganizationId?:string){
  const active=members.filter(member=>member.status==="ACTIVE");
  return active.find(member=>member.organizationId===requestedOrganizationId)??active[0]??null;
}

export function administrativeAccountActionAllowed(input:{actorRole:string;targetRole:string;isSelf:boolean;activeOwnerCount:number;outsideActiveMemberships:number;global:boolean}){
  if(input.actorRole!=="OWNER"&&input.actorRole!=="ADMINISTRATOR")return false;
  if(input.isSelf)return false;
  if(input.actorRole==="ADMINISTRATOR"&&input.targetRole==="OWNER")return false;
  if(input.targetRole==="OWNER"&&input.activeOwnerCount<=1)return false;
  if(input.global&&input.outsideActiveMemberships>0)return false;
  return true;
}
