<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header con Volver -->
      <div class="flex items-center gap-4 mb-6">
        <RouterLink
          to="/solicitudes"
          class="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </RouterLink>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Detalle de Solicitud</h1>
      </div>

      <!-- Estado de Carga -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600">Cargando solicitud...</p>
        </div>
      </div>

      <!-- Grid Principal -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Contenido Principal (2 columnas en desktop) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información General -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Información General</h2>

            <!-- Grid de Información -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Número de Solicitud -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Número de Solicitud</label>
                <p class="text-lg font-semibold text-gray-800 mt-2">{{ solicitud?.numeroSolicitud || 'N/A' }}</p>
              </div>

              <!-- Estado -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Estado</label>
                <div class="mt-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      getEstadoColor(solicitud?.estado)
                    ]"
                  >
                    {{ getEstadoLabel(solicitud?.estado) }}
                  </span>
                </div>
              </div>

              <!-- Área -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Área</label>
                <p class="text-lg font-semibold text-gray-800 mt-2">{{ solicitud?.area?.nombre || 'N/A' }}</p>
              </div>

              <!-- Tipo -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Tipo</label>
                <p class="text-lg font-semibold text-gray-800 mt-2">{{ solicitud?.tipo || 'N/A' }}</p>
              </div>

              <!-- Prioridad -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Prioridad</label>
                <div class="mt-2">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      getPrioridadColor(solicitud?.prioridadId)
                    ]"
                  >
                    {{ getPrioridadLabel(solicitud?.prioridadId) }}
                  </span>
                </div>
              </div>

              <!-- Fecha -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Fecha</label>
                <p class="text-lg font-semibold text-gray-800 mt-2">{{ formatDate(solicitud?.fechaCreacion) }}</p>
              </div>

              <!-- Solicitante -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Solicitante</label>
                <p class="text-lg font-semibold text-gray-800 mt-2">{{ solicitud?.solicitante?.nombre || 'N/A' }}</p>
              </div>

              <!-- Gestor Asignado -->
              <div>
                <label class="text-sm font-semibold text-gray-600">Gestor Asignado</label>
                <p class="text-lg font-semibold text-gray-800 mt-2">
                  {{ solicitud?.gestorAsignado?.nombre || 'Sin asignar' }}
                </p>
              </div>
            </div>

            <!-- Asunto (Full Width) -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <label class="text-sm font-semibold text-gray-600">Asunto</label>
              <p class="text-gray-700 mt-2">{{ solicitud?.asunto || 'N/A' }}</p>
            </div>

            <!-- Descripción (Full Width) -->
            <div class="mt-6">
              <label class="text-sm font-semibold text-gray-600">Descripción</label>
              <p class="text-gray-700 mt-2">{{ solicitud?.descripcion || 'N/A' }}</p>
            </div>

            <!-- Archivo Adjunto (Full Width) -->
            <div class="mt-6">
              <label class="text-sm font-semibold text-gray-600">Archivo Adjunto</label>
              <div v-if="solicitud?.archivoAdjunto" class="mt-2">
                <a
                  :href="solicitud.archivoAdjunto"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Descargar archivo
                </a>
              </div>
              <p v-else class="text-gray-500 mt-2">Sin archivo adjunto</p>
            </div>
          </div>

          <!-- Comentarios -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Comentarios</h2>

            <!-- Lista de Comentarios -->
            <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
              <div v-if="comentarios.length === 0" class="text-center py-8">
                <p class="text-gray-500">Sin comentarios aún</p>
              </div>

              <div v-for="comentario in comentarios" :key="comentario.id" class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <p class="font-semibold text-gray-800">{{ comentario.usuario?.nombre || 'Anónimo' }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(comentario.fechaCreacion) }}</p>
                </div>
                <p class="text-gray-700">{{ comentario.contenido }}</p>
              </div>
            </div>

            <!-- Formulario de Comentario -->
            <div class="space-y-3">
              <textarea
                v-model="nuevoComentario"
                placeholder="Escribe un comentario..."
                rows="4"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
              ></textarea>
              <button
                @click="enviarComentario"
                :disabled="!nuevoComentario.trim() || isLoadingComment"
                class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
              >
                {{ isLoadingComment ? 'Enviando...' : 'Enviar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Panel de Acciones (1 columna en desktop) -->
        <div class="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Acciones</h2>

          <div class="space-y-3">
            <!-- Cambiar Estado -->
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Cambiar Estado</label>
              <select
                v-model="estadoSeleccionado"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
              >
                <option value="">Seleccionar estado</option>
                <option value="1">Nueva</option>
                <option value="2">En Proceso</option>
                <option value="3">Resuelta</option>
                <option value="4">Cerrada</option>
                <option value="5">Cancelada</option>
              </select>
              <button
                @click="cambiarEstado"
                :disabled="!estadoSeleccionado || isLoadingAction"
                class="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition"
              >
                {{ isLoadingAction ? 'Cambiando...' : 'Cambiar' }}
              </button>
            </div>

            <!-- Asignar Gestor -->
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Asignar Gestor</label>
              <select
                v-model="gestorSeleccionado"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
              >
                <option value="">Seleccionar gestor</option>
                <option v-for="gestor in gestores" :key="gestor.id" :value="gestor.id">
                  {{ gestor.nombre }}
                </option>
              </select>
              <button
                @click="asignarGestor"
                :disabled="!gestorSeleccionado || isLoadingAction"
                class="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition"
              >
                {{ isLoadingAction ? 'Asignando...' : 'Asignar' }}
              </button>
            </div>

            <!-- Guardar Cambios -->
            <button
              @click="guardarCambios"
              :disabled="!hayChanges || isLoadingAction"
              class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition mt-6"
            >
              {{ isLoadingAction ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>

          <!-- Mensajes de Estado -->
          <div v-if="successMessage" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
import { ESTADO_LABELS, ESTADO_COLORS, PRIORIDAD_LABELS, PRIORIDAD_COLORS } from '../constants/app.constants'

export default {
  name: 'SolicitudDetalleView',
  components: {
    Navbar,
    BottomNavBar
  },
  setup() {
    const route = useRoute()
    const solicitudId = route.params.id

    const solicitud = ref(null)
    const comentarios = ref([])
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

    // Funciones helper
    const getEstadoLabel = (estado) => ESTADO_LABELS[estado] || 'Desconocido'
    const getEstadoColor = (estado) => ESTADO_COLORS[estado] || 'bg-gray-100 text-gray-800'
    const getPrioridadLabel = (prioridad) => PRIORIDAD_LABELS[prioridad] || 'Desconocida'
    const getPrioridadColor = (prioridad) => PRIORIDAD_COLORS[prioridad] || 'bg-gray-100 text-gray-800'

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

    // Cargar datos
    const cargarSolicitud = async () => {
      isLoading.value = true
      errorMessage.value = ''
      try {
        const response = await solicitudesService.getSolicitudesDetalleById(solicitudId)
        solicitud.value = response.data || response
        console.log('Solicitud cargada:', solicitud.value)
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
        comentarios.value = response.data || response || []
        console.log('Comentarios cargados:', comentarios.value)
      } catch (error) {
        console.error('Error cargando comentarios:', error)
        comentarios.value = []
      }
    }

    const cargarGestores = async () => {
      try {
        const response = await solicitudesService.getGestoresDisponibles()
        gestores.value = response.data || response || []
        console.log('Gestores cargados:', gestores.value)
      } catch (error) {
        console.error('Error cargando gestores:', error)
        gestores.value = []
      }
    }

    const enviarComentario = async () => {
      if (!nuevoComentario.value.trim()) return

      isLoadingComment.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.crearComentario(solicitudId, {
          contenido: nuevoComentario.value
        })
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

    const cambiarEstado = async () => {
      if (!estadoSeleccionado.value) return

      isLoadingAction.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.cambiarEstado(solicitudId, {
          estado: parseInt(estadoSeleccionado.value)
        })
        successMessage.value = 'Estado cambiado exitosamente'
        estadoSeleccionado.value = ''
        await cargarSolicitud()
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error cambiando estado:', error)
        errorMessage.value = 'Error al cambiar el estado'
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
        await solicitudesService.asignarGestor(solicitudId, {
          gestorId: parseInt(gestorSeleccionado.value)
        })
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

    const guardarCambios = async () => {
      isLoadingAction.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        // Aquí iría la lógica para guardar cambios si los hay
        successMessage.value = 'Cambios guardados exitosamente'
        hayChanges.value = false
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error guardando cambios:', error)
        errorMessage.value = 'Error al guardar los cambios'
      } finally {
        isLoadingAction.value = false
      }
    }

    onMounted(() => {
      cargarSolicitud()
      cargarComentarios()
      cargarGestores()
    })

    return {
      solicitud,
      comentarios,
      gestores,
      nuevoComentario,
      estadoSeleccionado,
      gestorSeleccionado,
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
      enviarComentario,
      cambiarEstado,
      asignarGestor,
      guardarCambios
    }
  }
}
</script>
