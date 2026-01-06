<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white rounded-lg w-full max-w-sm sm:max-w-lg md:max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
      <!-- Encabezado -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Editar Solicitud #{{ solicitudId }}</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition text-xl sm:text-base"
        >
          ✕
        </button>
      </div>

      <!-- Mensaje de advertencia si no puede editar -->
      <div v-if="!puedeEditar" class="px-4 sm:px-6 py-3 bg-amber-50 border-b border-amber-200">
        <p class="text-sm text-amber-700 font-medium">⚠️ {{ mensajeNoEditable }}</p>
      </div>

      <!-- Contenido del Formulario -->
      <form @submit.prevent="guardar" class="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto flex-1">
        <!-- Área -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Área
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.areaId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || !puedeEditar"
            @change="cargarTiposSolicitud"
          >
            <option value="">-- Seleccionar Área --</option>
            <option v-for="area in catalogos.areas.value" :key="area.id" :value="area.id">
              {{ area.nombre }}
            </option>
          </select>
          <p v-if="errors.areaId" class="text-xs text-red-600 mt-1">{{ errors.areaId }}</p>
        </div>

        <!-- Tipo de Solicitud -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Solicitud
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.tipoSolicitudId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || !formData.areaId || !puedeEditar"
          >
            <option value="">-- Seleccionar Tipo --</option>
            <option v-for="tipo in tiposSolicitudFiltrados" :key="tipo.id" :value="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
          <p v-if="errors.tipoSolicitudId" class="text-xs text-red-600 mt-1">{{ errors.tipoSolicitudId }}</p>
        </div>

        <!-- Asunto (Título) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Asunto
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.titulo"
            type="text"
            placeholder="Asunto de la solicitud"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || !puedeEditar"
          />
          <p v-if="errors.titulo" class="text-xs text-red-600 mt-1">{{ errors.titulo }}</p>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.descripcion"
            placeholder="Descripción detallada"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || !puedeEditar"
          ></textarea>
          <p v-if="errors.descripcion" class="text-xs text-red-600 mt-1">{{ errors.descripcion }}</p>
        </div>

        <!-- Prioridad -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.prioridadId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || !puedeEditar"
          >
            <option value="">-- Seleccionar Prioridad --</option>
            <option v-for="prioridad in catalogos.prioridades.value" :key="prioridad.id" :value="prioridad.id">
              {{ prioridad.nombre }}
            </option>
          </select>
          <p v-if="errors.prioridadId" class="text-xs text-red-600 mt-1">{{ errors.prioridadId }}</p>
        </div>

        <!-- Adjuntos -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Archivo Adjunto</label>
          
          <!-- Archivo actual -->
          <div v-if="adjuntoActual" class="mb-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-2 flex-grow min-w-0">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-700 truncate">{{ adjuntoActual.nombreArchivo || adjuntoActual.nombre }}</span>
            </div>
            <button
              type="button"
              @click="eliminarAdjuntoActual"
              :disabled="isLoading || !adjuntoActual || !puedeEditar"
              class="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed text-xs font-semibold ml-2 flex-shrink-0"
              title="Eliminar archivo"
            >
              Eliminar
            </button>
          </div>

          <!-- Input para nuevo archivo -->
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition">
            <input
              ref="inputArchivo"
              type="file"
              @change="seleccionarArchivo"
              class="hidden"
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="$refs.inputArchivo.click()"
              class="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
              :disabled="isLoading || !puedeEditar"
            >
              {{ adjuntoSeleccionado ? 'Cambiar archivo' : 'Cargar archivo' }}
            </button>
            <p v-if="adjuntoSeleccionado" class="text-xs text-gray-600 mt-2">{{ adjuntoSeleccionado.name }}</p>
          </div>
          <p v-if="errors.adjunto" class="text-xs text-red-600 mt-1">{{ errors.adjunto }}</p>
        </div>

        <!-- Botones -->
        <div class="flex gap-2 sm:gap-3 pt-4 border-t flex-shrink-0">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-xs sm:text-sm transition"
            :disabled="isLoading"
          >
            Salir
          </button>
          <button
            type="submit"
            class="flex-1 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs sm:text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || !puedeEditar"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCatalogos } from '../composables/useCatalogos'
import { useNotification } from '../composables/useNotification'
import solicitudesService from '../services/solicitudesService'
import api from '../services/api'
import { authStore } from '../stores/authStore'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  solicitud: { type: Object, default: null }
})

const emit = defineEmits(['close', 'success'])

const catalogos = useCatalogos()
const { success, error } = useNotification()
const authStoreInstance = authStore

const formData = ref({
  areaId: '',
  tipoSolicitudId: '',
  titulo: '',
  descripcion: '',
  prioridadId: ''
})

const tiposSolicitudFiltrados = computed(() => {
  if (!formData.value.areaId) return []
  return catalogos.tiposSolicitud.value.filter(t => t.areaId === parseInt(formData.value.areaId) || t.areaId === formData.value.areaId)
})

const errors = ref({})
const isLoading = ref(false)
const inputArchivo = ref(null)
const adjuntoSeleccionado = ref(null)
const adjuntoActual = ref(null)

const solicitudId = computed(() => props.solicitud?.id || props.solicitud?.numeroSolicitud)

