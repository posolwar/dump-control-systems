// stores/databases.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { IDatabase } from '@/types/database'
import { useAuthStore } from '@/stores/auth'

export const useDatabasesStore = defineStore('databases', () => {
  const databases = ref<IDatabase[]>([])
  const databaseIdServer = ref<IDatabase[]>([])
  const databasesLoading = ref<boolean>(false)
  const databasesError = ref<string | null>(null)
  const authStore = useAuthStore()

  const fetchDatabases = async () => {
    try {
      databasesLoading.value = true
      const response = await axios.get<IDatabase[]>(`${import.meta.env.VITE_BASE_URL}databases`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      databases.value = response.data
      localStorage.setItem('databases', JSON.stringify(databases.value))
      console.log(databases.value)
    } catch (error) {
      console.error('Error fetching databases:', error)
      databasesError.value = (error as Error).message
    } finally {
      databasesLoading.value = false
    }
  }

  const loadDatabasesFromLocalStorage = () => {
    const storedDatabases = localStorage.getItem('databases')
    if (storedDatabases) {
      databases.value = JSON.parse(storedDatabases)
    }
  }

  const fetchDatabaseIdServer = async (serverId: number) => {
    try {
      databasesLoading.value = true
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}database/server-id/${serverId}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      databaseIdServer.value = response.data;
      return response.data
    } catch (error) {
      console.error('Error fetching databases:', error)
      databasesError.value = (error as Error).message
      return [];
    } finally {
      databasesLoading.value = false
    }
  };

 
  const fetchDatabaseCreate = async (name: string, username: string, password: string, serverId: number) => {
    try {
      databasesLoading.value = true;
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}database`,
        {
          name,
          username,
          password,
          server_id: serverId,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      console.log(response.data);
      // Обновите список баз данных, если необходимо
      fetchDatabases(); // Если нужно обновить список баз данных
    } catch (error) {
      console.error('Error creating database:', error);
      databasesError.value = (error as Error).message;
    } finally {
      databasesLoading.value = false;
    }
  };

  return {
    databases,
    fetchDatabaseCreate,
    fetchDatabases,
    loadDatabasesFromLocalStorage,
    databasesLoading,
    databasesError,
    databaseIdServer,
    fetchDatabaseIdServer
  }
})


