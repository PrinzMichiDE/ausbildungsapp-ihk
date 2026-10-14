-- Migration: sync_schema_with_prisma_model
-- Brings the database in line with prisma/schema.prisma, which had drifted
-- ahead of the migration history (new tables/columns/enums, Prisma-style enum
-- names, TEXT ids/FKs).
--
-- Enum renames (e.g. pruefungs_status -> "PruefungsStatus") and VARCHAR status
-- columns converted to enums are done in place via
-- ALTER COLUMN ... TYPE ... USING col::text::"NewEnum" instead of the generated
-- DROP COLUMN / ADD COLUMN, so existing values are preserved. Values that are
-- not part of the target enum make the migration fail instead of being lost.
-- CreateEnum
CREATE TYPE "ProjektStatus" AS ENUM ('entwurf', 'eingereicht', 'in_pruefung', 'freigegeben', 'abgelehnt', 'archiviert');

-- CreateEnum
CREATE TYPE "GradeStatus" AS ENUM ('entwurf', 'bestaetigt', 'visiert', 'archiviert');

-- CreateEnum
CREATE TYPE "Halbjahr" AS ENUM ('erstes', 'zweites');

-- CreateEnum
CREATE TYPE "Pruefungsart" AS ENUM ('schriftlich', 'muendlich', 'projektarbeit', 'sonstige');

-- CreateEnum
CREATE TYPE "GradeTyp" AS ENUM ('note', 'zertifikat', 'projekt', 'versetzungszeugnis');

-- CreateEnum
CREATE TYPE "Gewichtungskategorie" AS ENUM ('schulisch', 'berufsschulisch', 'betrieblich', 'ihk_pruefung');

-- CreateEnum
CREATE TYPE "PruefungTyp" AS ENUM ('ap1', 'ap2');

-- CreateEnum
CREATE TYPE "PruefungsStatus" AS ENUM ('angemeldet', 'teilgenommen', 'bestanden', 'wiederholung');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('review', 'deadline', 'reminder', 'absence', 'system');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "DatenschutzRequestTyp" AS ENUM ('access', 'export', 'deletion', 'rectification', 'restriction', 'portability', 'objection');

