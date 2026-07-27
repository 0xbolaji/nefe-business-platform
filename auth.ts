import NextAuth from "next-auth";
import type {NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import {compare} from "bcryptjs";
import {sql} from "drizzle-orm";
import {z} from "zod";
import {database} from "@/db/client";
import {users} from "@/db/schema";

const credentialInput=z.object({email:z.string().trim().toLowerCase().email(),password:z.string().min(12).max(128)});
const credentialProvider=Credentials({
  name:"NEFE development credentials",
  credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},
  async authorize(raw){
    const parsed=credentialInput.safeParse(raw);
    if(!parsed.success)return null;
    const demoEnabled=process.env.NODE_ENV!=="production"&&process.env.NEFE_DEMO_AUTH_ENABLED==="true";
    if(demoEnabled&&parsed.data.email===process.env.NEFE_DEMO_EMAIL?.toLowerCase()&&process.env.NEFE_DEMO_PASSWORD&&parsed.data.password===process.env.NEFE_DEMO_PASSWORD){return {id:"00000000-0000-4000-8000-000000000001",email:parsed.data.email,name:"Demo Owner"}}
    if(!process.env.DATABASE_URL)return null;
    const [user]=await database().select({id:users.id,name:users.name,email:users.email,passwordHash:users.passwordHash,disabledAt:users.disabledAt}).from(users).where(sql`lower(${users.email}) = ${parsed.data.email}`).limit(1);
    if(!user?.passwordHash||user.disabledAt||!(await compare(parsed.data.password,user.passwordHash)))return null;
    return {id:user.id,email:user.email,name:user.name};
  },
});
const providers:NextAuthConfig["providers"]=[credentialProvider];
if(process.env.AUTH_GOOGLE_ID&&process.env.AUTH_GOOGLE_SECRET)providers.push(Google({clientId:process.env.AUTH_GOOGLE_ID,clientSecret:process.env.AUTH_GOOGLE_SECRET}));

export const {handlers,auth,signIn,signOut}=NextAuth({
  providers,
  secret:process.env.AUTH_SECRET,
  session:{strategy:"jwt",maxAge:60*60*8},
  pages:{signIn:"/sign-in",error:"/sign-in"},
  callbacks:{
    authorized({auth,request}){return !request.nextUrl.pathname.startsWith("/workspace")||Boolean(auth?.user)},
    jwt({token,user}){if(user?.id)token.sub=user.id;return token},
    session({session,token}){if(session.user&&token.sub)session.user.id=token.sub;return session},
  },
  cookies:{sessionToken:{name:process.env.NODE_ENV==="production"?"__Secure-nefe.session-token":"nefe.session-token",options:{httpOnly:true,sameSite:"lax",path:"/",secure:process.env.NODE_ENV==="production"}}},
});
