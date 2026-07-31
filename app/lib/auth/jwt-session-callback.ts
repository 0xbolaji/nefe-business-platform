import type {NextAuthConfig} from "next-auth";
import {eq} from "drizzle-orm";
import {database} from "../../../db/client";
import {users} from "../../../db/schema";
import {logServerFailure} from "../observability/server-log";
import {createJwtSessionCallback} from "./session-security-policy";

export const jwtSessionCallback:NonNullable<NextAuthConfig["callbacks"]>["jwt"]=createJwtSessionCallback({
  developmentDemo:()=>process.env.NODE_ENV!=="production"&&process.env.NEFE_DEMO_AUTH_ENABLED==="true"&&!process.env.DATABASE_URL,
  async lookupUser(userId){
    if(!process.env.DATABASE_URL)throw new Error("Database unavailable");
    const [current]=await database().select({id:users.id,disabledAt:users.disabledAt,securityVersion:users.securityVersion}).from(users).where(eq(users.id,userId)).limit(1);
    return current??null;
  },
  log:logServerFailure,
});
