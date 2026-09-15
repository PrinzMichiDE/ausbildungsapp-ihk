<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useReportStore } from '@/stores/report'
import { onMounted, ref, computed } from 'vue'

const auth = useAuthStore()
const reportStore = useReportStore()

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const selectedStatus = ref('')
const showCreateDialog = ref(false)

const statusColors: Record<string, string> = {
  entwurf: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  eingereicht: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  vorpruefung: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  freigegeben: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  archiviert: 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  zurueckgewiesen: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
}

const statusLabels: Record<string, string> = {
  entwurf: 'Entwurf',
  eingereicht: 'Eingereicht',
  vorpruefung: 'Vorprüfung',
  freigegeben: 'Freigegeben',
  archiviert: 'Archiviert',
  zurueckgewiesen: 'Zurückgewiesen',
}

const recentReports = computed(() => reportStore.reports.slice(0, 5))

const stats = computed(() => {
  const all = reportStore.reports
  return {
    total: all.length,
    draft: all.filter((r) => r.status === 'entwurf').length,
    submitted: all.filter((r) => r.status === 'eingereicht').length,
    approved: all.filter((r) => r.status === 'freigegeben').length,
  }
})

const newReport = ref({
  titel: '',
  typ: 'wochenbericht',
  kalenderwoche: currentCalendarWeek(),
  jahr: currentYear,
  datumVon: '',
  datumBis: '',
  inhaltMarkdown: '',
})

function currentCalendarWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return Math.ceil((days + start.getDay() + 1) / 7)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function handleCreate() {
  if (!newReport.value.titel || !newReport.value.datumVon || !newReport.value.datumBis) return
  await reportStore.createReport(newReport.value)
  showCreateDialog.value = false
  newReport.value = { titel: '', typ: 'wochenbericht', kalenderwoche: currentCalendarWeek(), jahr: currentYear, datumVon: '', datumBis: '', inhaltMarkdown: '' }
}

onMounted(() => {
  reportStore.fetchReports({ jahr: selectedYear.value, status: selectedStatus.value || undefined })
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Berichtsheft</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Dokumentieren Sie Ihre Ausbildungstage und reichen Sie Berichte ein.
        </p>
      </div>
      <button
        v-if="auth.isAzubi"
        @click="showCreateDialog = true"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Neuer Bericht
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
        <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ stats.total }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Gesamt</p>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
        <p class="text-2xl font-bold text-slate-600 dark:text-slate-400">{{ stats.draft }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Entwürfe</p>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.submitted }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Eingereicht</p>
      </div>
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.approved }}</p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Freigegeben</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Berichte</h2>
        <div class="flex items-center gap-2 ml-auto">
          <select
            v-model="selectedYear"
            @change="reportStore.fetchReports({ jahr: selectedYear, status: selectedStatus || undefined })"
            class="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option :value="currentYear">{{ currentYear }}</option>
            <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
          </select>
          <select
            v-model="selectedStatus"
            @change="reportStore.fetchReports({ jahr: selectedYear, status: selectedStatus || undefined })"
            class="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Alle Status</option>
            <option value="entwurf">Entwurf</option>
            <option value="eingereicht">Eingereicht</option>
            <option value="freigegeben">Freigegeben</option>
            <option value="zurueckgewiesen">Zurückgewiesen</option>
          </select>
        </div>
      </div>

      <div v-if="reportStore.loading" class="p-8">
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>

      <div v-else-if="recentReports.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Keine Berichte vorhanden.</p>
      </div>

      <div v-else class="divide-y divide-slate-100 dark:divide-slate-700">
        <router-link
          v-for="report in recentReports"
          :key="report.id"
          :to="`/reports/${report.id}`"
          class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {{ report.titel }}
              </h3>
              <span
                class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                :class="statusColors[report.status]"
              >
                {{ statusLabels[report.status] }}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              KW {{ report.kalenderwoche }} / {{ report.jahr }} · {{ formatDate(report.datumVon) }} – {{ formatDate(report.datumBis) }}
            </p>
          </div>
          <svg class="h-5 w-5 text-slate-400 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="showCreateDialog = false"
    >
      <div class="w-full max-w-lg mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
        <div class="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Neuer Bericht</h3>
          <button @click="showCreateDialog = false" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleCreate" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Titel</label>
            <input
              v-model="newReport.titel"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              placeholder="z.B. Server-Migration dokumentiert"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">KW</label>
              <input
                v-model.number="newReport.kalenderwoche"
                type="number"
                min="1"
                max="53"
                required
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Jahr</label>
              <input
                v-model.number="newReport.jahr"
                type="number"
                required
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Von</label>
              <input
                v-model="newReport.datumVon"
                type="date"
                required
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bis</label>
              <input
                v-model="newReport.datumBis"
                type="date"
                required
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="showCreateDialog = false"
              class="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              :disabled="reportStore.saving"
              class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {{ reportStore.saving ? 'Erstellen...' : 'Erstellen' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
