import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "../lib/env";

const connectionString = env("DATABASE_URL") ?? env("DATABASE_URL_UNPOOLED");

if (!connectionString) {
  throw new Error("Missing DATABASE_URL (or DATABASE_URL_UNPOOLED) environment variable");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export type Db = typeof db;
