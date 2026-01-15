import { ref, computed, onMounted } from 'vue'
import catalogosService from '../services/catalogosService'
import { useNotification } from './useNotification'

export const useCatalogos = () => {
  const areas = ref([])
  const prioridades = ref([])
  const tiposSolicitud = ref([])
  const isLoading = ref(false)
  const { success, error: showError } = useNotification()

  // ===== CARGAR DATOS =====
  const cargarAreas = async () => {
    isLoading.value = true
    try {
      const data = await catalogosService.getAreas()
      areas.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error al cargar áreas:', error)
      showError('Error al cargar áreas')
      areas.value = []
    } finally {
      isLoading.value = false
    }
  }

  const cargarPrioridades = async () => {
    isLoading.value = true
    try {
      const data = await catalogosService.getPrioridades()
      prioridades.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error al cargar prioridades:', error)
      showError('Error al cargar prioridades')
      prioridades.value = []
    } finally {
      isLoading.value = false
    }
  }

  const cargarTiposSolicitud = async () => {
    isLoading.value = true
    try {
      const data = await catalogosService.getTiposSolicitud()
      tiposSolicitud.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error al cargar tipos de solicitud:', error)
      showError('Error al cargar tipos de solicitud')
      tiposSolicitud.value = []
    } finally {
      isLoading.value = false
    }
  }

  const cargarTodos = async () => {
    await Promise.all([cargarAreas(), cargarPrioridades(), cargarTiposSolicitud()])
  }

  // ===== CREAR =====
  const crearArea = async (data) => {
    isLoading.value = true
    try {
      await catalogosService.createArea(data)
      success('Área creada correctamente')
      await cargarAreas()
      return true
    } catch (error) {
      console.error('Error al crear área:', error)
      showError('Error al crear el área')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const crearPrioridad = async (data) => {
    isLoading.value = true
    try {
      await catalogosService.createPrioridad(data)
      success('Prioridad creada correctamente')
      await cargarPrioridades()
      return true
    } catch (error) {
      console.error('Error al crear prioridad:', error)
      showError('Error al crear la prioridad')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const crearTipoSolicitud = async (data) => {
    isLoading.value = true
    try {
      await catalogosService.createTipoSolicitud(data)
      success('Tipo de solicitud creado correctamente')
      await cargarTiposSolicitud()
      return true
    } catch (error) {
      console.error('Error al crear tipo de solicitud:', error)
      showError('Error al crear el tipo de solicitud')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // ===== ACTUALIZAR =====
  const actualizarArea = async (id, data) => {
    isLoading.value = true
    try {
      await catalogosService.updateArea(id, data)
      success('Área actualizada correctamente')
      await cargarAreas()
      return true
    } catch (error) {
      console.error('Error al actualizar área:', error)
      showError('Error al actualizar el área')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const actualizarPrioridad = async (id, data) => {
    isLoading.value = true
    try {
      await catalogosService.updatePrioridad(id, data)
      success('Prioridad actualizada correctamente')
      await cargarPrioridades()
      return true
    } catch (error) {
      console.error('Error al actualizar prioridad:', error)
      showError('Error al actualizar la prioridad')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const actualizarTipoSolicitud = async (id, data) => {
    isLoading.value = true
    try {
      await catalogosService.updateTipoSolicitud(id, data)
      success('Tipo de solicitud actualizado correctamente')
      await cargarTiposSolicitud()
      return true
    } catch (error) {
      console.error('Error al actualizar tipo de solicitud:', error)
      showError('Error al actualizar el tipo de solicitud')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // ===== ELIMINAR =====
  const eliminarArea = async (id) => {
    isLoading.value = true
    try {
      await catalogosService.deleteArea(id)
      success('Área eliminada correctamente')
      await cargarAreas()
      return true
    } catch (error) {
      console.error('Error al eliminar área:', error)
      showError('Error al eliminar el área')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const eliminarPrioridad = async (id) => {
    isLoading.value = true
    try {
      await catalogosService.deletePrioridad(id)
      success('Prioridad eliminada correctamente')
      await cargarPrioridades()
      return true
    } catch (error) {
      console.error('Error al eliminar prioridad:', error)
      showError('Error al eliminar la prioridad')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const eliminarTipoSolicitud = async (id) => {
    isLoading.value = true
    try {
      await catalogosService.deleteTipoSolicitud(id)
      success('Tipo de solicitud eliminado correctamente')
      await cargarTiposSolicitud()
      return true
    } catch (error) {
      console.error('Error al eliminar tipo de solicitud:', error)
      showError('Error al eliminar el tipo de solicitud')
      return false
    } finally {
      isLoading.value = false
    }
  }

  onMounted(cargarTodos)

  return {
    areas,
    prioridades,
    tiposSolicitud,
    isLoading,
    cargarAreas,
    cargarPrioridades,
    cargarTiposSolicitud,
    cargarTodos,
    crearArea,
    crearPrioridad,
    crearTipoSolicitud,
    actualizarArea,
    actualizarPrioridad,
    actualizarTipoSolicitud,
    eliminarArea,
    eliminarPrioridad,
    eliminarTipoSolicitud
  }
}
