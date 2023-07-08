import {
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";

export const logsTable = mysqlTable("logs", {
  id: int("id").autoincrement().primaryKey(),
  session_id: varchar("session_id", { length: 128 }).notNull(),
  action: mysqlEnum("action", ["PAGE_HIT"]).notNull(),
  user_agent: varchar("user_agent", { length: 512 }).notNull(),
  locale: varchar("locale", { length: 32 }).notNull(),
  location: varchar("location", { length: 2 }).notNull(),
  referrer: varchar("referrer", { length: 512 }).notNull(),
  pathname: varchar("pathname", { length: 512 }).notNull(),
  href: varchar("href", { length: 512 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertLogSchema = createInsertSchema(logsTable).omit({ id: true });
