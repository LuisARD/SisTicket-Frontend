import api from './api'

const authService = {
  login: async (nombreUsuario, password) => {
    try {
      const response = await api.post('/auth/login', {
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
      await api.post('/auth/logout')
      console.log('Logout exitoso')
    } catch (error) {
      console.error('Error en logout:', error.message)
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      console.log('Usuario actual:', response.data)
      return response.data
    } catch (error) {
      console.error('Error obteniendo usuario:', error.message)
      throw error
    }
  }
}

export default authService
