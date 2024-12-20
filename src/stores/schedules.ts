import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { ISchedule } from '@/types/schedule'
import { useAuthStore } from '@/stores/auth'

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref<ISchedule[]>([])
  const schedulesLoading = ref<boolean>(false)
  const schedulesError = ref<string | null>(null)
  const selectedInterval = ref<string>('')
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

  const fetchScheduleCreate = async (databaseId: number) => {
    try {
      schedulesLoading.value = true
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}dumps`,
        {
          database_id: databaseId,
          scheduled_time: new Date().toISOString(), // Замените на нужное значение
          created_at: new Date().toISOString(),
          last_run_at: null,
          reperat_interval: selectedInterval.value,
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
      await fetchSchedules()
    } catch (error) {
      console.error('Error creating dump:', error)
      schedulesError.value = (error as Error).message
    } finally {
      schedulesLoading.value = false
    }
  }

  const deleteSchedule = async (id: number) => {
    try {
      schedulesLoading.value = true
      await axios.delete(`${import.meta.env.VITE_BASE_URL}dumps/id/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      // Обновите список дампов после удаления
      await fetchSchedules()
    } catch (error) {
      console.error('Error deleting dump:', error)
      schedulesError.value = (error as Error).message
    } finally {
      schedulesLoading.value = false
    }
  }

  return {
    schedules,
    fetchSchedules,
    loadSchedulesFromLocalStorage,
    schedulesLoading,
    schedulesError,
    fetchScheduleCreate,
    selectedInterval,
    deleteSchedule,
  }
})
