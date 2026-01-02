import api from './api'

const catalogosService = {
  // ===== ÁREAS =====
  getAreas: async () => {
    try {
      const response = await api.get('/Catalogos/areas')
      return response.data
    } catch (error) {
      console.error('Error obteniendo áreas:', error.message)
      throw error
    }
  },

  createArea: async (data) => {
    try {
      const response = await api.post('/Catalogos/areas', data)
      return response.data
    } catch (error) {
      console.error('Error creando área:', error.message)
      throw error
    }
  },

  updateArea: async (id, data) => {
    try {
      const response = await api.put(`/Catalogos/areas/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error actualizando área:', error.message)
      throw error
    }
  },

  deleteArea: async (id) => {
    try {
      await api.delete(`/Catalogos/areas/${id}`)
      return true
    } catch (error) {
      console.error('Error eliminando área:', error.message)
      throw error
    }
  },

  // ===== PRIORIDADES =====
  getPrioridades: async () => {
    try {
      const response = await api.get('/Catalogos/prioridades')
      return response.data
    } catch (error) {
      console.error('Error obteniendo prioridades:', error.message)
      throw error
    }
  },

  createPrioridad: async (data) => {
    try {
      const response = await api.post('/Catalogos/prioridades', data)
      return response.data
    } catch (error) {
      console.error('Error creando prioridad:', error.message)
      throw error
    }
  },

  updatePrioridad: async (id, data) => {
    try {
      const response = await api.put(`/Catalogos/prioridades/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error actualizando prioridad:', error.message)
      throw error
    }
  },

  deletePrioridad: async (id) => {
    try {
      await api.delete(`/Catalogos/prioridades/${id}`)
      return true
    } catch (error) {
      console.error('Error eliminando prioridad:', error.message)
      throw error
    }
  },

  // ===== TIPOS DE SOLICITUD =====
  getTiposSolicitud: async () => {
    try {
      const response = await api.get('/Catalogos/tipos-solicitud')
      return response.data
    } catch (error) {
      console.error('Error obteniendo tipos de solicitud:', error.message)
      throw error
    }
  },

  createTipoSolicitud: async (data) => {
    try {
      const response = await api.post('/Catalogos/tipos-solicitud', data)
      return response.data
    } catch (error) {
      console.error('Error creando tipo de solicitud:', error.message)
      throw error
    }
  },

  updateTipoSolicitud: async (id, data) => {
    try {
      const response = await api.put(`/Catalogos/tipos-solicitud/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error actualizando tipo de solicitud:', error.message)
      throw error
    }
  },

  deleteTipoSolicitud: async (id) => {
    try {
      await api.delete(`/Catalogos/tipos-solicitud/${id}`)
      return true
    } catch (error) {
      console.error('Error eliminando tipo de solicitud:', error.message)
      throw error
    }
  }
}

export default catalogosService
