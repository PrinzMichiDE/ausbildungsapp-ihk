<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const mfaCode = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'E-Mail und Passwort sind erforderlich.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const result = await auth.login(email.value, password.value)
    if (result.mfaRequired) return
    router.push('/')
  } catch (e: unknown) {
    const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = msg || 'Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.'
  } finally {
    loading.value = false
  }
}

async function handleMfa() {
  if (!mfaCode.value) return
  loading.value = true
  error.value = ''
  try {
    await auth.verifyMfa(mfaCode.value)
    router.push('/')
  } catch (e: unknown) {
    const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = msg || 'Ungültiger Code.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-lg">
          NG
        </div>
        <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
          NextGen IT-Ausbildung
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Bitte melden Sie sich an
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <form v-if="!auth.mfaPending" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              E-Mail
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              placeholder="name@beispiel.de"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Passwort
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
              placeholder="Passwort eingeben"
            />
          </div>

          <div v-if="error" class="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Anmelden...
            </span>
            <span v-else>Anmelden</span>
          </button>
        </form>

        <form v-else @submit.prevent="handleMfa" class="space-y-4">
          <div>
            <label for="mfa" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              MFA-Code
            </label>
            <input
              id="mfa"
              v-model="mfaCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              autocomplete="one-time-code"
              required
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors text-center tracking-[0.5em] font-mono"
              placeholder="000000"
            />
          </div>

          <div v-if="error" class="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading || mfaCode.length !== 6"
            class="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifizieren...
            </span>
            <span v-else>Verifizieren</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
