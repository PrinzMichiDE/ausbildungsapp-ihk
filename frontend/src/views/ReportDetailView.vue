<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReportStore } from '@/stores/report'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const reportStore = useReportStore()
const auth = useAuthStore()

const reportId = route.params.id as string
const editorContent = ref('')
const showPreview = ref(true)
const autoSaved = ref(false)
const lastSaved = ref<Date | null>(null)
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function triggerAutoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(async () => {
    if (reportStore.currentReport?.status !== 'entwurf') return
    await reportStore.updateReport(reportId, { inhaltMarkdown: editorContent.value })
    lastSaved.value = new Date()
    autoSaved.value = true
    setTimeout(() => (autoSaved.value = false), 2000)
  }, 5000)
}

async function manualSave() {
  if (reportStore.currentReport?.status !== 'entwurf') return
  await reportStore.updateReport(reportId, { inhaltMarkdown: editorContent.value })
  lastSaved.value = new Date()
  autoSaved.value = true
  setTimeout(() => (autoSaved.value = false), 2000)
}

async function handleSubmit() {
  await reportStore.submitReport(reportId)
}

function insertMarkdown(prefix: string, suffix = '') {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = editorContent.value.substring(start, end)
  const replacement = prefix + (selected || 'Text') + suffix
  editorContent.value = editorContent.value.substring(0, start) + replacement + editorContent.value.substring(end)
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || 'Text').length)
  })
}

onMounted(async () => {
  await reportStore.fetchReport(reportId)
  if (reportStore.currentReport) {
    editorContent.value = reportStore.currentReport.inhaltMarkdown
  }
})

watch(editorContent, triggerAutoSave)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <button
        @click="router.push('/reports')"
        class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Zurück"
      >
        <svg class="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {{ reportStore.currentReport?.titel || 'Laden...' }}
          </h1>
          <span
            v-if="reportStore.currentReport"
            class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium shrink-0"
            :class="statusColors[reportStore.currentReport.status]"
          >
            {{ statusLabels[reportStore.currentReport.status] }}
          </span>
        </div>
        <p v-if="reportStore.currentReport" class="text-xs text-slate-500 dark:text-slate-400">
          KW {{ reportStore.currentReport.kalenderwoche }} / {{ reportStore.currentReport.jahr }} ·
          {{ formatDate(reportStore.currentReport.datumVon) }} – {{ formatDate(reportStore.currentReport.datumBis) }}
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span v-if="autoSaved" class="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Gespeichert
        </span>
        <span v-else-if="lastSaved" class="text-xs text-slate-400">
          {{ lastSaved.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }}
        </span>
        <button
          v-if="reportStore.currentReport?.status === 'entwurf'"
          @click="manualSave"
          :disabled="reportStore.saving"
          class="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          Speichern
        </button>
        <button
          v-if="reportStore.currentReport?.status === 'entwurf' && auth.isAzubi"
          @click="handleSubmit"
          :disabled="reportStore.saving"
          class="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          Einreichen
        </button>
      </div>
    </div>

    <div v-if="reportStore.loading" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
      <div class="space-y-4">
        <div class="h-8 w-48 rounded bg-slate-100 dark:bg-slate-700 animate-pulse" />
        <div class="h-64 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>

    <template v-else-if="reportStore.currentReport">
      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
        <div class="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            @click="insertMarkdown('**', '**')"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Fett (Strg+B)"
          >
            <svg class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 010 8H6z" />
            </svg>
          </button>
          <button
            @click="insertMarkdown('*', '*')"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Kursiv (Strg+I)"
          >
            <svg class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0l-4 16m-2 0h4m2-16l4 16" />
            </svg>
          </button>
          <button
            @click="insertMarkdown('`', '`')"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Code"
          >
            <svg class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
          <button
            @click="insertMarkdown('\n## ')"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Überschrift"
          >
            <svg class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button
            @click="insertMarkdown('\n- ')"
            class="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Aufzählung"
          >
            <svg class="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>
          <div class="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            @click="showPreview = !showPreview"
            class="p-1.5 rounded transition-colors"
            :class="showPreview ? 'bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'"
            title="Vorschau umschalten"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>

        <div class="flex" :class="showPreview ? 'divide-x divide-slate-200 dark:divide-slate-700' : ''">
          <div class="flex-1" :class="showPreview ? 'w-1/2' : 'w-full'">
            <textarea
              v-model="editorContent"
              :disabled="reportStore.currentReport.status !== 'entwurf'"
              class="w-full min-h-[500px] p-4 text-sm text-slate-800 dark:text-slate-200 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 font-mono placeholder-slate-400"
              placeholder="Markdown schreiben...&#10;&#10;## Montag&#10;Heute habe ich...&#10;&#10;## Dienstag&#10;..."
            />
          </div>
          <div v-if="showPreview" class="w-1/2 p-4 prose prose-sm dark:prose-invert max-w-none overflow-y-auto max-h-[500px]">
            <div v-if="editorContent" class="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {{ editorContent }}
            </div>
            <p v-else class="text-sm text-slate-400 italic">Vorschau erscheint hier...</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
