import Resolver from "@forge/resolver";
import api, {route} from '@forge/api';
import {db, queryForgeSql, toTimestamp} from "./sql/db";

const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  console.log(payload);
  await fetchAndInsertAllWorklogs();
});

export async function fetchAndInsertAllWorklogs() {
  let isLast = false;
  let currentSince = 0;

  do {
    const result = await api
        .asApp()
        .requestJira(route`rest/api/3/worklog/updated?since=${currentSince}`);
    const data = await result.json();
    const { values, until, lastPage } = data;

    const worklogsResponse = await api
        .asApp()
        .requestJira(route`/rest/api/3/worklog/list`, {
          method: "POST",
          body: JSON.stringify({ ids: values.map(value => value.worklogId) })
        });

    const worklogsResults = await worklogsResponse.json();

    const inserts = worklogsResults.map(worklog => ({
      jira_updated: toTimestamp(worklog.updated),
      started_at: toTimestamp(worklog.started),
      time_spent_seconds: worklog.timeSpentSeconds,
      author_id: worklog.author.accountId,
      dataset_id: 1,
      issue_id: worklog.issueId,
      local_project_id: 1,
      worklog_id: worklog.id
    }));

    const insertQuery = db('Worklogs').insert(inserts).onConflict('worklog_id').merge();
    await queryForgeSql(insertQuery)

    isLast = lastPage;
    currentSince = until;
  } while (!isLast)

  return {};
}

export const handler = resolver.getDefinitions();
