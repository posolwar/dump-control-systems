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
  const authStore = useAuthStore()

  const fetchDumps = async () => {
    try {
      dumpsLoading.value = true
      const response = await axios.get<IDump[]>(`${import.meta.env.VITE_BASE_URL}dumps`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
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

  const fetchDumpCreate = async (databaseId: number) => {
    try {
      dumpsLoading.value = true
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}dumps`,
        {
          database_id: databaseId,
          scheduled_time: new Date().toISOString(), // Замените на нужное значение
          created_at: new Date().toISOString(),
          status: 'pending',
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      )
      console.log(response.data)
      // Обновите список дампов, если необходимо
      await fetchDumps()
    } catch (error) {
      console.error('Error creating dump:', error)
      dumpsError.value = (error as Error).message
    } finally {
      dumpsLoading.value = false
    }
  }

  return { dumps, fetchDumps, loadDumpsFromLocalStorage, dumpsLoading, dumpsError, fetchDumpCreate }
})
