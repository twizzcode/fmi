CREATE TABLE "gallery_photo" (
	"id" text PRIMARY KEY NOT NULL,
	"gallery_entry_id" text NOT NULL,
	"storage_path" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_photo_storage_path_unique" UNIQUE("storage_path")
);
--> statement-breakpoint
ALTER TABLE "gallery_entry" ADD COLUMN "title" text;--> statement-breakpoint
UPDATE "gallery_entry"
SET "title" = initcap(replace(replace(regexp_replace(split_part("storage_path", '/', 2), '\.[^.]+$', ''), '-', ' '), '_', ' '))
WHERE "title" IS NULL;--> statement-breakpoint
ALTER TABLE "gallery_entry" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_photo" ADD CONSTRAINT "gallery_photo_gallery_entry_id_gallery_entry_id_fk" FOREIGN KEY ("gallery_entry_id") REFERENCES "public"."gallery_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_photo_entry_id_idx" ON "gallery_photo" USING btree ("gallery_entry_id");--> statement-breakpoint
CREATE INDEX "gallery_photo_sort_order_idx" ON "gallery_photo" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "gallery_photo_storage_path_idx" ON "gallery_photo" USING btree ("storage_path");
