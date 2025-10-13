export type ConfigMap = Record<string, string>;

export const envConfigs = {
  app_url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  app_name: process.env.NEXT_PUBLIC_APP_NAME ?? "",
  default_theme: process.env.NEXT_PUBLIC_DEFAULT_THEME ?? "system",
  theme: process.env.NEXT_PUBLIC_THEME ?? "default",
  appearance: process.env.NEXT_PUBLIC_APPEARANCE ?? "system",
  adsense_code: process.env.NEXT_PUBLIC_ADSENSE_CODE ?? "",
  database_url: process.env.DATABASE_URL ?? "",
  database_provider: process.env.DATABASE_PROVIDER ?? "postgresql",
  // Database singleton mode (default: true for traditional servers, set to false for serverless)
  db_singleton_enabled: process.env.DB_SINGLETON_ENABLED || "false",
  auth_url: process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "",
  auth_secret: process.env.AUTH_SECRET ?? "", // openssl rand -base64 32
  default_locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en",
};
