import { Queue } from '@forge/events';
import { runSchemaMigration } from "../sql/migration"
import sql, { migrationRunner } from '@forge/sql';

const queue = new Queue({ key: 'worklog-fetch' });

export const onInstall = async (event) => {
  console.log('trigger event', event);

  await runSchemaMigration();
  await queue.push({something: 1111}, {delayInSeconds: 5});
}

export const onWorklogCreate = async (event) => {
  const {updated, started, timeSpentSeconds, author, issueId, id} = event.worklog;

  const toTimestamp = (date) => date.replace("T", " ").replace("t", " ").split("+")[0].split('.')[0];

  //console.log(updated, started);
  //console.log(toTimestamp(updated), toTimestamp(started), timeSpentSeconds, author.accountId, 1, issueId, 1, id);
  const countResponse = await sql
    .prepare("INSERT INTO Worklogs (jira_updated, started_at, time_spent_seconds, author_id, dataset_id, issue_id, local_project_id, worklog_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .bindParams(toTimestamp(updated), toTimestamp(started), timeSpentSeconds, author.accountId, 1, issueId, 1, id)
    .execute();
}
