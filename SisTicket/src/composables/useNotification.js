import { ref } from 'vue'

export const useNotification = () => {
  const notification = ref({
    mensaje: '',
    tipo: 'success', // 'success', 'error', 'warning', 'info'
    visible: false
  })

  const mostrarNotificacion = (mensaje, tipo = 'success', duracion = 3000) => {
    notification.value = {
      mensaje,
      tipo,
      visible: true
    }

    if (duracion > 0) {
      setTimeout(() => {
        notification.value.visible = false
      }, duracion)
    }
  }

  const ocultarNotificacion = () => {
    notification.value.visible = false
  }

  return {
    notification,
    mostrarNotificacion,
    ocultarNotificacion
  }
}