// Validar si el usuario puede editar la solicitud
const puedeEditar = computed(() => {
  if (!props.solicitud) return false
  
  // Estado Nueva = 1
  const estadoNueva = props.solicitud.estado === 1 || props.solicitud.estado === '1' || props.solicitud.estado === 'Nueva'
  
  // Roles Admin (3) o SuperAdmin (4)
  const esAdmin = authStoreInstance.user?.rol === 3 || authStoreInstance.user?.rol === 4 || 
                  authStoreInstance.user?.rol === 'Admin' || authStoreInstance.user?.rol === 'SuperAdmin'
  
  // Puede editar si: estado es Nueva O es Admin/SuperAdmin
  return estadoNueva || esAdmin
})

const mensajeNoEditable = computed(() => {
  if (puedeEditar.value) return ''
  
  const esAdmin = authStoreInstance.user?.rol === 3 || authStoreInstance.user?.rol === 4 || 
                  authStoreInstance.user?.rol === 'Admin' || authStoreInstance.user?.rol === 'SuperAdmin'
  
  if (esAdmin) {
    return 'Solo puedes editar solicitudes en estado Nueva. Como administrador tienes acceso limitado.'
  }
  
  return 'No puedes editar esta solicitud. Solo puedes editar solicitudes en estado Nueva. Para realizar cambios, contacta al administrador.'
})

const cargarTiposSolicitud = () => {
  // Los tipos ya están filtrados por el computed
  formData.value.tipoSolicitudId = ''
}

const seleccionarArchivo = (event) => {
  const archivo = event.target.files?.[0]
  if (archivo) {
    adjuntoSeleccionado.value = archivo
  }
}

const eliminarAdjuntoActual = async () => {
  if (!adjuntoActual.value?.id) return
  
  if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
    return
  }

  isLoading.value = true
  try {
    await solicitudesService.eliminarAdjunto(props.solicitud.id, adjuntoActual.value.id)
    adjuntoActual.value = null
    success('Archivo eliminado exitosamente')
  } catch (err) {
    console.error('Error eliminando adjunto:', err)
    error('Error al eliminar el archivo')
  } finally {
    isLoading.value = false
  }
}

const validar = () => {
  errors.value = {}

  if (!formData.value.areaId) {
    errors.value.areaId = 'El área es requerida'
  }
  if (!formData.value.tipoSolicitudId) {
    errors.value.tipoSolicitudId = 'El tipo de solicitud es requerido'
  }
  if (!formData.value.titulo?.trim()) {
    errors.value.titulo = 'El asunto es requerido'
  }
  if (!formData.value.descripcion?.trim()) {
    errors.value.descripcion = 'La descripción es requerida'
  }
  if (!formData.value.prioridadId) {
    errors.value.prioridadId = 'La prioridad es requerida'
  }

  return Object.keys(errors.value).length === 0
}

const guardar = async () => {
  if (!validar()) {
    error('Por favor completa todos los campos requeridos')
    return
  }

  isLoading.value = true
  try {
    // Construir objeto con solo los campos a actualizar
    const dataActualizacion = {}
    
    if (formData.value.areaId) {
      dataActualizacion.areaId = parseInt(formData.value.areaId)
    }
    if (formData.value.tipoSolicitudId) {
      dataActualizacion.tipoSolicitudId = parseInt(formData.value.tipoSolicitudId)
    }
    if (formData.value.titulo?.trim()) {
      dataActualizacion.titulo = formData.value.titulo
    }
    if (formData.value.descripcion?.trim()) {
      dataActualizacion.descripcion = formData.value.descripcion
    }
    if (formData.value.prioridadId) {
      dataActualizacion.prioridadId = parseInt(formData.value.prioridadId)
    }

    // PUT request: solo envía los campos que se modificaron
    await api.put(`/Solicitudes/${props.solicitud.id}`, dataActualizacion)

    // Manejar adjunto si se seleccionó uno nuevo
    if (adjuntoSeleccionado.value) {
      await solicitudesService.cargarAdjunto(props.solicitud.id, adjuntoSeleccionado.value)
      adjuntoSeleccionado.value = null
      if (inputArchivo.value) {
        inputArchivo.value.value = ''
      }
    }

    success('Solicitud actualizada exitosamente')
    emit('success')
  } catch (err) {
    console.error('Error al actualizar solicitud:', err)
    const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar la solicitud'
    error(errorMsg)
  } finally {
    isLoading.value = false
  }
}

const cargarAdjuntoActual = async () => {
  try {
    const adjuntos = await solicitudesService.getAdjuntos(props.solicitud.id)
    if (adjuntos && adjuntos.length > 0) {
      adjuntoActual.value = adjuntos[0]
    } else {
      adjuntoActual.value = null
    }
  } catch (error) {
    console.error('Error cargando adjunto:', error)
    adjuntoActual.value = null
  }
}

// Cargar datos cuando se abre el modal
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen && props.solicitud) {
      // Cargar datos de la solicitud existente
      formData.value = {
        areaId: props.solicitud.areaId || '',
        tipoSolicitudId: props.solicitud.tipoSolicitudId || '',
        titulo: props.solicitud.titulo || '',
        descripcion: props.solicitud.descripcion || '',
        prioridadId: props.solicitud.prioridadId || ''
      }
      errors.value = {}
      adjuntoSeleccionado.value = null
      if (inputArchivo.value) {
        inputArchivo.value.value = ''
      }
      
      // Cargar catálogos cuando se abre el modal
      await Promise.all([
        catalogos.cargarAreas(),
        catalogos.cargarPrioridades(),
        catalogos.cargarTiposSolicitud()
      ])

      // Cargar adjunto actual
      await cargarAdjuntoActual()
    }
  }
)
</script>
