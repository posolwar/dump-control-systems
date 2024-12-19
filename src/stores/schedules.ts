
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { ISchedule } from '@/types/schedule'
import { useAuthStore } from '@/stores/auth'

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<ISchedule[]>([])
  const schedulesLoading = ref<boolean>(false)
  const schedulesError = ref<string | null>(null)
  const authStore = useAuthStore()

  const fetchSchedules = async () => {
    try {
      schedulesLoading.value = true
      const response = await axios.get<ISchedule[]>(`${import.meta.env.VITE_BASE_URL}schedules`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      schedules.value = response.data
      localStorage.setItem('schedules', JSON.stringify(schedules.value))
      console.log(schedules.value)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      schedulesError.value = (error as Error).message
    } finally {
      schedulesLoading.value = false
    }
  }

  const loadSchedulesFromLocalStorage = () => {
    const storedSchedules = localStorage.getItem('schedules')
    if (storedSchedules) {
      schedules.value = JSON.parse(storedSchedules)
    }
  }

  return {
    schedules,
    fetchSchedules,
    loadSchedulesFromLocalStorage,
    schedulesLoading,
    schedulesError,
  }
})
