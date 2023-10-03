import { InferSelectModel, relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

const mysqlTable = mysqlTableCreator((name) => `analytics_${name}`);

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

export type User = InferSelectModel<typeof usersTable>;

export const sessionsTable = mysqlTable("auth_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
  email: varchar("email", { length: 128 }),
});

export const authKeysTable = mysqlTable("auth_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  primaryKey: boolean("primary_key").notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
  expires: bigint("expires", {
    mode: "number",
  }),
});

export const websitesTable = mysqlTable(
  "websites",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    user_id: varchar("user_id", { length: 128 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    url: varchar("url", { length: 512 }).notNull(),
    created_at: timestamp("created_at").notNull(),
  },
  (table) => ({
    userIdx: index("user_idx").on(table.user_id),
  })
);

export const webSitesRelations = relations(websitesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [websitesTable.user_id],
    references: [usersTable.id],
  }),
}));

export type Website = InferSelectModel<typeof websitesTable> & {
  user?: User;
};

export const webVisitorsTable = mysqlTable(
  "web_visitors",
  {
    id: varchar("id", { length: 128 }).notNull(),
    website_id: varchar("website_id", { length: 128 }).notNull(),
    created_at: timestamp("created_at").notNull(),
  },
  (table) => ({
    pk: primaryKey(table.id, table.website_id),
  })
);

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

export const webSessionsTable = mysqlTable(
  "web_sessions",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    visitor_id: varchar("visitor_id", { length: 128 }).notNull(),
    website_id: varchar("website_id", { length: 128 }).notNull(),
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
    updated_at: timestamp("updated_at")
      .notNull()
      .$defaultFn(() => new Date())
      .onUpdateNow(),
  },
  (table) => ({
    visitorIdx: index("visitor_idx").on(table.visitor_id),
    websiteIdx: index("website_idx").on(table.website_id),
  })
);

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

export const webPageHitsTable = mysqlTable(
  "web_page_hits",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    visitor_id: varchar("visitor_id", { length: 128 }).notNull(),
    session_id: varchar("session_id", { length: 128 }).notNull(),
    website_id: varchar("website_id", { length: 128 }).notNull(),
    href: varchar("href", { length: 512 }).notNull(),
    referrer: varchar("referrer", { length: 512 }),
    pathname: varchar("pathname", { length: 512 }).notNull(),
    query_params: varchar("query_params", { length: 512 }),
    created_at: timestamp("created_at").notNull(),
  },
  (table) => ({
    websiteIdx: index("website_idx").on(table.website_id),
    visitorIdx: index("visitor_idx").on(table.visitor_id),
    sessionIdx: index("session_idx").on(table.session_id),
  })
);

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
