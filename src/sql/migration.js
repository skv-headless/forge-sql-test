import sql, { migrationRunner } from '@forge/sql';

//// Start of definition for schema migration statements ////
// The SQL statements should be idempotent.
export const CREATE_WORKLOGS_TABLE = `CREATE TABLE IF NOT EXISTS Worklogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jira_updated DATE,
    started_at DATE,
    time_spent_seconds INT,
    author_id VARCHAR(200) NOT NULL,
    dataset_id INT,
    issue_id INT,
    local_project_id INT,
    worklog_id INT
)`;

export const TRUNCATE_WORKLOGS = `TRUNCATE WORKLOGS`;

export const UPDATE_WORKLOGS_TABLE = `ALTER TABLE Worklogs
ADD CONSTRAINT WorklogId UNIQUE (worklog_id),
MODIFY COLUMN started_at TIMESTAMP,
MODIFY COLUMN jira_updated TIMESTAMP;
`;


const migrations = migrationRunner
  .enqueue('v001_create_worklogs_table', CREATE_WORKLOGS_TABLE)
  .enqueue('v002_truncate_worklogs_table', TRUNCATE_WORKLOGS)
  .enqueue('v003_update_worklogs_table', UPDATE_WORKLOGS_TABLE);

// The function to run the migrations in response to Forge events and triggers.
export const runSchemaMigration = async () => {

  try {
    console.log('Provisioning the database');
    await sql._provision();

    console.log('Running schema migrations');
    const successfulMigrations = await migrations.run();
    console.log('Migrations applied:', successfulMigrations);

    const migrationHistory = (await migrationRunner.list())
      .map((y) => `${y.id}, ${y.name}, ${y.migratedAt.toUTCString()}`)
      .join('\n');
    console.log('Migrations history:\nid, name, migrated_at\n', migrationHistory);

    return getHttpResponse(200, 'Migrations successfully executed');
  } catch (e) {
    console.error('Error while executing migration', e);
    return getHttpResponse(500, 'Error while executing migrations');
  }
};

function getHttpResponse<Body>(statusCode: number, body: Body) {
  let statusText = '';
  if (statusCode === 200) {
    statusText = 'Ok';
  } else if (statusCode === 404) {
    statusText = 'Not Found';
  } else {
    statusText = 'Bad Request';
  }

  return {
    headers: { 'Content-Type': ['application/json'] },
    statusCode,
    statusText,
    body,
  };
}
