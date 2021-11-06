import postgres from "postgres";

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_DATABASE = process.env.DB_DATABASE || "seneca";
export const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
export const DB_CONNECTION_LIMIT = parseInt(process.env.DB_CONNECTION_LIMIT || "22", 10);

export const sql = postgres({
  host: DB_HOST,
  password: DB_PASSWORD,
  username: DB_USER,
  port: DB_PORT,
  database: DB_DATABASE,
  max: DB_CONNECTION_LIMIT
});
