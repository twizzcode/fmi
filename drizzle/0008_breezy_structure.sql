CREATE TABLE "structure_cabinet" (
  "id" text PRIMARY KEY NOT NULL,
  "order_label" text NOT NULL,
  "name" text NOT NULL,
  "theme" text DEFAULT '' NOT NULL,
  "philosophy" text DEFAULT '' NOT NULL,
  "logo_path" text DEFAULT '' NOT NULL,
  "is_default" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "structure_member" (
  "id" text PRIMARY KEY NOT NULL,
  "cabinet_id" text NOT NULL,
  "department" text NOT NULL,
  "name" text NOT NULL,
  "nickname" text DEFAULT '' NOT NULL,
  "position" text NOT NULL,
  "program" text NOT NULL,
  "entry_year" text NOT NULL,
  "gender" text DEFAULT 'ikhwan' NOT NULL,
  "quote" text DEFAULT '' NOT NULL,
  "photo_path" text DEFAULT '' NOT NULL,
  "instagram" text DEFAULT '' NOT NULL,
  "linkedin" text DEFAULT '' NOT NULL,
  "github" text DEFAULT '' NOT NULL,
  "website" text DEFAULT '' NOT NULL,
  "tiktok" text DEFAULT '' NOT NULL,
  "youtube" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "structure_member" ADD CONSTRAINT "structure_member_cabinet_id_structure_cabinet_id_fk" FOREIGN KEY ("cabinet_id") REFERENCES "public"."structure_cabinet"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "structure_cabinet_created_at_idx" ON "structure_cabinet" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "structure_cabinet_is_default_idx" ON "structure_cabinet" USING btree ("is_default");
--> statement-breakpoint
CREATE INDEX "structure_member_cabinet_id_idx" ON "structure_member" USING btree ("cabinet_id");
--> statement-breakpoint
CREATE INDEX "structure_member_department_idx" ON "structure_member" USING btree ("department");
--> statement-breakpoint
CREATE INDEX "structure_member_created_at_idx" ON "structure_member" USING btree ("created_at");
