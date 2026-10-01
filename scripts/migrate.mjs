import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { databaseUrl, loadEnv, root } from "./env.mjs";

loadEnv();
const url = databaseUrl();
const sql = readFileSync(join(root, "db/schema.sql"), "utf8");

const client = new pg.Client({ connectionString: url });
await client.connect();
await client.query(sql);
await client.end();
console.log("Migrated schema to", url.replace(/:[^:@]+@/, ":***@"));
