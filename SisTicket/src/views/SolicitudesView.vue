<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Título -->
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Bandeja de Área</h2>

      <!-- Buscador y Filtros -->
      <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <!-- Buscador -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar solicitudes..."
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

        <!-- Botón Filtrar -->
        <div class="mt-4 flex gap-3 flex-wrap">
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

      <!-- Estadísticas -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Total</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-800">{{ estadisticas.total }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Nuevas</p>
          <p class="text-2xl sm:text-3xl font-bold text-purple-600">{{ estadisticas.nuevas }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">En Proceso</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ estadisticas.enProceso }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Resueltas</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ estadisticas.resueltas }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Cerradas</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-600">{{ estadisticas.cerradas }}</p>
        </div>
      </div>

      <!-- Tabla de Solicitudes -->
      <SolicitudesTable :solicitudes="solicitudesFiltradas" />
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import SolicitudesTable from '../components/SolicitudesTable.vue'
import { useSolicitudes } from '../composables/useSolicitudes'
import { useCatalogos } from '../composables/useCatalogos'
import { onMounted, computed } from 'vue'
import { authStore } from '../stores/authStore'

export default {
  name: 'SolicitudesView',
  components: {
    Navbar,
    BottomNavBar,
    SolicitudesTable
  },
  setup() {
    const {
      isLoading,
      searchQuery,
      filtros,
      solicitudesFiltradas,
      solicitudes,
      estadisticas,
      aplicarFiltros,
      limpiarFiltros
    } = useSolicitudes()

    const { areas, cargarAreas } = useCatalogos()

    // Validar permisos
    const esAdminOSuperAdmin = computed(() => {
      const rol = authStore.user?.rol
      return rol === 'Admin' || rol === 'SuperAdmin' || rol === 3 || rol === 4
    })

    onMounted(() => {
      cargarAreas()
    })

    return {
      isLoading,
      searchQuery,
      filtros,
      solicitudesFiltradas,
      estadisticas,
      aplicarFiltros,
      limpiarFiltros,
      areas,
      esAdminOSuperAdmin
    }
  }
}
</script>
