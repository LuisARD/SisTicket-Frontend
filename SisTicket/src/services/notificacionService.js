/**
 * Servicio de Notificaciones - Solo GET REST API (sin SignalR)
 * Endpoint: GET /api/Notificaciones
 */

class NotificacionService {
  constructor() {
    this.baseURL = 'http://localhost:5146/api'
  }

  /**
   * Obtener notificaciones del usuario
   * @returns {Promise<Array>} Array de notificaciones
   */
  async obtenerNotificaciones() {
    try {
      const response = await fetch(`${this.baseURL}/Notificaciones`, {
        method: 'GET',
        credentials: 'include', // ✅ Envía cookies de autenticación
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return []
      }

      const notificaciones = await response.json()
      return Array.isArray(notificaciones) ? notificaciones : []
    } catch (error) {
      return []
    }
  }

  /**
   * Eliminar una notificación (solo Admin/SuperAdmin)
   * @param {number} id - ID de la notificación
   * @returns {Promise<boolean>} true si se eliminó exitosamente
   */
  async eliminarNotificacion(id) {
    try {
      const response = await fetch(`${this.baseURL}/Notificaciones/${id}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ Envía cookies de autenticación
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Limpiar caché de notificaciones
   */
  limpiarCache() {
    try {
      localStorage.removeItem('notificaciones_cache')
    } catch (error) {
      // Silent
    }
  }
}

// Singleton
export const notificacionService = new NotificacionService()


