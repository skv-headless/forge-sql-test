import React, { useEffect, useState } from 'react';
import ForgeReconciler, {Button, Text} from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    invoke('getWorklogs').then(setData);
  }, []);

  if (!data) return 'Loading...'

  return (
    <>
      <Text>Count: {data.count}</Text>
      <Button onClick={() => invoke('fetchWorklogs')}>Fetch</Button>
      <Button onClick={() => invoke('runMigration')}>Migrate</Button>

      {data.results.rows.map((worklog) => {
        return <Text>{worklog.worklog_id} {worklog.started_at}</Text>;
      })}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
