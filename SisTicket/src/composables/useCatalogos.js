import { ref, computed, onMounted } from 'vue'
import catalogosService from '../services/catalogosService'
import { useNotification } from './useNotification'

export const useCatalogos = () => {
  const areas = ref([])
  const prioridades = ref([])
  const tiposSolicitud = ref([])
  const isLoading = ref(false)
  const { mostrarNotificacion } = useNotification()

  // ===== CARGAR DATOS =====
  const cargarAreas = async () => {
    isLoading.value = true
    try {
      const data = await catalogosService.getAreas()
      areas.value = Array.isArray(data) ? data : []
      console.log('Áreas cargadas:', areas.value.length)
    } catch (error) {
      console.error('Error al cargar áreas:', error)
      mostrarNotificacion('Error al cargar áreas', 'error')
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
      console.log('Prioridades cargadas:', prioridades.value.length)
    } catch (error) {
      console.error('Error al cargar prioridades:', error)
      mostrarNotificacion('Error al cargar prioridades', 'error')
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
      console.log('Tipos de solicitud cargados:', tiposSolicitud.value.length)
    } catch (error) {
      console.error('Error al cargar tipos de solicitud:', error)
      mostrarNotificacion('Error al cargar tipos de solicitud', 'error')
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
      mostrarNotificacion('Área creada correctamente', 'success')
      await cargarAreas()
      return true
    } catch (error) {
      console.error('Error al crear área:', error)
      mostrarNotificacion('Error al crear el área', 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const crearPrioridad = async (data) => {
    isLoading.value = true
    try {
      await catalogosService.createPrioridad(data)
      mostrarNotificacion('Prioridad creada correctamente', 'success')
      await cargarPrioridades()
      return true
    } catch (error) {
      console.error('Error al crear prioridad:', error)
      mostrarNotificacion('Error al crear la prioridad', 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const crearTipoSolicitud = async (data) => {
    isLoading.value = true
    try {
      await catalogosService.createTipoSolicitud(data)
      mostrarNotificacion('Tipo de solicitud creado correctamente', 'success')
      await cargarTiposSolicitud()
      return true
    } catch (error) {
      console.error('Error al crear tipo de solicitud:', error)
      mostrarNotificacion('Error al crear el tipo de solicitud', 'error')
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
      mostrarNotificacion('Área actualizada correctamente', 'success')
      await cargarAreas()
      return true
    } catch (error) {
      console.error('Error al actualizar área:', error)
      mostrarNotificacion('Error al actualizar el área', 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const actualizarPrioridad = async (id, data) => {
    isLoading.value = true
    try {
      await catalogosService.updatePrioridad(id, data)
      mostrarNotificacion('Prioridad actualizada correctamente', 'success')
      await cargarPrioridades()
      return true
    } catch (error) {
      console.error('Error al actualizar prioridad:', error)
      mostrarNotificacion('Error al actualizar la prioridad', 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const actualizarTipoSolicitud = async (id, data) => {
    isLoading.value = true
    try {
      await catalogosService.updateTipoSolicitud(id, data)
      mostrarNotificacion('Tipo de solicitud actualizado correctamente', 'success')
      await cargarTiposSolicitud()
      return true
    } catch (error) {
      console.error('Error al actualizar tipo de solicitud:', error)
      mostrarNotificacion('Error al actualizar el tipo de solicitud', 'error')
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
      mostrarNotificacion('Área eliminada correctamente', 'success')
      await cargarAreas()
      return true
    } catch (error) {
      console.error('Error al eliminar área:', error)
      mostrarNotificacion('Error al eliminar el área', 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const eliminarPrioridad = async (id) => {
    isLoading.value = true
    try {
      await catalogosService.deletePrioridad(id)
      mostrarNotificacion('Prioridad eliminada correctamente', 'success')
      await cargarPrioridades()
      return true
    } catch (error) {
      console.error('Error al eliminar prioridad:', error)
      mostrarNotificacion('Error al eliminar la prioridad', 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const eliminarTipoSolicitud = async (id) => {
    isLoading.value = true
    try {
      await catalogosService.deleteTipoSolicitud(id)
      mostrarNotificacion('Tipo de solicitud eliminado correctamente', 'success')
      await cargarTiposSolicitud()
      return true
    } catch (error) {
      console.error('Error al eliminar tipo de solicitud:', error)
      mostrarNotificacion('Error al eliminar el tipo de solicitud', 'error')
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
