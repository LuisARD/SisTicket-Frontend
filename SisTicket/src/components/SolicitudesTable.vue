<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Tabla Desktop -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-100 border-b-2 border-gray-300">
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Número</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Asunto</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Área</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Solicitante</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Gestor</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Prioridad</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-800">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="solicitud in solicitudes"
            :key="solicitud.id"
            class="border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3 text-sm text-gray-800 font-semibold">
              {{ solicitud.numeroSolicitud }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ solicitud.titulo }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ solicitud.areaNombre || solicitud.area?.nombre || 'N/A' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ solicitud.solicitanteNombre || solicitud.usuario?.nombre || 'N/A' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ solicitud.gestorNombre || solicitud.gestorAsignadoNombre || '-' }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-semibold text-white',
                  getPrioridadColor(solicitud.prioridadNombre || solicitud.prioridad?.nombre)
                ]"
              >
                {{ solicitud.prioridadNombre || solicitud.prioridad?.nombre || 'N/A' }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-semibold text-white',
                  getEstadoColor(getEstadoActual(solicitud))
                ]"
              >
                {{ getEstadoLabel(getEstadoActual(solicitud)) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <RouterLink
                :to="`/detalle-solicitud/${solicitud.id}`"
                class="text-indigo-600 hover:text-indigo-800 transition"
                title="Ver detalles"
              >
                <svg class="w-5 h-5 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards Mobile -->
    <div class="md:hidden">
      <div
        v-for="solicitud in solicitudes"
        :key="solicitud.id"
        class="border-b border-gray-200 p-4 hover:bg-gray-50 transition"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs font-semibold text-gray-500">{{ solicitud.numeroSolicitud }}</p>
            <p class="text-sm font-semibold text-gray-800">{{ solicitud.titulo }}</p>
          </div>
          <RouterLink
            :to="`/detalle-solicitud/${solicitud.id}`"
            class="text-indigo-600 hover:text-indigo-800"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              />
            </svg>
          </RouterLink>
        </div>

        <div class="space-y-2 text-xs text-gray-600">
          <p><strong>Área:</strong> {{ solicitud.areaNombre || solicitud.area?.nombre || 'N/A' }}</p>
          <p><strong>Solicitante:</strong> {{ solicitud.solicitanteNombre || solicitud.usuario?.nombre || 'N/A' }}</p>
          <p><strong>Gestor:</strong> {{ solicitud.gestorNombre || solicitud.gestorAsignadoNombre || '-' }}</p>
        </div>

        <div class="flex gap-2 mt-3">
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-semibold text-white',
              getPrioridadColor(solicitud.prioridadNombre || solicitud.prioridad?.nombre)
            ]"
          >
            {{ solicitud.prioridadNombre || solicitud.prioridad?.nombre || 'N/A' }}
          </span>
          <span
            :class="[
              'inline-block px-2 py-1 rounded text-xs font-semibold text-white',
              getEstadoColor(getEstadoActual(solicitud))
            ]"
          >
            {{ getEstadoLabel(getEstadoActual(solicitud)) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Mensaje vacío -->
    <div v-if="solicitudes.length === 0" class="p-8 text-center">
      <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500">No hay solicitudes disponibles</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolicitudesTable',
  props: {
    solicitudes: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const getPrioridadColor = (nivelONombre) => {
      // Manejar tanto números como nombres de prioridad
      const colores = {
        // Por nombre (como viene del API)
        'Baja': 'bg-green-500 text-white shadow-md font-semibold',
        'Media': 'bg-yellow-500 text-white shadow-md font-semibold',
        'Alta': 'bg-orange-600 text-white shadow-md font-semibold',
        'Crítica': 'bg-red-700 text-white shadow-md font-semibold',
        // Por número (por compatibilidad)
        1: 'bg-green-500 text-white shadow-md font-semibold',
        2: 'bg-yellow-500 text-white shadow-md font-semibold',
        3: 'bg-orange-600 text-white shadow-md font-semibold',
        4: 'bg-red-700 text-white shadow-md font-semibold'
      }
      return colores[nivelONombre] || 'bg-gray-500 text-white shadow-md font-semibold'
    }

    const getEstadoColor = (estado) => {
      const colores = {
        'Nueva': 'bg-purple-600 text-white shadow-md font-semibold',
        'En Proceso': 'bg-blue-600 text-white shadow-md font-semibold',
        'Resuelta': 'bg-green-600 text-white shadow-md font-semibold',
        'Cerrada': 'bg-gray-700 text-white shadow-md font-semibold',
        'Cancelada': 'bg-red-600 text-white shadow-md font-semibold',
        // Fallback para números (por compatibilidad)
        1: 'bg-purple-600 text-white shadow-md font-semibold',
        2: 'bg-blue-600 text-white shadow-md font-semibold',
        3: 'bg-green-600 text-white shadow-md font-semibold',
        4: 'bg-gray-700 text-white shadow-md font-semibold',
        5: 'bg-red-600 text-white shadow-md font-semibold'
      }
      return colores[estado] || 'bg-gray-500 text-white shadow-md font-semibold'
    }

    const getEstadoLabel = (estado) => {
      const labels = {
        'Nueva': 'Nueva',
        'En Proceso': 'En Proceso',
        'Resuelta': 'Resuelta',
        'Cerrada': 'Cerrada',
        'Cancelada': 'Cancelada',
        // Fallback para números (por compatibilidad)
        1: 'Nueva',
        2: 'En Proceso',
        3: 'Resuelta',
        4: 'Cerrada',
        5: 'Cancelada'
      }
      return labels[estado] || 'Desconocido'
    }

    const getEstadoActual = (solicitud) => {
      // El API envía el campo estado directamente como string
      // Simplemente devolver el estado tal como viene
      return solicitud.estado || 'Nueva'
    }

    return {
      getPrioridadColor,
      getEstadoColor,
      getEstadoLabel,
      getEstadoActual
    }
  }
}
</script>
