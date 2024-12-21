import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { ISetting } from '@/types/setting'
import { useAuthStore } from '@/stores/auth'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<ISetting[]>([])
  const settingsLoading = ref<boolean>(false)
  const settingsError = ref<string | null>(null)
  const tgToken = ref<string | null>(null)
  const sucssess = ref(false)
  const authStore = useAuthStore()

  const fetchSettings = async () => {
    try {
      settingsLoading.value = true
      const response = await axios.get<ISetting[]>(`${import.meta.env.VITE_BASE_URL}settings`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      settings.value = response.data
      localStorage.setItem('settings', JSON.stringify(settings.value))
      console.log(settings.value)
    } catch (error) {
      console.error('Error fetching settings:', error)
      settingsError.value = (error as Error).message
    } finally {
      settingsLoading.value = false
    }
  }

  const loadSettingsFromLocalStorage = () => {
    const storedSettings = localStorage.getItem('settings')
    if (storedSettings) {
      settings.value = JSON.parse(storedSettings)
    }
  }
  const fetchSettingsCreate = async (tgToken: string) => {
    try {
      settingsLoading.value = true
      const response = await axios.post<ISetting[]>(
        `${import.meta.env.VITE_BASE_URL}settings/new`,
        { value: tgToken },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      )
      settings.value = response.data
      localStorage.setItem('settings', JSON.stringify(settings.value))
      console.log(settings.value)
    } catch (error) {
      console.error('Error fetching settings:', error)
      settingsError.value = (error as Error).message
    } finally {
      settingsLoading.value = false
    }
  }

  return {
    settings,
    fetchSettings,
    loadSettingsFromLocalStorage,
    settingsLoading,
    settingsError,
    fetchSettingsCreate,
    tgToken,
    sucssess,
  }
})
