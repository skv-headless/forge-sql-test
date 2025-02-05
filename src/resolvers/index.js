import Resolver from '@forge/resolver';
import { runSchemaMigration } from "../sql/migration"
import sql, { migrationRunner } from '@forge/sql';

const resolver = new Resolver();

resolver.define('getText', async (req) => {
  const results = await sql
    .prepare(`SELECT * FROM Worklogs;`)
    .execute();

  return results;
});

resolver.define('runMigration', async (req) => {
  await runSchemaMigration();
  const results = await sql
    .prepare(`INSERT INTO Worklogs VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`)
    .bindParams(null, new Date(),new Date(), 60, "6098d58e2614ec00681605ea", 1, 1, 1, 1)
    .execute();

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();
