<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAbsenceStore, type Absence } from '@/stores/absence'

const absenceStore = useAbsenceStore()
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingAbsence = ref<Absence | null>(null)
const confirmDeleteId = ref<string | null>(null)

const newAbsence = ref({
  typ: 'krankheit' as string,
  von: '',
  bis: '',
  notiz: '',
})

const typLabels: Record<string, string> = {
  krankheit: 'Krankheit',
  urlaub: 'Urlaub',
  berufsschule: 'Berufsschule',
  sonstiges: 'Sonstiges',
}

const typColors: Record<string, string> = {
  krankheit: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  urlaub: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  berufsschule: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  sonstiges: 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
}

const typIcons: Record<string, string> = {
  krankheit: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  urlaub: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  berufsschule: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  sonstiges: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function daysBetween(a: string, b: string) {
  const diff = Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1
  return diff
}

const sortedAbsences = computed(() =>
  [...absenceStore.absences].sort((a, b) => new Date(b.von).getTime() - new Date(a.von).getTime()),
)

async function handleCreate() {
  if (!newAbsence.value.von || !newAbsence.value.bis) return
  await absenceStore.createAbsence(newAbsence.value)
  showCreateDialog.value = false
  newAbsence.value = { typ: 'krankheit', von: '', bis: '', notiz: '' }
}

function openEdit(absence: Absence) {
  editingAbsence.value = { ...absence }
  showEditDialog.value = true
}

async function handleEdit() {
  if (!editingAbsence.value) return
  await absenceStore.updateAbsence(editingAbsence.value.id, {
    typ: editingAbsence.value.typ,
    von: editingAbsence.value.von,
    bis: editingAbsence.value.bis,
    notiz: editingAbsence.value.notiz,
  })
  showEditDialog.value = false
  editingAbsence.value = null
}

async function handleDelete(id: string) {
  await absenceStore.deleteAbsence(id)
  confirmDeleteId.value = null
}

onMounted(() => {
  absenceStore.fetchAbsences()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Abwesenheiten</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Urlaub, Berufsschule und Krankheit verwalten.
        </p>
      </div>
      <button
        @click="showCreateDialog = true"
        class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Neue Abwesenheit
      </button>
    </div>

    <div v-if="absenceStore.loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
    </div>

    <div v-else-if="sortedAbsences.length === 0" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
      <svg class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Keine Abwesenheiten vorhanden.</p>
    </div>

    <div v-else class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-700">
      <div
        v-for="absence in sortedAbsences"
        :key="absence.id"
        class="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div class="flex h-10 w-10 items-center justify-center rounded-lg shrink-0" :class="typColors[absence.typ]">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="typIcons[absence.typ]" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ typLabels[absence.typ] }}</h3>
            <span class="text-xs text-slate-400">· {{ daysBetween(absence.von, absence.bis) }} Tag{{ daysBetween(absence.von, absence.bis) > 1 ? 'e' : '' }}</span>
          </div>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {{ formatDate(absence.von) }} – {{ formatDate(absence.bis) }}
            <span v-if="absence.notiz"> · {{ absence.notiz }}</span>
          </p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button
            @click="openEdit(absence)"
            class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Bearbeiten"
          >
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            v-if="confirmDeleteId !== absence.id"
            @click="confirmDeleteId = absence.id"
            class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Löschen"
          >
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <div v-else class="flex items-center gap-1">
            <button
              @click="handleDelete(absence.id)"
              class="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
            >
              Ja
            </button>
            <button
              @click="confirmDeleteId = null"
              class="rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Nein
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCreateDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="showCreateDialog = false"
    >
      <div class="w-full max-w-md mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
        <div class="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Neue Abwesenheit</h3>
          <button @click="showCreateDialog = false" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleCreate" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Art</label>
            <select
              v-model="newAbsence.typ"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            >
              <option value="krankheit">Krankheit</option>
              <option value="urlaub">Urlaub</option>
              <option value="berufsschule">Berufsschule</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Von</label>
              <input
                v-model="newAbsence.von"
                type="date"
                required
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bis</label>
              <input
                v-model="newAbsence.bis"
                type="date"
                required
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notiz (optional)</label>
            <input
              v-model="newAbsence.notiz"
              type="text"
              maxlength="500"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              placeholder="z.B. Arzttermin"
            />
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showCreateDialog = false" class="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Abbrechen
            </button>
            <button type="submit" :disabled="absenceStore.saving" class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors">
              {{ absenceStore.saving ? 'Erstellen...' : 'Erstellen' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showEditDialog && editingAbsence"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="showEditDialog = false"
    >
      <div class="w-full max-w-md mx-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
        <div class="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Abwesenheit bearbeiten</h3>
          <button @click="showEditDialog = false" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleEdit" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Art</label>
            <select
              v-model="editingAbsence.typ"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            >
              <option value="krankheit">Krankheit</option>
              <option value="urlaub">Urlaub</option>
              <option value="berufsschule">Berufsschule</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Von</label>
              <input v-model="editingAbsence.von" type="date" required class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bis</label>
              <input v-model="editingAbsence.bis" type="date" required class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Notiz</label>
            <input v-model="editingAbsence.notiz" type="text" maxlength="500" class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors" />
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="showEditDialog = false" class="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Abbrechen
            </button>
            <button type="submit" :disabled="absenceStore.saving" class="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors">
              {{ absenceStore.saving ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
