import Resolver from '@forge/resolver';
import { runSchemaMigration } from "../sql/migration"
import sql, { migrationRunner } from '@forge/sql';
import {getAllWorklogs} from "../consumer";

const resolver = new Resolver();

resolver.define('getWorklogs', async (req) => {
  const results = await sql
    .prepare(`SELECT * FROM Worklogs;`)
    .execute();
  const countResponse = await sql
    .prepare(`SELECT COUNT(*) FROM Worklogs;`)
    .execute();

  return { results, count: countResponse.rows[0]['COUNT(*)'] };
});

resolver.define('searchWorklogs', async (req) => {
  const { startAt, endAt } = req.payload;

  const results = await sql
      .prepare(`SELECT * FROM Worklogs WHERE started_at BETWEEN '${startAt}' AND '${endAt}';`)
      .execute();
  const countResponse = await sql
      .prepare(`SELECT COUNT(*) FROM Worklogs WHERE started_at BETWEEN '${startAt}' AND '${endAt}';`)
      .execute();

  return { results, count: countResponse.rows[0]['COUNT(*)'] };
});

resolver.define('runMigration', async (req) => {
  await runSchemaMigration();

  return 'Hello, world!';
});

resolver.define('fetchWorklogs', async () => {
  const worklogs = await getAllWorklogs();
});

export const handler = resolver.getDefinitions();
