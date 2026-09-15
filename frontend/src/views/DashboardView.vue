<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useReportStore } from '@/stores/report'
import { useAbsenceStore } from '@/stores/absence'
import { computed, onMounted, ref } from 'vue'

const auth = useAuthStore()
const reportStore = useReportStore()
const absenceStore = useAbsenceStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Guten Morgen'
  if (hour < 18) return 'Guten Tag'
  return 'Guten Abend'
})

const currentWeek = ref(currentCalendarWeek())

function currentCalendarWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return Math.ceil((days + start.getDay() + 1) / 7)
}

const draftReports = computed(() => reportStore.reports.filter((r) => r.status === 'entwurf'))
const pendingReports = computed(() => reportStore.reports.filter((r) => r.status === 'eingereicht'))

const upcomingAbsences = computed(() => {
  const now = new Date()
  return absenceStore.absences
    .filter((a) => new Date(a.bis) >= now)
    .sort((a, b) => new Date(a.von).getTime() - new Date(b.von).getTime())
    .slice(0, 3)
})

const quickActions = computed(() => [
  { label: 'Berichtsheft', description: 'Neuen Eintrag verfassen', to: '/reports', icon: 'document', badge: draftReports.value.length || undefined },
  { label: 'Abwesenheit', description: 'Krankheit / Urlaub melden', to: '/absences', icon: 'clock', badge: undefined },
  { label: 'Skill-Matrix', description: 'Lernfortschritt einsehen', to: '/skills', icon: 'target', badge: undefined },
])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

const typLabels: Record<string, string> = {
  krankheit: 'Krankheit',
  urlaub: 'Urlaub',
  berufsschule: 'Berufsschule',
  sonstiges: 'Sonstiges',
}

onMounted(async () => {
  await Promise.all([
    reportStore.fetchReports({ jahr: new Date().getFullYear() }),
    absenceStore.fetchAbsences(),
  ])
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {{ greeting }}, {{ auth.user?.firstName }}
      </h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Willkommen bei der NextGen IT-Ausbildungsplattform. KW {{ currentWeek }}.
      </p>

      <div class="mt-5">
        <div class="flex items-center justify-between text-sm mb-1.5">
          <span class="text-slate-600 dark:text-slate-400">Gesamtfortschritt AP1/AP2</span>
          <span class="font-medium text-slate-900 dark:text-slate-100">75%</span>
        </div>
        <div class="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div class="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700" style="width: 75%" />
        </div>
        <div class="flex justify-between mt-1.5 text-[11px] text-slate-400">
          <span>AP1: 80%</span>
          <span>AP2: 65%</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
      >
        <div v-if="action.badge" class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
          {{ action.badge }}
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-500/20 transition-colors">
          <svg v-if="action.icon === 'document'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else-if="action.icon === 'clock'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="action.icon === 'target'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ action.label }}</h3>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ action.description }}</p>
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Offene Aufgaben</h2>
          <span v-if="draftReports.length" class="text-xs text-slate-400">{{ draftReports.length }} offen</span>
        </div>
        <div v-if="draftReports.length === 0 && pendingReports.length === 0" class="text-center py-6">
          <svg class="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
          </svg>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Alles erledigt!</p>
        </div>
        <div v-else class="space-y-2">
          <router-link
            v-for="report in draftReports.slice(0, 3)"
            :key="report.id"
            :to="`/reports/${report.id}`"
            class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-warning" />
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ report.titel }}</span>
            </div>
            <span class="text-xs text-slate-400">KW {{ report.kalenderwoche }}</span>
          </router-link>
          <router-link
            v-for="report in pendingReports.slice(0, 2)"
            :key="report.id"
            :to="`/reports/${report.id}`"
            class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="h-2 w-2 rounded-full bg-info" />
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ report.titel }}</span>
            </div>
            <span class="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400">
              Eingereicht
            </span>
          </router-link>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Anstehende Abwesenheiten</h2>
        </div>
        <div v-if="upcomingAbsences.length === 0" class="text-center py-6">
          <svg class="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Keine anstehenden Abwesenheiten.</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="absence in upcomingAbsences"
            :key="absence.id"
            class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 p-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-2 w-2 rounded-full"
                :class="{
                  'bg-red-500': absence.typ === 'krankheit',
                  'bg-blue-500': absence.typ === 'urlaub',
                  'bg-amber-500': absence.typ === 'berufsschule',
                  'bg-slate-400': absence.typ === 'sonstiges',
                }"
              />
              <div>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ typLabels[absence.typ] }}</span>
                <p class="text-xs text-slate-400">{{ formatDate(absence.von) }} – {{ formatDate(absence.bis) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
