import { ref } from 'vue'

/**
 * Composable para manejar notificaciones y mensajes
 */
export function useNotification() {
  const notifications = ref([])
  const nextId = ref(0)

  /**
   * Agrega una notificación
   * @param {string} message - Mensaje de la notificación
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duración en ms (0 = permanente)
   */
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = nextId.value++
    const notification = {
      id,
      message,
      type
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  /**
   * Métodos de conveniencia para tipos específicos
   */
  const success = (message, duration = 5000) =>
    addNotification(message, 'success', duration)

  const error = (message, duration = 5000) =>
    addNotification(message, 'error', duration)

  const warning = (message, duration = 5000) =>
    addNotification(message, 'warning', duration)

  const info = (message, duration = 5000) =>
    addNotification(message, 'info', duration)

  /**
   * Elimina una notificación
   */
  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  /**
   * Limpia todas las notificaciones
   */
  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    success,
    error,
    warning,
    info,
    removeNotification,
    clearAll
  }
}
