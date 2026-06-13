CREATE TABLE "news_article" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"category" text NOT NULL,
	"author" text NOT NULL,
	"image_path" text NOT NULL,
	"body_json" text NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_article_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "news_article_published_at_idx" ON "news_article" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "news_article_slug_idx" ON "news_article" USING btree ("slug");