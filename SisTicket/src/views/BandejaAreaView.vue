<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Título -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Bandeja de Área</h2>
        <p class="text-sm text-gray-600 mt-1">
          <span v-if="esGestor">Solicitudes asignadas a ti</span>
          <span v-else>Todas las solicitudes</span>
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Área</label>
            <select
              v-model="filtros.areaId"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">Todas las áreas</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">
                {{ area.nombre }}
              </option>
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

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-500">Cargando solicitudes...</p>
      </div>

      <!-- Tabla de Solicitudes -->
      <template v-else>
        <BandejaAreaTable
          :solicitudes="solicitudes"
          :es-admin="esAdmin"
          :es-gestor="esGestor"
          @asignar-gestor="handleAsignarGestor"
          @cambiar-estado="handleCambiarEstado"
        />
      </template>
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />

    <!-- Modal Asignar Gestor -->
    <AsignarGestorModal
      :is-open="modalAsignar.isOpen"
      :solicitud="modalAsignar.solicitud"
      :area-id="modalAsignar.areaId"
      @close="cerrarModalAsignar"
      @success="handleModalAsignarSuccess"
    />

    <!-- Modal Cambiar Estado -->
    <CambiarEstadoModal
      :is-open="modalEstado.isOpen"
      :solicitud="modalEstado.solicitud"
      @close="cerrarModalEstado"
      @success="handleModalEstadoSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import BandejaAreaTable from '../components/BandejaAreaTable.vue'
import AsignarGestorModal from '../components/AsignarGestorModal.vue'
import CambiarEstadoModal from '../components/CambiarEstadoModal.vue'
import { useBandejaArea } from '../composables/useBandejaArea'
import { useCatalogos } from '../composables/useCatalogos'
import { authStore } from '../stores/authStore'

const router = useRouter()
const { solicitudes, isLoading, filtros, esAdmin, esGestor, cargarSolicitudes, cambiarEstado, aplicarFiltros, limpiarFiltros } = useBandejaArea()
const { areas, cargarAreas } = useCatalogos()

// Verificar permisos: solo gestores y admins pueden acceder
onMounted(() => {
  const rol = authStore.user?.rol
  if (rol === 'Solicitante' || rol === 1) {
    router.push('/solicitudes')
  }
  // Cargar áreas disponibles
  cargarAreas()
})

// Modales
const modalAsignar = ref({ isOpen: false, solicitud: null, areaId: null })
const modalEstado = ref({ isOpen: false, solicitud: null })

const handleAsignarGestor = (solicitud) => {
  modalAsignar.value = { isOpen: true, solicitud, areaId: solicitud.areaId }
}

const cerrarModalAsignar = () => {
  modalAsignar.value = { isOpen: false, solicitud: null, areaId: null }
}

const handleModalAsignarSuccess = async () => {
  cerrarModalAsignar()
  await cargarSolicitudes()
}

const handleCambiarEstado = (solicitud) => {
  modalEstado.value = { isOpen: true, solicitud }
}

const cerrarModalEstado = () => {
  modalEstado.value = { isOpen: false, solicitud: null }
}

const handleModalEstadoSuccess = async () => {
  cerrarModalEstado()
  await cargarSolicitudes()
}
</script>
