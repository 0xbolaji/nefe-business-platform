import "server-only";
import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {serverEnv} from "@/app/lib/server-env";
import * as schema from "./schema";
let client:ReturnType<typeof postgres>|undefined;
export function database(){const url=serverEnv().DATABASE_URL;if(!url)throw new Error("Database unavailable. Configure DATABASE_URL and apply migrations.");client??=postgres(url,{max:10,prepare:false,connect_timeout:10});return drizzle(client,{schema})}
