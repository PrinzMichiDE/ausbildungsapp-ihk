-- Migration: add_projekt_model
-- Add Projekt table for Abschlussprüfung Teil 2 (Betriebliches Projekt)

CREATE TABLE "projekte" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "azubi_id" VARCHAR(36) NOT NULL,
    "titel" VARCHAR(200) NOT NULL,
    "beschreibung" VARCHAR(1000),
    "projektantrag" TEXT,
    "projektdoku" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'entwurf',
    "bewertung" TEXT,
    "bewertet_von" VARCHAR(36),
    "bewertet_am" TIMESTAMP(3),
    "freigegeben" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "projekte_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_projekt_azubi_id" ON "projekte" ("azubi_id");
CREATE INDEX "idx_projekt_status" ON "projekte" ("status");

ALTER TABLE "projekte" ADD CONSTRAINT "projekte_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE SEQUENCE IF NOT EXISTS "projekte_id_seq";