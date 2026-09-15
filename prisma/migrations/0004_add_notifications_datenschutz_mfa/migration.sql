-- Migration: add_notifications_datenschutz_mfa
-- Add Notification, NotificationPreference, DatenschutzRequest, Consent, ConsentLog,
-- LegalBasis (Verarbeitungsverzeichnis), DpiaEntry tables and MFA fields on users.

ALTER TABLE "users" ADD COLUMN "mfa_secret" VARCHAR(80);
ALTER TABLE "users" ADD COLUMN "mfa_active" BOOLEAN NOT NULL DEFAULT false;

CREATE TYPE "notification_category" AS ENUM ('review', 'deadline', 'reminder', 'absence', 'system');
CREATE TYPE "notification_priority" AS ENUM ('low', 'medium', 'high');

CREATE TABLE "notifications" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(36) NOT NULL,
    "category" "notification_category" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "notification_priority" NOT NULL DEFAULT 'medium',
    "read_at" TIMESTAMP(3),
    "acknowledged_at" TIMESTAMP(3),
    "reference_type" VARCHAR(50),
    "reference_id" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_notifications_user_created" ON "notifications" ("user_id", "created_at");

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TABLE "notification_preferences" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(36) NOT NULL,
    "category" "notification_category" NOT NULL,
    "in_app" BOOLEAN NOT NULL DEFAULT true,
    "email" BOOLEAN NOT NULL DEFAULT false,
    "teams" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uq_notification_preference_user_category" ON "notification_preferences" ("user_id", "category");
CREATE INDEX "idx_notification_preference_user_id" ON "notification_preferences" ("user_id");

ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TYPE "datenschutz_request_typ" AS ENUM ('access', 'export', 'deletion', 'rectification', 'restriction', 'portability', 'objection');
CREATE TYPE "datenschutz_request_status" AS ENUM ('open', 'in_progress', 'completed', 'rejected');

CREATE TABLE "datenschutz_requests" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(36) NOT NULL,
    "typ" "datenschutz_request_typ" NOT NULL,
    "status" "datenschutz_request_status" NOT NULL DEFAULT 'open',
    "details" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "result" TEXT,
    "processed_by" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "datenschutz_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_datenschutz_request_user_id" ON "datenschutz_requests" ("user_id");
CREATE INDEX "idx_datenschutz_request_status" ON "datenschutz_requests" ("status");

ALTER TABLE "datenschutz_requests" ADD CONSTRAINT "datenschutz_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TYPE "consent_action" AS ENUM ('granted', 'revoked');

CREATE TABLE "consents" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(36) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "version" VARCHAR(20) NOT NULL DEFAULT '1',
    "text" TEXT,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "revoked_at" TIMESTAMP(3),
    "ip_address" VARCHAR(45),
    "source" VARCHAR(50) NOT NULL DEFAULT 'ui',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_consent_user_id" ON "consents" ("user_id");
CREATE UNIQUE INDEX "uq_consent_user_key_version" ON "consents" ("user_id", "key", "version");

ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TABLE "consent_logs" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(36) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "action" "consent_action" NOT NULL,
    "text" TEXT,
    "ip_address" VARCHAR(45),
    "source" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "consent_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_consent_log_user_id" ON "consent_logs" ("user_id");

ALTER TABLE "consent_logs" ADD CONSTRAINT "consent_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TYPE "legal_basis_article" AS ENUM ('art6_1_a', 'art6_1_b', 'art6_1_c', 'art6_1_f');

CREATE TABLE "legal_bases" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "purpose" TEXT NOT NULL,
    "data_categories" TEXT[] NOT NULL,
    "recipients" TEXT[] NOT NULL,
    "retention_period" VARCHAR(100),
    "legal_basis" "legal_basis_article" NOT NULL,
    "controller" VARCHAR(200),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "legal_bases_pkey" PRIMARY KEY ("id")
);

CREATE TYPE "dpia_risk" AS ENUM ('low', 'medium', 'high');
CREATE TYPE "dpia_status" AS ENUM ('open', 'in_progress', 'completed');

CREATE TABLE "dpia_entries" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "risk_level" "dpia_risk" NOT NULL DEFAULT 'low',
    "measures" TEXT,
    "status" "dpia_status" NOT NULL DEFAULT 'open',
    "assessed_at" TIMESTAMP(3),
    "assessed_by" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "dpia_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_dpia_entry_status" ON "dpia_entries" ("status");