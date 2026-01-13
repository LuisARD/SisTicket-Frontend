import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'

export const useLogin = () => {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref(null)

  const login = async (nombreUsuario, password) => {
    error.value = null

    // Validación
    if (!nombreUsuario?.trim() || !password?.trim()) {
      error.value = 'Por favor complete todos los campos'
      return false
    }

    isLoading.value = true
    try {
      await authStore.login(nombreUsuario, password)
      
      // Si el usuario tiene contraseña temporal, NO redirigir aún
      // El modal se mostrará y después redirigirá al cambiar la contraseña
      if (authStore.tienePasswordTemporal === true) {
        console.log('[useLogin] Usuario tiene contraseña temporal, esperando cambio antes de redirigir...')
        return true
      }
      
      // Redirigir según el rol del usuario solo si NO tiene contraseña temporal
      const rol = authStore.user?.rol
      if (rol === 1 || rol === 'Solicitante') {
        router.push('/mis-solicitudes')
      } else {
        router.push('/solicitudes')
      }
      
      return true
    } catch (err) {
      error.value = authStore.error || 'Error al iniciar sesión'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    login,
    isLoading,
    error,
    clearError
  }
}
