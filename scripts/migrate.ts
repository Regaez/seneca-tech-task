import path from "path";
import { migrate } from "postgres-migrations"

const run = async () => {
  const dbConfig = {
    database: process.env.DB_DATABASE || "seneca",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),

    // Default: false for backwards-compatibility
    // This might change!
    ensureDatabaseExists: true,

    // Default: "postgres"
    // Used when checking/creating "database-name"
    defaultDatabase: "postgres"
  }

  await migrate(dbConfig, path.join(__dirname, "../migrations"));
};

run();
