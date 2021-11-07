export const NODE_ENV = process.env.NODE_ENV || "production";
export const SERVICE_PORT = parseInt(process.env.SERVICE_PORT || "8080", 10);
export const LOG_LEVEL = process.env.LOG_LEVEL || "error";

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_DATABASE = process.env.DB_DATABASE || "seneca";
export const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
export const DB_CONNECTION_LIMIT = parseInt(process.env.DB_CONNECTION_LIMIT || "22", 10);
