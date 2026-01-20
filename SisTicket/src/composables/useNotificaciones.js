import { ref, onMounted, onUnmounted, watch } from 'vue'
import { notificacionService } from '@/services/notificacionService'
import { authStore } from '@/stores/authStore'

// Variables globales del composable
let reloadInterval = null
let yaIntentamoCargar = false

export const useNotificaciones = () => {
  const notificaciones = ref([])
  
  // Cargar notificaciones del caché local
  const cargarDelCache = () => {
    try {
      const cached = localStorage.getItem('notificaciones_cache')
      if (cached) {
        notificaciones.value = JSON.parse(cached)
      }
    } catch (error) {
      // Silent
    }
  }

  // Guardar en caché
  const guardarEnCache = () => {
    try {
      localStorage.setItem('notificaciones_cache', JSON.stringify(notificaciones.value))
    } catch (error) {
      // Silent
    }
  }

  // Cargar notificaciones del servidor
  const cargarNotificaciones = async () => {
    try {
      const datos = await notificacionService.obtenerNotificaciones()
      notificaciones.value = datos
      guardarEnCache()
    } catch (error) {
      cargarDelCache()
    }
  }

  // Eliminar notificación
  const eliminarNotificacion = async (id) => {
    const success = await notificacionService.eliminarNotificacion(id)
    if (success) {
      notificaciones.value = notificaciones.value.filter(n => n.id !== id)
      guardarEnCache()
    }
    return success
  }

  // Obtener icono según tipo de notificación
  const obtenerIcono = (tipo) => {
    const iconos = {
      1: '📌', 2: '✅', 3: '💬', 4: '🔄'
    }
    return iconos[tipo] || '📌'
  }

  // Obtener color de fondo según tipo
  const obtenerColor = (tipo) => {
    const colores = {
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-green-100 text-green-700',
      3: 'bg-purple-100 text-purple-700',
      4: 'bg-orange-100 text-orange-700'
    }
    return colores[tipo] || 'bg-gray-100 text-gray-700'
  }

  // Formatear fecha relativa
  const formatearFecha = (fecha) => {
    const date = new Date(fecha)
    const ahora = new Date()
    const diff = Math.floor((ahora - date) / 1000)

    if (diff < 60) return 'Hace unos segundos'
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`
    return date.toLocaleDateString('es-ES')
  }

  // Montar/desmontar
  onMounted(() => {
    // Si ya está autenticado, cargar inmediatamente
    if (authStore.isAuthenticated) {
      cargarNotificaciones()
    } else {
      cargarDelCache()
      
      // Watch para cuando inicie sesión
      const unwatch = watch(
        () => authStore.isAuthenticated,
        (nuevoValor) => {
          if (nuevoValor && !yaIntentamoCargar) {
            yaIntentamoCargar = true
            cargarNotificaciones()
          }
        }
      )
      
      onUnmounted(() => {
        unwatch()
      })
    }

    // Polling cada 30 segundos
    reloadInterval = setInterval(() => {
      if (authStore.isAuthenticated) {
        cargarNotificaciones()
      }
    }, 30000)

    onUnmounted(() => {
      if (reloadInterval) clearInterval(reloadInterval)
    })
  })

  return {
    notificaciones,
    cargarNotificaciones,
    eliminarNotificacion,
    obtenerIcono,
    obtenerColor,
    formatearFecha
  }
}
