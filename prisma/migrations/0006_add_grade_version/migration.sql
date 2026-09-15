-- Migration: add_grade_version
-- Adds GradeVersion model for tracking grade change history.

CREATE TABLE "grade_versions" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "grade_id" VARCHAR(36) NOT NULL,
    "version" INTEGER NOT NULL,
    "fach" VARCHAR(100) NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'entwurf',
    "zeitraum" VARCHAR(100) NOT NULL,
    "halbjahr" VARCHAR(20),
    "datum" TIMESTAMP,
    "pruefungsart" VARCHAR(20),
    "gewichtung" DOUBLE PRECISION DEFAULT 1.0,
    "gewichtungs_kategorie" VARCHAR(20),
    "typ" VARCHAR(20) NOT NULL DEFAULT 'note',
    "bemerkungen" TEXT,
    "pruefer_id" VARCHAR(36),
    "pruefungsdatum" TIMESTAMP,
    "wiederholung" BOOLEAN NOT NULL DEFAULT false,
    "maßnahme" TEXT,
    "zeugnis_url" VARCHAR(500),
    "bewertet_von" VARCHAR(36),
    "bewertet_am" TIMESTAMP,
    "erstellt_von" VARCHAR(36),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "grade_versions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "grade_versions" ADD CONSTRAINT "grade_versions_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE CASCADE;

CREATE INDEX "idx_gradeversion_grade_id" ON "grade_versions"("grade_id");
CREATE INDEX "idx_gradeversion_version" ON "grade_versions"("version");
