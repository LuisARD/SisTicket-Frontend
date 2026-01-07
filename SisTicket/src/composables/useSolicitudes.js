import { ref, computed, onMounted } from 'vue'
import solicitudesService from '../services/solicitudesService'
import { mapearEstadoANumero } from '../utils/estadoMapper'
import { authStore } from '../stores/authStore'

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

  // Verificar si es gestor
  const esGestor = computed(() => {
    const rol = authStore.user?.rol
    return rol === 2 || rol === 'Gestor'
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
      // Normalizar filtros: convertir estado a número si es string
      const filtrosNormalizados = {
        ...filtros.value,
        estado: filtros.value.estado ? parseInt(filtros.value.estado) : '',
        prioridadId: filtros.value.prioridadId ? parseInt(filtros.value.prioridadId) : ''
      }
      const data = await solicitudesService.getSolicitudes(filtrosNormalizados)
      solicitudes.value = Array.isArray(data) ? data : []
      console.log('Solicitudes después de filtros:', solicitudes.value.length)
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

  const estadisticas = computed(() => {
    console.log('Recalculando estadísticas con', solicitudes.value.length, 'solicitudes')
    
    const stats = {
      total: solicitudes.value.length,
      nuevas: 0,
      enProceso: 0,
      resueltas: 0,
      cerradas: 0
    }

    solicitudes.value.forEach((s) => {
      const estado = mapearEstadoANumero(s.estado)
      console.log('Solicitud', s.numeroSolicitud, 'Estado original:', s.estado, 'Mapeado:', estado)
      
      if (estado === 1) stats.nuevas++
      else if (estado === 2) stats.enProceso++
      else if (estado === 3) stats.resueltas++
      else if (estado === 5) stats.cerradas++
    })

    console.log('Estadísticas calculadas:', stats)
    return stats
  })

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
