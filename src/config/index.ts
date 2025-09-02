import "dotenv/config";
import { config } from "dotenv";

export function getConfigs() {
  // client side
  if (typeof window !== "undefined") {
    return {};
  }

  // server side
  config({ path: ".env" });
  config({ path: ".env.local" });
  config({ path: ".env.development" });
  config({ path: ".env.production" });

  // database
  const databaseProvider = process.env.DATABASE_PROVIDER || "sqlite";
  const databaseUrl = process.env.DATABASE_URL || "";

  // auth
  const authUrl = process.env.AUTH_URL || "";
  const authSecret = process.env.AUTH_SECRET || "";

  // auth: google
  const authGoogleId = process.env.AUTH_GOOGLE_ID || "";
  const authGoogleSecret = process.env.AUTH_GOOGLE_SECRET || "";

  // auth: github
  const authGithubId = process.env.AUTH_GITHUB_ID || "";
  const authGithubSecret = process.env.AUTH_GITHUB_SECRET || "";

  return {
    databaseProvider,
    databaseUrl,
    authUrl,
    authSecret,
    authGoogleId,
    authGoogleSecret,
    authGithubId,
    authGithubSecret,
  };
}
