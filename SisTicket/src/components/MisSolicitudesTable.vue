<template>
  <!-- Tabla de Mis Solicitudes (Desktop) -->
  <div class="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-300">
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Número</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Asunto</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Área</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Prioridad</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudes" :key="solicitud.id" class="border-b border-gray-200 hover:bg-gray-50 transition">
          <td class="px-4 py-3 text-sm font-semibold text-gray-800">#{{ solicitud.numeroSolicitud }}</td>
          <td class="px-4 py-3 text-sm text-gray-700">{{ solicitud.asunto }}</td>
          <td class="px-4 py-3 text-sm text-gray-700">{{ solicitud.areaNombre || '-' }}</td>
          <td class="px-4 py-3 text-sm">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                getPrioridadColor(solicitud.prioridad)
              ]"
            >
              {{ getPrioridadLabel(solicitud.prioridad) }}
            </span>
          </td>
          <td class="px-4 py-3 text-sm">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                getEstadoColor(solicitud.estado)
              ]"
            >
              {{ getEstadoLabel(solicitud.estado) }}
            </span>
          </td>
          <td class="px-4 py-3 text-center space-x-2">
            <button
              @click="$emit('editar', solicitud)"
              :disabled="solicitud.estado !== 1"
              :class="[
                'inline-block transition',
                solicitud.estado === 1
                  ? 'text-blue-600 hover:text-blue-800'
                  : 'text-gray-300 cursor-not-allowed'
              ]"
              :title="solicitud.estado === 1 ? 'Editar solicitud' : 'Solo se pueden editar solicitudes en estado Nueva'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="$emit('eliminar', solicitud.id)"
              class="text-red-600 hover:text-red-800 transition inline-block"
              title="Eliminar solicitud"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="solicitudes.length === 0" class="text-center py-12 text-gray-500">
      No hay solicitudes para mostrar
    </div>
  </div>

  <!-- Tarjetas de Mis Solicitudes (Mobile) -->
  <div class="md:hidden space-y-4">
    <div v-for="solicitud in solicitudes" :key="solicitud.id" class="bg-white rounded-2xl shadow-lg p-4">
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="text-xs font-semibold text-gray-500">#{{ solicitud.numeroSolicitud }}</p>
          <p class="text-sm font-semibold text-gray-800">{{ solicitud.asunto }}</p>
        </div>
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-semibold',
            getEstadoColor(solicitud.estado)
          ]"
        >
          {{ getEstadoLabel(solicitud.estado) }}
        </span>
      </div>

      <div class="space-y-2 mb-4 text-xs">
        <p><strong>Área:</strong> {{ solicitud.areaNombre || '-' }}</p>
        <p>
          <strong>Prioridad:</strong>
          <span :class="['px-2 py-1 rounded text-xs font-semibold', getPrioridadColor(solicitud.prioridad)]">
            {{ getPrioridadLabel(solicitud.prioridad) }}
          </span>
        </p>
      </div>

      <div class="flex gap-2 justify-end">
        <button
          @click="$emit('editar', solicitud)"
          :disabled="solicitud.estado !== 1"
          :class="[
            'transition',
            solicitud.estado === 1
              ? 'text-blue-600 hover:text-blue-800'
              : 'text-gray-300 cursor-not-allowed'
          ]"
          :title="solicitud.estado === 1 ? 'Editar solicitud' : 'Solo se pueden editar solicitudes en estado Nueva'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="$emit('eliminar', solicitud.id)"
          class="text-red-600 hover:text-red-800 transition"
          title="Eliminar solicitud"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="solicitudes.length === 0" class="text-center py-12 text-gray-500">
      No hay solicitudes para mostrar
    </div>
  </div>
</template>

<script setup>
import { ESTADO_LABELS, ESTADO_COLORS, PRIORIDAD_LABELS, PRIORIDAD_COLORS } from '../constants/app.constants'

defineProps({
  solicitudes: {
    type: Array,
    required: true
  }
})

defineEmits(['editar', 'eliminar'])

/**
 * Obtiene la etiqueta del estado
 */
const getEstadoLabel = (estadoId) => {
  return ESTADO_LABELS[estadoId] || 'Desconocido'
}

/**
 * Obtiene los colores del estado
 */
const getEstadoColor = (estadoId) => {
  return ESTADO_COLORS[estadoId] || 'bg-gray-100 text-gray-800'
}

/**
 * Obtiene la etiqueta de prioridad
 */
const getPrioridadLabel = (prioridadId) => {
  return PRIORIDAD_LABELS[prioridadId] || 'Desconocida'
}

/**
 * Obtiene los colores de prioridad
 */
const getPrioridadColor = (prioridadId) => {
  const colores = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-red-100 text-red-800'
  }
  return colores[prioridadId] || 'bg-gray-100 text-gray-800'
}
</script>
