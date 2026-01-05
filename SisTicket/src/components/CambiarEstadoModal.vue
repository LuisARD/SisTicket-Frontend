<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-md w-full shadow-xl">
      <!-- Encabezado -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900">Cambiar Estado</h3>
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

        <!-- Estado Actual -->
        <div>
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Estado Actual</p>
          <p :class="getEstadoClass(solicitud?.estado)" class="inline-block text-sm font-medium">
            {{ solicitud?.estado }}
          </p>
        </div>

        <!-- Selector de Nuevo Estado -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nuevo Estado
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="nuevoEstado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            :disabled="isLoading"
          >
            <option value="">-- Seleccionar --</option>
            <option value="Abierta">Abierta</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Resuelta">Resuelta</option>
            <option value="Cerrada">Cerrada</option>
          </select>
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
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!nuevoEstado || isLoading"
          >
            {{ isLoading ? 'Guardando...' : 'Cambiar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBandejaArea } from '../composables/useBandejaArea'
import { useNotification } from '../composables/useNotification'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  solicitud: { type: Object, default: null },
})

const emit = defineEmits(['close', 'success'])

const { cambiarEstado } = useBandejaArea()
const { success, showError } = useNotification()

const nuevoEstado = ref('')
const isLoading = ref(false)

const guardar = async () => {
  if (!nuevoEstado.value) {
    showError('Por favor selecciona un estado')
    return
  }

  if (nuevoEstado.value === props.solicitud?.estado) {
    showError('El nuevo estado es igual al actual')
    return
  }

  isLoading.value = true
  try {
    await cambiarEstado(props.solicitud.id, nuevoEstado.value)
    emit('success')
  } catch (error) {
    // El error ya fue mostrado en cambiarEstado
  } finally {
    isLoading.value = false
  }
}

const getEstadoClass = (estado) => {
  const classes = {
    'Abierta': 'px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium',
    'En Progreso': 'px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium',
    'Resuelta': 'px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium',
    'Cerrada': 'px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium',
  }
  return classes[estado] || 'px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium'
}
</script>
