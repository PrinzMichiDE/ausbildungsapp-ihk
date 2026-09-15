import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/client'

export interface Certificate {
  id: string
  azubiId: string
  titel: string
  aussteller: string
  erworbenAm: string
  dokumentUrl?: string
}

export const useCertificateStore = defineStore('certificate', () => {
  const certificates = ref<Certificate[]>([])
  const loading = ref(false)
  const saving = ref(false)

  async function fetchCertificates() {
    loading.value = true
    try {
      const res = await api.get<{ data: Certificate[] }>('/api/zertifikate')
      certificates.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function createCertificate(data: {
    titel: string
    aussteller: string
    erworbenAm: string
    dokumentUrl?: string
  }) {
    saving.value = true
    try {
      const res = await api.post<{ data: Certificate }>('/zertifikate', data)
      certificates.value.unshift(res.data.data)
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function deleteCertificate(id: string) {
    saving.value = true
    try {
      await api.delete(`/zertifikate/${id}`)
      certificates.value = certificates.value.filter((c) => c.id !== id)
    } finally {
      saving.value = false
    }
  }

  function $reset() {
    certificates.value = []
  }

  return { certificates, loading, saving, fetchCertificates, createCertificate, deleteCertificate, $reset }
})
