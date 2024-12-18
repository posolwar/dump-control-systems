// stores/users.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { IUser } from '@/types/user'
import { useAuthStore } from '@/stores/auth'

export const useUsersStore = defineStore('users', () => {
  const users = ref<IUser[]>([])
  const usersLoading = ref<boolean>(false)
  const usersError = ref<string | null>(null)
  const authStore = useAuthStore()

  const fetchUsers = async () => {
    try {
      usersLoading.value = true
      const response = await axios.get<IUser[]>(`${import.meta.env.VITE_BASE_URL}users/all`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      users.value = response.data
      localStorage.setItem('users', JSON.stringify(users.value))
      console.log(users.value)
    } catch (error) {
      console.error('Error fetching users:', error)
      usersError.value = (error as Error).message
    } finally {
      usersLoading.value = false
    }
  }

  const loadUsersFromLocalStorage = () => {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      users.value = JSON.parse(storedUsers)
    }
  }

  return { users, fetchUsers, loadUsersFromLocalStorage, usersLoading, usersError }
})
