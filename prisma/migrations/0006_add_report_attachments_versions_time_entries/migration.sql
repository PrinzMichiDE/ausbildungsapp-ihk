-- Migration: add_report_attachments_versions_time_entries
-- Add ReportAttachment, ReportVersion, and ReportTimeEntry models for full report lifecycle tracking

CREATE TABLE "report_attachments" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "report_id" VARCHAR(36) NOT NULL,
    "typ" VARCHAR(50) NOT NULL,
    "datei_url" VARCHAR(500) NOT NULL,
    "kommentar" TEXT,
    "erstellt_von" VARCHAR(36),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "report_attachments_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "report_attachments" ADD CONSTRAINT "report_attachments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE;

CREATE INDEX "idx_report_attachment_report_id" ON "report_attachments"("report_id");

CREATE TABLE "report_versions" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "report_id" VARCHAR(36) NOT NULL,
    "version" INTEGER NOT NULL,
    "inhalt_markdown" TEXT NOT NULL,
    "erstellt_von" VARCHAR(36),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "report_versions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "report_versions" ADD CONSTRAINT "report_versions_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE;

CREATE INDEX "idx_report_version_report_id" ON "report_versions"("report_id");
CREATE INDEX "idx_report_version_version" ON "report_versions"("version");

CREATE TABLE "report_time_entries" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "report_id" VARCHAR(36) NOT NULL,
    "task_id" VARCHAR(36),
    "stunden" DOUBLE PRECISION NOT NULL,
    "kommentar" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "report_time_entries_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "report_time_entries" ADD CONSTRAINT "report_time_entries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE;

CREATE INDEX "idx_report_timeentry_report_id" ON "report_time_entries"("report_id");

-- Unique constraint for version numbers
ALTER TABLE "report_versions" ADD CONSTRAINT "uq_report_version_number" UNIQUE ("report_id", "version");
