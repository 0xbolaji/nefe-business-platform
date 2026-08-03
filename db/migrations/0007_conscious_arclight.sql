CREATE TABLE "auth_rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text NOT NULL,
	"key_hash" text NOT NULL,
	"window_started_at" timestamp with time zone NOT NULL,
	"attempt_count" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_rate_limits_attempt_count_ck" CHECK ("auth_rate_limits"."attempt_count" >= 1)
);
--> statement-breakpoint
CREATE TABLE "auth_session_registry" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"user_agent" text,
	"browser" text,
	"platform" text,
	"approximate_location" text,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invited_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "token_hash" text;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "accepted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "auth_session_registry" ADD CONSTRAINT "auth_session_registry_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_rate_limits_scope_key_uq" ON "auth_rate_limits" USING btree ("scope","key_hash");--> statement-breakpoint
CREATE INDEX "auth_rate_limits_expiry_idx" ON "auth_rate_limits" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "auth_session_registry_user_activity_idx" ON "auth_session_registry" USING btree ("user_id","last_activity_at");--> statement-breakpoint
CREATE INDEX "auth_session_registry_expiry_idx" ON "auth_session_registry" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "email_verification_tokens_hash_uq" ON "email_verification_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "email_verification_tokens_user_expiry_idx" ON "email_verification_tokens" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_tokens_hash_uq" ON "password_reset_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_user_expiry_idx" ON "password_reset_tokens" USING btree ("user_id","expires_at");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_id_users_id_fk" FOREIGN KEY ("invited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitations_org_status_expiry_idx" ON "invitations" USING btree ("organization_id","status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_token_hash_uq" ON "invitations" USING btree ("token_hash");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_status_ck" CHECK ("invitations"."status" in ('PENDING','ACCEPTED','REVOKED','EXPIRED'));
--> statement-breakpoint
UPDATE "users" SET "email_verified" = COALESCE("email_verified", "created_at") WHERE "email_verified" IS NULL;
