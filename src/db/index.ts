import { drizzle } from "drizzle-orm/libsql";
import { getConfigs } from "@/config";

export function db() {
  const configs = getConfigs();

  if (!configs.databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  return drizzle({ connection: { url: configs.databaseUrl } });
}
