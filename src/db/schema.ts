import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

/* ---------- Projects ---------- */

export const projects = pgTable("projects", {
  id: text("id").primaryKey(), // slug
  status: text("status").notNull().default("draft"), // draft | flagship | pipeline | published | archived
  year: text("year").notNull(),
  platform: text("platform").notNull().default(""),
  distributionUrl: text("distribution_url"),
  bannerKey: text("banner_key"), // Neon Object Storage key
  sortOrder: integer("sort_order").notNull().default(0),
  isFlagship: boolean("is_flagship").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectI18n = pgTable(
  "project_i18n",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(), // en | id
    title: text("title").notNull(),
    typeLabel: text("type_label").notNull().default(""),
    description: text("description").notNull().default(""),
    culturalNote: text("cultural_note").notNull().default(""),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.lang] })]
);

export const projectThumbnails = pgTable("project_thumbnails", {
  id: text("id").primaryKey(), // nanoid
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  storageKey: text("storage_key").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ---------- News ---------- */

export const news = pgTable("news", {
  id: text("id").primaryKey(), // slug
  status: text("status").notNull().default("draft"), // draft | published
  coverKey: text("cover_key"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsI18n = pgTable(
  "news_i18n",
  {
    newsId: text("news_id")
      .notNull()
      .references(() => news.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull().default(""), // markdown
  },
  (t) => [primaryKey({ columns: [t.newsId, t.lang] })]
);

/* ---------- Milestones ---------- */

export const milestones = pgTable("milestones", {
  id: text("id").primaryKey(), // slug
  yearLabel: text("year_label").notNull(), // "2025" | "2024 - 2025"
  kind: text("kind").notNull().default("award"), // grant | angel | competition | showcase | innovation | compliance
  badgeText: text("badge_text").notNull().default(""), // "Rp 10.000.000", "3rd Place Winner" — same both langs
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const milestoneI18n = pgTable(
  "milestone_i18n",
  {
    milestoneId: text("milestone_id")
      .notNull()
      .references(() => milestones.id, { onDelete: "cascade" }),
    lang: text("lang").notNull(),
    title: text("title").notNull(),
    org: text("org").notNull().default(""),
    description: text("description").notNull().default(""),
  },
  (t) => [primaryKey({ columns: [t.milestoneId, t.lang] })]
);

/* ---------- Studio facts / channels / inquiries ---------- */

export const studioFacts = pgTable("studio_facts", {
  key: text("key").primaryKey(), // active_core | network_total | published_override | ip_count | partners_count | years_manual...
  value: text("value").notNull(),
  mode: text("mode").notNull().default("manual"), // manual | auto
  note: text("note").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const channels = pgTable("channels", {
  key: text("key").primaryKey(), // email | itch | github | discord | instagram | youtube | tiktok | x | domain | location
  value: text("value").notNull().default(""),
  label: text("label").notNull().default(""),
  isLink: boolean("is_link").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey(), // nanoid
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(), // session token (random)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});
