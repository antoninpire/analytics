import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
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

// Auth tables
export const usersTable = mysqlTable(
  "auth_user",
  {
    id: varchar("id", {
      length: 15,
    }).primaryKey(),
    // other user attributes
    email: varchar("email", {
      length: 255,
    }).notNull(),
  },
  (users) => ({
    emailIndex: uniqueIndex("email_idx").on(users.email),
  })
);

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  websites: many(websitesTable),
}));

export type User = InferModel<typeof usersTable>;

export const sessionsTable = mysqlTable("auth_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});

export const authKeysTable = mysqlTable("auth_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  primaryKey: boolean("primary_key").notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
  expires: bigint("expires", {
    mode: "number",
  }),
});

export const websitesTable = mysqlTable("websites", {
  id: varchar("id", { length: 128 }).primaryKey(),
  user_id: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: varchar("name", { length: 128 }).notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  created_at: timestamp("created_at").notNull(),
});

export const webSitesRelations = relations(websitesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [websitesTable.user_id],
    references: [usersTable.id],
  }),
}));

export type Website = InferModel<typeof websitesTable> & {
  user?: User;
};

// export const apiKeysTable = mysqlTable("api_keys", {
//   id: varchar("id", { length: 128 }).primaryKey(),
//   tenantId: varchar("tenantId", { length: 128 }).notNull(),
//   hash: varchar("hash", { length: 128 }).notNull(),
//   first_characters: varchar("first_characters", { length: 4 }).notNull(),
//   last_characters: varchar("last_characters", { length: 4 }).notNull(),
//   created_at: timestamp("created_at").notNull(),
// });

export const webVisitorsTable = mysqlTable("web_visitors", {
  id: varchar("id", { length: 128 }).primaryKey(),
  website_id: varchar("website_id", { length: 128 })
    .notNull()
    .references(() => websitesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  created_at: timestamp("created_at").notNull(),
});

export const webVisitorsRelations = relations(
  webVisitorsTable,
  ({ many, one }) => ({
    sessions: many(webSessionsTable),
    pageHits: many(webPageHitsTable),
    website: one(websitesTable, {
      fields: [webVisitorsTable.website_id],
      references: [websitesTable.id],
    }),
  })
);

export const webSessionsTable = mysqlTable("web_sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  visitor_id: varchar("visitor_id", { length: 128 })
    .notNull()
    .references(() => webVisitorsTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  website_id: varchar("website_id", { length: 128 })
    .notNull()
    .references(() => websitesTable.id, {
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
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const webSessionsRelations = relations(
  webSessionsTable,
  ({ one, many }) => ({
    visitor: one(webVisitorsTable, {
      fields: [webSessionsTable.visitor_id],
      references: [webVisitorsTable.id],
    }),
    pageHits: many(webPageHitsTable),
    website: one(websitesTable, {
      fields: [webSessionsTable.website_id],
      references: [websitesTable.id],
    }),
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
  website_id: varchar("website_id", { length: 128 })
    .notNull()
    .references(() => websitesTable.id, {
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
  website: one(websitesTable, {
    fields: [webPageHitsTable.website_id],
    references: [websitesTable.id],
  }),
}));
