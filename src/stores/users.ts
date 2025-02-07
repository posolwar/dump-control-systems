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
  const sucssess = ref(false)
  const authStore = useAuthStore()

  const fetchUsers = async () => {
    try {
      usersLoading.value = true
      const response = await axios.get<IUser[]>(`${import.meta.env.VITE_BASE_URL}users/all`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
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
  const fetchUserCreate = async (userName: string, password: string) => {
    try {
      usersLoading.value = true
      const response = await axios.post<IUser>(
        `${import.meta.env.VITE_BASE_URL}users/new`,
        {
          username: userName,
          password: password,
        },

        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      )
      sucssess.value = true
      users.value.push(response.data)
      localStorage.setItem('users', JSON.stringify(users.value))
      console.log(users.value)
      await fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      usersError.value = (error as Error).message
    } finally {
      usersLoading.value = false
    }
  }
  const fetchUserDelete = async (username: string | number) => {
    try {
      usersLoading.value = true
      await axios.delete(`${import.meta.env.VITE_BASE_URL}users/username/${username}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      usersError.value = (error as Error).message
    } finally {
      usersLoading.value = false
    }
  }

  return {
    users,
    fetchUsers,
    loadUsersFromLocalStorage,
    usersLoading,
    usersError,
    fetchUserCreate,
    sucssess,
    fetchUserDelete,
  }
})
