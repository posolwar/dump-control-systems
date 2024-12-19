import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { ILog } from '@/types/log'

import { useAuthStore } from '@/stores/auth'

export const useLogsStore = defineStore('logs', () => {
  const logs = ref<ILog[]>([])
  const logsLoading = ref(false)
  const logsError = ref<string | null>(null)

  const fetchLogs = async () => {
    try {
      logsLoading.value = true
      const response = await axios.get<ILog[]>(`${import.meta.env.VITE_BASE_URL}operations/logs`, {
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`,
        },
      })
      logs.value = response.data
      localStorage.setItem('logs', JSON.stringify(logs.value))
      console.log(logs.value)
    } catch (error) {
      console.error('Error fetching logs:', error)
      logsError.value = (error as Error).message
    } finally {
      logsLoading.value = false
    }
  }

  const loadLogsFromLocalStorage = () => {
    const storedLogs = localStorage.getItem('logs')
    if (storedLogs) {
      logs.value = JSON.parse(storedLogs)
    }
  }

  return { logs, fetchLogs, loadLogsFromLocalStorage, logsLoading, logsError }
})
