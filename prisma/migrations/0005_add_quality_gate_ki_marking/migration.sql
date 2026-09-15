-- Migration: add_quality_gate_ki_marking
-- Add KI-generated marking and quality score for EU AI Act §6.3 compliance and quality gate.

ALTER TABLE "courses" ADD COLUMN "ki_generiert" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN "qualitaets_score" INTEGER;

ALTER TABLE "tasks" ADD COLUMN "ki_generiert" BOOLEAN NOT NULL DEFAULT false;
