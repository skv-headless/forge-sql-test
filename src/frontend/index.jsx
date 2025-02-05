import React, { useEffect, useState } from 'react';
import ForgeReconciler, {Button, Text} from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  if (!data) return 'Loading...'

  return (
    <>
      <Text>Hello world!</Text>
      <Button onClick={() => invoke('fetchWorklogs')}>Fetch</Button>
      {data.rows.map((worklog) => {
        return <Text>{worklog.id} {worklog.author_id}</Text>;
      })}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
