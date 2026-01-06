<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Título -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Mis Solicitudes</h2>
        <button
          @click="abrirModalCrear"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base"
        >
          + Crear Solicitud
        </button>
      </div>

      <!-- Buscador y Filtros -->
      <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <!-- Buscador -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar mis solicitudes..."
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm sm:text-base"
          />
        </div>

        <!-- Filtros en Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="filtros.estado"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="1">Nueva</option>
              <option value="2">En Proceso</option>
              <option value="3">Resuelta</option>
              <option value="4">Cerrada</option>
              <option value="5">Cancelada</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              v-model="filtros.prioridadId"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">Todas las prioridades</option>
              <option value="1">Baja</option>
              <option value="2">Media</option>
              <option value="3">Alta</option>
              <option value="4">Crítica</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              v-model="filtros.fechaDesde"
              type="date"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              v-model="filtros.fechaHasta"
              type="date"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            />
          </div>
        </div>

        <!-- Botones Filtrar y Limpiar -->
        <div class="mt-4 flex gap-3">
          <button
            @click="aplicarFiltros"
            :disabled="isLoading"
            class="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm sm:text-base"
          >
            {{ isLoading ? 'Filtrando...' : 'Filtrar' }}
          </button>
          <button
            @click="limpiarFiltros"
            class="flex-1 sm:flex-initial px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm sm:text-base"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Tabla de Solicitudes -->
      <SolicitudesTable :solicitudes="solicitudesFiltradas" />
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />

    <!-- Botón FAB para crear solicitud (Mobile) -->
    <button
      @click="abrirModalCrear"
      class="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition sm:hidden"
      title="Crear nueva solicitud"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Modal Crear Solicitud -->
    <CrearSolicitudModal
      :is-open="modalCrearIsOpen"
      @close="cerrarModalCrear"
      @success="handleCrearSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import SolicitudesTable from '../components/SolicitudesTable.vue'
import CrearSolicitudModal from '../components/CrearSolicitudModal.vue'
import { useMisSolicitudes } from '../composables/useMisSolicitudes'

const { solicitudes, isLoading, cargarMisSolicitudes } = useMisSolicitudes()

const searchQuery = ref('')
const modalCrearIsOpen = ref(false)

const filtros = ref({
  estado: '',
  prioridadId: '',
  fechaDesde: '',
  fechaHasta: ''
})

// Filtrar solicitudes según búsqueda y filtros
const solicitudesFiltradas = computed(() => {
  let resultado = solicitudes.value

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    resultado = resultado.filter(s =>
      s.titulo?.toLowerCase().includes(query) ||
      s.asunto?.toLowerCase().includes(query) ||
      s.numero?.toString().includes(query) ||
      s.descripcion?.toLowerCase().includes(query)
    )
  }

  // Filtrar por estado
  if (filtros.value.estado) {
    resultado = resultado.filter(s => s.estado === filtros.value.estado)
  }

  // Filtrar por prioridad
  if (filtros.value.prioridadId) {
    resultado = resultado.filter(s => s.prioridadId === parseInt(filtros.value.prioridadId))
  }

  // Filtrar por rango de fechas
  if (filtros.value.fechaDesde) {
    const fechaDesde = new Date(filtros.value.fechaDesde)
    resultado = resultado.filter(s => new Date(s.fechaCreacion) >= fechaDesde)
  }

  if (filtros.value.fechaHasta) {
    const fechaHasta = new Date(filtros.value.fechaHasta)
    fechaHasta.setHours(23, 59, 59, 999)
    resultado = resultado.filter(s => new Date(s.fechaCreacion) <= fechaHasta)
  }

  return resultado
})

const aplicarFiltros = async () => {
  // Los filtros se aplican automáticamente a través del computed
  // Solo refrescamos los datos
  await cargarMisSolicitudes()
}

const limpiarFiltros = () => {
  searchQuery.value = ''
  filtros.value = {
    estado: '',
    prioridadId: '',
    fechaDesde: '',
    fechaHasta: ''
  }
}

const abrirModalCrear = () => {
  modalCrearIsOpen.value = true
}

const cerrarModalCrear = () => {
  modalCrearIsOpen.value = false
}

const handleCrearSuccess = () => {
  cerrarModalCrear()
  // Recargar la lista de solicitudes
  cargarMisSolicitudes()
}
</script>
