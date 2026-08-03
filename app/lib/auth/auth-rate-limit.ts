import "server-only";
import {createHmac} from "node:crypto";
import {lt,sql} from "drizzle-orm";
import {database} from "@/db/client";
import {authRateLimits} from "@/db/schema";

export async function consumeAuthRateLimit(scope:string,identifier:string,limit=5,windowMinutes=15){
  const secret=process.env.AUTH_SECRET;if(!secret||!process.env.DATABASE_URL)return false;
  const keyHash=createHmac("sha256",secret).update(identifier.trim().toLowerCase()).digest("hex");
  const now=new Date(),windowStartedAt=new Date(now.getTime()-windowMinutes*60_000),expiresAt=new Date(now.getTime()+windowMinutes*60_000);
  return database().transaction(async tx=>{
    await tx.delete(authRateLimits).where(lt(authRateLimits.expiresAt,now));
    const [row]=await tx.insert(authRateLimits).values({scope,keyHash,windowStartedAt:now,expiresAt}).onConflictDoUpdate({target:[authRateLimits.scope,authRateLimits.keyHash],set:{attemptCount:sql`case when ${authRateLimits.windowStartedAt} < ${windowStartedAt} then 1 else ${authRateLimits.attemptCount} + 1 end`,windowStartedAt:sql`case when ${authRateLimits.windowStartedAt} < ${windowStartedAt} then ${now} else ${authRateLimits.windowStartedAt} end`,expiresAt,updatedAt:now}}).returning({count:authRateLimits.attemptCount});
    return Boolean(row&&row.count>limit);
  });
}
