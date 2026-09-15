-- Migration: add_report_attachments_versions_time_entries
-- Add ReportAttachment, ReportVersion, ReportTimeEntry tables (defined in schema but never migrated)

CREATE TABLE "report_attachments" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "report_id" VARCHAR(36) NOT NULL,
    "typ" VARCHAR(50) NOT NULL,
    "datei_url" TEXT NOT NULL,
    "kommentar" TEXT,
    "erstellt_von" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "report_attachments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_report_attachment_report_id" ON "report_attachments" ("report_id");

ALTER TABLE "report_attachments" ADD CONSTRAINT "report_attachments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE;

CREATE TABLE "report_versions" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "report_id" VARCHAR(36) NOT NULL,
    "version" INTEGER NOT NULL,
    "inhalt_markdown" TEXT NOT NULL,
    "erstellt_von" VARCHAR(36),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "report_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uq_report_version" ON "report_versions" ("report_id", "version");

ALTER TABLE "report_versions" ADD CONSTRAINT "report_versions_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE;

CREATE TABLE "report_time_entries" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "report_id" VARCHAR(36) NOT NULL,
    "task_id" VARCHAR(36),
    "stunden" DOUBLE PRECISION NOT NULL,
    "kommentar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "report_time_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_report_time_entry_report_id" ON "report_time_entries" ("report_id");

ALTER TABLE "report_time_entries" ADD CONSTRAINT "report_time_entries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE;

CREATE TABLE "report_templates" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "beruf" VARCHAR(100) NOT NULL,
    "jahr" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "felder" JSONB NOT NULL,
    "ist_standard" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);
