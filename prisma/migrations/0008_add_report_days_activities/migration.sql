-- Migration: add_report_days_activities
-- Weekly report capture per day: each report has days (with a day type) and
-- each day has activities with a duration in whole minutes (optionally linked
-- to a released practice task). Adds users.geburtsdatum for the JArbSchG
-- daily limit and enforces one report per azubi and calendar week.
-- CreateEnum
CREATE TYPE "ReportDayArt" AS ENUM ('betrieb', 'berufsschule', 'schulung', 'urlaub', 'krank', 'feiertag');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "geburtsdatum" DATE;

-- CreateTable
CREATE TABLE "report_days" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "datum" DATE NOT NULL,
    "art" "ReportDayArt" NOT NULL DEFAULT 'betrieb',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_activities" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "dauer_minuten" INTEGER NOT NULL,
    "sortierung" INTEGER NOT NULL DEFAULT 0,
    "task_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_report_day_report_id" ON "report_days"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_report_day_report_datum" ON "report_days"("report_id", "datum");

-- CreateIndex
CREATE INDEX "idx_report_activity_day_id" ON "report_activities"("day_id");

-- CreateIndex
CREATE INDEX "idx_report_activity_task_id" ON "report_activities"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_report_azubi_jahr_kw" ON "reports"("azubi_id", "jahr", "kalenderwoche");

-- AddForeignKey
ALTER TABLE "report_days" ADD CONSTRAINT "report_days_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_activities" ADD CONSTRAINT "report_activities_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "report_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_activities" ADD CONSTRAINT "report_activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Defensive checks (business limits are enforced in the service layer)
ALTER TABLE "report_activities" ADD CONSTRAINT "chk_report_activity_dauer" CHECK ("dauer_minuten" > 0 AND "dauer_minuten" <= 1440);
ALTER TABLE "report_activities" ADD CONSTRAINT "chk_report_activity_beschreibung" CHECK (char_length("beschreibung") BETWEEN 1 AND 500);