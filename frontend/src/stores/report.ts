import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/client'

export type ReportStatus = 'entwurf' | 'eingereicht' | 'in_pruefung' | 'visiert' | 'archiviert'

export type ReportDayArt = 'betrieb' | 'berufsschule' | 'schulung' | 'urlaub' | 'krank' | 'feiertag'

export interface ReportActivity {
  id?: string
  beschreibung: string
  dauerMinuten: number
  taskId: string | null
  taskTitel?: string | null
}

export interface ReportDay {
  id?: string
  datum: string
  art: ReportDayArt
  summeMinuten: number
  maxMinuten: number
  aktivitaeten: ReportActivity[]
}

export interface Report {
  id: string
  azubiId: string
  titel: string
  typ: string
  kalenderwoche: number
  jahr: number
  datumVon: string
  datumBis: string
  inhaltMarkdown: string
  status: ReportStatus
  signiertVon?: string | null
  signiertAm?: string | null
  archiviertAm?: string | null
  taskIds: string[]
  summeMinuten: number
  maxMinutenWoche: number | null
  tage?: ReportDay[]
  createdAt: string
}

export interface ReportComment {
  id: string
  text: string
  art: string
  createdAt: string
}

export interface ReportsResponse {
  data: Report[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface SaveDayPayload {
  datum: string
  art: ReportDayArt
  aktivitaeten: Array<{ beschreibung: string; dauerMinuten: number; taskId?: string }>
}

export const useReportStore = defineStore('report', () => {
  const reports = ref<Report[]>([])
  const currentReport = ref<Report | null>(null)
  const comments = ref<ReportComment[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)

  function replaceInList(report: Report) {
    const idx = reports.value.findIndex((r) => r.id === report.id)
    if (idx !== -1) reports.value[idx] = report
  }

  function setCurrent(report: Report) {
    currentReport.value = report
    replaceInList(report)
    return report
  }

  async function fetchReports(params?: { status?: string; jahr?: number; azubiId?: string }) {
    loading.value = true
    try {
      const query = new URLSearchParams()
      query.set('page', String(page.value))
      query.set('limit', String(limit.value))
      if (params?.status) query.set('status', params.status)
      if (params?.jahr) query.set('jahr', String(params.jahr))
      if (params?.azubiId) query.set('azubiId', params.azubiId)
      const res = await api.get<ReportsResponse>(`/berichte?${query.toString()}`)
      reports.value = res.data.data
      total.value = res.data.meta.total
    } finally {
      loading.value = false
    }
  }

  async function fetchReport(id: string) {
    loading.value = true
    try {
      const res = await api.get<{ data: Report }>(`/berichte/${id}`)
      currentReport.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function createReport(data: { titel: string; kalenderwoche: number; jahr: number }) {
    saving.value = true
    try {
      const res = await api.post<{ data: Report }>('/berichte', data)
      reports.value.unshift(res.data.data)
      return res.data.data
    } finally {
      saving.value = false
    }
  }

  async function updateReport(id: string, data: { titel?: string }) {
    saving.value = true
    try {
      const res = await api.patch<{ data: Report }>(`/berichte/${id}`, data)
      return setCurrent(res.data.data)
    } finally {
      saving.value = false
    }
  }

  async function saveDays(id: string, tage: SaveDayPayload[]) {
    saving.value = true
    try {
      const res = await api.put<{ data: Report }>(`/berichte/${id}/tage`, { tage })
      return setCurrent(res.data.data)
    } finally {
      saving.value = false
    }
  }

  async function submitReport(id: string) {
    saving.value = true
    try {
      const res = await api.post<{ data: Report }>(`/berichte/${id}/submit`)
      return setCurrent(res.data.data)
    } finally {
      saving.value = false
    }
  }

  async function reviewReport(id: string, entscheidung: 'freigeben' | 'zurueck', kommentar?: string) {
    saving.value = true
    try {
      const res = await api.post<{ data: Report }>(`/berichte/${id}/review`, { entscheidung, kommentar })
      return setCurrent(res.data.data)
    } finally {
      saving.value = false
    }
  }

  async function signReport(id: string) {
    saving.value = true
    try {
      const res = await api.post<{ data: Report }>(`/berichte/${id}/visieren`)
      return setCurrent(res.data.data)
    } finally {
      saving.value = false
    }
  }

  async function fetchComments(id: string) {
    const res = await api.get<{ data: ReportComment[] }>(`/berichte/${id}/kommentare`)
    comments.value = res.data.data
  }

  async function addComment(id: string, text: string) {
    await api.post(`/berichte/${id}/kommentare`, { text })
    await fetchComments(id)
  }

  function $reset() {
    reports.value = []
    currentReport.value = null
    comments.value = []
    total.value = 0
    page.value = 1
  }

  return {
    reports, currentReport, comments, loading, saving, total, page, limit,
    fetchReports, fetchReport, createReport, updateReport, saveDays, submitReport,
    reviewReport, signReport, fetchComments, addComment, $reset,
  }
})
