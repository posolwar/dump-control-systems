// stores/dump.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { IDump } from '@/types/dump'

import { useAuthStore } from '@/stores/auth'

export const useDumpStore = defineStore('dump', () => {
  const dumps = ref<IDump[]>([])
  const dumpsLoading = ref(false)
  const dumpsError = ref<string | null>(null)

  const fetchDumps = async () => {
    try {
      dumpsLoading.value = true
      const response = await axios.get<IDump[]>(`${import.meta.env.VITE_BASE_URL}dumps`, {
        headers: {
          Authorization: `Bearer ${useAuthStore().token}`,
        },
      })
      dumps.value = response.data
      localStorage.setItem('dumps', JSON.stringify(dumps.value))
      console.log(dumps.value)
    } catch (error) {
      console.error('Error fetching dumps:', error)
      dumpsError.value = (error as Error).message
    } finally {
      dumpsLoading.value = false
    }
  }

  const loadDumpsFromLocalStorage = () => {
    const storedDumps = localStorage.getItem('dumps')
    if (storedDumps) {
      dumps.value = JSON.parse(storedDumps)
    }
  }

  return { dumps, fetchDumps, loadDumpsFromLocalStorage, dumpsLoading , dumpsError }
})
