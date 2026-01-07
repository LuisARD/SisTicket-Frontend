import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useNotification } from './useNotification'

export const useMisSolicitudes = () => {
  const solicitudes = ref([])
  const isLoading = ref(false)
  const { error: showError } = useNotification()

  // ===== CARGAR MIS SOLICITUDES =====
  const cargarMisSolicitudes = async (filtros = {}) => {
    isLoading.value = true
    try {
      // Construir query string con filtros
      const params = new URLSearchParams()
      
      if (filtros.estado) params.append('estado', filtros.estado)
      if (filtros.prioridadId) params.append('prioridadId', filtros.prioridadId)
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde)
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta)

      const queryString = params.toString()
      const url = queryString ? `/Solicitudes/filtrar?${queryString}` : '/Solicitudes'

      const response = await api.get(url)
      solicitudes.value = Array.isArray(response.data) ? response.data : []
      console.log('Mis solicitudes cargadas:', solicitudes.value.length)
    } catch (err) {
      console.error('Error al cargar solicitudes:', err)
      showError('Error al cargar solicitudes')
      solicitudes.value = []
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => cargarMisSolicitudes())

  return {
    solicitudes,
    isLoading,
    cargarMisSolicitudes
  }
}
