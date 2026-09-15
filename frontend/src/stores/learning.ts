import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/client'

export interface Framework {
  id: string
  titel: string
  lernfeld: string
  kompetenz: string
  beschreibung?: string
  quelle?: string
  createdAt: string
}

export interface Course {
  id: string
  frameworkId: string
  titel: string
  beschreibung?: string
  lernziele: string[]
  theorie?: string
  freigegeben: boolean
  kiGeneriert: boolean
  qualitaetsScore?: number
}

export interface Task {
  id: string
  frameworkId: string
  courseId?: string
  titel: string
  beschreibung?: string
  musterloesung?: string
  freigegeben: boolean
  kiGeneriert: boolean
}

export const useLearningStore = defineStore('learning', () => {
  const frameworks = ref<Framework[]>([])
  const courses = ref<Course[]>([])
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const selectedFramework = ref<Framework | null>(null)

  async function fetchFrameworks() {
    loading.value = true
    try {
      const res = await api.get<{ data: Framework[] }>('/frameworks')
      frameworks.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchFrameworkTree(id: string) {
    loading.value = true
    try {
      const res = await api.get<{ data: { framework: Framework; courses: Course[]; tasks: Task[] } }>(
        `/frameworks/${id}/tree`,
      )
      selectedFramework.value = res.data.data.framework
      courses.value = res.data.data.courses
      tasks.value = res.data.data.tasks
    } finally {
      loading.value = false
    }
  }

  async function fetchCourses() {
    loading.value = true
    try {
      const res = await api.get<{ data: Course[] }>('/courses')
      courses.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  function $reset() {
    frameworks.value = []
    courses.value = []
    tasks.value = []
    selectedFramework.value = null
  }

  return { frameworks, courses, tasks, loading, selectedFramework, fetchFrameworks, fetchFrameworkTree, fetchCourses, $reset }
})
