import Resolver from "@forge/resolver";
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  console.log(payload);
  const worklogs = await getAllWorklogs();
  console.log('worklogs', worklogs);
});

export async function getAllWorklogs() {
  const worklogs = [];
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
    worklogs.push(...worklogsResults);
    isLast = lastPage;
    currentSince = until;
  } while (!isLast)

  return worklogs;
}

export const handler = resolver.getDefinitions();
