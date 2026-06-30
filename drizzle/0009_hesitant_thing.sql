ALTER TABLE "testimonial" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "testimonial" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "testimonial" ADD CONSTRAINT "testimonial_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "testimonial_status_idx" ON "testimonial" USING btree ("status");--> statement-breakpoint
CREATE INDEX "testimonial_user_id_idx" ON "testimonial" USING btree ("user_id");