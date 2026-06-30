ALTER TABLE "gallery_entry" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "gallery_entry" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_entry" ADD CONSTRAINT "gallery_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_entry_status_idx" ON "gallery_entry" USING btree ("status");--> statement-breakpoint
CREATE INDEX "gallery_entry_user_id_idx" ON "gallery_entry" USING btree ("user_id");