import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getConfigs } from "@/config";
import { db } from "@/db";
import * as schema from "@/db/schema";

const configs = getConfigs();

export const auth = betterAuth({
  database: drizzleAdapter(db(), {
    provider: getDatabaseProvider(),
    schema: schema,
  }),
  secret: configs.authSecret ?? "",
  socialProviders: getSocialProviders(),
});

function getDatabaseProvider(): "sqlite" | "pg" | "mysql" {
  switch (configs.databaseProvider) {
    case "sqlite":
      return "sqlite";
    case "postgresql":
      return "pg";
    case "mysql":
      return "mysql";
    default:
      throw new Error(
        `Unsupported database provider for auth: ${configs.databaseProvider}`
      );
  }
}

function getSocialProviders() {
  const providers: any = {};

  if (true) {
    providers.google = {
      clientId: configs.authGoogleId,
      clientSecret: configs.authGoogleSecret,
    };
  }

  if (true) {
    providers.github = {
      clientId: configs.authGithubId,
      clientSecret: configs.authGithubSecret,
    };
  }

  return providers;
}
