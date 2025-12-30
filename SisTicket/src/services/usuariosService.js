import axios from 'axios'

const API_URL = 'http://localhost:5146/api/Usuarios'

export const usuariosService = {
  // Obtener todos los usuarios
  async getUsuarios(filtros = {}) {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: filtros,
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  },

  // Obtener usuario por ID
  async getUsuarioById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      throw error
    }
  },

  // Crear nuevo usuario
  async createUsuario(usuario) {
    try {
      const response = await axios.post(`${API_URL}`, usuario, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw error
    }
  },

  // Actualizar usuario
  async updateUsuario(id, usuario) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, usuario, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      throw error
    }
  },

  // Eliminar usuario
  async deleteUsuario(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw error
    }
  },

  // Cambiar estado del usuario
  async cambiarEstado(id, activo) {
    try {
      const response = await axios.patch(`${API_URL}/${id}/estado`, { activo }, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error)
      throw error
    }
  }
}
