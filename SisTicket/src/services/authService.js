import api from './api'

/**
 * Interface para la respuesta de login
 * @typedef {Object} LoginResponse
 * @property {number} id - ID del usuario
 * @property {string} nombreUsuario - Nombre de usuario
 * @property {string} nombre - Nombre del usuario
 * @property {string} apellido - Apellido del usuario
 * @property {string} email - Email del usuario
 * @property {string} rol - Rol del usuario
 * @property {string} [area] - Área del usuario (opcional)
 * @property {number} [areaId] - ID del área (opcional)
 * @property {string} token - Token JWT para autenticación
 * @property {boolean} tienePasswordTemporal - Indica si el usuario debe cambiar su contraseña
 */

const authService = {
  login: async (nombreUsuario, password) => {
    try {
      console.log('Enviando login a:', 'http://localhost:5146/api/Auth/login')
      const response = await api.post('/Auth/login', {
        nombreUsuario,
        password
      })
      console.log('Login exitoso:', response.data)
      return response.data
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message)
      throw error
    }
  },

  logout: async () => {
    try {
      // Llamar al endpoint POST /api/auth/logout
      // El servidor elimina la cookie de autenticación automáticamente
      await api.post('/Auth/logout')
      
      // Limpiar el estado local
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth')
      
      // Limpiar sessionStorage
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('auth')
      
      console.log('Logout exitoso - sesión cerrada')
    } catch (error) {
      console.error('Error en logout:', error.message)
      // Aún así limpiar el estado local aunque falle la llamada al servidor
      localStorage.clear()
      sessionStorage.clear()
      throw error
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/Auth/me')
      console.log('Usuario actual:', response.data)
      return response.data
    } catch (error) {
      console.error('Error obteniendo usuario:', error.message)
      throw error
    }
  }
}

export default authService
