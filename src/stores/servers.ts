// stores/servers.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { IServer } from '@/types/server'
import { useAuthStore } from '@/stores/auth'

export const useServersStore = defineStore('servers', () => {
  const servers = ref<IServer[]>([])
  const serversLoading = ref<boolean>(false)
  const serversError = ref<string | null>(null)
  const authStore = useAuthStore()

  const fetchServers = async () => {
    try {
      serversLoading.value = true
      const response = await axios.get<IServer[]>(`${import.meta.env.VITE_BASE_URL}servers`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      servers.value = response.data
      localStorage.setItem('servers', JSON.stringify(servers.value))
      console.log(servers.value)
    } catch (error) {
      console.error('Error fetching servers:', error)
      serversError.value = (error as Error).message
    } finally {
      serversLoading.value = false
    }
  }

  const loadServersFromLocalStorage = () => {
    const storedServers = localStorage.getItem('servers')
    if (storedServers) {
      servers.value = JSON.parse(storedServers)
    }
  }

  const fetchServerCreate = async (
    ipAddress: string, 
    location: string, 
    name: string, 
    port: string, 
    status: string
  ) => {
    try {
      serversLoading.value = true;
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}servers`, 
        {
          ip_address: ipAddress,
          location: location,
          name: name,
          port: port,
          status: status,
        }, 
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      console.log(response.data);
      // Обновите список серверов после успешного создания
      await fetchServers();
    } catch (error) {
      console.error('Error creating server:', error);
      serversError.value = (error as Error).message;
    } finally {
      serversLoading.value = false;
    }
  }

  return { servers, fetchServers, fetchServerCreate, loadServersFromLocalStorage, serversLoading, serversError }
})


