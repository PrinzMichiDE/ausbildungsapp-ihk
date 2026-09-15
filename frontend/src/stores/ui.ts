import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(localStorage.getItem('sidebarOpen') !== 'false')
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  )

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
    localStorage.setItem('sidebarOpen', String(sidebarOpen.value))
  }

  function setTheme(t: 'light' | 'dark') {
    theme.value = t
    localStorage.setItem('theme', t)
    applyTheme(t)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function applyTheme(t: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', t === 'dark')
  }

  watch(theme, applyTheme, { immediate: true })

  return { sidebarOpen, theme, toggleSidebar, setTheme, toggleTheme }
})
