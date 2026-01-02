<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-gray-400 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <!-- Modal -->
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-bold">
            {{ isEditing ? `Editar ${titulo}` : `Crear ${titulo}` }}
          </h2>
          <button @click="cerrar" class="text-white hover:text-gray-200 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mensaje de Error -->
        <div v-if="error" class="m-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">
          {{ error }}
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardar" class="p-6 space-y-4 flex flex-col h-full">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.nombre"
              type="text"
              placeholder="Ingrese el nombre"
              @blur="validarCampo('nombre')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('nombre')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            />
            <p v-if="getError('nombre')" class="text-sm text-red-500 mt-1">{{ getError('nombre') }}</p>
          </div>

          <!-- Descripción (opcional) -->
          <div v-if="mostrarDescripcion">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción
              <span class="text-gray-400 text-xs">(opcional)</span>
            </label>
            <textarea
              v-model="formData.descripcion"
              placeholder="Ingrese una descripción"
              rows="3"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
            />
          </div>

          <!-- Área (solo para Tipos de Solicitud) -->
          <div v-if="estipoSolicitud">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Área
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.areaId"
              @blur="validarCampo('areaId')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('areaId')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            >
              <option :value="null">-- Seleccione un área --</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">
                {{ area.nombre }}
              </option>
            </select>
            <p v-if="getError('areaId')" class="text-sm text-red-500 mt-1">{{ getError('areaId') }}</p>
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="formData.estado"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition"
            >
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>

          <!-- Footer con botones -->
          <div class="flex gap-3 justify-end mt-6">
            <button
              type="button"
              @click="cerrar"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
              :disabled="isSubmitting"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  item: Object,
  tipo: {
    type: String,
    default: 'Área',
    validator: (value) => ['Área', 'Prioridad', 'Tipo de Solicitud'].includes(value)
  },
  mostrarDescripcion: {
    type: Boolean,
    default: false
  },
  areas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'success'])

const titulo = computed(() => props.tipo)
const isEditing = computed(() => !!props.item?.id)
const mostrarDescripcion = computed(() => props.mostrarDescripcion)
const estipoSolicitud = computed(() => props.tipo === 'Tipo de Solicitud')

const formData = ref({
  nombre: '',
  descripcion: '',
  areaId: null,
  estado: true
})

const error = ref('')
const isSubmitting = ref(false)
const touched = ref({})

// Reglas de validación
const validationRules = {
  nombre: [
    { required: true, message: 'El nombre es requerido' },
    { minLength: 2, message: 'El nombre debe tener al menos 2 caracteres' },
    { maxLength: 100, message: 'El nombre no puede exceder 100 caracteres' }
  ],
  areaId: [
    { required: true, message: 'El área es requerido para tipos de solicitud' }
  ]
}

const validarCampo = (campo) => {
  touched.value[campo] = true
}

const getError = (campo) => {
  if (!touched.value[campo] && !isSubmitting.value) return ''

  const rules = validationRules[campo]
  if (!rules) return ''

  for (const rule of rules) {
    const valor = formData.value[campo]

    if (rule.required) {
      if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
        return rule.message
      }
    }
    if (rule.minLength && typeof valor === 'string' && valor.length < rule.minLength) {
      return rule.message
    }
    if (rule.maxLength && typeof valor === 'string' && valor.length > rule.maxLength) {
      return rule.message
    }
  }

  return ''
}

const hasError = (campo) => {
  return !!getError(campo)
}

const validarFormulario = () => {
  error.value = ''

  for (const campo of Object.keys(validationRules)) {
    // Saltar validación de areaId si no es TipoSolicitud
    if (campo === 'areaId' && !estipoSolicitud.value) continue

    touched.value[campo] = true
    if (hasError(campo)) {
      error.value = `Por favor, corrige los errores en el formulario`
      return false
    }
  }

  return true
}

const guardar = async () => {
  if (!validarFormulario()) {
    console.log('Validación fallida')
    return
  }

  isSubmitting.value = true
  try {
    const dataToSend = {
      nombre: formData.value.nombre.trim(),
      ...(mostrarDescripcion.value && { descripcion: formData.value.descripcion }),
      ...(estipoSolicitud.value && { areaId: formData.value.areaId }),
      estado: formData.value.estado
    }

    console.log('Enviando datos:', { action: isEditing.value ? 'update' : 'create', data: dataToSend })
    emit('success', {
      action: isEditing.value ? 'update' : 'create',
      data: dataToSend
    })
  } catch (err) {
    error.value = 'Error al guardar. Intenta nuevamente.'
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const cerrar = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    nombre: '',
    descripcion: '',
    areaId: null,
    estado: true
  }
  error.value = ''
  touched.value = {}
}

// Cargar datos cuando se abre el modal
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = {
        nombre: newItem.nombre || '',
        descripcion: newItem.descripcion || '',
        areaId: newItem.areaId || null,
        estado: newItem.activo !== undefined ? newItem.activo : newItem.estado !== undefined ? newItem.estado : true
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  }
)
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
