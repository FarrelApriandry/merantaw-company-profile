CREATE TABLE "admin_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channels" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"label" text DEFAULT '' NOT NULL,
	"is_link" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestone_i18n" (
	"milestone_id" text NOT NULL,
	"lang" text NOT NULL,
	"title" text NOT NULL,
	"org" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "milestone_i18n_milestone_id_lang_pk" PRIMARY KEY("milestone_id","lang")
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"year_label" text NOT NULL,
	"kind" text DEFAULT 'award' NOT NULL,
	"badge_text" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"cover_key" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_i18n" (
	"news_id" text NOT NULL,
	"lang" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	CONSTRAINT "news_i18n_news_id_lang_pk" PRIMARY KEY("news_id","lang")
);
--> statement-breakpoint
CREATE TABLE "project_i18n" (
	"project_id" text NOT NULL,
	"lang" text NOT NULL,
	"title" text NOT NULL,
	"type_label" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"cultural_note" text DEFAULT '' NOT NULL,
	CONSTRAINT "project_i18n_project_id_lang_pk" PRIMARY KEY("project_id","lang")
);
--> statement-breakpoint
CREATE TABLE "project_thumbnails" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"storage_key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"year" text NOT NULL,
	"platform" text DEFAULT '' NOT NULL,
	"distribution_url" text,
	"banner_key" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_flagship" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_facts" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"mode" text DEFAULT 'manual' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "milestone_i18n" ADD CONSTRAINT "milestone_i18n_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_i18n" ADD CONSTRAINT "news_i18n_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_i18n" ADD CONSTRAINT "project_i18n_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_thumbnails" ADD CONSTRAINT "project_thumbnails_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;