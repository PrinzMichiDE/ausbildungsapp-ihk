<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useReportStore } from '@/stores/report'
import {
  STATUS_CLASSES,
  STATUS_LABELS,
  formatDate,
  formatMinutes,
  isoWeekMonday,
  isoWeekOf,
} from '@/utils/report-time'

const auth = useAuthStore()
const reportStore = useReportStore()
const router = useRouter()

const today = isoWeekOf(new Date())
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const selectedStatus = ref('')
const showCreateDialog = ref(false)
const createError = ref<string | null>(null)
const existingReportId = ref<string | null>(null)

const newReport = ref({ titel: '', kalenderwoche: today.kalenderwoche, jahr: today.jahr })

const newReportRange = computed(() => {
  const { jahr, kalenderwoche } = newReport.value
  if (!jahr || !kalenderwoche || kalenderwoche < 1 || kalenderwoche > 53) return null
  const montag = isoWeekMonday(jahr, kalenderwoche)
  const sonntag = new Date(new Date(`${montag}T00:00:00Z`).getTime() + 6 * 86_400_000).toISOString().slice(0, 10)
  return { montag, sonntag }
})

const stats = computed(() => {
  const all = reportStore.reports
  return {
    total: all.length,
    draft: all.filter((r) => r.status === 'entwurf').length,
    submitted: all.filter((r) => r.status === 'eingereicht' || r.status === 'in_pruefung').length,
    approved: all.filter((r) => r.status === 'visiert' || r.status === 'archiviert').length,
  }
})

function reload() {
  void reportStore.fetchReports({ jahr: selectedYear.value, status: selectedStatus.value || undefined })
}

async function openCreate() {
  createError.value = null
  existingReportId.value = null
  newReport.value = { titel: `KW ${today.kalenderwoche}`, kalenderwoche: today.kalenderwoche, jahr: today.jahr }
  showCreateDialog.value = true
  await nextTick()
  document.getElementById('new-report-titel')?.focus()
}

async function handleCreate() {
  createError.value = null
  existingReportId.value = null
  try {
    const created = await reportStore.createReport(newReport.value)
    showCreateDialog.value = false
    await router.push(`/reports/${created.id}`)
  } catch (error) {
    if (isAxiosError(error)) {
      const body = error.response?.data as { message?: string; error?: string; details?: { reportId?: string } } | undefined
      createError.value = body?.message ?? 'Bericht konnte nicht erstellt werden.'
      if (body?.error === 'REPORT_WEEK_EXISTS') existingReportId.value = body.details?.reportId ?? null
    } else {
      createError.value = 'Bericht konnte nicht erstellt werden.'
    }
  }
}

function onDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') showCreateDialog.value = false
}

