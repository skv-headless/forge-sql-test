import Resolver from "@forge/resolver";
import api, { route } from '@forge/api';

const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  console.log(payload);

  const result = await api
      .asApp()
      .requestJira(route`rest/api/3/worklog/updated?since=0`);

  const status = result.status;

  console.log(status);

  const data = await result.json();
  console.log('==data', data);
});

export const handler = resolver.getDefinitions();
