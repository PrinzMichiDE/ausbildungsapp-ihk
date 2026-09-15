-- Migration: add_audit_pruefungen
-- Add AuditEvent, Pruefung, PruefungsMeilenstein tables

CREATE TABLE "audit_events" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "user_id" VARCHAR(36) NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "entity" VARCHAR(255),
    "entity_id" VARCHAR(36),
    "details" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_audit_user_id" ON "audit_events" ("user_id");
CREATE INDEX "idx_audit_action" ON "audit_events" ("action");
CREATE INDEX "idx_audit_created_at" ON "audit_events" ("created_at");

ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TYPE "pruefung_typ" AS ENUM ('ap1', 'ap2');
CREATE TYPE "pruefungs_status" AS ENUM ('angemeldet', 'teilgenommen', 'bestanden', 'wiederholung');

CREATE TABLE "pruefungen" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "azubi_id" VARCHAR(36) NOT NULL,
    "typ" "pruefung_typ" NOT NULL DEFAULT 'ap2',
    "status" "pruefungs_status" NOT NULL DEFAULT 'angemeldet',
    "beschreibung" VARCHAR(1000),
    "ihk_termin" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "pruefungen_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_pruefung_azubi_id" ON "pruefungen" ("azubi_id");
CREATE INDEX "idx_pruefung_typ" ON "pruefungen" ("typ");
CREATE INDEX "idx_pruefung_status" ON "pruefungen" ("status");

ALTER TABLE "pruefungen" ADD CONSTRAINT "pruefungen_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE;

CREATE TABLE "pruefungs_meilensteine" (
    "id" VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "pruefung_id" VARCHAR(36) NOT NULL,
    "titel" VARCHAR(200) NOT NULL,
    "beschreibung" VARCHAR(1000),
    "faellig_am" TIMESTAMP(3),
    "erledigt" BOOLEAN NOT NULL DEFAULT false,
    "erledigt_am" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "pruefungs_meilensteine_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_pm_pruefung_id" ON "pruefungs_meilensteine" ("pruefung_id");

ALTER TABLE "pruefungs_meilensteine" ADD CONSTRAINT "pruefungs_meilensteine_pruefung_id_fkey" FOREIGN KEY ("pruefung_id") REFERENCES "pruefungen"("id") ON DELETE CASCADE;