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

            <!-- Mensaje cuando solicitud está bloqueada -->
            <div v-if="estaBloqueada" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
              <p class="font-semibold">🔒 Solicitud Bloqueada</p>
              <p class="mt-1">{{ estaCerrada ? 'No puedes agregar comentarios en una solicitud cerrada.' : 'No puedes agregar comentarios en una solicitud rechazada.' }}</p>
            </div>

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
            <div v-if="puedeAgregarComentario" class="space-y-2 border-t border-gray-200 pt-4">
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
        <div v-if="!estaBloqueada" class="md:sticky md:top-20 bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 h-fit">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Acciones</h2>

          <div class="space-y-4 sm:space-y-5">
            <!-- Cambiar Estado -->
            <div v-if="puedeCambiarEstado">
              <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-2">Cambiar Estado</label>
              <select
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

            <!-- Mensaje para Solicitantes (sin permisos) -->
            <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs sm:text-sm">
              <p class="font-semibold mb-1">Permisos Limitados</p>
              <p>Como solicitante, puedes agregar comentarios pero no puedes cambiar el estado de la solicitud.</p>
            </div>

            <!-- Asignar Gestor (Solo Admin/SuperAdmin) -->
            <div v-if="puedeAsignarGestor && puedeAsignarGestorEnEsteEstado">
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

            <!-- Autoasignarse (Solo Gestores) -->
            <div v-else-if="esGestor && puedeAsignarGestorEnEsteEstado">
              <label class="block text-xs sm:text-sm font-semibold text-gray-600 mb-2">Asignación</label>
              <p v-if="solicitud?.gestorAsignadoNombre" class="text-xs text-gray-600 mb-2">
                Gestor asignado: <span class="font-semibold">{{ solicitud?.gestorAsignadoNombre }}</span>
              </p>
              <button
                @click="autoasignarse"
                :disabled="isLoadingAction || solicitud?.gestorAsignadoId === authStoreInstance.user?.id"
                :title="solicitud?.gestorAsignadoId === authStoreInstance.user?.id ? 'Ya estás asignado a esta solicitud' : 'Tomar esta solicitud'"
                class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm rounded-lg transition"
              >
                {{ isLoadingAction ? 'Procesando...' : solicitud?.gestorAsignadoId === authStoreInstance.user?.id ? '✓ Ya asignado' : 'Tomar Solicitud' }}
              </button>
            </div>

            <!-- Mensaje cuando solicitud está en estado final bloqueante (Rechazada, Cerrada) -->
            <div v-else-if="estaBloqueada" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
              <p class="font-semibold mb-1">🔒 Solicitud Bloqueada</p>
              <p v-if="estaRechazada">No se puede asignar gestor a una solicitud rechazada.</p>
              <p v-else-if="estaCerrada">No se puede asignar gestor a una solicitud cerrada.</p>
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

        <!-- Mensaje cuando solicitud está cerrada o rechazada -->
        <div v-else class="md:sticky md:top-20 bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 h-fit">
          <div class="p-4 bg-gray-50 border border-gray-300 rounded-lg text-center">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p class="font-semibold text-gray-800">Solicitud Bloqueada</p>
            <p class="text-xs text-gray-600 mt-2">
              {{ estaCerrada ? 'Esta solicitud ha sido cerrada.' : 'Esta solicitud ha sido rechazada.' }}
            </p>
            <p class="text-xs text-gray-600 mt-1">No se pueden realizar acciones adicionales.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Rechazo con Comentario Obligatorio -->
    <Transition name="fade">
      <div v-if="mostrarModalRechazo" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full shadow-xl">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Rechazar Solicitud</h3>
            <button
              @click="mostrarModalRechazo = false"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4 space-y-4">
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p class="font-semibold">⚠️ Acción Irreversible</p>
              <p class="text-xs mt-1">Una solicitud rechazada no podrá ser modificada ni asignada a otro gestor (excepto por SuperAdmin).</p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Motivo del Rechazo
                <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="comentarioRechazo"
                placeholder="Explica el motivo del rechazo..."
                rows="4"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-600 resize-none text-sm"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Este comentario se agregará automáticamente a la solicitud.</p>
            </div>

            <div v-if="errorMessage" class="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Botones -->
          <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              @click="mostrarModalRechazo = false"
              class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm"
            >
              Cancelar
            </button>
            <button
              @click="confirmarRechazo"
              :disabled="!comentarioRechazo.trim() || isLoadingAction"
              class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
            >
              {{ isLoadingAction ? 'Procesando...' : 'Confirmar Rechazo' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Confirmación para Tomar Solicitud -->
    <Transition name="fade">
      <div v-if="mostrarModalTomarSolicitud" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full shadow-xl">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Tomar Solicitud</h3>
            <button
              @click="mostrarModalTomarSolicitud = false"
              class="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4 space-y-4">
            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <p class="font-semibold">ℹ️ Confirmar Asignación</p>
              <p class="text-xs mt-1">Al tomar esta solicitud, serás asignado como responsable y el estado cambiará a <strong>En Proceso</strong>.</p>
            </div>

            <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              <p class="font-semibold mb-2">Detalles de la Solicitud:</p>
              <p><strong>Número:</strong> {{ solicitud?.numeroSolicitud }}</p>
              <p><strong>Asunto:</strong> {{ solicitud?.titulo }}</p>
              <p><strong>Solicitante:</strong> {{ solicitud?.solicitanteNombre }}</p>
            </div>

            <div v-if="errorMessage" class="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
              {{ errorMessage }}
            </div>
          </div>

          <!-- Botones -->
          <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
            <button
              @click="mostrarModalTomarSolicitud = false"
              class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm"
            >
              Cancelar
            </button>
            <button
              @click="confirmarTomarSolicitud"
              :disabled="isLoadingAction"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
            >
              {{ isLoadingAction ? 'Procesando...' : 'Tomar Solicitud' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

    // Modal de rechazo con comentario obligatorio
    const mostrarModalRechazo = ref(false)
    const comentarioRechazo = ref('')
    const estadoRechazoPendiente = ref(null)

    // Modal de confirmación para tomar solicitud
    const mostrarModalTomarSolicitud = ref(false)

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

    // Mapeo de estados string a ID numérico (exactos del API)
    const ESTADO_STRING_A_ID = {
      'Nueva': 1,
      'EnProceso': 2,
      'Resuelta': 3,
      'Rechazada': 4,
      'Cerrada': 5
    }

    // Mapeo inverso de ID a string (exactos del API)
    const ESTADO_ID_A_STRING = {
      1: 'Nueva',
      2: 'EnProceso',
      3: 'Resuelta',
      4: 'Rechazada',
      5: 'Cerrada'
    }

    // Mapeo de transiciones válidas de estados (según API)
    const TRANSICIONES_VALIDAS = {
      1: [2, 4],      // Nueva → En Proceso, Rechazada
      2: [3, 4],      // En Proceso → Resuelta, Rechazada
      3: [5],         // Resuelta → Cerrada
      4: [],          // Rechazada → No puede cambiar (estado final)
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

    // Verificar si el gestor es del área de la solicitud
    const esGestorDelArea = computed(() => {
      if (!esGestor.value) return false
      const areaUserActual = authStoreInstance.user?.areaId
      const areaSolicitud = solicitud.value?.areaId
      return areaUserActual && areaSolicitud && areaUserActual === areaSolicitud
    })

    // Permisos específicos por rol
    const puedeVerGestorAsignado = computed(() => esAdminOSuperAdmin.value)
    
    const puedeCambiarEstado = computed(() => esGestor.value || esAdminOSuperAdmin.value)
    
    // Gestores pueden autoasignarse, Admins/SuperAdmins pueden asignar a cualquiera
    const puedeAsignarGestor = computed(() => esAdminOSuperAdmin.value)
    
    const puedeGestorAutoasignarse = computed(() => {
      // Un gestor puede autoasignarse si:
      // 1. Es gestor
      // 2. No tiene gestor asignado aún (gestorAsignadoId es null/undefined)
      // 3. O ya está autoasignado (muestra botón deshabilitado)
      return esGestor.value
    })

    // Validaciones adicionales para estado Rechazada o Cerrada (estados finales bloqueantes)
    const estaRechazada = computed(() => solicitud.value?.estado === 'Rechazada' || solicitud.value?.estado === 4)
    
    const estaCerrada = computed(() => solicitud.value?.estado === 'Cerrada' || solicitud.value?.estado === 5)
    
    const estaResuelta = computed(() => solicitud.value?.estado === 'Resuelta' || solicitud.value?.estado === 3)
    
    // Solo Rechazada y Cerrada bloquean todo (Resuelta es un paso intermedio)
    const estaBloqueada = computed(() => estaRechazada.value || estaCerrada.value)

    // Admin/SuperAdmin pueden asignar, pero NO en rechazada o cerrada
    // Gestores pueden autoasignarse, pero NO en rechazada o cerrada
    const puedeAsignarGestorEnEsteEstado = computed(() => {
      // Si está rechazada o cerrada, no se puede asignar
      if (estaBloqueada.value) {
        return false
      }
      // En otros estados (incluyendo Resuelta): pueden asignar/autoasignarse
      return puedeAsignarGestor.value || puedeGestorAutoasignarse.value
    })

    // NO puede agregar comentario si está rechazada o cerrada (para TODOS, incluso SuperAdmin)
    const puedeAgregarComentario = computed(() => {
      return !estaBloqueada.value
    })

    // Computed que retorna los estados disponibles según el estado actual y el rol
    const estadosDisponibles = computed(() => {
      if (!solicitud.value?.estado) {
        console.log('Sin estado en solicitud')
        return []
      }
      
      let estadoActual = solicitud.value.estado
      console.log('Estado actual desde solicitud:', estadoActual, 'Tipo:', typeof estadoActual)
      
      // Si el estado es string, convertirlo a número
      if (typeof estadoActual === 'string') {
        // Limpiar espacios en blanco
        estadoActual = estadoActual.trim()
        estadoActual = ESTADO_STRING_A_ID[estadoActual]
        console.log('Estado convertido a número:', estadoActual)
      }
      
      // Si no tenemos un ID válido, retornar vacío
      if (!estadoActual || !TRANSICIONES_VALIDAS[estadoActual]) {
        console.log('Estado inválido o sin transiciones:', estadoActual)
        return []
      }
      
      let estadosValidos = TRANSICIONES_VALIDAS[estadoActual] || []
      
      // Filtrar estados según el rol:
      // - Gestores (rol 2) solo pueden cambiar a Resuelta (3)
      // - Admin y SuperAdmin (roles 3 y 4) pueden cambiar a cualquier estado válido
      if (esGestor.value && !esAdmin.value && !esSuperAdmin.value) {
        // Gestor: solo permitir Resuelta (3)
        estadosValidos = estadosValidos.filter(estadoId => estadoId === 3)
      }
      
      console.log('Estados válidos disponibles:', estadosValidos)
      
      const resultado = estadosValidos.map(estadoId => ({
        id: estadoId,
        label: ESTADO_LABELS[estadoId]
      }))
      
      console.log('Resultado de estadosDisponibles:', resultado)
      return resultado
    })

    // Cargar datos
    const cargarSolicitud = async () => {
      isLoading.value = true
      errorMessage.value = ''
      try {
        const response = await solicitudesService.getSolicitudesDetalleById(solicitudId)
        solicitud.value = response
        console.log('Solicitud cargada:', solicitud.value)
        console.log('Estado de solicitud:', solicitud.value?.estado, 'Tipo:', typeof solicitud.value?.estado)
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
        
        // Filtrar: rol = 2 (Gestor) AND areaId = areaId de la solicitud AND activo = true
        const gestoresDelArea = todosLosUsuarios.filter(usuario => {
          const esGestor = usuario.rol === 2 || usuario.rol === 'Gestor'
          const esDelArea = usuario.areaId === parseInt(solicitud.value.areaId) || usuario.areaId === solicitud.value.areaId
          const estaActivo = usuario.activo === true
          return esGestor && esDelArea && estaActivo
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

      const nuevoEstadoId = parseInt(estadoSeleccionado.value)
      
      // Si se selecciona "Rechazada" (ID 4), pedir comentario obligatorio
      if (nuevoEstadoId === 4) {
        estadoRechazoPendiente.value = nuevoEstadoId
        mostrarModalRechazo.value = true
        return
      }

      // Para otros estados, cambiar directamente
      await realizarCambioEstado(nuevoEstadoId)
    }

    const realizarCambioEstado = async (nuevoEstadoId, comentarioRechazoText = null) => {
      isLoadingAction.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.cambiarEstado(solicitudId, nuevoEstadoId)
        
        // Si es rechazo con comentario, agregar el comentario formateado
        if (nuevoEstadoId === 4 && comentarioRechazoText) {
          const comentarioFormato = `Esta solicitud fue rechazada por: ${comentarioRechazoText}`
          await solicitudesService.crearComentario(solicitudId, comentarioFormato)
        }

        successMessage.value = 'Estado cambiado exitosamente'
        estadoSeleccionado.value = ''
        comentarioRechazo.value = ''
        mostrarModalRechazo.value = false
        estadoRechazoPendiente.value = null
        
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

    const confirmarRechazo = async () => {
      if (!comentarioRechazo.value.trim()) {
        errorMessage.value = 'Debes agregar un comentario para rechazar la solicitud'
        return
      }

      await realizarCambioEstado(estadoRechazoPendiente.value, comentarioRechazo.value)
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

    const autoasignarse = async () => {
      mostrarModalTomarSolicitud.value = true
    }

    const confirmarTomarSolicitud = async () => {
      isLoadingAction.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await solicitudesService.tomarSolicitud(solicitudId)
        successMessage.value = 'Has tomado la solicitud exitosamente. Estado: En Proceso'
        mostrarModalTomarSolicitud.value = false
        await cargarSolicitud()
        setTimeout(() => (successMessage.value = ''), 3000)
      } catch (error) {
        console.error('Error al tomar solicitud:', error)
        errorMessage.value = error.response?.data?.message || 'Error al tomar la solicitud'
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
      autoasignarse,
      // Modal de rechazo
      mostrarModalRechazo,
      comentarioRechazo,
      confirmarRechazo,
      // Modal de tomar solicitud
      mostrarModalTomarSolicitud,
      confirmarTomarSolicitud,
      // Permisos
      esGestor,
      esAdmin,
      esSuperAdmin,
      esAdminOSuperAdmin,
      esGestorDelArea,
      puedeVerGestorAsignado,
      puedeCambiarEstado,
      puedeAsignarGestor,
      estaRechazada,
      estaResuelta,
      estaCerrada,
      estaBloqueada,
      puedeAsignarGestorEnEsteEstado,
      puedeAgregarComentario,
      // Store
      authStoreInstance
    }
  }
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>