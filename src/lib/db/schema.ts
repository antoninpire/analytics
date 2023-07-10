import { relations } from "drizzle-orm";
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

export const webVisitorsTable = mysqlTable("web_visitors", {
  id: varchar("id", { length: 128 }).primaryKey(),

  created_at: timestamp("created_at").notNull(),
});

export const webVisitorsRelations = relations(webVisitorsTable, ({ many }) => ({
  sessions: many(webSessionsTable),
  pageHits: many(webPageHitsTable),
}));

export const webSessionsTable = mysqlTable("web_sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  visitor_id: varchar("visitor_id", { length: 128 })
    .notNull()
    .references(() => webVisitorsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  referrer: varchar("referrer", { length: 512 }),
  query_params: varchar("query_params", { length: 512 }),
  duration: int("duration").default(0).notNull(),
  country: varchar("country", { length: 128 }),
  city: varchar("city", { length: 128 }),
  device: varchar("device", { length: 128 }),
  os: varchar("os", { length: 128 }),
  browser: varchar("browser", { length: 128 }),
  language: varchar("language", { length: 128 }),
  created_at: timestamp("created_at").notNull(),
});

export const webSessionsRelations = relations(
  webSessionsTable,
  ({ one, many }) => ({
    visitor: one(webVisitorsTable, {
      fields: [webSessionsTable.visitor_id],
      references: [webVisitorsTable.id],
    }),
    pageHits: many(webPageHitsTable),
  })
);

export const webPageHitsTable = mysqlTable("web_page_hits", {
  id: varchar("id", { length: 128 }).primaryKey(),
  visitor_id: varchar("visitor_id", { length: 128 })
    .notNull()
    .references(() => webVisitorsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  session_id: varchar("session_id", { length: 128 })
    .notNull()
    .references(() => webSessionsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  href: varchar("href", { length: 512 }).notNull(),
  referrer: varchar("referrer", { length: 512 }),
  pathname: varchar("pathname", { length: 512 }).notNull(),
  query_params: varchar("query_params", { length: 512 }),
  created_at: timestamp("created_at").notNull(),
});

export const webPageHitsRelations = relations(webPageHitsTable, ({ one }) => ({
  visitor: one(webVisitorsTable, {
    fields: [webPageHitsTable.visitor_id],
    references: [webVisitorsTable.id],
  }),
  session: one(webSessionsTable, {
    fields: [webPageHitsTable.session_id],
    references: [webSessionsTable.id],
  }),
}));
