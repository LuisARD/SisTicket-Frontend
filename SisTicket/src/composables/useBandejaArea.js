import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { useNotification } from './useNotification'
import { authStore } from '../stores/authStore'

export const useBandejaArea = () => {
  const solicitudes = ref([])
  const gestoresDisponibles = ref([])
  const isLoading = ref(false)
  const filtros = ref({
    estado: '',
    prioridadId: '',
    fechaDesde: '',
    fechaHasta: ''
  })
  const { success, error: showError } = useNotification()

  // ===== CARGAR SOLICITUDES =====
  const cargarSolicitudes = async (filtrosAplicar = {}) => {
    isLoading.value = true
    try {
      // Si se pasan filtros, usar el endpoint con filtros
      let datos = []
      
      if (Object.values(filtrosAplicar).some(v => v !== '' && v !== null && v !== undefined)) {
        // Usar endpoint de filtrado
        const params = new URLSearchParams()
        if (filtrosAplicar.estado) params.append('estado', filtrosAplicar.estado)
        if (filtrosAplicar.prioridadId) params.append('prioridadId', filtrosAplicar.prioridadId)
        if (filtrosAplicar.fechaDesde) params.append('fechaDesde', filtrosAplicar.fechaDesde)
        if (filtrosAplicar.fechaHasta) params.append('fechaHasta', filtrosAplicar.fechaHasta)

        const queryString = params.toString()
        const url = `/Solicitudes/filtrar?${queryString}`
        
        const response = await api.get(url)
        datos = Array.isArray(response.data) ? response.data : []
      } else {
        // Sin filtros, obtener todas las solicitudes
        const response = await api.get('/Solicitudes')
        datos = Array.isArray(response.data) ? response.data : []
      }

      // Filtrar según el rol del usuario
      const rol = authStore.user?.rol
      const areaId = authStore.user?.areaId

      if (rol === 'Gestor' || rol === 2) {
        // Gestor: solo ve solicitudes asignadas a él de su área
        datos = datos.filter(s => s.gestorAsignadoId === authStore.user.id && s.areaId === areaId)
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
      
      // Filtrar: rol = 2 (Gestor) AND areaId = areaId de la solicitud AND activo = true
      const gestoresDelArea = todosLosUsuarios.filter(usuario => {
        const esGestor = usuario.rol === 2 || usuario.rol === 'Gestor'
        const esDelArea = usuario.areaId === parseInt(areaId) || usuario.areaId === areaId
        const estaActivo = usuario.activo === true
        return esGestor && esDelArea && estaActivo
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

  // ===== APLICAR FILTROS =====
  const aplicarFiltros = async () => {
    // Normalizar filtros: convertir estado a número si es string
    const filtrosNormalizados = {
      ...filtros.value,
      estado: filtros.value.estado ? parseInt(filtros.value.estado) : '',
      prioridadId: filtros.value.prioridadId ? parseInt(filtros.value.prioridadId) : ''
    }
    await cargarSolicitudes(filtrosNormalizados)
  }

  const limpiarFiltros = () => {
    filtros.value = {
      estado: '',
      prioridadId: '',
      fechaDesde: '',
      fechaHasta: ''
    }
    cargarSolicitudes()
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
    filtros,
    esAdmin,
    esGestor,
    cargarSolicitudes,
    cargarGestoresArea,
    asignarGestor,
    cambiarEstado,
    aplicarFiltros,
    limpiarFiltros
  }
}
