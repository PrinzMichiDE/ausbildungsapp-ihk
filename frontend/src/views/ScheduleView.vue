<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAssignmentStore } from '@/stores/assignment'

const assignmentStore = useAssignmentStore()

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const groupedByAzubi = computed(() => {
  const map = new Map<string, { name: string; einsaetze: typeof assignmentStore.assignments }>()
  for (const a of assignmentStore.assignments) {
    const key = a.azubiId
    if (!map.has(key)) {
      map.set(key, {
        name: a.azubi ? `${a.azubi.firstName} ${a.azubi.lastName}` : a.azubiId,
        einsaetze: [],
      })
    }
    map.get(key)!.einsaetze.push(a)
  }
  return Array.from(map.values())
})

const skillLevelLabel = (level: number) => {
  const labels = ['Neuling', 'Einsteiger', 'Fortgeschritten', 'Kompetent', 'Erfahren', 'Experte']
  return labels[level] || `Level ${level}`
}

const skillLevelColor = (level: number) => {
  if (level >= 4) return 'bg-emerald-500'
  if (level >= 2) return 'bg-amber-500'
  return 'bg-slate-400'
}

onMounted(() => {
  assignmentStore.fetchAssignments()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Einsatzplanung</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Abteilungsrotation und Einsatzplanung im Überblick.
      </p>
    </div>

    <div v-if="assignmentStore.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
    </div>

    <div v-else-if="assignmentStore.assignments.length === 0" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
      <svg class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Keine Einsätze geplant.</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="azubi in groupedByAzubi"
        :key="azubi.name"
        class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden"
      >
        <div class="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ azubi.name }}</h3>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700">
          <div
            v-for="einsatz in azubi.einsaetze"
            :key="einsatz.id"
            class="flex items-center gap-4 p-4"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
                Abteilung {{ einsatz.abteilungId.slice(0, 8) }}
              </p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {{ formatDate(einsatz.von) }} – {{ formatDate(einsatz.bis) }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <div class="flex items-center gap-1">
                <div v-for="i in 5" :key="i" class="h-2 w-2 rounded-full" :class="i <= einsatz.skillLevel ? skillLevelColor(einsatz.skillLevel) : 'bg-slate-200 dark:bg-slate-700'" />
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400 w-24 text-right">
                {{ skillLevelLabel(einsatz.skillLevel) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
