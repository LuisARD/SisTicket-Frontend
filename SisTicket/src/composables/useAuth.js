import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'

export const useAuth = () => {
  const router = useRouter()

  const logout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  return {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    logout
  }
}