onMounted(reload)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Berichtsheft</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Erfasse jeden Tag deiner Woche mit Aktivitäten und Zeiten.
        </p>
      </div>
      <button
        v-if="auth.isAzubi"
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        @click="openCreate"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Neue Woche
      </button>
    </div>

    <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <dd class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ stats.total }}</dd>
        <dt class="mt-1 text-xs text-slate-600 dark:text-slate-400">Gesamt</dt>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <dd class="text-2xl font-bold text-slate-700 dark:text-slate-300">{{ stats.draft }}</dd>
        <dt class="mt-1 text-xs text-slate-600 dark:text-slate-400">Entwürfe</dt>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <dd class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ stats.submitted }}</dd>
        <dt class="mt-1 text-xs text-slate-600 dark:text-slate-400">In Prüfung</dt>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <dd class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{{ stats.approved }}</dd>
        <dt class="mt-1 text-xs text-slate-600 dark:text-slate-400">Visiert</dt>
      </div>
    </dl>

    <div class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col items-start gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Wochen</h2>
        <div class="flex items-center gap-2 sm:ml-auto">
          <label for="filter-year" class="sr-only">Jahr</label>
          <select
            id="filter-year"
            v-model="selectedYear"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            @change="reload"
          >
            <option :value="currentYear">{{ currentYear }}</option>
            <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
          </select>
          <label for="filter-status" class="sr-only">Status</label>
          <select
            id="filter-status"
            v-model="selectedStatus"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            @change="reload"
          >
            <option value="">Alle Status</option>
            <option v-for="(label, value) in STATUS_LABELS" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
      </div>

      <div v-if="reportStore.loading" class="space-y-3 p-4" aria-busy="true">
        <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" />
      </div>

      <div v-else-if="reportStore.reports.length === 0" class="p-10 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="mt-3 text-sm text-slate-600 dark:text-slate-400">Noch keine Wochen erfasst.</p>
        <button
          v-if="auth.isAzubi"
          type="button"
          class="mt-3 text-sm font-medium text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300"
          @click="openCreate"
        >
          Aktuelle Woche anlegen
        </button>
      </div>

      <ul v-else class="divide-y divide-slate-100 dark:divide-slate-700">
        <li v-for="report in reportStore.reports" :key="report.id">
          <router-link
            :to="`/reports/${report.id}`"
            class="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 dark:hover:bg-slate-700/50 dark:focus-visible:bg-slate-700/50"
          >
            <div class="w-14 shrink-0 text-center">
              <p class="text-xs text-slate-500 dark:text-slate-400">KW</p>
              <p class="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100">{{ report.kalenderwoche }}</p>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{{ report.titel }}</h3>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" :class="STATUS_CLASSES[report.status]">
                  {{ STATUS_LABELS[report.status] }}
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {{ formatDate(report.datumVon) }} – {{ formatDate(report.datumBis) }}
              </p>
            </div>
            <p class="shrink-0 font-mono text-sm tabular-nums text-slate-900 dark:text-slate-100" :aria-label="`Wochensumme ${formatMinutes(report.summeMinuten)}`">
              {{ formatMinutes(report.summeMinuten) }}
            </p>
            <svg class="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Create dialog -->
    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="showCreateDialog = false"
      @keydown="onDialogKeydown"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-dialog-title"
        class="mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <h3 id="create-dialog-title" class="text-lg font-semibold text-slate-900 dark:text-slate-100">Neue Woche</h3>
          <button
            type="button"
            class="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Dialog schließen"
            @click="showCreateDialog = false"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form class="space-y-4 p-5" @submit.prevent="handleCreate">
          <div>
            <label for="new-report-titel" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Titel</label>
            <input
              id="new-report-titel"
              v-model="newReport.titel"
              type="text"
              required
              minlength="3"
              maxlength="200"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
              placeholder="z. B. KW 42 – Netzwerkinfrastruktur"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="new-report-kw" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Kalenderwoche</label>
              <input
                id="new-report-kw"
                v-model.number="newReport.kalenderwoche"
                type="number"
                min="1"
                max="53"
                required
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label for="new-report-jahr" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Jahr</label>
              <input
                id="new-report-jahr"
                v-model.number="newReport.jahr"
                type="number"
                min="2000"
                max="2100"
                required
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <p v-if="newReportRange" class="text-sm text-slate-600 dark:text-slate-400">
            Zeitraum: {{ formatDate(newReportRange.montag) }} – {{ formatDate(newReportRange.sonntag) }}.
            Montag bis Freitag werden angelegt, Abwesenheiten automatisch übernommen.
          </p>

          <div
            v-if="createError"
            role="alert"
            class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            {{ createError }}
            <router-link
              v-if="existingReportId"
              :to="`/reports/${existingReportId}`"
              class="ml-1 font-medium underline"
              @click="showCreateDialog = false"
            >
              Zum Bericht
            </router-link>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              @click="showCreateDialog = false"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              :disabled="reportStore.saving"
              class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:focus-visible:ring-offset-slate-800"
            >
              {{ reportStore.saving ? 'Wird angelegt …' : 'Anlegen' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
