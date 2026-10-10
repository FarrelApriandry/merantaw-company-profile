import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL (or DATABASE_URL_UNPOOLED) environment variable");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export type Db = typeof db;
