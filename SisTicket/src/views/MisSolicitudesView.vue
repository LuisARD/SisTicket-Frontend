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
              <option value="4">Rechazada</option>
              <option value="5">Cerrada</option>
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
      <SolicitudesTable 
        :solicitudes="solicitudesFiltradas"
        :mostrarAccionesEditar="false"
        :mostrarAccionesVer="true"
        @editar-solicitud="handleEditarSolicitud"
        @ver-solicitud="handleVerSolicitud"
      />
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

    <!-- Modal Editar Solicitud -->
    <EditarSolicitudModal
      :is-open="modalEditarIsOpen"
      :solicitud="solicitudEditando"
      @close="cerrarModalEditar"
      @success="handleEditarSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import SolicitudesTable from '../components/SolicitudesTable.vue'
import CrearSolicitudModal from '../components/CrearSolicitudModal.vue'
import EditarSolicitudModal from '../components/EditarSolicitudModal.vue'
import { useMisSolicitudes } from '../composables/useMisSolicitudes'
import { authStore } from '../stores/authStore'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const { solicitudes, isLoading, cargarMisSolicitudes } = useMisSolicitudes()
const authStoreInstance = authStore
const { error: mostrarError } = useNotification()

const searchQuery = ref('')
const modalCrearIsOpen = ref(false)
const modalEditarIsOpen = ref(false)
const solicitudEditando = ref(null)

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
  // Normalizar filtros: convertir estado a número si es string
  const filtrosNormalizados = {
    ...filtros.value,
    estado: filtros.value.estado ? parseInt(filtros.value.estado) : '',
    prioridadId: filtros.value.prioridadId ? parseInt(filtros.value.prioridadId) : ''
  }
  await cargarMisSolicitudes(filtrosNormalizados)
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

const handleEditarSolicitud = (solicitud) => {
  // Validar si puede editar
  const estadoNueva = solicitud.estado === 1 || solicitud.estado === '1' || solicitud.estado === 'Nueva'
  const esAdmin = authStoreInstance.user?.rol === 3 || authStoreInstance.user?.rol === 4 || 
                  authStoreInstance.user?.rol === 'Admin' || authStoreInstance.user?.rol === 'SuperAdmin'
  
  if (!estadoNueva && !esAdmin) {
    mostrarError('No puedes editar esta solicitud. Solo puedes editar solicitudes en estado Nueva.')
    return
  }
  
  solicitudEditando.value = solicitud
  modalEditarIsOpen.value = true
}

const handleVerSolicitud = (solicitud) => {
  // Navegar a la vista de detalles de la solicitud con parámetro para indicar que es desde Mis Solicitudes
  router.push({
    path: `/detalle-solicitud/${solicitud.id}`,
    query: { desde: 'misSolicitudes' }
  })
}

const cerrarModalEditar = () => {
  modalEditarIsOpen.value = false
  solicitudEditando.value = null
}

const handleEditarSuccess = () => {
  cerrarModalEditar()
  // Recargar la lista de solicitudes
  cargarMisSolicitudes()
}
</script>
