<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useReportStore, type ReportDay, type ReportDayArt, type SaveDayPayload } from '@/stores/report'
import DurationInput from '@/components/DurationInput.vue'
import {
  ABSENCE_DAY_ARTEN,
  DAY_ART_OPTIONS,
  STATUS_CLASSES,
  STATUS_LABELS,
  dayMonth,
  formatDate,
  formatMinutes,
  isWeekend,
  weekDates,
  weekdayLong,
  weekdayShort,
} from '@/utils/report-time'

interface EditableActivity {
  key: number
  beschreibung: string
  dauerMinuten: number
  taskId: string | null
}

interface EditableDay {
  datum: string
  art: ReportDayArt
  maxMinuten: number
  aktivitaeten: EditableActivity[]
}

interface TaskOption {
  id: string
  titel: string
}

interface ApiErrorDetail {
  code: string
  message: string
  datum?: string
  fehlendeTage?: string[]
}

const AUTOSAVE_DELAY_MS = 1500
const MAX_ACTIVITIES_PER_DAY = 30
const MAX_DESCRIPTION = 500

const route = useRoute()
const router = useRouter()
const reportStore = useReportStore()
const auth = useAuthStore()

const reportId = computed(() => route.params.id as string)
const days = ref<EditableDay[]>([])
const showWeekend = ref(false)
const tasks = ref<TaskOption[]>([])
const saveState = ref<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
const serverError = ref<string | null>(null)
const serverErrorDays = ref<Set<string>>(new Set())
let nextKey = 1
let autosaveTimer: ReturnType<typeof setTimeout> | null = null
let hydrating = false

const report = computed(() => reportStore.currentReport)
const editable = computed(() => report.value?.status === 'entwurf' && auth.isAzubi)

const weekendDays = computed(() => days.value.filter((d) => isWeekend(d.datum)))
const workDays = computed(() => days.value.filter((d) => !isWeekend(d.datum)))
const visibleDays = computed(() => (showWeekend.value ? days.value : workDays.value))

function daySum(day: EditableDay): number {
  return day.aktivitaeten.reduce((acc, a) => acc + (a.dauerMinuten || 0), 0)
}

const weekSum = computed(() => days.value.reduce((acc, d) => acc + daySum(d), 0))
const maxWeek = computed(() => report.value?.maxMinutenWoche ?? null)

function dayIssues(day: EditableDay): string[] {
  const issues: string[] = []
  if (daySum(day) > day.maxMinuten) {
    issues.push(`Tagesgrenze ${formatMinutes(day.maxMinuten)} überschritten`)
  }
  if (ABSENCE_DAY_ARTEN.has(day.art) && day.aktivitaeten.length > 0) {
    issues.push('An Abwesenheitstagen sind keine Aktivitäten erlaubt')
  }
  if (day.aktivitaeten.some((a) => a.beschreibung.trim() === '')) {
    issues.push('Jede Aktivität braucht eine Beschreibung')
  }
  if (day.aktivitaeten.some((a) => a.dauerMinuten < 5)) {
    issues.push('Jede Aktivität braucht eine Dauer (mind. 00:05)')
  }
  return issues
}

const weekOverLimit = computed(() => maxWeek.value !== null && weekSum.value > maxWeek.value)
const hasBlockingIssues = computed(
  () => weekOverLimit.value || days.value.some((d) => dayIssues(d).length > 0),
)

const missingDays = computed(() =>
  workDays.value.filter((d) => !ABSENCE_DAY_ARTEN.has(d.art) && d.aktivitaeten.length === 0),
)

const canSubmit = computed(
  () => editable.value && !hasBlockingIssues.value && missingDays.value.length === 0 && saveState.value !== 'saving',
)

function hydrate(tage: ReportDay[] | undefined) {
  if (!report.value) return
  hydrating = true
  const byDate = new Map((tage ?? []).map((t) => [t.datum, t]))
  const fallbackMax = tage?.[0]?.maxMinuten ?? 600
  const montag = report.value.datumVon.slice(0, 10)
  days.value = weekDates(montag).map((datum) => {
    const t = byDate.get(datum)
    return {
      datum,
      art: t?.art ?? 'betrieb',
      maxMinuten: t?.maxMinuten ?? fallbackMax,
      aktivitaeten: (t?.aktivitaeten ?? []).map((a) => ({
        key: nextKey++,
        beschreibung: a.beschreibung,
        dauerMinuten: a.dauerMinuten,
        taskId: a.taskId,
      })),
    }
  })
  showWeekend.value = weekendDays.value.some((d) => byDate.has(d.datum))
  queueMicrotask(() => {
    hydrating = false
  })
}

