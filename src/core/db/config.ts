import { defineConfig } from 'drizzle-kit';

import { envConfigs } from '@/config';

export default defineConfig({
  out: envConfigs.db_migrations_out,
  schema: './src/config/db/schema.ts',
  dialect: envConfigs.database_provider as
    | 'sqlite'
    | 'postgresql'
    | 'mysql'
    | 'turso'
    | 'singlestore'
    | 'gel',
  dbCredentials: {
    url: envConfigs.database_url ?? '',
  },
  // Migration journal location (used by drizzle-kit migrate)
  migrations: {
    schema: envConfigs.db_migrations_schema,
    table: envConfigs.db_migrations_table,
  },
});
