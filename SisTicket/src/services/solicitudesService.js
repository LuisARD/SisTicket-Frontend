import api from './api'

const solicitudesService = {
  getSolicitudes: async (filtros = {}) => {
    try {
      const params = new URLSearchParams()

      if (filtros.estado && filtros.estado !== '') params.append('estado', filtros.estado)
      if (filtros.prioridadId && filtros.prioridadId !== '') params.append('prioridadId', filtros.prioridadId)
      if (filtros.fechaDesde && filtros.fechaDesde !== '') params.append('fechaDesde', filtros.fechaDesde)
      if (filtros.fechaHasta && filtros.fechaHasta !== '') params.append('fechaHasta', filtros.fechaHasta)

      const queryString = params.toString()
      const url = queryString ? `/Solicitudes/filtrar?${queryString}` : '/Solicitudes'

      const response = await api.get(url)
      console.log('Solicitudes obtenidas:', response.data)
      return response.data
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error.message)
      throw error
    }
  },

  getSolicitudById: async (id) => {
    try {
      const response = await api.get(`/Solicitudes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo solicitud:', error.message)
      throw error
    }
  },

  createSolicitud: async (data) => {
    try {
      const response = await api.post('/Solicitudes', data)
      return response.data
    } catch (error) {
      console.error('Error creando solicitud:', error.message)
      throw error
    }
  },

  updateSolicitud: async (id, data) => {
    try {
      const response = await api.put(`/Solicitudes/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error actualizando solicitud:', error.message)
      throw error
    }
  },

  deleteSolicitud: async (id) => {
    try {
      await api.delete(`/Solicitudes/${id}`)
      console.log('Solicitud eliminada')
    } catch (error) {
      console.error('Error eliminando solicitud:', error.message)
      throw error
    }
  },

  cambiarEstado: async (id, estado) => {
    try {
      const response = await api.post(`/Solicitudes/${id}/cambiar-estado`, { estado })
      return response.data
    } catch (error) {
      console.error('Error cambiando estado:', error.message)
      throw error
    }
  },

  asignarGestor: async (id, gestorId) => {
    try {
      const response = await api.post(`/Solicitudes/${id}/asignar-gestor`, { gestorId })
      return response.data
    } catch (error) {
      console.error('Error asignando gestor:', error.message)
      throw error
    }
  },

  getComentarios: async (solicitudId) => {
    try {
      const response = await api.get(`/Solicitudes/${solicitudId}/comentarios`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo comentarios:', error.message)
      throw error
    }
  },

  crearComentario: async (solicitudId, texto) => {
    try {
      const response = await api.post(`/Solicitudes/${solicitudId}/comentarios`, { texto })
      return response.data
    } catch (error) {
      console.error('Error creando comentario:', error.message)
      throw error
    }
  },

  getSolicitudesDetalleById: async (id) => {
    try {
      const response = await api.get(`/Solicitudes/${id}`)
      return response
    } catch (error) {
      console.error('Error obteniendo detalle de solicitud:', error.message)
      throw error
    }
  },

  getGestoresDisponibles: async () => {
    try {
      const response = await api.get('/Usuarios/gestores')
      return response
    } catch (error) {
      console.error('Error obteniendo gestores:', error.message)
      throw error
    }
  },

  getMisSolicitudes: async (filtros = {}) => {
    try {
      const params = new URLSearchParams()

      if (filtros.estado && filtros.estado !== '') params.append('estado', filtros.estado)
      if (filtros.prioridadId && filtros.prioridadId !== '') params.append('prioridadId', filtros.prioridadId)
      if (filtros.fechaDesde && filtros.fechaDesde !== '') params.append('fechaDesde', filtros.fechaDesde)
      if (filtros.fechaHasta && filtros.fechaHasta !== '') params.append('fechaHasta', filtros.fechaHasta)

      const queryString = params.toString()
      const url = queryString ? `/Solicitudes/mis-solicitudes?${queryString}` : '/Solicitudes/mis-solicitudes'

      const response = await api.get(url)
      console.log('Mis solicitudes obtenidas:', response.data)
      return response
    } catch (error) {
      console.error('Error obteniendo mis solicitudes:', error.message)
      throw error
    }
  }
}

export default solicitudesService
