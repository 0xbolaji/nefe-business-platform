import {defineConfig} from "drizzle-kit";
export default defineConfig({schema:"./db/schema.ts",out:"./db/migrations",dialect:"postgresql",dbCredentials:{url:process.env.DATABASE_URL??"postgresql://nefe:nefe@localhost:5432/nefe"},strict:true,verbose:true});
