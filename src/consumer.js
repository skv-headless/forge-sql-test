import Resolver from "@forge/resolver";
import api, { route } from '@forge/api';
import sql, { migrationRunner } from '@forge/sql';

const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  console.log(payload);
  const worklogs = await getAllWorklogs();
  console.log('worklogs', worklogs);
});

export async function getAllWorklogs() {
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

    const toTimestamp = (date) => date.replace("T", " ").replace("t", " ").split("+")[0].split('.')[0];

    const worklogValues = worklogsResults.map((worklog) => {
      const { updated, started, timeSpentSeconds, author, issueId, id } = worklog;
      return `('${toTimestamp(updated)}', '${toTimestamp(started)}', ${timeSpentSeconds}, '${author.accountId}', 1, ${issueId}, 1, ${id})`
    });

    //console.log(`REPLACE INTO Worklogs (jira_updated, started_at, time_spent_seconds, author_id, dataset_id, issue_id, local_project_id, worklog_id) VALUES ${worklogValues.join(", ")}`);
    await sql.executeRaw(`REPLACE INTO Worklogs (jira_updated, started_at, time_spent_seconds, author_id, dataset_id, issue_id, local_project_id, worklog_id) VALUES ${worklogValues.join(", ")}`)

    isLast = lastPage;
    currentSince = until;
  } while (!isLast)

  return {};
}

export const handler = resolver.getDefinitions();
