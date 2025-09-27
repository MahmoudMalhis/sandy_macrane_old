import knex from "knex";
import config from "../../knexfile.js";

const environment = process.env.NODE_ENV || "development";
const db = knex(config[environment]);

export const fn = db.fn;
export const transaction = db.transaction.bind(db);
export default db;
