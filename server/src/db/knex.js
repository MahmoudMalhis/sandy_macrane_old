import knex from "knex";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let sslConfig = false;
if (process.env.DB_SSL === "true") {
  try {
    if (process.env.DB_SSL_CA) {
      sslConfig = {
        ca: process.env.DB_SSL_CA,
        rejectUnauthorized: true,
      };
    } else if (process.env.DB_SSL_CA_PATH) {
      const caPath = join(__dirname, "../../", process.env.DB_SSL_CA_PATH);
      sslConfig = {
        ca: readFileSync(caPath).toString(),
        rejectUnauthorized: true,
      };
    }
  } catch (error) {
    console.error("Failed to load SSL certificate:", error.message);
  }
}

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    ssl: sslConfig,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

db.raw("SELECT 1")
  .then(() => {
    console.log("✅ Database connected successfully (Aiven MySQL)");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

export default db;
export const fn = db.fn;
export const transaction = db.transaction;
