CREATE TABLE "decision_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"actor_id" uuid,
	"event_type" text NOT NULL,
	"summary" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "decision_events_version_ck" CHECK ("decision_events"."version_number" >= 1)
);
--> statement-breakpoint
CREATE TABLE "decision_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"approval_order" integer,
	"added_by_id" uuid NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "decision_participants_role_ck" CHECK ("decision_participants"."role" in ('approver','reviewer')),
	CONSTRAINT "decision_participants_order_ck" CHECK ("decision_participants"."approval_order" is null or "decision_participants"."approval_order" >= 1)
);
--> statement-breakpoint
CREATE TABLE "decision_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_id" uuid NOT NULL,
	"version_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"participant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"state" text NOT NULL,
	"comment" text,
	"idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "decision_responses_state_ck" CHECK ("decision_responses"."state" in ('approved','rejected','changes_requested','abstained')),
	CONSTRAINT "decision_responses_version_ck" CHECK ("decision_responses"."version_number" >= 1)
);
--> statement-breakpoint
CREATE TABLE "decision_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"decision_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"title" text NOT NULL,
	"statement" text NOT NULL,
	"rationale" text NOT NULL,
	"requested_outcome" text NOT NULL,
	"approval_mode" text NOT NULL,
	"due_at" timestamp with time zone,
	"participant_snapshot" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"author_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "decision_versions_number_ck" CHECK ("decision_versions"."version_number" >= 1),
	CONSTRAINT "decision_versions_mode_ck" CHECK ("decision_versions"."approval_mode" in ('parallel','sequential'))
);
--> statement-breakpoint
CREATE TABLE "executive_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"title" text NOT NULL,
	"statement" text NOT NULL,
	"rationale" text NOT NULL,
	"requested_outcome" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"approval_mode" text DEFAULT 'parallel' NOT NULL,
	"requested_by_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"due_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"finalized_at" timestamp with time zone,
	"final_decision_summary" text,
	"finalized_by_id" uuid,
	"version_number" integer DEFAULT 1 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exec_decisions_entity_type_ck" CHECK ("executive_decisions"."entity_type" in ('business','opportunity','campaign','journey','pilot','recommendation')),
	CONSTRAINT "exec_decisions_status_ck" CHECK ("executive_decisions"."status" in ('draft','pending_review','pending_approval','approved','rejected','changes_requested','cancelled','expired')),
	CONSTRAINT "exec_decisions_priority_ck" CHECK ("executive_decisions"."priority" in ('low','medium','high','critical')),
	CONSTRAINT "exec_decisions_mode_ck" CHECK ("executive_decisions"."approval_mode" in ('parallel','sequential')),
	CONSTRAINT "exec_decisions_version_ck" CHECK ("executive_decisions"."version_number" >= 1)
);
--> statement-breakpoint
ALTER TABLE "decision_events" ADD CONSTRAINT "decision_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_events" ADD CONSTRAINT "decision_events_decision_id_executive_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."executive_decisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_events" ADD CONSTRAINT "decision_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_participants" ADD CONSTRAINT "decision_participants_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_participants" ADD CONSTRAINT "decision_participants_decision_id_executive_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."executive_decisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_participants" ADD CONSTRAINT "decision_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_participants" ADD CONSTRAINT "decision_participants_added_by_id_users_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_responses" ADD CONSTRAINT "decision_responses_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_responses" ADD CONSTRAINT "decision_responses_decision_id_executive_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."executive_decisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_responses" ADD CONSTRAINT "decision_responses_version_id_decision_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."decision_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_responses" ADD CONSTRAINT "decision_responses_participant_id_decision_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."decision_participants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_responses" ADD CONSTRAINT "decision_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_versions" ADD CONSTRAINT "decision_versions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_versions" ADD CONSTRAINT "decision_versions_decision_id_executive_decisions_id_fk" FOREIGN KEY ("decision_id") REFERENCES "public"."executive_decisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decision_versions" ADD CONSTRAINT "decision_versions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_decisions" ADD CONSTRAINT "executive_decisions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_decisions" ADD CONSTRAINT "executive_decisions_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_decisions" ADD CONSTRAINT "executive_decisions_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executive_decisions" ADD CONSTRAINT "executive_decisions_finalized_by_id_users_id_fk" FOREIGN KEY ("finalized_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "decision_events_org_decision_created_idx" ON "decision_events" USING btree ("organization_id","decision_id","created_at");--> statement-breakpoint
CREATE INDEX "decision_events_org_created_idx" ON "decision_events" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "decision_participants_decision_user_role_uq" ON "decision_participants" USING btree ("decision_id","user_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "decision_participants_active_order_uq" ON "decision_participants" USING btree ("decision_id","approval_order") WHERE "decision_participants"."role" = 'approver' and "decision_participants"."deleted_at" is null and "decision_participants"."approval_order" is not null;--> statement-breakpoint
CREATE INDEX "decision_participants_org_user_idx" ON "decision_participants" USING btree ("organization_id","user_id","role");--> statement-breakpoint
CREATE INDEX "decision_participants_org_decision_idx" ON "decision_participants" USING btree ("organization_id","decision_id");--> statement-breakpoint
CREATE UNIQUE INDEX "decision_responses_version_user_uq" ON "decision_responses" USING btree ("version_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "decision_responses_org_idempotency_uq" ON "decision_responses" USING btree ("organization_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "decision_responses_org_decision_idx" ON "decision_responses" USING btree ("organization_id","decision_id","version_number");--> statement-breakpoint
CREATE UNIQUE INDEX "decision_versions_decision_number_uq" ON "decision_versions" USING btree ("decision_id","version_number");--> statement-breakpoint
CREATE INDEX "decision_versions_org_decision_idx" ON "decision_versions" USING btree ("organization_id","decision_id");--> statement-breakpoint
CREATE INDEX "exec_decisions_org_status_due_idx" ON "executive_decisions" USING btree ("organization_id","status","due_at");--> statement-breakpoint
CREATE INDEX "exec_decisions_org_entity_idx" ON "executive_decisions" USING btree ("organization_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "exec_decisions_org_owner_idx" ON "executive_decisions" USING btree ("organization_id","owner_id");