import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/client'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  abteilungIds: string[]
}

interface AuthSuccessResponse {
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}

interface MfaPendingResponse {
  data: {
    mfaRequired: boolean
    pendingToken: string
    user: User | null
  }
}

type LoginResponse = AuthSuccessResponse | MfaPendingResponse

function isMfaResponse(res: LoginResponse): res is MfaPendingResponse {
  return 'mfaRequired' in res.data && res.data.mfaRequired === true
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const mfaPending = ref(false)
  const mfaPendingToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAusbilder = computed(() => user.value?.roles.includes('ausbilder') ?? false)
  const isAzubi = computed(() => user.value?.roles.includes('azubi') ?? false)
  const isAdmin = computed(() => user.value?.roles.includes('admin') ?? false)
  const fullName = computed(() => user.value ? `${user.value.firstName} ${user.value.lastName}` : '')

  function hasRole(role: string): boolean {
    return user.value?.roles.includes(role) ?? false
  }

  function persistTokens(at: string, rt: string) {
    accessToken.value = at
    refreshTokenValue.value = rt
    localStorage.setItem('accessToken', at)
    localStorage.setItem('refreshToken', rt)
  }

  function persistUser(u: User) {
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
  }

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>('/api/auth/login', { email, password })
    const body = res.data

    if (isMfaResponse(body)) {
      mfaPending.value = true
      mfaPendingToken.value = body.data.pendingToken
      return { mfaRequired: true as const }
    }

    persistTokens(body.data.accessToken, body.data.refreshToken)
    persistUser(body.data.user)
    return { mfaRequired: false as const }
  }

  async function verifyMfa(code: string) {
    if (!mfaPendingToken.value) throw new Error('No MFA pending')
    const res = await api.post<AuthSuccessResponse>('/api/auth/verify-mfa', {
      pendingToken: mfaPendingToken.value,
      code,
    })
    persistTokens(res.data.data.accessToken, res.data.data.refreshToken)
    persistUser(res.data.data.user)
    mfaPending.value = false
    mfaPendingToken.value = null
  }

  async function doRefreshToken() {
    if (!refreshTokenValue.value) throw new Error('No refresh token')
    const res = await api.post<AuthSuccessResponse>('/api/auth/refresh', {
      refreshToken: refreshTokenValue.value,
    })
    persistTokens(res.data.data.accessToken, res.data.data.refreshToken)
    persistUser(res.data.data.user)
  }

  function logout() {
    accessToken.value = null
    refreshTokenValue.value = null
    user.value = null
    mfaPending.value = false
    mfaPendingToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    user,
    mfaPending,
    isAuthenticated,
    isAusbilder,
    isAzubi,
    isAdmin,
    fullName,
    hasRole,
    login,
    verifyMfa,
    doRefreshToken,
    logout,
  }
})
