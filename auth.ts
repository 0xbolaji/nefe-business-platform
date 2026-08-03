import NextAuth from "next-auth";
import type {NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import {compare} from "bcryptjs";
import {sql} from "drizzle-orm";
import {z} from "zod";
import {database} from "@/db/client";
import {users} from "@/db/schema";
import {logServerFailure} from "@/app/lib/observability/server-log";
import {jwtSessionCallback} from "@/app/lib/auth/jwt-session-callback";
import {registerAuthenticationSession} from "@/app/lib/auth/session-registry";
import {REMEMBERED_SESSION_SECONDS} from "@/app/lib/auth/session-duration-policy";
import {consumeAuthRateLimit} from "@/app/lib/auth/auth-rate-limit";

const credentialInput=z.object({email:z.string().trim().toLowerCase().email(),password:z.string().min(12).max(128),rememberMe:z.union([z.literal("on"),z.literal("true")]).optional()});
const credentialProvider=Credentials({
  name:"NEFE development credentials",
  credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"},rememberMe:{label:"Remember me",type:"checkbox"}},
  async authorize(raw,request){
    const parsed=credentialInput.safeParse(raw);
    if(!parsed.success)return null;
    const demoEnabled=process.env.NODE_ENV!=="production"&&process.env.NEFE_DEMO_AUTH_ENABLED==="true"&&!process.env.DATABASE_URL;
    if(demoEnabled&&parsed.data.email===process.env.NEFE_DEMO_EMAIL?.toLowerCase()&&process.env.NEFE_DEMO_PASSWORD&&parsed.data.password===process.env.NEFE_DEMO_PASSWORD){return {id:"00000000-0000-4000-8000-000000000001",email:parsed.data.email,name:"Demo Owner"}}
    if(!process.env.DATABASE_URL)return null;
    if(await consumeAuthRateLimit("credentials_login",parsed.data.email,10,15)){logServerFailure({event:"authentication.failed",category:"rate_limited"});return null}
    const [user]=await database().select({id:users.id,name:users.name,email:users.email,emailVerified:users.emailVerified,passwordHash:users.passwordHash,disabledAt:users.disabledAt,securityVersion:users.securityVersion}).from(users).where(sql`lower(${users.email}) = ${parsed.data.email}`).limit(1);
    if(!user?.passwordHash||user.disabledAt||!user.emailVerified||!(await compare(parsed.data.password,user.passwordHash))){logServerFailure({event:"authentication.failed",category:user?.disabledAt?"disabled_account":!user?.emailVerified?"unverified_account":"invalid_credentials",userId:user?.id});return null}
    const remembered=parsed.data.rememberMe!==undefined,location=[request.headers.get("x-vercel-ip-city"),request.headers.get("x-vercel-ip-country")].filter(Boolean).join(", ");
    const registered=await registerAuthenticationSession({userId:user.id,rememberMe:remembered,userAgent:request.headers.get("user-agent"),location});
    return {id:user.id,email:user.email,name:user.name,securityVersion:user.securityVersion,authSessionId:registered.id,authExpiresAt:registered.expiresAt};
  },
});
const providers:NextAuthConfig["providers"]=[credentialProvider];
if(process.env.AUTH_GOOGLE_ID&&process.env.AUTH_GOOGLE_SECRET)providers.push(Google({clientId:process.env.AUTH_GOOGLE_ID,clientSecret:process.env.AUTH_GOOGLE_SECRET}));

export const {handlers,auth,signIn,signOut}=NextAuth({
  providers,
  secret:process.env.AUTH_SECRET,
  session:{strategy:"jwt",maxAge:REMEMBERED_SESSION_SECONDS},
  pages:{signIn:"/sign-in",error:"/sign-in"},
  callbacks:{
    authorized({auth,request}){return !request.nextUrl.pathname.startsWith("/workspace")||Boolean(auth?.user)},
    jwt:jwtSessionCallback,
    session({session,token}){if(session.user&&token.sub)session.user.id=token.sub;session.authSessionId=token.authSessionId;return session},
  },
  cookies:{sessionToken:{name:process.env.NODE_ENV==="production"?"__Secure-nefe.session-token":"nefe.session-token",options:{httpOnly:true,sameSite:"lax",path:"/",secure:process.env.NODE_ENV==="production"}}},
});
