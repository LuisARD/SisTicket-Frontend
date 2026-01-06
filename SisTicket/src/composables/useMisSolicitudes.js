import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useNotification } from './useNotification'

export const useMisSolicitudes = () => {
  const solicitudes = ref([])
  const isLoading = ref(false)
  const { error: showError } = useNotification()

  // ===== CARGAR MIS SOLICITUDES =====
  const cargarMisSolicitudes = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/Solicitudes')
      solicitudes.value = Array.isArray(response.data) ? response.data : []
    } catch (err) {
      console.error('Error al cargar solicitudes:', err)
      showError('Error al cargar solicitudes')
      solicitudes.value = []
    } finally {
      isLoading.value = false
    }
  }

  onMounted(cargarMisSolicitudes)

  return {
    solicitudes,
    isLoading,
    cargarMisSolicitudes
  }
}
