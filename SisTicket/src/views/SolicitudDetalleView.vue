<template>
  <div class="min-h-screen bg-gray-50 pb-24 sm:pb-8">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <!-- Header con Volver -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <RouterLink
          to="/solicitudes"
          class="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 w-fit"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm sm:text-base">Volver</span>
        </RouterLink>
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Detalle de Solicitud</h1>
      </div>

      <!-- Estado de Carga -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600 text-sm sm:text-base">Cargando solicitud...</p>
        </div>
      </div>

      <!-- Grid Principal - Responsive: Mobile apilado, Desktop 2+1 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <!-- Contenido Principal (1 columna en mobile, 2 en desktop) -->
        <div class="md:col-span-2 space-y-4 md:space-y-6">
          <!-- Información General -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Información General</h2>

            <!-- Grid de Información - Responsive -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <!-- Número de Solicitud -->
              <div class="min-w-0">
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Número</label>
                <p class="text-base sm:text-lg font-semibold text-gray-800 mt-1 truncate">{{ solicitud?.numeroSolicitud || 'N/A' }}</p>
              </div>

              <!-- Estado -->
              <div>
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Estado</label>
                <div class="mt-1">
                  <span
                    :class="[
                      'inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                      getEstadoColor(solicitud?.estado)
                    ]"
                  >
                    {{ getEstadoLabel(solicitud?.estado) }}
                  </span>
                </div>
              </div>

              <!-- Área -->
              <div class="min-w-0">
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Área</label>
                <p class="text-base sm:text-lg font-semibold text-gray-800 mt-1 truncate">{{ solicitud?.areaNombre || solicitud?.area?.nombre || 'N/A' }}</p>
              </div>

              <!-- Tipo -->
              <div class="min-w-0">
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Tipo</label>
                <p class="text-base sm:text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
                  {{ solicitud?.tipoSolicitudNombre || solicitud?.tipoNombre || solicitud?.tipoSolicitud?.nombre || solicitud?.tipo?.nombre || solicitud?.tipo || 'N/A' }}
                </p>
              </div>

              <!-- Prioridad -->
              <div>
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Prioridad</label>
                <div class="mt-1">
                  <span
                    :class="[
                      'inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                      getPrioridadColor(solicitud?.prioridadId)
                    ]"
                  >
                    {{ getPrioridadLabel(solicitud?.prioridadId) }}
                  </span>
                </div>
              </div>

              <!-- Fecha -->
              <div>
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Fecha</label>
                <p class="text-base sm:text-lg font-semibold text-gray-800 mt-1 text-xs sm:text-sm">{{ formatDate(solicitud?.fechaCreacion) }}</p>
              </div>

              <!-- Solicitante -->
              <div class="min-w-0 sm:col-span-2">
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Solicitante</label>
                <p class="text-base sm:text-lg font-semibold text-gray-800 mt-1 truncate">{{ solicitud?.solicitanteNombre || solicitud?.solicitante?.nombre || solicitud?.usuario?.nombre || 'N/A' }}</p>
              </div>

              <!-- Gestor Asignado (No visible para Gestores) -->
              <div v-if="puedeVerGestorAsignado" class="min-w-0 sm:col-span-2">
                <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Gestor Asignado</label>
                <p class="text-base sm:text-lg font-semibold text-gray-800 mt-1 truncate">
                  {{ solicitud?.gestorNombre || solicitud?.gestorAsignadoNombre || solicitud?.gestorAsignado?.nombre || 'Sin asignar' }}
                </p>
              </div>
            </div>

            <!-- Asunto (Full Width) -->
            <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Asunto</label>
              <p class="text-gray-700 mt-2 text-sm sm:text-base line-clamp-3">{{ solicitud?.titulo || 'N/A' }}</p>
            </div>

            <!-- Descripción (Full Width) -->
            <div class="mt-4 sm:mt-6">
              <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Descripción</label>
              <p class="text-gray-700 mt-2 text-sm sm:text-base whitespace-pre-wrap break-words max-h-48 overflow-y-auto">{{ solicitud?.descripcion || 'N/A' }}</p>
            </div>

            <!-- Archivo Adjunto (Full Width) -->
            <div class="mt-4 sm:mt-6">
              <label class="text-xs sm:text-sm font-semibold text-gray-600 block">Archivos Adjuntos</label>
              <div v-if="adjuntos.length > 0" class="mt-2 space-y-2">
                <div v-for="adjunto in adjuntos" :key="adjunto.id" class="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <svg class="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <a
                    :href="`http://localhost:5146/api${solicitudesService.descargarAdjunto(solicitudId, adjunto.id)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-indigo-600 hover:text-indigo-700 font-semibold flex-grow min-w-0 truncate text-xs sm:text-sm"
                  >
                    {{ adjunto.nombreArchivo || adjunto.nombre || 'Descargar archivo' }}
                  </a>
                </div>
              </div>
              <p v-else class="text-gray-500 mt-2 text-xs sm:text-sm">Sin archivos adjuntos</p>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Comentarios</h2>

            <!-- Lista de Comentarios -->
            <div class="space-y-3 mb-4 max-h-80 overflow-y-auto">
              <div v-if="comentarios.length === 0" class="text-center py-6 sm:py-8">
                <p class="text-gray-500 text-sm">Sin comentarios aún</p>
              </div>

              <div v-for="comentario in comentarios" :key="comentario.id" class="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div class="flex justify-between items-start gap-2 mb-2">
                  <p class="font-semibold text-gray-800 text-xs sm:text-sm truncate">{{ comentario.usuarioNombre || 'Anónimo' }}</p>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <p class="text-xs text-gray-500 whitespace-nowrap">{{ formatDate(comentario.fechaCreacion) }}</p>
                    <button
                      @click="eliminarComentario(comentario.id)"
                      :disabled="isLoadingComment"
                      class="text-red-500 hover:text-red-700 disabled:opacity-50 text-xs font-bold"
                      title="Eliminar comentario"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p class="text-gray-700 text-xs sm:text-sm break-words">{{ comentario.texto || 'Sin contenido' }}</p>
              </div>
            </div>

            <!-- Formulario de Comentario -->
            <div class="space-y-2 border-t border-gray-200 pt-4">
              <textarea
                v-model="nuevoComentario"
                placeholder="Escribe un comentario..."
                rows="3"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none text-xs sm:text-sm"
              ></textarea>
              <button
                @click="enviarComentario"
                :disabled="!nuevoComentario.trim() || isLoadingComment"
                class="w-full px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm sm:text-base"
              >
                {{ isLoadingComment ? 'Enviando...' : 'Enviar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Panel de Acciones (1 columna) -->
        <div class="md:sticky md:top-20 bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 h-fit">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Acciones</h2>

          <div class="space-y-4 sm:space-y-5">
            <!-- Cambiar Estado (No disponible para Gestores) -->
            <div v-if="puedeCambiarEstado">
              <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-2">Cambiar Estado</label>
              <div v-if="estadosDisponibles.length === 0" class="p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs">
                {{ solicitud?.estado === 5 ? 'Solicitud cerrada' : 'No hay estados disponibles' }}
              </div>
              <select
                v-else
                v-model="estadoSeleccionado"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-xs sm:text-sm"
              >
                <option value="">Seleccionar</option>
                <option v-for="estado in estadosDisponibles" :key="estado.id" :value="estado.id">
                  {{ estado.label }}
                </option>
              </select>
              <button
                @click="cambiarEstado"
                :disabled="!estadoSeleccionado || isLoadingAction"
                class="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg transition"
              >
                {{ isLoadingAction ? 'Cambiando...' : 'Cambiar' }}
              </button>
            </div>

            <!-- Mensaje para Gestores -->
            <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs sm:text-sm">
              <p class="font-semibold mb-1">Permisos Limitados</p>
              <p>Como gestor, puedes agregar comentarios pero no puedes cambiar el estado de la solicitud.</p>
            </div>

            <!-- Asignar Gestor (No disponible para Gestores) -->
            <div v-if="puedeAsignarGestor">
              <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-2">Asignar Gestor</label>
              <select
                v-model="gestorSeleccionado"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-xs sm:text-sm"
              >
                <option value="">Seleccionar</option>
                <option v-for="gestor in gestores" :key="gestor.id" :value="gestor.id">
                  {{ gestor.nombre }}
                </option>
              </select>
              <button
                @click="asignarGestor"
                :disabled="!gestorSeleccionado || isLoadingAction"
                class="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg transition"
              >
                {{ isLoadingAction ? 'Asignando...' : 'Asignar' }}
              </button>
            </div>
          </div>

          <!-- Mensajes de Estado -->
          <div v-if="successMessage" class="mt-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs sm:text-sm">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import solicitudesService from '../services/solicitudesService'
import api from '../services/api'
import { authStore } from '../stores/authStore'
import { ESTADO_LABELS, ESTADO_COLORS, PRIORIDAD_LABELS, PRIORIDAD_COLORS } from '../constants/app.constants'

export default {
  name: 'SolicitudDetalleView',
  components: {
    Navbar,
    BottomNavBar
  },
  setup() {
    const route = useRoute()
    const authStoreInstance = authStore
    const solicitudId = route.params.id

    const solicitud = ref(null)
    const comentarios = ref([])
    const adjuntos = ref([])
    const gestores = ref([])
    const nuevoComentario = ref('')

    const estadoSeleccionado = ref('')
    const gestorSeleccionado = ref('')

    const isLoading = ref(false)
    const isLoadingComment = ref(false)
    const isLoadingAction = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const hayChanges = ref(false)

    // Funciones helper mejoradas para manejar tanto números como strings
    const getEstadoLabel = (estado) => {
      if (!estado) return 'Desconocido'
      // Si es string, devolverlo tal cual
      if (typeof estado === 'string') return estado
      // Si es número, buscar en el mapa
      return ESTADO_LABELS[estado] || 'Desconocido'
    }
    
    const getEstadoColor = (estado) => {
      if (!estado) return 'bg-gray-100 text-gray-800'
      
      // Mapear nombres de estado a colores
      if (typeof estado === 'string') {
        const estadoMap = {
          'Nueva': 'bg-green-100 text-green-800',
          'En Proceso': 'bg-blue-100 text-blue-800',
          'Resuelta': 'bg-green-100 text-green-800',
          'Cerrada': 'bg-gray-100 text-gray-800',
          'Rechazada': 'bg-orange-100 text-orange-800',
          'Cancelada': 'bg-red-100 text-red-800'
        }
        return estadoMap[estado] || 'bg-gray-100 text-gray-800'
      }
      
      // Si es número, buscar en el mapa
      return ESTADO_COLORS[estado] || 'bg-gray-100 text-gray-800'
    }
    
    const getPrioridadLabel = (prioridad) => {
      if (!prioridad) return 'Desconocida'
      // Si es string, devolverlo tal cual
      if (typeof prioridad === 'string') return prioridad
      // Si es número, buscar en el mapa
      return PRIORIDAD_LABELS[prioridad] || 'Desconocida'
    }
    
    const getPrioridadColor = (prioridad) => {
      if (!prioridad) return 'bg-gray-100 text-gray-800'
      
      // Mapear nombres de prioridad a colores
      if (typeof prioridad === 'string') {
        const prioridadMap = {
          'Baja': 'bg-sky-500 text-white',
          'Media': 'bg-yellow-500 text-white',
          'Alta': 'bg-orange-500 text-white',
          'Crítica': 'bg-red-600 text-white'
        }
        return prioridadMap[prioridad] || 'bg-gray-100 text-gray-800'
      }
      
      // Si es número, buscar en el mapa
      return PRIORIDAD_COLORS[prioridad] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Mapeo de transiciones válidas de estados
    const TRANSICIONES_VALIDAS = {
      1: [2, 4],      // Nueva → En Proceso, Rechazada
      2: [3, 4],      // En Proceso → Resuelta, Rechazada
      3: [5],         // Resuelta → Cerrada
      4: [5],         // Rechazada → Cerrada
      5: []           // Cerrada (estado final, no se puede cambiar)
    }

    // Permisos basados en roles
    const esGestor = computed(() => {
      const rol = authStoreInstance.user?.rol
      return rol === 2 || rol === 'Gestor'
    })

    const esAdmin = computed(() => {
      const rol = authStoreInstance.user?.rol
      return rol === 3 || rol === 'Admin'
    })

    const esSuperAdmin = computed(() => {
      const rol = authStoreInstance.user?.rol
      return rol === 4 || rol === 'SuperAdmin'
    })

    const esAdminOSuperAdmin = computed(() => esAdmin.value || esSuperAdmin.value)

    // Los gestores NO pueden cambiar estado ni asignar gestor
    const puedeVerGestorAsignado = computed(() => !esGestor.value)
    
    const puedeCambiarEstado = computed(() => !esGestor.value)
    
    const puedeAsignarGestor = computed(() => !esGestor.value)

    // Computed que retorna los estados disponibles según el estado actual
    const estadosDisponibles = computed(() => {
      if (!solicitud.value?.estado) return []
      
      const estadoActual = solicitud.value.estado
      const estadosValidos = TRANSICIONES_VALIDAS[estadoActual] || []
      
      return estadosValidos.map(estadoId => ({
        id: estadoId,
        label: ESTADO_LABELS[estadoId]
      }))
    })

    // Cargar datos
    const cargarSolicitud = async () => {
      isLoading.value = true
      errorMessage.value = ''
      try {
        const response = await solicitudesService.getSolicitudesDetalleById(solicitudId)
        solicitud.value = response
        console.log('Solicitud cargada:', solicitud.value)
        console.log('Área:', solicitud.value?.areaNombre, solicitud.value?.area?.nombre)
        console.log('Tipo:', solicitud.value?.tipoNombre, solicitud.value?.tipoSolicitud?.nombre, solicitud.value?.tipo)
        
        // Cargar gestores del área de la solicitud
        await cargarGestores()
        
        // Cargar comentarios
        await cargarComentarios()
        
        // Cargar adjuntos
        await cargarAdjuntos()
      } catch (error) {
        console.error('Error cargando solicitud:', error)
        errorMessage.value = 'Error al cargar la solicitud'
      } finally {
        isLoading.value = false
      }
    }

    const cargarComentarios = async () => {
      try {
        const response = await solicitudesService.getComentarios(solicitudId)
        comentarios.value = response || []
        console.log('Comentarios cargados:', comentarios.value)
      } catch (error) {
        console.error('Error cargando comentarios:', error)
        comentarios.value = []
      }
    }

    const cargarGestores = async () => {
      try {
        // Si no hay solicitud aún o no tiene areaId, no cargar gestores
        if (!solicitud.value?.areaId) {
          gestores.value = []
          return
        }

        // Obtener todos los usuarios
        const response = await api.get('/Usuarios')
        const todosLosUsuarios = Array.isArray(response.data) ? response.data : []
        
        // Filtrar: rol = 2 (Gestor) AND areaId = areaId de la solicitud
        const gestoresDelArea = todosLosUsuarios.filter(usuario => {
          const esGestor = usuario.rol === 2 || usuario.rol === 'Gestor'
          const esDelArea = usuario.areaId === parseInt(solicitud.value.areaId) || usuario.areaId === solicitud.value.areaId
          return esGestor && esDelArea
        })
        
        gestores.value = gestoresDelArea
        console.log('Gestores del área cargados:', gestores.value)
      } catch (error) {
        console.error('Error cargando gestores:', error)
        gestores.value = []
      }
    }

    const cargarAdjuntos = async () => {
      try {
        const response = await solicitudesService.getAdjuntos(solicitudId)
        adjuntos.value = response || []
        console.log('Adjuntos cargados:', adjuntos.value)
      } catch (error) {
        console.error('Error cargando adjuntos:', error)
        adjuntos.value = []
      }
    }

    const enviarComentario = async () => {
      if (!nuevoComentario.value.trim()) return

      isLoadingComment.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.crearComentario(solicitudId, nuevoComentario.value)
        nuevoComentario.value = ''
        successMessage.value = 'Comentario enviado exitosamente'
        await cargarComentarios()
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error enviando comentario:', error)
        errorMessage.value = 'Error al enviar el comentario'
      } finally {
        isLoadingComment.value = false
      }
    }

    const eliminarComentario = async (comentarioId) => {
      if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return

      isLoadingComment.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.eliminarComentario(solicitudId, comentarioId)
        successMessage.value = 'Comentario eliminado exitosamente'
        await cargarComentarios()
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error eliminando comentario:', error)
        errorMessage.value = 'Error al eliminar el comentario'
      } finally {
        isLoadingComment.value = false
      }
    }

    const cambiarEstado = async () => {
      if (!estadoSeleccionado.value) return

      isLoadingAction.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.cambiarEstado(solicitudId, parseInt(estadoSeleccionado.value))
        successMessage.value = 'Estado cambiado exitosamente'
        estadoSeleccionado.value = ''
        await cargarSolicitud()
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error cambiando estado:', error)
        console.error('Respuesta del servidor:', error.response?.data)
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error al cambiar el estado'
        errorMessage.value = errorMsg
      } finally {
        isLoadingAction.value = false
      }
    }

    const asignarGestor = async () => {
      if (!gestorSeleccionado.value) return

      isLoadingAction.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.asignarGestor(solicitudId, gestorSeleccionado.value)
        successMessage.value = 'Gestor asignado exitosamente'
        gestorSeleccionado.value = ''
        await cargarSolicitud()
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error asignando gestor:', error)
        errorMessage.value = 'Error al asignar el gestor'
      } finally {
        isLoadingAction.value = false
      }
    }

    onMounted(() => {
      cargarSolicitud()
    })

    return {
      solicitudId,
      solicitud,
      comentarios,
      adjuntos,
      gestores,
      nuevoComentario,
      estadoSeleccionado,
      gestorSeleccionado,
      estadosDisponibles,
      isLoading,
      isLoadingComment,
      isLoadingAction,
      errorMessage,
      successMessage,
      hayChanges,
      getEstadoLabel,
      getEstadoColor,
      getPrioridadLabel,
      getPrioridadColor,
      formatDate,
      solicitudesService,
      enviarComentario,
      eliminarComentario,
      cambiarEstado,
      asignarGestor,
      // Permisos
      esGestor,
      esAdmin,
      esSuperAdmin,
      esAdminOSuperAdmin,
      puedeVerGestorAsignado,
      puedeCambiarEstado,
      puedeAsignarGestor
    }
  }
}
</script>
