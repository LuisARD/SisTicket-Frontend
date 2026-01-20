import { ref, computed } from 'vue'
import { usuariosService } from '../services/usuariosService'

export const useCambiarPassword = () => {
  const passwordActual = ref('')
  const passwordNueva = ref('')
  const confirmarPassword = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  const success = ref(false)

  // Requisitos de validación
  const requisitos = {
    longitud: (pwd) => pwd.length >= 8,
    mayuscula: (pwd) => /[A-Z]/.test(pwd),
    numero: (pwd) => /[0-9]/.test(pwd),
    simbolo: (pwd) => /[-*@!#$%^&+=]/.test(pwd),
    noIgual: (pwd, actual) => pwd !== actual,
    coincidencia: (pwd, confirmar) => pwd === confirmar
  }

  // Validar requisitos en tiempo real
  const validacionesNuevaPassword = computed(() => ({
    longitud: requisitos.longitud(passwordNueva.value),
    mayuscula: requisitos.mayuscula(passwordNueva.value),
    numero: requisitos.numero(passwordNueva.value),
    simbolo: requisitos.simbolo(passwordNueva.value),
    noIgual: requisitos.noIgual(passwordNueva.value, passwordActual.value),
    coincidencia: requisitos.coincidencia(passwordNueva.value, confirmarPassword.value)
  }))

  // Verificar si todos los requisitos se cumplen
  const todasValidacionesCumplen = computed(() => {
    return (
      validacionesNuevaPassword.value.longitud &&
      validacionesNuevaPassword.value.mayuscula &&
      validacionesNuevaPassword.value.numero &&
      validacionesNuevaPassword.value.simbolo &&
      validacionesNuevaPassword.value.noIgual &&
      validacionesNuevaPassword.value.coincidencia
    )
  })

  // Cambiar contraseña
  const cambiarPassword = async () => {
    if (!todasValidacionesCumplen.value) {
      error.value = 'Por favor, completa todos los requisitos'
      return false
    }

    isLoading.value = true
    error.value = null
    success.value = false

    try {
      await usuariosService.cambiarMiPassword({
        passwordActual: passwordActual.value,
        passwordNueva: passwordNueva.value,
        confirmarPassword: confirmarPassword.value
      })
      success.value = true
      limpiarFormulario()
      return true
    } catch (err) {
      // Intentar obtener mensaje de error del backend
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0] ||
                          err.message || 
                          'Error al cambiar la contraseña'
      error.value = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  const limpiarFormulario = () => {
    passwordActual.value = ''
    passwordNueva.value = ''
    confirmarPassword.value = ''
  }

  const limpiarError = () => {
    error.value = null
  }

  return {
    passwordActual,
    passwordNueva,
    confirmarPassword,
    isLoading,
    error,
    success,
    validacionesNuevaPassword,
    todasValidacionesCumplen,
    cambiarPassword,
    limpiarFormulario,
    limpiarError
  }
}
