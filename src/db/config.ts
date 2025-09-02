import { defineConfig } from "drizzle-kit";
import { getConfigs } from "@/config";

const configs = getConfigs();

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  dialect: configs.databaseProvider as
    | "sqlite"
    | "postgresql"
    | "mysql"
    | "turso"
    | "singlestore"
    | "gel",
  dbCredentials: {
    url: configs.databaseUrl ?? "",
  },
});
