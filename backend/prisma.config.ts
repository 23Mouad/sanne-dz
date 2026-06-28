import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --project tsconfig.json -e esm prisma/seed.ts",
  },
  datasource: {
    // Direct URL for migrations (bypasses pgbouncer)
    url: process.env["DIRECT_URL"] ?? "postgresql://postgres.cljlemcyexknqtwxiuii:3XBSV775hGNUUKmv@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
  },
});
