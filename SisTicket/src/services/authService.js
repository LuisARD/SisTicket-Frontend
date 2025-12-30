import api from './api'

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
      await api.post('/Auth/logout')
      console.log('Logout exitoso')
    } catch (error) {
      console.error('Error en logout:', error.message)
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
