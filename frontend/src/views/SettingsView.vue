<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const auth = useAuthStore()
const ui = useUiStore()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Einstellungen</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Profil, Benachrichtigungen und Darstellung.
      </p>
    </div>

    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Profil</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
          <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ auth.fullName }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">E-Mail</label>
          <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ auth.user?.email }}</p>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Rollen</label>
          <div class="flex flex-wrap gap-1.5 mt-1">
            <span
              v-for="role in auth.user?.roles"
              :key="role"
              class="inline-flex items-center rounded-md bg-brand-50 dark:bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-700 dark:text-brand-400"
            >
              {{ role }}
            </span>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Abteilungen</label>
          <div class="flex flex-wrap gap-1.5 mt-1">
            <span
              v-for="id in auth.user?.abteilungIds"
              :key="id"
              class="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              {{ id.slice(0, 8) }}
            </span>
            <span v-if="!auth.user?.abteilungIds?.length" class="text-sm text-slate-400">—</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm divide-y divide-slate-200 dark:divide-slate-700">
      <div class="p-6">
        <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Darstellung</h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dunkles Theme aktivieren</p>
          </div>
          <button
            @click="ui.toggleTheme"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            :class="ui.theme === 'dark' ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'"
            role="switch"
            :aria-checked="ui.theme === 'dark'"
            aria-label="Dark Mode umschalten"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
              :class="ui.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>

      <div class="p-6">
        <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Navigation</h2>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Sidebar</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sidebar zusammengeklappt anzeigen</p>
          </div>
          <button
            @click="ui.toggleSidebar"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            :class="ui.sidebarOpen ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'"
            role="switch"
            :aria-checked="ui.sidebarOpen"
            aria-label="Sidebar umschalten"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm"
              :class="ui.sidebarOpen ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>

      <div class="p-6">
        <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Konto</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 p-3">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">API-Dokumentation</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Swagger-UI für die REST-API</p>
            </div>
            <a
              href="/api/docs"
              target="_blank"
              class="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Öffnen
            </a>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 p-3">
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Abmelden</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sitzung beenden</p>
            </div>
            <button
              @click="auth.logout(); $router.push('/login')"
              class="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
