ALTER TABLE "news_article" ADD COLUMN "object_position_x" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "news_article" ADD COLUMN "object_position_y" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "news_article" ADD COLUMN "image_zoom" integer DEFAULT 100 NOT NULL;