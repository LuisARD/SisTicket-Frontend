<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white rounded-lg w-full max-w-sm sm:max-w-lg md:max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
      <!-- Encabezado -->
      <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900">Nueva Solicitud</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition text-xl sm:text-base"
        >
          ✕
        </button>
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading || !formData.areaId"
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
            placeholder="Ingresa el asunto"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading"
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
            placeholder="Describe tu solicitud en detalle"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading"
          />
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading"
          >
            <option value="">-- Seleccionar Prioridad --</option>
            <option v-for="prioridad in catalogos.prioridades.value" :key="prioridad.id" :value="prioridad.id">
              {{ prioridad.nombre }}
            </option>
          </select>
          <p v-if="errors.prioridadId" class="text-xs text-red-600 mt-1">{{ errors.prioridadId }}</p>
        </div>

        <!-- Archivo Adjunto (Opcional) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Archivo Adjunto (Opcional)
          </label>
          <input
            type="file"
            @change="handleFileChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
          />
          <p v-if="formData.archivo" class="text-xs text-green-600 mt-1">
            📎 {{ formData.archivo.name }}
          </p>
        </div>

        <!-- Botones -->
        <div class="flex gap-2 sm:gap-3 pt-4 border-t flex-shrink-0\">
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
            :disabled="isLoading"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCatalogos } from '../composables/useCatalogos'
import { useNotification } from '../composables/useNotification'
import api from '../services/api'

const props = defineProps({
  isOpen: { type: Boolean, required: true }
})

const emit = defineEmits(['close', 'success'])

const catalogos = useCatalogos()
const { success, showError } = useNotification()

const formData = ref({
  areaId: '',
  tipoSolicitudId: '',
  titulo: '',
  descripcion: '',
  prioridadId: '',
  archivo: null
})

const errors = ref({})
const isLoading = ref(false)

const tiposSolicitudFiltrados = computed(() => {
  if (!formData.value.areaId) return []
  return catalogos.tiposSolicitud.value.filter(t => t.areaId === parseInt(formData.value.areaId) || t.areaId === formData.value.areaId)
})

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    formData.value.archivo = file
  }
}

const cargarTiposSolicitud = () => {
  // Los tipos ya están filtrados por el computed
  formData.value.tipoSolicitudId = ''
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
    showError('Por favor completa todos los campos requeridos')
    return
  }

  isLoading.value = true
  try {
    // Crear la solicitud con los datos correctos
    const dataSolicitud = {
      titulo: formData.value.titulo,
      descripcion: formData.value.descripcion,
      tipoSolicitudId: parseInt(formData.value.tipoSolicitudId),
      prioridadId: parseInt(formData.value.prioridadId),
      areaId: parseInt(formData.value.areaId)
    }

    const response = await api.post('/Solicitudes', dataSolicitud)
    const solicitudId = response.data?.id || response.data?.solicitudId

    if (!solicitudId) {
      throw new Error('No se pudo obtener el ID de la solicitud creada')
    }

    // Si hay archivo, subirlo al endpoint de adjuntos
    if (formData.value.archivo) {
      try {
        const archivoFormData = new FormData()
        archivoFormData.append('archivo', formData.value.archivo)
        archivoFormData.append('nombreArchivoOriginal', formData.value.archivo.name)
        archivoFormData.append('tipoContenido', formData.value.archivo.type)
        archivoFormData.append('tamanoBytes', formData.value.archivo.size)

        await api.post(`/Solicitudes/${solicitudId}/adjuntos`, archivoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (archivoError) {
        console.error('Error al subir archivo:', archivoError)
        // No fallar la solicitud si el archivo falla
        showError('La solicitud se creó pero hubo un error al subir el archivo')
      }
    }

    success('Solicitud creada exitosamente')
    emit('success')
  } catch (error) {
    console.error('Error al crear solicitud:', error)
    const errorMsg = error.response?.data?.message || error.message || 'Error al crear la solicitud'
    showError(errorMsg)
  } finally {
    isLoading.value = false
  }
}

// Reset form cuando se abre el modal
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      formData.value = {
        areaId: '',
        tipoSolicitudId: '',
        titulo: '',
        descripcion: '',
        prioridadId: '',
        archivo: null
      }
      errors.value = {}
      
      // Cargar catálogos cuando se abre el modal
      await Promise.all([
        catalogos.cargarAreas(),
        catalogos.cargarPrioridades(),
        catalogos.cargarTiposSolicitud()
      ])
    }
  }
)
</script>
