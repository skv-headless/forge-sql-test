import Resolver from '@forge/resolver';
import {runSchemaMigration} from "../sql/migration"
import {fetchAndInsertAllWorklogs} from "../consumer";
import {db, queryForgeSql} from "../sql/db";


const resolver = new Resolver();

resolver.define('getWorklogs', async (req) => {
  const query = db('Worklogs');
  const results = await queryForgeSql(query)
  const countResponse = await queryForgeSql(query.count({ count: '* '}));

  return { results, count: countResponse.rows[0].count};
});

resolver.define('searchWorklogs', async (req) => {
  const { startAt, endAt } = req.payload;
  const query = db('Worklogs').whereBetween('started_at', [startAt, endAt]);

  const results = await queryForgeSql(query);
  const countResponse = await queryForgeSql(query.count({ count: '*' }));

  return { results, count: countResponse.rows[0].count };
});

resolver.define('runMigration', async (req) => {
  await runSchemaMigration();
  return {};
});

resolver.define('sqlDebug', async (req) => {
  return await queryForgeSql(req.payload.sql);
});

resolver.define('fetchWorklogs', async () => {
  await fetchAndInsertAllWorklogs();
});

export const handler = resolver.getDefinitions();
