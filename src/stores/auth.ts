// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(Cookies.get('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    // Set the token in a cookie на HTTPs установить secure:true
    Cookies.set('token', newToken, { expires: 7, secure: false, sameSite: 'Strict' })
  }

  function clearToken() {
    token.value = null
    Cookies.remove('token')
  }

  return { token, isAuthenticated, setToken, clearToken }
})
