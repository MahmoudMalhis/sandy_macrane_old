import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let sslConfig = false;
if (process.env.DB_SSL === "true" && process.env.DB_SSL_CA_PATH) {
  try {
    const caPath = join(__dirname, process.env.DB_SSL_CA_PATH);
    sslConfig = {
      ca: readFileSync(caPath).toString(),
      rejectUnauthorized: true,
    };
  } catch (error) {
    console.error("Failed to load SSL certificate:", error.message);
  }
}

const config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    ssl: sslConfig,
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
  },
  migrations: {
    directory: "./src/db/migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
};

export const development = config;
export const production = config;
export default config;