-- CreateEnum
CREATE TYPE "DatenschutzRequestStatus" AS ENUM ('open', 'in_progress', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "ConsentAction" AS ENUM ('granted', 'revoked');

-- CreateEnum
CREATE TYPE "LegalBasisArticle" AS ENUM ('art6_1_a', 'art6_1_b', 'art6_1_c', 'art6_1_f');

-- CreateEnum
CREATE TYPE "DpiaRisk" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "DpiaStatus" AS ENUM ('open', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "Ausbildungsberuf" AS ENUM ('systemintegration', 'anwendungsentwicklung', 'daten_prozessanalyse', 'digitale_vernetzung', 'fachinformatiker', 'elektroniker', 'industriemechaniker', 'mechatroniker', 'zerspanungsmechaniker', 'konstruktionsmechaniker', 'werkzeugmechaniker', 'automotive_mechaniker', 'kfz_mechaniker', 'landwirt', 'forstwirt', 'gärtner', 'tischler', 'steinmetz', 'maler', 'glaser', 'sanitär_heizung_klimatechnik', 'elektronik_elektronik', 'IT_systemelektroniker', 'pharmazeutisch_technischer_assistent', 'medizinisch_technischer_assistent', 'biologe', 'chemielaborant', 'lebensmittelchemiker', 'lebensmitteltechnologe', 'banker', 'kaufmann_für_bankwirtschaft', 'kaufmann_für_spedition_logistik', 'kaufmann_für_marketingkommunikation', 'kaufmann_für_digitalmanagement', 'kaufmann_für_versicherungen', 'industriekaufmann', 'bankkaufmann', 'sparkassenkaufmann', 'steuerfachangestellter', 'steuerfachwirt', 'wirtschaftsprüfer', 'controller', 'bilanzbuchhalter', 'personalreferent', 'personalkaufmann', 'vertriebskaufmann', 'kaufmann_für_einzelhandel', 'kaufmann_für_spedition', 'kaufmann_für_lagerlogistik', 'kaufmann_für_marketing', 'kaufmann_für_digitalisierung', 'kaufmann_für_cybersicherheit', 'kaufmann_für_kI', 'kaufmann_für_data_science', 'kaufmann_für_webentwicklung', 'kaufmann_für_gamedesign', 'kaufmann_für_medientechnik', 'kaufmann_für_fotografie', 'kaufmann_für_video_produktion', 'kaufmann_für_audio_technik', 'kaufmann_für_tischlerei', 'kaufmann_für_metallgestaltung', 'kaufmann_für_glasgestaltung', 'kaufmann_für_keramik', 'kaufmann_für_textilgestaltung', 'kaufmann_für_goldschmied', 'kaufmann_für_juwelier', 'kaufmann_für_pflege', 'kaufmann_für_ergotherapie', 'kaufmann_für_physiotherapie', 'kaufmann_für_logopädie', 'kaufmann_für_heilerziehungspflege', 'kaufmann_für_soziale_pflege', 'kaufmann_für_altenpflege', 'kaufmann_für_krankenpflege', 'kaufmann_für_pflegewissenschaften');

-- CreateEnum
CREATE TYPE "AusbildungsplanStatus" AS ENUM ('entwurf', 'eingereicht', 'geprueft', 'genehmigt');

-- CreateEnum
CREATE TYPE "VertragsStatus" AS ENUM ('aktiv', 'beendet', 'archiviert');

-- CreateEnum
CREATE TYPE "ErziehungsBezug" AS ENUM ('elternteil', 'betreuer', 'anderer');

-- CreateEnum
CREATE TYPE "UebernahmeErgebnis" AS ENUM ('geplant', 'geblockt', 'abgeschlossen', 'widerrufen');

-- CreateEnum
CREATE TYPE "FeedbackGespraechTyp" AS ENUM ('regelmaessig', 'anlassbezogen', 'probezeit', 'uebernahme');

-- CreateEnum
CREATE TYPE "FeedbackGespraechStatus" AS ENUM ('geplant', 'durchgefuehrt', 'dokumentiert', 'nachverfolgt');

-- CreateEnum
CREATE TYPE "VereinbarungStatus" AS ENUM ('offen', 'erledigt');

-- CreateEnum
CREATE TYPE "FoerderMassnahme" AS ENUM ('nachhilfe', 'gespraech', 'andere');

-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('nicht_begonnen', 'in_arbeit', 'vermittelt');

-- CreateEnum
CREATE TYPE "LernpfadPrioritaet" AS ENUM ('hoch', 'mittel', 'niedrig');

-- DropForeignKey
ALTER TABLE "audit_events" DROP CONSTRAINT "audit_events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "consent_logs" DROP CONSTRAINT "consent_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "consents" DROP CONSTRAINT "consents_user_id_fkey";

-- DropForeignKey
ALTER TABLE "datenschutz_requests" DROP CONSTRAINT "datenschutz_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "grade_versions" DROP CONSTRAINT "grade_versions_grade_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_preferences" DROP CONSTRAINT "notification_preferences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projekte" DROP CONSTRAINT "projekte_azubi_id_fkey";

-- DropForeignKey
ALTER TABLE "pruefungen" DROP CONSTRAINT "pruefungen_azubi_id_fkey";

-- DropForeignKey
ALTER TABLE "pruefungs_meilensteine" DROP CONSTRAINT "pruefungs_meilensteine_pruefung_id_fkey";

-- DropForeignKey
ALTER TABLE "report_attachments" DROP CONSTRAINT "report_attachments_report_id_fkey";

-- DropForeignKey
ALTER TABLE "report_time_entries" DROP CONSTRAINT "report_time_entries_report_id_fkey";

-- DropForeignKey
ALTER TABLE "report_versions" DROP CONSTRAINT "report_versions_report_id_fkey";

-- DropIndex
DROP INDEX "idx_report_version_report_id";

-- DropIndex
DROP INDEX "idx_report_version_version";

-- AlterTable
ALTER TABLE "abteilungen" ADD COLUMN     "standort_id" TEXT;

-- AlterTable
ALTER TABLE "abwesenheiten" ADD COLUMN     "urlaubsanspruch" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "audit_events" DROP CONSTRAINT "audit_events_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "action" SET DATA TYPE TEXT,
ALTER COLUMN "entity" SET DATA TYPE TEXT,
ALTER COLUMN "entity_id" SET DATA TYPE TEXT,
ALTER COLUMN "ip_address" SET DATA TYPE TEXT,
ALTER COLUMN "user_agent" SET DATA TYPE TEXT,
ADD CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "consent_logs" DROP CONSTRAINT "consent_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "key" SET DATA TYPE TEXT,
ALTER COLUMN "version" SET DATA TYPE TEXT,
ALTER COLUMN "action" DROP DEFAULT,
ALTER COLUMN "action" SET DATA TYPE "ConsentAction" USING "action"::text::"ConsentAction",
ALTER COLUMN "action" SET NOT NULL,
ALTER COLUMN "ip_address" SET DATA TYPE TEXT,
ALTER COLUMN "source" SET DATA TYPE TEXT,
ADD CONSTRAINT "consent_logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "consents" DROP CONSTRAINT "consents_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "key" SET DATA TYPE TEXT,
ALTER COLUMN "version" SET DATA TYPE TEXT,
ALTER COLUMN "ip_address" SET DATA TYPE TEXT,
ALTER COLUMN "source" DROP NOT NULL,
ALTER COLUMN "source" SET DATA TYPE TEXT,
ADD CONSTRAINT "consents_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "datenschutz_requests" DROP CONSTRAINT "datenschutz_requests_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "typ" DROP DEFAULT,
ALTER COLUMN "typ" SET DATA TYPE "DatenschutzRequestTyp" USING "typ"::text::"DatenschutzRequestTyp",
ALTER COLUMN "typ" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE "DatenschutzRequestStatus" USING "status"::text::"DatenschutzRequestStatus",
ALTER COLUMN "status" SET DEFAULT 'open',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "processed_by" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "datenschutz_requests_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dpia_entries" DROP CONSTRAINT "dpia_entries_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "risk_level" DROP DEFAULT,
ALTER COLUMN "risk_level" SET DATA TYPE "DpiaRisk" USING "risk_level"::text::"DpiaRisk",
ALTER COLUMN "risk_level" SET DEFAULT 'low',
ALTER COLUMN "risk_level" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE "DpiaStatus" USING "status"::text::"DpiaStatus",
ALTER COLUMN "status" SET DEFAULT 'open',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "assessed_by" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "dpia_entries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "grade_versions" DROP CONSTRAINT "grade_versions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "grade_id" SET DATA TYPE TEXT,
ALTER COLUMN "fach" SET DATA TYPE TEXT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE "GradeStatus" USING "status"::text::"GradeStatus",
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "zeitraum" SET DATA TYPE TEXT,
ALTER COLUMN "halbjahr" DROP DEFAULT,
ALTER COLUMN "halbjahr" SET DATA TYPE "Halbjahr" USING "halbjahr"::text::"Halbjahr",
ALTER COLUMN "datum" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "pruefungsart" DROP DEFAULT,
ALTER COLUMN "pruefungsart" SET DATA TYPE "Pruefungsart" USING "pruefungsart"::text::"Pruefungsart",
ALTER COLUMN "gewichtungs_kategorie" DROP DEFAULT,
ALTER COLUMN "gewichtungs_kategorie" SET DATA TYPE "Gewichtungskategorie" USING "gewichtungs_kategorie"::text::"Gewichtungskategorie",
ALTER COLUMN "typ" DROP DEFAULT,
ALTER COLUMN "typ" SET DATA TYPE "GradeTyp" USING "typ"::text::"GradeTyp",
ALTER COLUMN "typ" SET DEFAULT 'note',
ALTER COLUMN "typ" SET NOT NULL,
ALTER COLUMN "pruefer_id" SET DATA TYPE TEXT,
ALTER COLUMN "pruefungsdatum" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "zeugnis_url" SET DATA TYPE TEXT,
ALTER COLUMN "bewertet_von" SET DATA TYPE TEXT,
ALTER COLUMN "bewertet_am" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "erstellt_von" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "grade_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "bemerkungen" TEXT,
ADD COLUMN     "beschreibung" TEXT,
ADD COLUMN     "bewertet_am" TIMESTAMP(3),
ADD COLUMN     "bewertet_von" TEXT,
ADD COLUMN     "bewertung" TEXT,
ADD COLUMN     "datum" TIMESTAMP(3),
ADD COLUMN     "gewichtung" DOUBLE PRECISION DEFAULT 1.0,
ADD COLUMN     "gewichtungs_kategorie" "Gewichtungskategorie",
ADD COLUMN     "halbjahr" "Halbjahr",
ADD COLUMN     "kurs_id" TEXT,
ADD COLUMN     "maßnahme" TEXT,
ADD COLUMN     "pruefer_id" TEXT,
ADD COLUMN     "pruefungsart" "Pruefungsart",
ADD COLUMN     "pruefungsdatum" TIMESTAMP(3),
ADD COLUMN     "quellen_url" TEXT,
ADD COLUMN     "status" "GradeStatus" NOT NULL DEFAULT 'entwurf',
ADD COLUMN     "typ" "GradeTyp" NOT NULL DEFAULT 'note',
ADD COLUMN     "wiederholung" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "legal_bases" DROP CONSTRAINT "legal_bases_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "retention_period" SET DATA TYPE TEXT,
ALTER COLUMN "legal_basis" DROP DEFAULT,
ALTER COLUMN "legal_basis" SET DATA TYPE "LegalBasisArticle" USING "legal_basis"::text::"LegalBasisArticle",
ALTER COLUMN "legal_basis" SET NOT NULL,
ALTER COLUMN "controller" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "legal_bases_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notification_preferences" DROP CONSTRAINT "notification_preferences_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "category" SET DATA TYPE "NotificationCategory" USING "category"::text::"NotificationCategory",
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "category" SET DATA TYPE "NotificationCategory" USING "category"::text::"NotificationCategory",
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "priority" DROP DEFAULT,
ALTER COLUMN "priority" SET DATA TYPE "NotificationPriority" USING "priority"::text::"NotificationPriority",
ALTER COLUMN "priority" SET DEFAULT 'medium',
ALTER COLUMN "priority" SET NOT NULL,
ALTER COLUMN "reference_type" SET DATA TYPE TEXT,
ALTER COLUMN "reference_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "projekte" DROP CONSTRAINT "projekte_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "azubi_id" SET DATA TYPE TEXT,
ALTER COLUMN "titel" SET DATA TYPE TEXT,
ALTER COLUMN "beschreibung" SET DATA TYPE TEXT,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE "ProjektStatus" USING "status"::text::"ProjektStatus",
ALTER COLUMN "status" SET DEFAULT 'entwurf',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "bewertet_von" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "projekte_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pruefungen" DROP CONSTRAINT "pruefungen_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "azubi_id" SET DATA TYPE TEXT,
ALTER COLUMN "typ" DROP DEFAULT,
ALTER COLUMN "typ" SET DATA TYPE "PruefungTyp" USING "typ"::text::"PruefungTyp",
ALTER COLUMN "typ" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE "PruefungsStatus" USING "status"::text::"PruefungsStatus",
ALTER COLUMN "status" SET DEFAULT 'angemeldet',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "beschreibung" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "pruefungen_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pruefungs_meilensteine" DROP CONSTRAINT "pruefungs_meilensteine_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pruefung_id" SET DATA TYPE TEXT,
ALTER COLUMN "titel" SET DATA TYPE TEXT,
ALTER COLUMN "beschreibung" SET DATA TYPE TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "pruefungs_meilensteine_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "report_attachments" DROP CONSTRAINT "report_attachments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "report_id" SET DATA TYPE TEXT,
ALTER COLUMN "typ" SET DATA TYPE TEXT,
ALTER COLUMN "datei_url" SET DATA TYPE TEXT,
ALTER COLUMN "erstellt_von" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "report_attachments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "report_time_entries" DROP CONSTRAINT "report_time_entries_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "report_id" SET DATA TYPE TEXT,
ALTER COLUMN "task_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "report_time_entries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "report_versions" DROP CONSTRAINT "report_versions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "report_id" SET DATA TYPE TEXT,
ALTER COLUMN "erstellt_von" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "report_versions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "ausbildungsnachweis_id" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "mfa_secret" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "consent_action";

-- DropEnum
DROP TYPE "datenschutz_request_status";

-- DropEnum
DROP TYPE "datenschutz_request_typ";

-- DropEnum
DROP TYPE "dpia_risk";

-- DropEnum
DROP TYPE "dpia_status";

-- DropEnum
DROP TYPE "legal_basis_article";

-- DropEnum
DROP TYPE "notification_category";

-- DropEnum
DROP TYPE "notification_priority";

-- DropEnum
DROP TYPE "pruefung_typ";

-- DropEnum
DROP TYPE "pruefungs_status";

-- CreateTable
CREATE TABLE "ausbildungsplaene" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "ausbilder_id" TEXT NOT NULL,
    "beruf" "Ausbildungsberuf" NOT NULL,
    "jahr" INTEGER NOT NULL,
    "inhalte" JSONB,
    "status" "AusbildungsplanStatus" NOT NULL DEFAULT 'entwurf',
    "anhang_url" TEXT,
    "gueltig_von" TIMESTAMP(3),
    "gueltig_bis" TIMESTAMP(3),
    "geprueft_von" TEXT,
    "geprueft_am" TIMESTAMP(3),
    "rahmenlehrplan_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ausbildungsplaene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ausbildungsvertraege" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "ausbildungsberuf" "Ausbildungsberuf" NOT NULL,
    "startdatum" TIMESTAMP(3) NOT NULL,
    "enddatum" TIMESTAMP(3) NOT NULL,
    "probezeit_monate" INTEGER NOT NULL DEFAULT 4,
    "dauer_monate" INTEGER NOT NULL,
    "verkuerzung_monate" INTEGER,
    "verlaengerung_grund" TEXT,
    "vertrags_url" TEXT,
    "status" "VertragsStatus" NOT NULL DEFAULT 'aktiv',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ausbildungsvertraege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "erziehungsberechtigte" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bezug" "ErziehungsBezug" NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "berechtigungen" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "erziehungsberechtigte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_templates" (
    "id" TEXT NOT NULL,
    "beruf" "Ausbildungsberuf" NOT NULL,
    "jahr" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "felder" JSONB NOT NULL,
    "ist_standard" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_gespraeche" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "durchgefuehrt_von_id" TEXT NOT NULL,
    "typ" "FeedbackGespraechTyp" NOT NULL,
    "status" "FeedbackGespraechStatus" NOT NULL DEFAULT 'geplant',
    "termin" TIMESTAMP(3),
    "durchgefuehrt_am" TIMESTAMP(3),
    "ziele" TEXT,
    "verlaufsnotiz" TEXT,
    "sichtbarkeit_azubi" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_gespraeche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gespraech_vereinbarungen" (
    "id" TEXT NOT NULL,
    "gespraech_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "faellig_am" TIMESTAMP(3),
    "status" "VereinbarungStatus" NOT NULL DEFAULT 'offen',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gespraech_vereinbarungen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_entries" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "fach" TEXT NOT NULL,
    "halbjahr" TEXT,
    "note" DOUBLE PRECISION NOT NULL,
    "datum" TIMESTAMP(3),
    "pruefungsart" TEXT,
    "gewichtung" DOUBLE PRECISION,
    "zeugnis_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grade_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foerderbedarfe" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "grade_entry_id" TEXT,
    "massnahme" "FoerderMassnahme" NOT NULL,
    "beschreibung" TEXT,
    "durchgefuehrt_von" TEXT,
    "durchgefuehrt_am" TIMESTAMP(3),
    "ergebnis" TEXT,
    "nachverfolgung_am" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foerderbedarfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berufsschulen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adresse" TEXT,
    "klasse" TEXT,
    "klassenlehrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "berufsschulen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uebernahme_gespraeche" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "hr_id" TEXT,
    "termin" TIMESTAMP(3),
    "ergebnis" "UebernahmeErgebnis" NOT NULL DEFAULT 'geplant',
    "notizen" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uebernahme_gespraeche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumni" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "austritt_am" TIMESTAMP(3) NOT NULL,
    "loeschung_am" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alumni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versetzungswuensche" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "wunsch_abteilungen" TEXT[],
    "begruendung" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "versetzungswuensche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llm_quotas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "modell" TEXT NOT NULL,
    "limit_per_hour" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "reset_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llm_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_index" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "inhalt" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_assignments" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "framework_id" TEXT NOT NULL,
    "course_id" TEXT,
    "status" "SkillStatus" NOT NULL DEFAULT 'nicht_begonnen',
    "fortschritt" INTEGER NOT NULL DEFAULT 0,
    "vermittelt_von" TEXT,
    "vermittelt_am" TIMESTAMP(3),
    "bemerkungen" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_matrix_benchmarks" (
    "id" TEXT NOT NULL,
    "jahrgang" INTEGER NOT NULL,
    "beruf" TEXT NOT NULL,
    "lernfeld_id" TEXT NOT NULL,
    "durchschnitt_note" DOUBLE PRECISION NOT NULL,
    "durchschnitt_abdeckung_prozent" DOUBLE PRECISION NOT NULL,
    "durchschnitt_fortschritt" DOUBLE PRECISION NOT NULL,
    "azubi_anzahl" INTEGER NOT NULL,
    "berechnet_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_matrix_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lernpfad" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "prioritaet" "LernpfadPrioritaet" NOT NULL DEFAULT 'mittel',
    "skip_begründung" TEXT,
    "ausgeschlossen" BOOLEAN NOT NULL DEFAULT false,
    "erstellt_von" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lernpfad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standorte" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adresse" TEXT,
    "plz" TEXT,
    "ort" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standorte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kompetenzprofile" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "fachkompetenzen" TEXT[],
    "sozialkompetenzen" TEXT[],
    "staerken" TEXT[],
    "schwaechen" TEXT[],
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kompetenzprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schnittstellenkonfigurationen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "systemTyp" TEXT NOT NULL,
    "oauth2Config" TEXT,
    "webhookConfig" TEXT,
    "status" TEXT NOT NULL DEFAULT 'aktiv',
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schnittstellenkonfigurationen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ausbildungsnachweise" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "inhalt_markdown" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'entwurf',
    "signiert_von" TEXT,
    "signiert_am" TIMESTAMP(3),
    "archiviert_am" TIMESTAMP(3),
    "rahmenlehrplan_id" TEXT,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ausbildungsnachweise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pruefungssimulationen" (
    "id" TEXT NOT NULL,
    "beruf" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "aufgaben" TEXT[],
    "loesungen" TEXT[],
    "bewertung" TEXT,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pruefungssimulationen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lernzeit_tracker" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "course_id" TEXT,
    "lektion_id" TEXT,
    "durchgehend_verbracht" TIMESTAMP(3),
    "aktivitaetstyp" TEXT NOT NULL,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lernzeit_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kompetenzabdeckung" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "lernfeld_id" TEXT,
    "sollStunden" DOUBLE PRECISION NOT NULL,
    "istStunden" DOUBLE PRECISION NOT NULL,
    "deckungProzent" DOUBLE PRECISION NOT NULL,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kompetenzabdeckung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eskaliungen" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "stufe" INTEGER NOT NULL,
    "triggermail" BOOLEAN NOT NULL DEFAULT false,
    "manuelle_eskalation" BOOLEAN NOT NULL DEFAULT false,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eskaliungen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abteilungsuebergaben" (
    "id" TEXT NOT NULL,
    "von_einsatz_id" TEXT,
    "bis_einsatz_id" TEXT,
    "datum" TIMESTAMP(3),
    "wichtigeLernziele" TEXT,
    "offenePunkte" TEXT,
    "uebergabeprotokoll_url" TEXT,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abteilungsuebergaben_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kapazitaetswarnungen" (
    "id" TEXT NOT NULL,
    "abteilung_id" TEXT NOT NULL,
    "jahr" INTEGER NOT NULL,
    "planAusbilder" INTEGER NOT NULL,
    "tatsaechlicheAusbilder" INTEGER NOT NULL,
    "warnSchwelle" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OK',
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kapazitaetswarnungen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentoring" (
    "id" TEXT NOT NULL,
    "pate_id" TEXT NOT NULL,
    "mentori_id" TEXT NOT NULL,
    "jahrgang" INTEGER,
    "rollen" TEXT[],
    "aktiv" BOOLEAN NOT NULL DEFAULT true,
    "zugewiesen_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "beendetAm" TIMESTAMP(3),
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "frage" TEXT NOT NULL,
    "antwort" TEXT NOT NULL,
    "quelle_id" TEXT,
    "aktualisiertVon" TEXT,
    "aktualisiertAm" TIMESTAMP(3),
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_courses" (
    "id" TEXT NOT NULL,
    "ausbilder_id" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "beschreibung" TEXT,
    "inhalt" TEXT,
    "verantwortlichkeiten" TEXT[],
    "freigegeben" BOOLEAN NOT NULL DEFAULT false,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genehmigt_von" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rahmenlehrplaene" (
    "id" TEXT NOT NULL,
    "beruf" "Ausbildungsberuf" NOT NULL,
    "jahr" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "inhalt" JSONB NOT NULL,
    "ist_standard" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rahmenlehrplaene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ausbildungsnachweis_kommentare" (
    "id" TEXT NOT NULL,
    "nachweis_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "art" TEXT NOT NULL DEFAULT 'allgemein',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ausbildungsnachweis_kommentare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ausbildungsnachweis_anhaenge" (
    "id" TEXT NOT NULL,
    "nachweis_id" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "datei_url" TEXT NOT NULL,
    "kommentar" TEXT,
    "erstellt_von" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ausbildungsnachweis_anhaenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ausbildungsnachweis_versions" (
    "id" TEXT NOT NULL,
    "nachweis_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "inhalt_markdown" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "erstellt_von" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ausbildungsnachweis_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_konfigurationen" (
    "id" TEXT NOT NULL,
    "benutzer_id" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "schwellenwert" DOUBLE PRECISION,
    "aktive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_konfigurationen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "datenportabilitaet" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "exportTyp" TEXT NOT NULL,
    "daten" JSONB NOT NULL,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "datenportabilitaet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kohorten" (
    "id" TEXT NOT NULL,
    "jahr" INTEGER NOT NULL,
    "beruf" "Ausbildungsberuf" NOT NULL,
    "durchschnitt_abbruchquote" DOUBLE PRECISION,
    "durchschnitt_notendurchschnitt" DOUBLE PRECISION,
    "durchschnitt_kompetenzabdeckung" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kohorten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unterrichtsstunden" (
    "id" TEXT NOT NULL,
    "azubi_id" TEXT NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL,
    "typ" TEXT NOT NULL,
    "beschreibung" TEXT,
    "stunden" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unterrichtsstunden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standortspezifische_badges" (
    "id" TEXT NOT NULL,
    "standort_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "beschreibung" TEXT,
    "criteria" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "standortspezifische_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standortspezifische_lektionen" (
    "id" TEXT NOT NULL,
    "standort_id" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "inhalt_markdown" TEXT NOT NULL,
    "erstellt_am" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standortspezifische_lektionen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GradeBewertetVon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GradeBewertetVon_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ausbildungsplaene_azubi_id_idx" ON "ausbildungsplaene"("azubi_id");

-- CreateIndex
CREATE UNIQUE INDEX "ausbildungsvertraege_azubi_id_key" ON "ausbildungsvertraege"("azubi_id");

-- CreateIndex
CREATE INDEX "erziehungsberechtigte_azubi_id_idx" ON "erziehungsberechtigte"("azubi_id");

-- CreateIndex
CREATE INDEX "feedback_gespraeche_azubi_id_idx" ON "feedback_gespraeche"("azubi_id");

-- CreateIndex
CREATE INDEX "gespraech_vereinbarungen_gespraech_id_idx" ON "gespraech_vereinbarungen"("gespraech_id");

-- CreateIndex
CREATE INDEX "grade_entries_azubi_id_idx" ON "grade_entries"("azubi_id");

-- CreateIndex
CREATE INDEX "foerderbedarfe_azubi_id_idx" ON "foerderbedarfe"("azubi_id");

-- CreateIndex
CREATE INDEX "uebernahme_gespraeche_azubi_id_idx" ON "uebernahme_gespraeche"("azubi_id");

-- CreateIndex
CREATE UNIQUE INDEX "alumni_azubi_id_key" ON "alumni"("azubi_id");

-- CreateIndex
CREATE INDEX "versetzungswuensche_azubi_id_idx" ON "versetzungswuensche"("azubi_id");

-- CreateIndex
CREATE INDEX "search_index_entity_type_idx" ON "search_index"("entity_type");

-- CreateIndex
CREATE INDEX "idx_skill_assignment_azubi_id" ON "skill_assignments"("azubi_id");

-- CreateIndex
CREATE INDEX "idx_skill_assignment_framework_id" ON "skill_assignments"("framework_id");

-- CreateIndex
CREATE INDEX "idx_skill_assignment_status" ON "skill_assignments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "skill_assignments_azubi_id_framework_id_key" ON "skill_assignments"("azubi_id", "framework_id");

-- CreateIndex
CREATE INDEX "idx_benchmark_jahrgang_beruf" ON "skill_matrix_benchmarks"("jahrgang", "beruf");

-- CreateIndex
CREATE INDEX "idx_benchmark_lernfeld_id" ON "skill_matrix_benchmarks"("lernfeld_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_matrix_benchmarks_jahrgang_beruf_lernfeld_id_key" ON "skill_matrix_benchmarks"("jahrgang", "beruf", "lernfeld_id");

-- CreateIndex
CREATE INDEX "idx_lernpfad_azubi_id" ON "lernpfad"("azubi_id");

-- CreateIndex
CREATE INDEX "idx_lernpfad_course_id" ON "lernpfad"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "lernpfad_azubi_id_course_id_key" ON "lernpfad"("azubi_id", "course_id");

-- CreateIndex
CREATE INDEX "kompetenzprofile_azubi_id_idx" ON "kompetenzprofile"("azubi_id");

-- CreateIndex
CREATE INDEX "ausbildungsnachweise_azubi_id_idx" ON "ausbildungsnachweise"("azubi_id");

-- CreateIndex
CREATE INDEX "ausbildungsnachweise_status_idx" ON "ausbildungsnachweise"("status");

-- CreateIndex
CREATE INDEX "idx_nachweis_kommentar_nachweis_id" ON "ausbildungsnachweis_kommentare"("nachweis_id");

-- CreateIndex
CREATE INDEX "idx_nachweis_anhang_nachweis_id" ON "ausbildungsnachweis_anhaenge"("nachweis_id");

-- CreateIndex
CREATE INDEX "idx_nachweis_version_nachweis_id" ON "ausbildungsnachweis_versions"("nachweis_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_nachweis_version" ON "ausbildungsnachweis_versions"("nachweis_id", "version");

-- CreateIndex
CREATE INDEX "idx_alert_benutzer_id" ON "alert_konfigurationen"("benutzer_id");

-- CreateIndex
CREATE INDEX "idx_datenportabilitaet_azubi_id" ON "datenportabilitaet"("azubi_id");

-- CreateIndex
CREATE INDEX "idx_unterricht_azubi_id" ON "unterrichtsstunden"("azubi_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_standort_badge" ON "standortspezifische_badges"("standort_id", "badge_id");

-- CreateIndex
CREATE INDEX "idx_standort_lektion_standort_id" ON "standortspezifische_lektionen"("standort_id");

-- CreateIndex
CREATE INDEX "_GradeBewertetVon_B_index" ON "_GradeBewertetVon"("B");

-- CreateIndex
CREATE INDEX "idx_grade_fach" ON "grades"("fach");

-- CreateIndex
CREATE INDEX "idx_grade_status" ON "grades"("status");

-- CreateIndex
CREATE INDEX "idx_grade_typ" ON "grades"("typ");

-- CreateIndex
CREATE INDEX "idx_grade_datum" ON "grades"("datum");

-- AddForeignKey
ALTER TABLE "abteilungen" ADD CONSTRAINT "abteilungen_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorte"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_kurs_id_fkey" FOREIGN KEY ("kurs_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_versions" ADD CONSTRAINT "grade_versions_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projekte" ADD CONSTRAINT "projekte_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pruefungen" ADD CONSTRAINT "pruefungen_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pruefungs_meilensteine" ADD CONSTRAINT "pruefungs_meilensteine_pruefung_id_fkey" FOREIGN KEY ("pruefung_id") REFERENCES "pruefungen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datenschutz_requests" ADD CONSTRAINT "datenschutz_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_logs" ADD CONSTRAINT "consent_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsplaene" ADD CONSTRAINT "ausbildungsplaene_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsplaene" ADD CONSTRAINT "ausbildungsplaene_ausbilder_id_fkey" FOREIGN KEY ("ausbilder_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsvertraege" ADD CONSTRAINT "ausbildungsvertraege_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "erziehungsberechtigte" ADD CONSTRAINT "erziehungsberechtigte_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_attachments" ADD CONSTRAINT "report_attachments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_versions" ADD CONSTRAINT "report_versions_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_time_entries" ADD CONSTRAINT "report_time_entries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_gespraeche" ADD CONSTRAINT "feedback_gespraeche_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_gespraeche" ADD CONSTRAINT "feedback_gespraeche_durchgefuehrt_von_id_fkey" FOREIGN KEY ("durchgefuehrt_von_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gespraech_vereinbarungen" ADD CONSTRAINT "gespraech_vereinbarungen_gespraech_id_fkey" FOREIGN KEY ("gespraech_id") REFERENCES "feedback_gespraeche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_entries" ADD CONSTRAINT "grade_entries_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foerderbedarfe" ADD CONSTRAINT "foerderbedarfe_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uebernahme_gespraeche" ADD CONSTRAINT "uebernahme_gespraeche_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumni" ADD CONSTRAINT "alumni_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versetzungswuensche" ADD CONSTRAINT "versetzungswuensche_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_assignments" ADD CONSTRAINT "skill_assignments_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_assignments" ADD CONSTRAINT "skill_assignments_framework_id_fkey" FOREIGN KEY ("framework_id") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_assignments" ADD CONSTRAINT "skill_assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_matrix_benchmarks" ADD CONSTRAINT "skill_matrix_benchmarks_lernfeld_id_fkey" FOREIGN KEY ("lernfeld_id") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lernpfad" ADD CONSTRAINT "lernpfad_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lernpfad" ADD CONSTRAINT "lernpfad_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lernpfad" ADD CONSTRAINT "lernpfad_erstellt_von_fkey" FOREIGN KEY ("erstellt_von") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsnachweise" ADD CONSTRAINT "ausbildungsnachweise_rahmenlehrplan_id_fkey" FOREIGN KEY ("rahmenlehrplan_id") REFERENCES "rahmenlehrplaene"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsnachweis_kommentare" ADD CONSTRAINT "ausbildungsnachweis_kommentare_nachweis_id_fkey" FOREIGN KEY ("nachweis_id") REFERENCES "ausbildungsnachweise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsnachweis_kommentare" ADD CONSTRAINT "ausbildungsnachweis_kommentare_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsnachweis_anhaenge" ADD CONSTRAINT "ausbildungsnachweis_anhaenge_nachweis_id_fkey" FOREIGN KEY ("nachweis_id") REFERENCES "ausbildungsnachweise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ausbildungsnachweis_versions" ADD CONSTRAINT "ausbildungsnachweis_versions_nachweis_id_fkey" FOREIGN KEY ("nachweis_id") REFERENCES "ausbildungsnachweise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_konfigurationen" ADD CONSTRAINT "alert_konfigurationen_benutzer_id_fkey" FOREIGN KEY ("benutzer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datenportabilitaet" ADD CONSTRAINT "datenportabilitaet_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unterrichtsstunden" ADD CONSTRAINT "unterrichtsstunden_azubi_id_fkey" FOREIGN KEY ("azubi_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standortspezifische_badges" ADD CONSTRAINT "standortspezifische_badges_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standortspezifische_badges" ADD CONSTRAINT "standortspezifische_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standortspezifische_lektionen" ADD CONSTRAINT "standortspezifische_lektionen_standort_id_fkey" FOREIGN KEY ("standort_id") REFERENCES "standorte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeBewertetVon" ADD CONSTRAINT "_GradeBewertetVon_A_fkey" FOREIGN KEY ("A") REFERENCES "grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GradeBewertetVon" ADD CONSTRAINT "_GradeBewertetVon_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_report_attachment_report_id" RENAME TO "report_attachments_report_id_idx";

-- RenameIndex
ALTER INDEX "idx_report_timeentry_report_id" RENAME TO "report_time_entries_report_id_idx";

-- RenameIndex
ALTER INDEX "uq_report_version_number" RENAME TO "report_versions_report_id_version_key";
