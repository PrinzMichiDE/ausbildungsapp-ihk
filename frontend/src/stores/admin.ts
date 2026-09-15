import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/client'

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  roles: string[]
  abteilungIds: string[]
  mfaActive: boolean
}

export interface AdminRole {
  id: string
  name: string
  beschreibung: string
  benutzerAnzahl: number
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AdminUser[]>([])
  const roles = ref<AdminRole[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const filterRole = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredUsers = computed(() => {
    let result = users.value

    if (filterRole.value) {
      result = result.filter((u) => u.roles.includes(filterRole.value!))
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      )
    }

    return result
  })

  async function fetchUsers() {
    loading.value = true
    try {
      const res = await api.get<{ data: AdminUser[] }>('/api/users')
      users.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchRoles() {
    loading.value = true
    try {
      const res = await api.get<{ data: AdminRole[] }>('/api/roles')
      roles.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function createUser(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    roles: string[]
    abteilungIds?: string[]
  }) {
    saving.value = true
    try {
      const res = await api.post<{ data: AdminUser }>('/api/users', data)
      users.value.unshift(res.data.data)
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function updateUser(
    id: string,
    data: { roles?: string[]; abteilungIds?: string[]; isActive?: boolean },
  ) {
    saving.value = true
    try {
      const res = await api.patch<{ data: AdminUser }>(`/api/users/${id}`, data)
      const idx = users.value.findIndex((u) => u.id === id)
      if (idx !== -1) users.value[idx] = res.data.data
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function deleteUser(id: string) {
    saving.value = true
    try {
      await api.delete(`/api/users/${id}`)
      users.value = users.value.filter((u) => u.id !== id)
    } finally {
      saving.value = false
    }
  }

  async function assignRole(userId: string, role: string) {
    saving.value = true
    try {
      const user = users.value.find((u) => u.id === userId)
      if (!user) return
      const newRoles = [...new Set([...user.roles, role])]
      return await updateUser(userId, { roles: newRoles })
    } finally {
      saving.value = false
    }
  }

  async function removeRole(userId: string, role: string) {
    saving.value = true
    try {
      const user = users.value.find((u) => u.id === userId)
      if (!user) return
      const newRoles = user.roles.filter((r) => r !== role)
      return await updateUser(userId, { roles: newRoles })
    } finally {
      saving.value = false
    }
  }

  async function createRole(data: { name: string; beschreibung?: string }) {
    saving.value = true
    try {
      const res = await api.post<{ data: AdminRole }>('/api/roles', data)
      roles.value.push(res.data.data)
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function updateRole(id: string, data: { name?: string; beschreibung?: string }) {
    saving.value = true
    try {
      const res = await api.patch<{ data: AdminRole }>(`/roles/${id}`, data)
      const idx = roles.value.findIndex((r) => r.id === id)
      if (idx !== -1) roles.value[idx] = res.data.data
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function deleteRole(id: string) {
    saving.value = true
    try {
      await api.delete(`/roles/${id}`)
      roles.value = roles.value.filter((r) => r.id !== id)
    } finally {
      saving.value = false
    }
  }

  function $reset() {
    users.value = []
    roles.value = []
    filterRole.value = null
    searchQuery.value = ''
  }

  return {
    users,
    roles,
    loading,
    saving,
    filterRole,
    searchQuery,
    filteredUsers,
    fetchUsers,
    fetchRoles,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    removeRole,
    createRole,
    updateRole,
    deleteRole,
    $reset,
  }
})
