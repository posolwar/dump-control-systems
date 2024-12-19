
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { IScheduleExtend } from '@/types/schedule-extend'
import { useAuthStore } from '@/stores/auth'

export const useSchedulesExtendStore = defineStore('schedulesExtend', () => {
  const schedulesExtend = ref<IScheduleExtend[]>([])
  const schedulesExtendLoading = ref<boolean>(false)
  const schedulesExtendError = ref<string | null>(null)
  const authStore = useAuthStore()

  const fetchSchedulesExtend = async () => {
    try {
      schedulesExtendLoading.value = true
      const response = await axios.get<IScheduleExtend[]>(`${import.meta.env.VITE_BASE_URL}schedules/extend`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      schedulesExtend.value = response.data
      localStorage.setItem('schedulesExtend', JSON.stringify(schedulesExtend.value))
      console.log(schedulesExtend.value)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      schedulesExtendError.value = (error as Error).message
    } finally {
      schedulesExtendLoading.value = false
    }
  }

  const loadSchedulesExtendFromLocalStorage = () => {
    const storedSchedules = localStorage.getItem('schedulesExtend')
    if (storedSchedules) {
      schedulesExtend.value = JSON.parse(storedSchedules)
    }
  }

  return {
    schedulesExtend,
    fetchSchedulesExtend,
    loadSchedulesExtendFromLocalStorage,
    schedulesExtendLoading,
    schedulesExtendError,
  }
})
