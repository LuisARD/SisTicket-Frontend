import { ref, computed } from 'vue'
import { usuariosService } from '../services/usuariosService'
import { ROLE_LABELS, ROLE_COLORS, MENSAJES } from '../constants/app.constants'

export function useUsuarios() {
  // Estado reactivo
  const usuarios = ref([])
  const searchQuery = ref('')
  const filtroRol = ref('')
  const filtroEstado = ref('')
  const isLoading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  /**
   * Obtiene todos los usuarios aplicando filtros
   */
  const aplicarFiltros = async () => {
    try {
      isLoading.value = true
      error.value = null

      // El API no admite filtros, así que los aplicamos en frontend
      const respuesta = await usuariosService.getUsuarios()
      usuarios.value = respuesta || []
    } catch (err) {
      error.value = MENSAJES.ERROR_CARGAR_USUARIOS
      console.error('Error al aplicar filtros:', err)
      usuarios.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Limpia todos los filtros y la búsqueda
   */
  const limpiarFiltros = () => {
    searchQuery.value = ''
    filtroRol.value = ''
    filtroEstado.value = ''
    error.value = null
  }

  /**
   * Elimina un usuario con confirmación
   */
  const eliminarUsuario = async (id) => {
    if (!confirm(MENSAJES.CONFIRMACION_ELIMINAR)) {
      return
    }

    try {
      isLoading.value = true
      error.value = null
      await usuariosService.deleteUsuario(id)
      usuarios.value = usuarios.value.filter(u => u.id !== id)
      successMessage.value = MENSAJES.USUARIO_ELIMINADO
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    } catch (err) {
      error.value = MENSAJES.ERROR_ELIMINAR_USUARIO
      console.error('Error al eliminar usuario:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cambia el estado de un usuario
   */
  const cambiarEstadoUsuario = async (id, nuevoEstado) => {
    try {
      isLoading.value = true
      error.value = null
      await usuariosService.cambiarEstado(id, nuevoEstado)
      const usuario = usuarios.value.find(u => u.id === id)
      if (usuario) {
        usuario.activo = nuevoEstado
      }
      successMessage.value = MENSAJES.USUARIO_ACTUALIZADO
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    } catch (err) {
      error.value = MENSAJES.ERROR_ACTUALIZAR_USUARIO
      console.error('Error al cambiar estado:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtiene la etiqueta del rol
   */
  const getRolLabel = (rol) => {
    // El API devuelve rol como string
    if (typeof rol === 'string') {
      return rol
    }
    // Si es número, usar el mapeo de constantes
    return ROLE_LABELS[rol] || 'Desconocido'
  }

  /**
   * Obtiene los colores del rol
   */
  const getRolColor = (rol) => {
    // Mapeo de string a ID para obtener color
    const rolMap = { 'Solicitante': 1, 'Gestor': 2, 'Admin': 3, 'SuperAdmin': 4 }
    const rolId = typeof rol === 'number' ? rol : rolMap[rol] || 0
    return ROLE_COLORS[rolId] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Obtiene la clase de color para el estado
   */
  const getEstadoColor = (activo) => {
    return activo
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  /**
   * Obtiene la etiqueta del estado
   */
  const getEstadoLabel = (activo) => {
    return activo ? 'Activo' : 'Inactivo'
  }

  /**
   * Filtra usuarios combinando búsqueda y filtros
   */
  const usuariosFiltrados = computed(() => {
    let resultado = usuarios.value

    // Filtro por búsqueda
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      resultado = resultado.filter(
        u =>
          u.nombre?.toLowerCase().includes(query) ||
          u.nombreUsuario?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.apellido?.toLowerCase().includes(query) ||
          u.nombreCompleto?.toLowerCase().includes(query)
      )
    }

    // Filtro por rol (comparar con string del API)
    if (filtroRol.value) {
      const rolId = parseInt(filtroRol.value)
      resultado = resultado.filter(u => {
        // El API devuelve rol como string, necesitamos comparar
        const rolMap = { 'Solicitante': 1, 'Gestor': 2, 'Admin': 3, 'SuperAdmin': 4 }
        const usuarioRolId = rolMap[u.rol] || u.rolId
        return usuarioRolId === rolId
      })
    }

    // Filtro por estado
    if (filtroEstado.value) {
      resultado = resultado.filter(u => u.activo === (filtroEstado.value === 'activo'))
    }

    return resultado
  })

  /**
   * Cuenta usuarios por estado
   */
  const totalUsuarios = computed(() => usuarios.value.length)
  const usuariosActivos = computed(() => usuarios.value.filter(u => u.activo).length)
  const usuariosInactivos = computed(() => usuarios.value.filter(u => !u.activo).length)

  return {
    // Estado
    usuarios,
    usuariosFiltrados,
    searchQuery,
    filtroRol,
    filtroEstado,
    isLoading,
    error,
    successMessage,
    // Computed
    totalUsuarios,
    usuariosActivos,
    usuariosInactivos,
    // Métodos
    aplicarFiltros,
    limpiarFiltros,
    eliminarUsuario,
    cambiarEstadoUsuario,
    getRolLabel,
    getRolColor,
    getEstadoColor,
    getEstadoLabel
  }
}
