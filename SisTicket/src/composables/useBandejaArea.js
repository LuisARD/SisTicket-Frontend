import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useNotification } from './useNotification'
import { authStore } from '../stores/authStore'

export const useBandejaArea = () => {
  const solicitudes = ref([])
  const gestoresDisponibles = ref([])
  const isLoading = ref(false)
  const { success, error: showError } = useNotification()

  // ===== CARGAR SOLICITUDES =====
  const cargarSolicitudes = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/Solicitudes')
      let datos = Array.isArray(response.data) ? response.data : []

      // Filtrar según el rol del usuario
      const rol = authStore.user?.rol
      const areaId = authStore.user?.areaId

      if (rol === 'Gestor' || rol === 2) {
        // Gestor: solo ve solicitudes asignadas a él de su área
        datos = datos.filter(s => s.gestorId === authStore.user.id && s.areaId === areaId)
      } else if (rol === 'Admin' || rol === 'SuperAdmin' || rol === 3 || rol === 4) {
        // Admin/SuperAdmin: ve todas las solicitudes
        // Se mantienen todas
      }

      solicitudes.value = datos
      console.log(`Solicitudes cargadas: ${solicitudes.value.length}`)
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
      showError('Error al cargar solicitudes')
      solicitudes.value = []
    } finally {
      isLoading.value = false
    }
  }

  // ===== CARGAR GESTORES DE UN ÁREA =====
  const cargarGestoresArea = async (areaId) => {
    try {
      const response = await api.get('/Usuarios', {
        params: {
          rol: 2, // rol Gestor
          areaId: areaId
        }
      })
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error al cargar gestores del área:', error)
      showError('Error al cargar gestores')
      return []
    }
  }

  // ===== ASIGNAR GESTOR =====
  const asignarGestor = async (solicitudId, gestorId) => {
    isLoading.value = true
    try {
      await api.post(`/Solicitudes/${solicitudId}/asignar-gestor`, {
        gestorId: gestorId
      })
      success('Solicitud asignada correctamente')
      await cargarSolicitudes()
      return true
    } catch (error) {
      console.error('Error al asignar gestor:', error)
      showError('Error al asignar gestor')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // ===== CAMBIAR ESTADO =====
  const cambiarEstado = async (solicitudId, nuevoEstado) => {
    isLoading.value = true
    try {
      await api.post(`/Solicitudes/${solicitudId}/cambiar-estado`, {
        estado: nuevoEstado
      })
      success('Estado actualizado correctamente')
      await cargarSolicitudes()
      return true
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      showError('Error al cambiar estado')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // ===== COMPUTED =====
  const esAdmin = computed(() => {
    const rol = authStore.user?.rol
    return rol === 'Admin' || rol === 'SuperAdmin' || rol === 3 || rol === 4
  })

  const esGestor = computed(() => {
    const rol = authStore.user?.rol
    return rol === 'Gestor' || rol === 2
  })

  onMounted(cargarSolicitudes)

  return {
    solicitudes,
    isLoading,
    esAdmin,
    esGestor,
    cargarSolicitudes,
    cargarGestoresArea,
    asignarGestor,
    cambiarEstado
  }
}
