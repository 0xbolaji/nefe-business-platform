import "next-auth";
import "@auth/core/jwt";
declare module "next-auth"{interface Session{user:{id:string;name?:string|null;email?:string|null;image?:string|null};authSessionId?:string}interface User{securityVersion?:number;authSessionId?:string;authExpiresAt?:number}}
declare module "@auth/core/jwt"{interface JWT{securityVersion?:number;authSessionId?:string;authExpiresAt?:number}}
