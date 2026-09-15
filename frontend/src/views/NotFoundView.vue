<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
    <div class="text-center">
      <p class="text-6xl font-bold text-slate-200 dark:text-slate-700">404</p>
      <h1 class="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Seite nicht gefunden
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Die angeforderte Seite existiert nicht.
      </p>
      <button
        @click="router.push('/')"
        class="mt-6 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
      >
        Zum Dashboard
      </button>
    </div>
  </div>
</template>
