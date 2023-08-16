import { env } from "@/env.mjs";
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

export const mySqlClient = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
});

export const db = drizzle(mySqlClient, { schema, mode: "default" });
