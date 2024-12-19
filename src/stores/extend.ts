// stores/dump.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { IDumpExtend } from '@/types/extend'

import { useAuthStore } from '@/stores/auth'

export const useDumpExtendStore = defineStore('dumpExtend', () => {
  const dumpsExtend = ref<IDumpExtend[]>([])
  const dumpsExtendLoading = ref(false)
  const dumpsExtendError = ref<string | null>(null)

  const fetchExtendDumps = async () => {
    try {
      dumpsExtendLoading.value = true
      const response = await axios.get<IDumpExtend[]>(
        `${import.meta.env.VITE_BASE_URL}dumps/extend`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`,
          },
        },
      )
      dumpsExtend.value = response.data
      localStorage.setItem('dumpsExtend', JSON.stringify(dumpsExtend.value))
      console.log(dumpsExtend.value)
    } catch (error) {
      console.error('Error fetching dumps:', error)
      dumpsExtendError.value = (error as Error).message
    } finally {
      dumpsExtendLoading.value = false
    }
  }

  const loadDumpsExtendFromLocalStorage = () => {
    const storedDumpsExtend = localStorage.getItem('dumpsExtend')
    if (storedDumpsExtend) {
      dumpsExtend.value = JSON.parse(storedDumpsExtend)
    }
  }

  return {
    dumpsExtend,
    fetchExtendDumps,
    loadDumpsExtendFromLocalStorage,
    dumpsExtendLoading,
    dumpsExtendError,
  }
})
