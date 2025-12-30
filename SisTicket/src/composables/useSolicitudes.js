import { ref, computed, onMounted } from 'vue'
import solicitudesService from '../services/solicitudesService'

export const useSolicitudes = () => {
  const solicitudes = ref([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const filtros = ref({
    estado: '',
    prioridadId: '',
    fechaDesde: '',
    fechaHasta: ''
  })

  const cargarSolicitudes = async () => {
    isLoading.value = true
    try {
      const data = await solicitudesService.getSolicitudes()
      solicitudes.value = Array.isArray(data) ? data : []
      console.log('Solicitudes cargadas:', solicitudes.value.length)
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
      solicitudes.value = []
    } finally {
      isLoading.value = false
    }
  }

  const aplicarFiltros = async () => {
    isLoading.value = true
    try {
      const data = await solicitudesService.getSolicitudes(filtros.value)
      solicitudes.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error al filtrar:', error)
      solicitudes.value = []
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
    cargarSolicitudes()
  }

  const solicitudesFiltradas = computed(() => {
    if (!searchQuery.value.trim()) {
      return solicitudes.value
    }

    const query = searchQuery.value.toLowerCase()
    return solicitudes.value.filter((s) => {
      const numero = s.numeroSolicitud?.toLowerCase() || ''
      const titulo = s.titulo?.toLowerCase() || ''
      const solicitante = s.solicitanteNombre?.toLowerCase() || ''

      return numero.includes(query) || titulo.includes(query) || solicitante.includes(query)
    })
  })

  const estadisticas = computed(() => ({
    total: solicitudes.value.length,
    nuevas: solicitudes.value.filter((s) => s.estado === 1).length,
    enProceso: solicitudes.value.filter((s) => s.estado === 2).length,
    resueltas: solicitudes.value.filter((s) => s.estado === 3).length,
    cerradas: solicitudes.value.filter((s) => s.estado === 4).length
  }))

  onMounted(cargarSolicitudes)

  return {
    solicitudes,
    isLoading,
    searchQuery,
    filtros,
    solicitudesFiltradas,
    estadisticas,
    cargarSolicitudes,
    aplicarFiltros,
    limpiarFiltros
  }
}
