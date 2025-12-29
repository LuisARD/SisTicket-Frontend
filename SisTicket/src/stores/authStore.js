import { reactive } from 'vue'
import authService from '../services/authService'

export const authStore = reactive({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  async login(nombreUsuario, password) {
    this.isLoading = true
    this.error = null
    try {
      console.log('Iniciando login...')
      const data = await authService.login(nombreUsuario, password)
      console.log('Datos de usuario recibidos:', data)
      this.user = {
        id: data.id,
        nombreUsuario: data.nombreUsuario,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        rol: data.rol,
        area: data.area,
        token: data.token
      }
      this.isAuthenticated = true
      console.log('Estado del store actualizado:', this.user)
      return data
    } catch (err) {
      this.error = err.response?.data?.message || 'Error al iniciar sesión'
      console.error('Error en login store:', this.error)
      throw err
    } finally {
      this.isLoading = false
    }
  },

  async logout() {
    try {
      await authService.logout()
      this.user = null
      this.isAuthenticated = false
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  },

  clearError() {
    this.error = null
  }
})
