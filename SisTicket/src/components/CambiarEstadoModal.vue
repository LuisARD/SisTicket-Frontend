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
            :disabled="isLoading || estadosDisponibles.length === 0"
          >
            <option value="">-- Seleccionar --</option>
            <option v-if="estadosDisponibles.includes(2)" value="En Progreso">En Progreso</option>
            <option v-if="estadosDisponibles.includes(3)" value="Resuelta">Resuelta</option>
            <option v-if="estadosDisponibles.includes(4)" value="Rechazada">Rechazada</option>
            <option v-if="estadosDisponibles.includes(5)" value="Cerrada">Cerrada</option>
          </select>
          <p v-if="esGestor && !esAdmin && !esSuperAdmin" class="text-xs text-blue-600 mt-2">
            Como Gestor, solo puedes cambiar el estado a Resuelta
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
import { ref, computed } from 'vue'
import { useBandejaArea } from '../composables/useBandejaArea'
import { useNotification } from '../composables/useNotification'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  solicitud: { type: Object, default: null },
})

const emit = defineEmits(['close', 'success'])

const { cambiarEstado } = useBandejaArea()
const { success, showError } = useNotification()
const { user } = useAuth()

const nuevoEstado = ref('')
const isLoading = ref(false)

// Constantes de estados
const ESTADOS_DISPONIBLES = {
  'Abierta': 'Nueva',
  'En Progreso': 'EnProceso',
  'Resuelta': 'Resuelta',
  'Cerrada': 'Cerrada'
}

const ESTADO_LABELS = {
  'Nueva': 'Abierta',
  'EnProceso': 'En Progreso',
  'Resuelta': 'Resuelta',
  'Cerrada': 'Cerrada'
}

const ESTADO_STRING_A_ID = {
  'Nueva': 1,
  'EnProceso': 2,
  'Resuelta': 3,
  'Rechazada': 4,
  'Cerrada': 5
}

const TRANSICIONES_VALIDAS = {
  1: [2, 4],      // Nueva → En Proceso, Rechazada
  2: [3, 4],      // En Proceso → Resuelta, Rechazada
  3: [5],         // Resuelta → Cerrada
  4: [],          // Rechazada → No puede cambiar (estado final)
  5: []           // Cerrada (estado final, no se puede cambiar)
}

// Permisos basados en roles
const esGestor = computed(() => {
  const rol = user?.value?.rol
  return rol === 2 || rol === 'Gestor'
})

const esAdmin = computed(() => {
  const rol = user?.value?.rol
  return rol === 3 || rol === 'Admin'
})

const esSuperAdmin = computed(() => {
  const rol = user?.value?.rol
  return rol === 4 || rol === 'SuperAdmin'
})

// Estados disponibles según el rol
const estadosDisponibles = computed(() => {
  const currentEstado = props.solicitud?.estado
  let estadoActualId = ESTADO_STRING_A_ID[currentEstado]
  
  if (!estadoActualId || !TRANSICIONES_VALIDAS[estadoActualId]) {
    return []
  }
  
  let estadosValidos = TRANSICIONES_VALIDAS[estadoActualId] || []
  
  // Filtrar estados según el rol:
  // - Gestores (rol 2) solo pueden cambiar a Resuelta (3)
  // - Admin y SuperAdmin (roles 3 y 4) pueden cambiar a cualquier estado válido
  if (esGestor.value && !esAdmin.value && !esSuperAdmin.value) {
    // Gestor: solo permitir Resuelta (3)
    estadosValidos = estadosValidos.filter(estadoId => estadoId === 3)
  }
  
  return estadosValidos
})

const guardar = async () => {
  if (!nuevoEstado.value) {
    showError('Por favor selecciona un estado')
    return
  }

  if (nuevoEstado.value === props.solicitud?.estado) {
    showError('El nuevo estado es igual al actual')
    return
  }

  // Validar que el estado seleccionado esté permitido para este rol
  const estadoId = ESTADO_STRING_A_ID[ESTADOS_DISPONIBLES[nuevoEstado.value]]
  if (!estadosDisponibles.value.includes(estadoId)) {
    showError('No tienes permiso para cambiar a este estado')
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
