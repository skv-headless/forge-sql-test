import { Queue } from '@forge/events';
import { runSchemaMigration } from "../sql/migration"

const queue = new Queue({ key: 'worklog-fetch' });

export const onInstall = async (event) => {
  console.log('trigger event', event);

  await runSchemaMigration();
  await queue.push({something: 1111}, {delayInSeconds: 5});
}
