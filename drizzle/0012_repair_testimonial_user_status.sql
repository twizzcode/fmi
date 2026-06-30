ALTER TABLE "testimonial"
ADD COLUMN IF NOT EXISTS "user_id" text;
--> statement-breakpoint
ALTER TABLE "testimonial"
ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'pending' NOT NULL;
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'testimonial_user_id_user_id_fk'
  ) THEN
    ALTER TABLE "testimonial"
    ADD CONSTRAINT "testimonial_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
    ON DELETE cascade
    ON UPDATE no action;
  END IF;
END
$$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "testimonial_status_idx" ON "testimonial" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "testimonial_user_id_idx" ON "testimonial" USING btree ("user_id");
