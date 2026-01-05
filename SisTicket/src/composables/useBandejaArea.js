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
      // Obtener todos los usuarios
      const response = await api.get('/Usuarios')
      const todosLosUsuarios = Array.isArray(response.data) ? response.data : []
      
      // Filtrar: rol = 2 (Gestor) AND areaId = areaId de la solicitud
      const gestoresDelArea = todosLosUsuarios.filter(usuario => {
        const esGestor = usuario.rol === 2 || usuario.rol === 'Gestor'
        const esDelArea = usuario.areaId === parseInt(areaId) || usuario.areaId === areaId
        return esGestor && esDelArea
      })
      
      return gestoresDelArea
    } catch (error) {
      console.error('Error al cargar gestores del área:', error)
      showError('Error al cargar gestores del área')
      return []
    }
  }

  // ===== ASIGNAR GESTOR =====
  const asignarGestor = async (solicitudId, gestorId) => {
    try {
      await api.post(`/Solicitudes/${solicitudId}/asignar-gestor`, {
        gestorId: gestorId
      })
      success('Solicitud asignada correctamente')
      await cargarSolicitudes()
      return true
    } catch (error) {
      console.error('Error al asignar gestor:', error)
      const errorMsg = error.response?.data?.message || 'Error al asignar gestor'
      showError(errorMsg)
      throw error
    }
  }

  // ===== CAMBIAR ESTADO =====
  const cambiarEstado = async (solicitudId, nuevoEstado) => {
    try {
      await api.post(`/Solicitudes/${solicitudId}/cambiar-estado`, {
        estado: nuevoEstado
      })
      success('Estado actualizado correctamente')
      await cargarSolicitudes()
      return true
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      const errorMsg = error.response?.data?.message || 'Error al cambiar estado'
      showError(errorMsg)
      throw error
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