function toPayload(): SaveDayPayload[] {
  return days.value
    .filter((d) => !isWeekend(d.datum) || d.aktivitaeten.length > 0 || d.art !== 'betrieb')
    .map((d) => ({
      datum: d.datum,
      art: d.art,
      aktivitaeten: d.aktivitaeten.map((a) => ({
        beschreibung: a.beschreibung.trim(),
        dauerMinuten: a.dauerMinuten,
        ...(a.taskId ? { taskId: a.taskId } : {}),
      })),
    }))
}

function applyServerError(error: unknown) {
  serverErrorDays.value = new Set()
  if (isAxiosError(error)) {
    const body = error.response?.data as { message?: string; details?: ApiErrorDetail[] } | undefined
    serverError.value = body?.message ?? 'Speichern fehlgeschlagen.'
    for (const d of body?.details ?? []) {
      if (d.datum) serverErrorDays.value.add(d.datum)
      for (const f of d.fehlendeTage ?? []) serverErrorDays.value.add(f)
    }
  } else {
    serverError.value = 'Speichern fehlgeschlagen.'
  }
}

async function save(): Promise<boolean> {
  if (!editable.value || hasBlockingIssues.value) return false
  if (autosaveTimer) clearTimeout(autosaveTimer)
  saveState.value = 'saving'
  try {
    const updated = await reportStore.saveDays(reportId.value, toPayload())
    serverError.value = null
    serverErrorDays.value = new Set()
    for (const t of updated.tage ?? []) {
      const day = days.value.find((d) => d.datum === t.datum)
      if (day) day.maxMinuten = t.maxMinuten
    }
    saveState.value = 'saved'
    return true
  } catch (error) {
    applyServerError(error)
    saveState.value = 'error'
    return false
  }
}

function scheduleAutosave() {
  if (hydrating || !editable.value) return
  saveState.value = 'dirty'
  if (autosaveTimer) clearTimeout(autosaveTimer)
  if (hasBlockingIssues.value) return
  autosaveTimer = setTimeout(() => void save(), AUTOSAVE_DELAY_MS)
}

watch(days, scheduleAutosave, { deep: true })

function addActivity(day: EditableDay) {
  if (day.aktivitaeten.length >= MAX_ACTIVITIES_PER_DAY) return
  const key = nextKey++
  day.aktivitaeten.push({ key, beschreibung: '', dauerMinuten: 0, taskId: null })
  requestAnimationFrame(() => document.getElementById(`desc-${day.datum}-${key}`)?.focus())
}

function removeActivity(day: EditableDay, key: number) {
  day.aktivitaeten = day.aktivitaeten.filter((a) => a.key !== key)
}

function onArtChange(day: EditableDay) {
  if (ABSENCE_DAY_ARTEN.has(day.art) && day.aktivitaeten.length > 0) {
    const ok = window.confirm(
      `${weekdayLong(day.datum)}: Beim Wechsel auf „${DAY_ART_OPTIONS.find((o) => o.value === day.art)?.label}“ werden ${day.aktivitaeten.length} Aktivität(en) entfernt. Fortfahren?`,
    )
    if (ok) {
      day.aktivitaeten = []
    } else {
      day.art = 'betrieb'
    }
  }
}

async function handleSubmit() {
  if (!canSubmit.value) return
  if (saveState.value === 'dirty' && !(await save())) return
  try {
    await reportStore.submitReport(reportId.value)
    serverError.value = null
  } catch (error) {
    applyServerError(error)
  }
}

function sumClass(day: EditableDay): string {
  const sum = daySum(day)
  if (sum > day.maxMinuten) return 'text-red-600 dark:text-red-400'
  if (sum === 0) return 'text-slate-500 dark:text-slate-400'
  return 'text-slate-900 dark:text-slate-100'
}

function onBeforeUnload(event: BeforeUnloadEvent) {
  if (saveState.value === 'dirty' || saveState.value === 'saving') {
    event.preventDefault()
  }
}

async function loadTasks() {
  try {
    const res = await api.get<{ data: TaskOption[] }>('/tasks')
    tasks.value = res.data.data.map((t) => ({ id: t.id, titel: t.titel }))
  } catch {
    tasks.value = []
  }
}

