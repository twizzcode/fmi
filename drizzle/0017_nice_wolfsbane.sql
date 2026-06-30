ALTER TABLE "news_article" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "news_article" ADD CONSTRAINT "news_article_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_article_user_id_idx" ON "news_article" USING btree ("user_id");