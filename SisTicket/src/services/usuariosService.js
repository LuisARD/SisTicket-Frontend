import axios from 'axios'
import { API_ENDPOINTS } from '../constants/app.constants'

const BASE_URL = 'http://localhost:5146/api'

/**
 * Instancia de Axios con configuración base
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

/**
 * Servicio de Usuarios
 */
export const usuariosService = {
  /**
   * Obtiene todos los usuarios
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise}
   */
  async getUsuarios(filtros = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USUARIOS.LIST, {
        params: filtros
      })
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error('Error getUsuarios:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios')
    }
  },

  /**
   * Obtiene un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise}
   */
  async getUsuarioById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USUARIOS.GET(id))
      return response.data
    } catch (error) {
      console.error('Error getUsuarioById:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener el usuario')
    }
  },

  /**
   * Obtiene usuarios por área
   * @param {number} areaId - ID del área
   * @returns {Promise}
   */
  async getUsuariosPorArea(areaId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USUARIOS.POR_AREA(areaId))
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error('Error getUsuariosPorArea:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios del área')
    }
  },

  /**
   * Obtiene gestores por área
   * @param {number} areaId - ID del área
   * @returns {Promise}
   */
  async getGestoresArea(areaId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USUARIOS.GESTORES_AREA(areaId))
      return Array.isArray(response.data) ? response.data : response.data.data || []
    } catch (error) {
      console.error('Error getGestoresArea:', error)
      throw new Error(error.response?.data?.message || 'Error al obtener gestores del área')
    }
  },

  /**
   * Crea un nuevo usuario
   * @param {Object} usuario - Datos del usuario (nombreUsuario, nombre, apellido, email, password, rol, areaId?)
   * @returns {Promise}
   */
  async createUsuario(usuario) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USUARIOS.CREATE, usuario)
      return response.data
    } catch (error) {
      console.error('Error createUsuario:', error)
      throw new Error(error.response?.data?.message || 'Error al crear el usuario')
    }
  },

  /**
   * Actualiza un usuario
   * @param {number} id - ID del usuario
   * @param {Object} usuario - Datos a actualizar (nombreUsuario, nombre, apellido, email, rol, areaId?)
   * @returns {Promise}
   */
  async updateUsuario(id, usuario) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USUARIOS.UPDATE(id), usuario)
      return response.data
    } catch (error) {
      console.error('Error updateUsuario:', error)
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario')
    }
  },

  /**
   * Elimina un usuario
   * @param {number} id - ID del usuario a eliminar
   * @returns {Promise}
   */
  async deleteUsuario(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USUARIOS.DELETE(id))
      return response.data
    } catch (error) {
      console.error('Error deleteUsuario:', error)
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario')
    }
  },

  /**
   * Cambia el estado de un usuario (activo/inactivo)
   * @param {number} id - ID del usuario
   * @param {boolean} activo - Nuevo estado
   * @returns {Promise}
   */
  async cambiarEstado(id, activo) {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.USUARIOS.UPDATE(id)}/estado`,
        { activo }
      )
      return response.data
    } catch (error) {
      console.error('Error cambiarEstado:', error)
      throw new Error(error.response?.data?.message || 'Error al cambiar el estado del usuario')
    }
  }
}

