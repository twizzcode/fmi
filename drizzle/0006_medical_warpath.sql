CREATE TABLE "gallery_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"storage_path" text NOT NULL,
	"event_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_entry_storage_path_unique" UNIQUE("storage_path")
);
--> statement-breakpoint
CREATE INDEX "gallery_entry_event_date_idx" ON "gallery_entry" USING btree ("event_date");--> statement-breakpoint
CREATE INDEX "gallery_entry_storage_path_idx" ON "gallery_entry" USING btree ("storage_path");