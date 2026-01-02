import { ref, computed, onMounted } from 'vue'
import solicitudesService from '../services/solicitudesService'
import { useNotification } from './useNotification'

export const useMisSolicitudes = () => {
  const misSolicitudes = ref([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const { mostrarNotificacion } = useNotification()

  const filtros = ref({
    estado: '',
    prioridadId: '',
    fechaDesde: '',
    fechaHasta: ''
  })

  const cargarMisSolicitudes = async () => {
    isLoading.value = true
    try {
      const response = await solicitudesService.getMisSolicitudes()
      const data = response.data || response
      misSolicitudes.value = Array.isArray(data) ? data : []
      console.log('Mis solicitudes cargadas:', misSolicitudes.value.length)
    } catch (error) {
      console.error('Error al cargar mis solicitudes:', error)
      mostrarNotificacion('Error al cargar mis solicitudes', 'error')
      misSolicitudes.value = []
    } finally {
      isLoading.value = false
    }
  }

  const aplicarFiltros = async () => {
    isLoading.value = true
    try {
      const response = await solicitudesService.getMisSolicitudes(filtros.value)
      const data = response.data || response
      misSolicitudes.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error al filtrar mis solicitudes:', error)
      mostrarNotificacion('Error al aplicar filtros', 'error')
      misSolicitudes.value = []
    } finally {
      isLoading.value = false
    }
  }

  const limpiarFiltros = () => {
    searchQuery.value = ''
    filtros.value = {
      estado: '',
      prioridadId: '',
      fechaDesde: '',
      fechaHasta: ''
    }
    cargarMisSolicitudes()
  }

  const eliminarSolicitud = async (id) => {
    isLoading.value = true
    try {
      await solicitudesService.deleteSolicitud(id)
      mostrarNotificacion('Solicitud eliminada correctamente', 'success')
      await cargarMisSolicitudes()
    } catch (error) {
      console.error('Error al eliminar solicitud:', error)
      mostrarNotificacion('Error al eliminar la solicitud', 'error')
    } finally {
      isLoading.value = false
    }
  }

  const misSolicitudesFiltradas = computed(() => {
    if (!searchQuery.value.trim()) {
      return misSolicitudes.value
    }

    const query = searchQuery.value.toLowerCase()
    return misSolicitudes.value.filter((s) => {
      const numero = s.numeroSolicitud?.toLowerCase() || ''
      const titulo = s.titulo?.toLowerCase() || ''
      const asunto = s.asunto?.toLowerCase() || ''
      const descripcion = s.descripcion?.toLowerCase() || ''

      return (
        numero.includes(query) ||
        titulo.includes(query) ||
        asunto.includes(query) ||
        descripcion.includes(query)
      )
    })
  })

  // Función auxiliar para verificar si una solicitud puede ser editada
  const puedeSerEditada = (solicitud) => {
    // Solo se puede editar si el estado es "Nueva" (estado === 1)
    return solicitud.estado === 1
  }

  const estadisticas = computed(() => ({
    total: misSolicitudes.value.length,
    nuevas: misSolicitudes.value.filter((s) => s.estado === 1).length,
    enProceso: misSolicitudes.value.filter((s) => s.estado === 2).length,
    resueltas: misSolicitudes.value.filter((s) => s.estado === 3).length,
    cerradas: misSolicitudes.value.filter((s) => s.estado === 4).length
  }))

  onMounted(cargarMisSolicitudes)

  return {
    misSolicitudes,
    isLoading,
    searchQuery,
    filtros,
    misSolicitudesFiltradas,
    estadisticas,
    cargarMisSolicitudes,
    aplicarFiltros,
    limpiarFiltros,
    eliminarSolicitud,
    puedeSerEditada
  }
}
