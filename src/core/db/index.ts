import { envConfigs } from '@/config';

import { closePostgresDb, getPostgresDb } from './postgres';
import { getSqliteDb } from './sqlite';

/**
 * Universal DB accessor.
 *
 * Drizzle returns different DB types for Postgres vs SQLite/libsql.
 * If we return a union here, TypeScript can't call methods like `db().insert(...)`
 * because the overloads are incompatible across dialects.
 *
 * So we intentionally return `any` to keep call sites stable.
 */
export function db(): any {
  if (['sqlite', 'turso'].includes(envConfigs.database_provider)) {
    return getSqliteDb() as any;
  }

  return getPostgresDb() as any;
}

export function dbPg(): ReturnType<typeof getPostgresDb> {
  if (envConfigs.database_provider !== 'postgresql') {
    throw new Error('Database provider is not PostgreSQL');
  }

  return getPostgresDb();
}

export function dbSqlite(): ReturnType<typeof getSqliteDb> {
  if (!['sqlite', 'turso'].includes(envConfigs.database_provider)) {
    throw new Error('Database provider is not SQLite');
  }

  return getSqliteDb();
}

export async function closeDb() {
  if (envConfigs.database_provider !== 'postgresql') {
    return;
  }

  // Only for postgres
  await closePostgresDb();
}