async function load(id: string) {
  if (autosaveTimer) clearTimeout(autosaveTimer)
  saveState.value = 'idle'
  serverError.value = null
  serverErrorDays.value = new Set()
  await reportStore.fetchReport(id)
  hydrate(reportStore.currentReport?.tage)
}

onMounted(async () => {
  window.addEventListener('beforeunload', onBeforeUnload)
  await Promise.all([load(reportId.value), loadTasks()])
})

watch(reportId, async (id, previous) => {
  if (!id || id === previous) return
  if (saveState.value === 'dirty') await save()
  await load(id)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', onBeforeUnload)
  if (autosaveTimer) {
    clearTimeout(autosaveTimer)
    if (saveState.value === 'dirty') void save()
  }
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start gap-3">
      <button
        type="button"
        class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Zurück zur Übersicht"
        @click="router.push('/reports')"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
            {{ report?.titel || 'Laden …' }}
          </h1>
          <span
            v-if="report"
            class="inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium"
            :class="STATUS_CLASSES[report.status]"
          >
            {{ STATUS_LABELS[report.status] }}
          </span>
        </div>
        <p v-if="report" class="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
          KW {{ report.kalenderwoche }}/{{ report.jahr }} · {{ formatDate(report.datumVon) }} – {{ formatDate(report.datumBis) }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="reportStore.loading && !report" class="space-y-3" aria-busy="true" aria-live="polite">
      <div v-for="i in 5" :key="i" class="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>

    <template v-else-if="report">
      <!-- Server error -->
      <div
        v-if="serverError"
        role="alert"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      >
        {{ serverError }}
      </div>

      <p
        v-if="!editable"
        class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
      >
        Dieser Bericht ist {{ STATUS_LABELS[report.status].toLowerCase() }} und kann nicht mehr bearbeitet werden.
      </p>

      <!-- Days -->
      <ol class="space-y-3" aria-label="Tage der Woche">
        <li
          v-for="day in visibleDays"
          :key="day.datum"
          class="rounded-xl border bg-white shadow-sm transition-colors dark:bg-slate-800"
          :class="
            dayIssues(day).length || serverErrorDays.has(day.datum)
              ? 'border-red-300 dark:border-red-500/50'
              : 'border-slate-200 dark:border-slate-700'
          "
        >
          <section :aria-labelledby="`day-${day.datum}`">
            <header class="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <h2 :id="`day-${day.datum}`" class="flex items-baseline gap-2">
                <span class="w-7 text-base font-semibold text-slate-900 dark:text-slate-100">{{ weekdayShort(day.datum) }}</span>
                <span class="text-sm text-slate-600 dark:text-slate-400">{{ dayMonth(day.datum) }}</span>
                <span class="sr-only">{{ weekdayLong(day.datum) }}</span>
              </h2>

              <label :for="`art-${day.datum}`" class="sr-only">Tagesart {{ weekdayLong(day.datum) }}</label>
              <select
                :id="`art-${day.datum}`"
                v-model="day.art"
                :disabled="!editable"
                class="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                @change="onArtChange(day)"
              >
                <option v-for="opt in DAY_ART_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>

              <p class="ml-auto font-mono text-sm tabular-nums" :aria-label="`Summe ${formatMinutes(daySum(day))} von maximal ${formatMinutes(day.maxMinuten)}`">
                <span class="font-semibold" :class="sumClass(day)">{{ formatMinutes(daySum(day)) }}</span>
                <span class="text-slate-500 dark:text-slate-400"> / {{ formatMinutes(day.maxMinuten) }}</span>
              </p>
            </header>

            <div class="px-4 py-3">
              <p
                v-if="ABSENCE_DAY_ARTEN.has(day.art)"
                class="text-sm italic text-slate-500 dark:text-slate-400"
              >
                Abwesend – keine Aktivitäten erforderlich.
              </p>

              <template v-else>
                <ul v-if="day.aktivitaeten.length" class="space-y-2">
                  <li
                    v-for="(act, index) in day.aktivitaeten"
                    :key="act.key"
                    class="grid grid-cols-[1fr_auto_auto] items-start gap-2 sm:grid-cols-[1fr_12rem_auto_auto]"
                  >
                    <div class="col-span-3 sm:col-span-1">
                      <label :for="`desc-${day.datum}-${act.key}`" class="sr-only">
                        Aktivität {{ index + 1 }} am {{ weekdayLong(day.datum) }}
                      </label>
                      <input
                        :id="`desc-${day.datum}-${act.key}`"
                        v-model="act.beschreibung"
                        type="text"
                        :maxlength="MAX_DESCRIPTION"
                        :disabled="!editable"
                        placeholder="Was hast du gemacht?"
                        :aria-invalid="act.beschreibung.trim() === ''"
                        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-300"
                      />
                    </div>

                    <div>
                      <label :for="`task-${day.datum}-${act.key}`" class="sr-only">Praxis-Task (optional)</label>
                      <select
                        :id="`task-${day.datum}-${act.key}`"
                        v-model="act.taskId"
                        :disabled="!editable || tasks.length === 0"
                        :title="tasks.length === 0 ? 'Keine freigegebenen Praxis-Tasks vorhanden' : undefined"
                        class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
                      >
                        <option :value="null">Kein Task</option>
                        <option v-for="t in tasks" :key="t.id" :value="t.id">{{ t.titel }}</option>
                      </select>
                    </div>

                    <DurationInput
                      v-model="act.dauerMinuten"
                      :id="`dur-${day.datum}-${act.key}`"
                      :label="`Dauer Aktivität ${index + 1} am ${weekdayLong(day.datum)} (hh:mm)`"
                      :disabled="!editable"
                      :invalid="act.dauerMinuten < 5"
                    />

                    <button
                      v-if="editable"
                      type="button"
                      class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      :aria-label="`Aktivität ${index + 1} am ${weekdayLong(day.datum)} entfernen`"
                      @click="removeActivity(day, act.key)"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                </ul>
                <p v-else-if="!editable" class="text-sm text-slate-500 dark:text-slate-400">Keine Aktivitäten.</p>

                <button
                  v-if="editable && day.aktivitaeten.length < MAX_ACTIVITIES_PER_DAY"
                  type="button"
                  class="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300 dark:hover:bg-brand-500/10"
                  @click="addActivity(day)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Aktivität
                </button>
              </template>

              <ul v-if="dayIssues(day).length" class="mt-2 space-y-0.5" :id="`issues-${day.datum}`">
                <li v-for="issue in dayIssues(day)" :key="issue" class="text-xs font-medium text-red-600 dark:text-red-400">
                  {{ issue }}
                </li>
              </ul>
            </div>
          </section>
        </li>
      </ol>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-slate-800"
        :aria-expanded="showWeekend"
        @click="showWeekend = !showWeekend"
      >
        <svg class="h-4 w-4 transition-transform" :class="showWeekend ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        {{ showWeekend ? 'Wochenende ausblenden' : 'Wochenende anzeigen' }}
      </button>

      <!-- Sticky footer (sticks to the bottom of the scrolling <main>, never under the sidebar) -->
      <div
        class="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 lg:-mx-6"
      >
        <div class="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
          <p class="font-mono text-sm tabular-nums">
            <span class="text-slate-600 dark:text-slate-400">Woche </span>
            <span class="font-semibold" :class="weekOverLimit ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'">
              {{ formatMinutes(weekSum) }}
            </span>
            <span v-if="maxWeek !== null" class="text-slate-500 dark:text-slate-400"> / {{ formatMinutes(maxWeek) }}</span>
          </p>

          <p class="text-xs text-slate-600 dark:text-slate-400" aria-live="polite">
            <template v-if="!editable" />
            <template v-else-if="saveState === 'saving'">Speichert …</template>
            <template v-else-if="saveState === 'saved'">Gespeichert</template>
            <template v-else-if="saveState === 'error'"><span class="text-red-600 dark:text-red-400">Nicht gespeichert</span></template>
            <template v-else-if="saveState === 'dirty' && hasBlockingIssues"><span class="text-red-600 dark:text-red-400">Bitte Fehler beheben</span></template>
            <template v-else-if="saveState === 'dirty'">Ungespeicherte Änderungen</template>
          </p>

          <p v-if="editable && missingDays.length && !hasBlockingIssues" class="text-xs text-slate-600 dark:text-slate-400">
            Noch offen: {{ missingDays.map((d) => weekdayShort(d.datum)).join(', ') }}
          </p>

          <div v-if="editable" class="ml-auto flex items-center gap-2">
            <button
              type="button"
              :disabled="hasBlockingIssues || saveState === 'saving'"
              class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="save"
            >
              Speichern
            </button>
            <button
              type="button"
              :disabled="!canSubmit"
              class="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
              @click="handleSubmit"
            >
              Einreichen
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
