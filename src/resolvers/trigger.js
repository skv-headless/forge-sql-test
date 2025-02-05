import { Queue } from '@forge/events';

const queue = new Queue({ key: 'worklog-fetch' });

export const onInstall = async (event) => {
  console.log('trigger event', event);

  await queue.push({something: 1111}, {delayInSeconds: 5});
}
