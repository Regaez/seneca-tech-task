import postgres from "postgres";
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  DB_CONNECTION_LIMIT,
} from "../configs";

export const sql = postgres({
  host: DB_HOST,
  password: DB_PASSWORD,
  username: DB_USER,
  port: DB_PORT,
  database: DB_DATABASE,
  max: DB_CONNECTION_LIMIT
});
