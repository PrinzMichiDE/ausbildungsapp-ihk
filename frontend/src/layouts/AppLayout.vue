<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import AppSidebar from '@/components/AppSidebar.vue'

const ui = useUiStore()
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar :open="ui.sidebarOpen" @toggle="ui.toggleSidebar" />

    <main
      class="flex-1 overflow-y-auto transition-all duration-200"
      :class="ui.sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'"
    >
      <header
        class="sticky top-0 z-10 flex h-14 items-center border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 lg:px-6"
      >
        <button
          class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          @click="ui.toggleSidebar"
          aria-label="Menü öffnen"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="ml-auto flex items-center gap-3">
          <button
            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            @click="ui.toggleTheme"
            :aria-label="ui.theme === 'light' ? 'Dark Mode aktivieren' : 'Light Mode aktivieren'"
          >
            <svg v-if="ui.theme === 'light'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </header>

      <div class="p-4 lg:p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>
