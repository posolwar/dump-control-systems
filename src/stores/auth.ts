// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(Cookies.get('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    Cookies.set('token', newToken, { expires: 7, secure: true, sameSite: 'Strict' })
  }

  function clearToken() {
    token.value = null
    Cookies.remove('token')
  }

  return { token, isAuthenticated, setToken, clearToken }
})
