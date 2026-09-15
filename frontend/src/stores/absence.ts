import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/client'

export interface Absence {
  id: string
  azubiId: string
  typ: 'krankheit' | 'urlaub' | 'berufsschule' | 'sonstiges'
  quelle: 'selbst' | 'ausbilder' | 'hr'
  von: string
  bis: string
  notiz?: string
}

export interface AbsenceResponse {
  data: Absence[]
}

export const useAbsenceStore = defineStore('absence', () => {
  const absences = ref<Absence[]>([])
  const loading = ref(false)
  const saving = ref(false)

  async function fetchAbsences() {
    loading.value = true
    try {
      const res = await api.get<AbsenceResponse>('/api/absence')
      absences.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function createAbsence(data: {
    typ: string
    von: string
    bis: string
    notiz?: string
    azubiId?: string
  }) {
    saving.value = true
    try {
      const res = await api.post<{ data: Absence }>('/api/absence', data)
      absences.value.unshift(res.data.data)
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function updateAbsence(id: string, data: { typ?: string; von?: string; bis?: string; notiz?: string }) {
    saving.value = true
    try {
      const res = await api.patch<{ data: Absence }>(`/api/absence/${id}`, data)
      const idx = absences.value.findIndex((a) => a.id === id)
      if (idx !== -1) absences.value[idx] = res.data.data
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function deleteAbsence(id: string) {
    saving.value = true
    try {
      await api.delete(`/api/absence/${id}`)
      absences.value = absences.value.filter((a) => a.id !== id)
    } finally {
      saving.value = false
    }
  }

  function $reset() {
    absences.value = []
  }

  return { absences, loading, saving, fetchAbsences, createAbsence, updateAbsence, deleteAbsence, $reset }
})
