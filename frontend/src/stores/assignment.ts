import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/client'

export interface Assignment {
  id: string
  azubiId: string
  abteilungId: string
  von: string
  bis: string
  skillLevel: number
  azubi?: { firstName: string; lastName: string }
  abteilung?: { name: string }
}

export const useAssignmentStore = defineStore('assignment', () => {
  const assignments = ref<Assignment[]>([])
  const loading = ref(false)

  async function fetchAssignments() {
    loading.value = true
    try {
      const res = await api.get<{ data: Assignment[] }>('/einsatz')
      assignments.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchPlan() {
    loading.value = true
    try {
      const res = await api.get<{ data: Assignment[] }>('/einsatz/plan')
      assignments.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  function $reset() {
    assignments.value = []
  }

  return { assignments, loading, fetchAssignments, fetchPlan, $reset }
})
