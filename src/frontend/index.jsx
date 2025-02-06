import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
    Button,
    Text,
    DatePicker,
    Inline,
    DynamicTable,
    InlineEdit,
    Textfield,
    Box,
    xcss,
    Stack
} from '@forge/react';
import { invoke } from '@forge/bridge';


const getHeader = () => (
    { cells: [
            {
                key: 'Id',
                content: <Text>Worklog Id</Text>,
                width: 16,
            },
            {
                key: 'issueId',
                content: <Text>Issue Id</Text>,
                width: 16,
            },
            {
                key: 'timeSpent',
                content: <Text>Time Spent</Text>,
                width: 16,
            },
            {
                key: 'startAt',
                content: <Text>Start at</Text>,
                width: 20,
            }
        ]});

const App = () => {
  const [startAt, setStartAt] = useState('2025-02-01 00:00:00');
  const [endAt, setEndAt] = useState('2025-02-06 00:00:00');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    invoke('searchWorklogs', { startAt, endAt }).then(setData).then(() => setIsLoading(false));
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    invoke('searchWorklogs', { startAt, endAt }).then(setData).then(() => setIsLoading(false));
  }

  if (!data) return 'Loading...'

    const rows = data.results.rows.map((worklog) => ({ key: worklog.worklog_id, cells: [
            {
                key: worklog.worklog_id,
                content: <Text>{worklog.worklog_id}</Text>,
            },
            {
                key: worklog.issue_id,
                content: <Text>{worklog.issue_id}</Text>,
            },
            {
                key: worklog.time_spent_seconds,
                content: <Text>{worklog.time_spent_seconds}</Text>,
            },
            {
                key: worklog.started_at,
                content: <Text>{worklog.started_at}</Text>,
            }
        ] }));

  return (
    <Stack space="space.100">
      <InlineEdit
        defaultValue=""
        label="SQL"
        editView={({ errorMessage, ...fieldProps }) => (
          <Textfield {...fieldProps} autoFocus />
        )}
        readView={() => (
          <Box xcss={xcss({paddingInline: "space.075", paddingBlock: "space.100"})}>
            SQL
          </Box>
        )}
        onConfirm={async (value) => {
          const res = await invoke('sqlDebug', { sql: value })
          console.log(res);
        }}
      />

      <Inline alignBlock="center" space="space.100">
        <Text>Start at</Text>
        <DatePicker value={startAt} onChange={setStartAt} maxDate={endAt}/>
        <Text>End at</Text>
        <DatePicker value={endAt} onChange={setEndAt} minDate={startAt} />
        <Button onClick={handleSearch}>Search</Button>
      </Inline>

      <Stack space="space.100">
        <Inline space="space.100">
          <Button onClick={() => invoke('fetchWorklogs')}>Fetch</Button>
          <Button onClick={() => invoke('runMigration')}>Migrate</Button>
        </Inline>
        <Text>Count: {data.count}</Text>
      </Stack>

      <DynamicTable rows={rows} head={getHeader()} isLoading={isLoading}/>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
