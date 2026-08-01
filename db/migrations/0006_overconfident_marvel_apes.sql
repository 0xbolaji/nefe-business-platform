CREATE TABLE "journey_participants" (
	"journey_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "journey_participants_journey_id_business_id_pk" PRIMARY KEY("journey_id","business_id")
);
--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "journey_type" text DEFAULT 'Not specified' NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "objective" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "target_customer" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "intended_outcome" text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE "journeys" SET
	"journey_type" = COALESCE((SELECT "title" FROM "journey_stages" WHERE "journey_stages"."journey_id" = "journeys"."id" ORDER BY "position" LIMIT 1), 'Not specified'),
	"objective" = COALESCE((SELECT "touchpoint" FROM "journey_stages" WHERE "journey_stages"."journey_id" = "journeys"."id" ORDER BY "position" LIMIT 1), '');--> statement-breakpoint
ALTER TABLE "journey_participants" ADD CONSTRAINT "journey_participants_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_participants" ADD CONSTRAINT "journey_participants_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journey_participants" ADD CONSTRAINT "journey_participants_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "journey_participants_org_idx" ON "journey_participants" USING btree ("organization_id","journey_id");
--> statement-breakpoint
INSERT INTO "journey_participants" ("journey_id", "business_id", "organization_id")
SELECT DISTINCT "journey_id", "business_id", "organization_id"
FROM "journey_stages"
WHERE "business_id" IS NOT NULL
ON CONFLICT DO NOTHING;
