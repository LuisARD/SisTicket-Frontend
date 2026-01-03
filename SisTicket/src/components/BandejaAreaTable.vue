<template>
  <div class="space-y-4">
    <!-- No results -->
    <div v-if="solicitudes.length === 0" class="text-center py-12 bg-white rounded-lg">
      <p class="text-gray-500">No hay solicitudes para mostrar</p>
    </div>

    <!-- Desktop Table -->
    <div v-else class="hidden lg:block overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Número</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Asunto</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Solicitante</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prioridad</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Estado</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Gestor</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="solicitud in solicitudes" :key="solicitud.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-3 text-sm font-semibold text-blue-600">
              <router-link :to="`/detalle-solicitud/${solicitud.id}`" class="hover:underline">
                #{{ solicitud.numero }}
              </router-link>
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 max-w-xs">
              <span class="truncate">{{ solicitud.asunto }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ solicitud.usuarioNombre }}</td>
            <td class="px-4 py-3 text-sm">
              <span :class="getPrioridadClass(solicitud.prioridad)">
                {{ solicitud.prioridad }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span :class="getEstadoClass(solicitud.estado)">
                {{ solicitud.estado }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ solicitud.gestorNombre || '-' }}
            </td>
            <td class="px-4 py-3 text-sm space-x-2 flex">
              <!-- Asignar Gestor (Solo Admins) -->
              <button
                v-if="esAdmin"
                @click="$emit('asignar-gestor', solicitud)"
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition"
              >
                Asignar
              </button>

              <!-- Cambiar Estado (Solo Gestores con solicitud asignada) -->
              <button
                v-if="esGestor && solicitud.gestorId === userGestorId"
                @click="$emit('cambiar-estado', solicitud)"
                class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition"
              >
                Cambiar
              </button>

              <!-- Ver Detalles -->
              <router-link
                :to="`/detalle-solicitud/${solicitud.id}`"
                class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition"
              >
                Ver
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden space-y-4">
      <div
        v-for="solicitud in solicitudes"
        :key="solicitud.id"
        class="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
      >
        <!-- Encabezado -->
        <div class="flex justify-between items-start">
          <div>
            <router-link
              :to="`/detalle-solicitud/${solicitud.id}`"
              class="text-sm font-bold text-blue-600 hover:underline"
            >
              #{{ solicitud.numero }}
            </router-link>
            <p class="text-xs text-gray-500 mt-1">{{ solicitud.asunto }}</p>
          </div>
          <span :class="getPrioridadClass(solicitud.prioridad)" class="text-xs font-medium whitespace-nowrap ml-2">
            {{ solicitud.prioridad }}
          </span>
        </div>

        <!-- Detalles -->
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p class="text-gray-500">Solicitante</p>
            <p class="font-medium text-gray-900">{{ solicitud.usuarioNombre }}</p>
          </div>
          <div>
            <p class="text-gray-500">Estado</p>
            <span :class="getEstadoClass(solicitud.estado)" class="inline-block font-medium">
              {{ solicitud.estado }}
            </span>
          </div>
          <div class="col-span-2">
            <p class="text-gray-500">Gestor</p>
            <p class="font-medium text-gray-900">{{ solicitud.gestorNombre || '-' }}</p>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex gap-2 pt-2 border-t">
          <button
            v-if="esAdmin"
            @click="$emit('asignar-gestor', solicitud)"
            class="flex-1 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition"
          >
            Asignar
          </button>
          <button
            v-if="esGestor && solicitud.gestorId === userGestorId"
            @click="$emit('cambiar-estado', solicitud)"
            class="flex-1 px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition"
          >
            Cambiar
          </button>
          <router-link
            :to="`/detalle-solicitud/${solicitud.id}`"
            class="flex-1 px-2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition text-center"
          >
            Ver
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authStore } from '../stores/authStore'

const props = defineProps({
  solicitudes: { type: Array, required: true },
  esAdmin: { type: Boolean, required: true },
  esGestor: { type: Boolean, required: true },
})

defineEmits(['asignar-gestor', 'cambiar-estado'])

const userGestorId = computed(() => authStore.user?.id)

const getPrioridadClass = (prioridad) => {
  const classes = {
    'Crítica': 'px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium',
    'Alta': 'px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium',
    'Media': 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium',
    'Baja': 'px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium',
  }
  return classes[prioridad] || 'px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium'
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
