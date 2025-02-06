import sql from "@forge/sql";
import knex from "knex";

export const db = knex({ client: 'mysql' });

export async function queryForgeSql(query) {
    return sql.prepare(query.toQuery()).execute();
}

export const toTimestamp = (date) => date.replace("T", " ").replace("t", " ").split("+")[0].split('.')[0];
