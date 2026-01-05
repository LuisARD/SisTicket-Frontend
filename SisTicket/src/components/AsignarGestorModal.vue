<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-md w-full shadow-xl">
      <!-- Encabezado -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">Asignar Gestor</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      <!-- Contenido -->
      <form @submit.prevent="guardar" class="px-6 py-4 space-y-4">
        <!-- Número Solicitud -->
        <div>
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Solicitud</p>
          <p class="text-sm font-semibold text-gray-900">#{{ solicitud?.numero }}</p>
        </div>

        <!-- Asunto -->
        <div>
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Asunto</p>
          <p class="text-sm text-gray-700">{{ solicitud?.asunto }}</p>
        </div>

        <!-- Selector de Gestor -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Asignar a Gestor
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="gestorId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            :disabled="isLoading || cargandoGestores || !gestoresDisponibles.length"
          >
            <option value="">
              {{ cargandoGestores ? 'Cargando gestores...' : '-- Seleccionar --' }}
            </option>
            <option v-for="gestor in gestoresDisponibles" :key="gestor.id" :value="gestor.id">
              {{ gestor.nombre }}
            </option>
          </select>
          <p v-if="!cargandoGestores && !gestoresDisponibles.length" class="text-xs text-amber-600 mt-1">
            No hay gestores disponibles en esta área
          </p>
        </div>

        <!-- Botones -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition"
            :disabled="isLoading"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!gestorId || isLoading"
          >
            {{ isLoading ? 'Asignando...' : 'Asignar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useBandejaArea } from '../composables/useBandejaArea'
import { useNotification } from '../composables/useNotification'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  solicitud: { type: Object, default: null },
  areaId: { type: [String, Number], default: null },
})

const emit = defineEmits(['close', 'success'])

const { asignarGestor, cargarGestoresArea } = useBandejaArea()
const { success, showError } = useNotification()

const gestorId = ref('')
const gestoresDisponibles = ref([])
const isLoading = ref(false)
const cargandoGestores = ref(false)

// Función para cargar gestores del área
const cargarGestores = async (areaId) => {
  if (!areaId) {
    gestoresDisponibles.value = []
    return
  }
  
  cargandoGestores.value = true
  try {
    const gestores = await cargarGestoresArea(areaId)
    gestoresDisponibles.value = gestores || []
    
    if (!gestoresDisponibles.value.length) {
      showError('No hay gestores disponibles en esta área')
    }
  } catch (error) {
    console.error('Error al cargar gestores:', error)
    gestoresDisponibles.value = []
    showError('Error al cargar gestores del área')
  } finally {
    cargandoGestores.value = false
  }
}

// Cargar gestores cuando cambia el areaId
watch(
  () => props.areaId,
  (newAreaId) => {
    cargarGestores(newAreaId)
    gestorId.value = ''
  }
)

// Cargar gestores cuando se abre el modal
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.areaId) {
      cargarGestores(props.areaId)
    }
  }
)

const guardar = async () => {
  if (!gestorId.value) {
    showError('Por favor selecciona un gestor')
    return
  }

  isLoading.value = true
  try {
    await asignarGestor(props.solicitud.id, gestorId.value)
    emit('success')
  } catch (error) {
    // El error ya fue mostrado en asignarGestor
  } finally {
    isLoading.value = false
  }
}
</script>
