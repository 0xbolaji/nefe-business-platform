import "server-only";
import {createHmac,randomBytes} from "node:crypto";

export function createSecureToken(){return randomBytes(32).toString("base64url")}
export function hashSecureToken(token:string){const secret=process.env.AUTH_SECRET;if(!secret)throw new Error("Authentication security configuration is unavailable.");return createHmac("sha256",secret).update(token).digest("hex")}
export function tokenExpiry(minutes:number,now=new Date()){return new Date(now.getTime()+minutes*60_000)}
