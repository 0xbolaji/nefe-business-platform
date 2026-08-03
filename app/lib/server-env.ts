import "server-only";
import {z} from "zod";
const optionalValue=<T extends z.ZodType>(value:T)=>z.preprocess(input=>input===""?undefined:input,value.optional());
const schema=z.object({DATABASE_URL:z.string().url().startsWith("postgresql://").optional(),AUTH_SECRET:z.string().min(32).optional(),AUTH_URL:z.string().url().optional(),NEFE_APP_URL:z.string().url().optional(),NEFE_DEMO_AUTH_ENABLED:z.enum(["true","false"]).default("false"),NEFE_DEMO_EMAIL:z.string().email().default("owner@nefe.local"),NEFE_DEMO_PASSWORD:z.string().min(12).optional(),RESEND_API_KEY:optionalValue(z.string().min(10)),NEFE_EMAIL_FROM:optionalValue(z.string().email()),AUTH_GOOGLE_ID:z.string().optional(),AUTH_GOOGLE_SECRET:z.string().optional()});
export type ServerEnv=z.infer<typeof schema>;
let cached:ServerEnv|undefined;
export function serverEnv(){if(cached)return cached;const parsed=schema.safeParse(process.env);if(!parsed.success)throw new Error(`Invalid server configuration: ${parsed.error.issues.map(issue=>issue.path.join(".")).join(", ")}`);if(process.env.NODE_ENV==="production"&&(!parsed.data.DATABASE_URL||!parsed.data.AUTH_SECRET))throw new Error("DATABASE_URL and AUTH_SECRET are required in production.");if(process.env.NODE_ENV==="production"&&parsed.data.NEFE_DEMO_AUTH_ENABLED==="true")throw new Error("NEFE_DEMO_AUTH_ENABLED must be false in production.");cached=parsed.data;return cached}
export function databaseConfigured(){return Boolean(process.env.DATABASE_URL)}
