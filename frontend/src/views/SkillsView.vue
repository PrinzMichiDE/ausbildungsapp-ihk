<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLearningStore, type Framework, type Course } from '@/stores/learning'

const learningStore = useLearningStore()
const expandedFramework = ref<string | null>(null)
const loadingTree = ref(false)

const qualitaetColor = (score?: number) => {
  if (!score) return 'text-slate-400'
  if (score >= 85) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

const qualitaetBg = (score?: number) => {
  if (!score) return 'bg-slate-100 dark:bg-slate-700'
  if (score >= 85) return 'bg-emerald-100 dark:bg-emerald-500/10'
  if (score >= 60) return 'bg-amber-100 dark:bg-amber-500/10'
  return 'bg-red-100 dark:bg-red-500/10'
}

async function toggleFramework(fw: Framework) {
  if (expandedFramework.value === fw.id) {
    expandedFramework.value = null
    return
  }
  expandedFramework.value = fw.id
  loadingTree.value = true
  await learningStore.fetchFrameworkTree(fw.id)
  loadingTree.value = false
}

function getCoursesForFramework(frameworkId: string): Course[] {
  return learningStore.courses.filter((c) => c.frameworkId === frameworkId)
}

onMounted(() => {
  learningStore.fetchFrameworks()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Skill-Matrix</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        IHK-Rahmenplan vs. Firmenrealität — Lernfortschritte im Überblick.
      </p>
    </div>

    <div v-if="learningStore.loading && learningStore.frameworks.length === 0" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-16 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
    </div>

    <div v-else-if="learningStore.frameworks.length === 0" class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
      <svg class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">Keine Lernfelder vorhanden.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="fw in learningStore.frameworks"
        :key="fw.id"
        class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden"
      >
        <button
          @click="toggleFramework(fw)"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{{ fw.titel }}</h3>
              <span class="inline-flex items-center rounded-md bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-400 shrink-0">
                {{ fw.lernfeld }}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{{ fw.kompetenz }}</p>
          </div>
          <svg
            class="h-5 w-5 text-slate-400 shrink-0 ml-3 transition-transform duration-200"
            :class="expandedFramework === fw.id ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="expandedFramework === fw.id" class="border-t border-slate-200 dark:border-slate-700">
          <div v-if="loadingTree" class="p-4">
            <div class="space-y-2">
              <div v-for="i in 3" :key="i" class="h-12 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>
          <div v-else-if="getCoursesForFramework(fw.id).length === 0" class="p-4 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400">Keine Kurse vorhanden.</p>
          </div>
          <div v-else class="divide-y divide-slate-100 dark:divide-slate-700">
            <div
              v-for="course in getCoursesForFramework(fw.id)"
              :key="course.id"
              class="flex items-center justify-between p-4 pl-8"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm text-slate-700 dark:text-slate-300 truncate">{{ course.titel }}</h4>
                  <span v-if="course.kiGeneriert" class="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:text-purple-400">
                    KI
                  </span>
                  <span
                    v-if="course.freigegeben"
                    class="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Freigegeben
                  </span>
                </div>
                <p v-if="course.beschreibung" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                  {{ course.beschreibung }}
                </p>
              </div>
              <div v-if="course.qualitaetsScore !== undefined" class="shrink-0 ml-4">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  :class="qualitaetBg(course.qualitaetsScore) + ' ' + qualitaetColor(course.qualitaetsScore)"
                >
                  {{ course.qualitaetsScore }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
