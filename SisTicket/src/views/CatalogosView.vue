<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Título -->
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Catálogos</h2>

      <!-- Tabs -->
      <div class="flex gap-0 border-b-2 border-gray-300 mb-6 overflow-x-auto">
        <button
          @click="activeTab = 'areas'"
          :class="[
            'px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base border-b-4 transition whitespace-nowrap',
            activeTab === 'areas'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Áreas
        </button>
        <button
          @click="activeTab = 'prioridades'"
          :class="[
            'px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base border-b-4 transition whitespace-nowrap',
            activeTab === 'prioridades'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Prioridades
        </button>
        <button
          @click="activeTab = 'tiposSolicitud'"
          :class="[
            'px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base border-b-4 transition whitespace-nowrap',
            activeTab === 'tiposSolicitud'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
          ]"
        >
          Tipos de Solicitud
        </button>
      </div>

      <!-- Contenido de Tabs -->

      <!-- Tab: Áreas -->
      <div v-if="activeTab === 'areas'">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Gestionar Áreas</h3>
          <button
            v-if="isAdmin"
            @click="abrirModalCrearArea"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base"
          >
            + Nueva Área
          </button>
          <span v-else class="text-gray-500 text-sm italic">Solo lectura</span>
        </div>
        <CatalogosTable
          :items="areasOrdenadas"
          @editar="editarArea"
          @eliminar="eliminarArea"
        />
      </div>

      <!-- Tab: Prioridades -->
      <div v-if="activeTab === 'prioridades'">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Gestionar Prioridades</h3>
          <button
            v-if="isAdmin"
            @click="abrirModalCrearPrioridad"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base"
          >
            + Nueva Prioridad
          </button>
          <span v-else class="text-gray-500 text-sm italic">Solo lectura</span>
        </div>
        <CatalogosTable
          :items="prioridadesOrdenadas"
          @editar="editarPrioridad"
          @eliminar="eliminarPrioridad"
        />
      </div>

      <!-- Tab: Tipos de Solicitud -->
      <div v-if="activeTab === 'tiposSolicitud'">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Gestionar Tipos de Solicitud</h3>
          <button
            v-if="isAdmin"
            @click="abrirModalCrearTipoSolicitud"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base"
          >
            + Nuevo Tipo
          </button>
          <span v-else class="text-gray-500 text-sm italic">Solo lectura</span>
        </div>
        <CatalogosTable
          :items="tiposSolicitudOrdenados"
          @editar="editarTipoSolicitud"
          @eliminar="eliminarTipoSolicitud"
        />
      </div>
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />

    <!-- Modales -->
    <CatalogosModal
      :is-open="modalArea.isOpen"
      :item="modalArea.item"
      tipo="Área"
      @close="cerrarModalArea"
      @success="handleModalAreaSuccess"
    />

    <CatalogosModal
      :is-open="modalPrioridad.isOpen"
      :item="modalPrioridad.item"
      tipo="Prioridad"
      :mostrar-descripcion="true"
      @close="cerrarModalPrioridad"
      @success="handleModalPrioridadSuccess"
    />

    <CatalogosModal
      :is-open="modalTipo.isOpen"
      :item="modalTipo.item"
      tipo="Tipo de Solicitud"
      :mostrar-descripcion="true"
      :areas="areasOrdenadas"
      @close="cerrarModalTipo"
      @success="handleModalTipoSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import CatalogosTable from '../components/CatalogosTable.vue'
import CatalogosModal from '../components/CatalogosModal.vue'
import { useCatalogos } from '../composables/useCatalogos'
import { authStore } from '../stores/authStore'

const catalogos = useCatalogos()
const {
  cargarAreas,
  cargarPrioridades,
  cargarTiposSolicitud,
  eliminarArea: deleteArea,
  eliminarPrioridad: deletePrioridad,
  eliminarTipoSolicitud: deleteTipoSolicitud
} = catalogos

const activeTab = ref('areas')

// Validar permisos
const isAdmin = computed(() => {
  const rol = authStore.user?.rol
  return rol === 'Admin' || rol === 'SuperAdmin' || rol === 3 || rol === 4
})

const puedeCrear = () => {
  if (!isAdmin.value) {
    mostrarNotificacion('Solo administradores pueden crear catálogos', 'warning')
    return false
  }
  return true
}

const puedeEditar = () => {
  if (!isAdmin.value) {
    mostrarNotificacion('Solo administradores pueden editar catálogos', 'warning')
    return false
  }
  return true
}

const puedeEliminar = () => {
  if (!isAdmin.value) {
    mostrarNotificacion('Solo administradores pueden eliminar catálogos', 'warning')
    return false
  }
  return true
}

// Estado de modales
const modalArea = ref({ isOpen: false, item: null })
const modalPrioridad = ref({ isOpen: false, item: null })
const modalTipo = ref({ isOpen: false, item: null })

// Ordenar por ID
const areasOrdenadas = computed(() => {
  return [...catalogos.areas.value].sort((a, b) => a.id - b.id)
})

const prioridadesOrdenadas = computed(() => {
  return [...catalogos.prioridades.value].sort((a, b) => a.id - b.id)
})

const tiposSolicitudOrdenados = computed(() => {
  return [...catalogos.tiposSolicitud.value].sort((a, b) => a.id - b.id)
})

// ===== ÁREAS =====
const abrirModalCrearArea = () => {
  if (!puedeCrear()) return
  modalArea.value = { isOpen: true, item: null }
}

const editarArea = (area) => {
  if (!puedeEditar()) return
  modalArea.value = { isOpen: true, item: area }
}

const cerrarModalArea = () => {
  modalArea.value = { isOpen: false, item: null }
}

const handleModalAreaSuccess = async () => {
  cerrarModalArea()
  // Recargar las áreas después de la operación
  await catalogos.cargarAreas()
}

const eliminarArea = async (id) => {
  if (!puedeEliminar()) return
  
  if (!confirm('¿Está seguro que desea eliminar esta área?')) return
  
  try {
    await deleteArea(id)
    await cargarAreas()
  } catch (error) {
    console.error('Error al eliminar área:', error)
  }
}

// ===== PRIORIDADES =====
const abrirModalCrearPrioridad = () => {
  if (!puedeCrear()) return
  modalPrioridad.value = { isOpen: true, item: null }
}

const editarPrioridad = (prioridad) => {
  if (!puedeEditar()) return
  modalPrioridad.value = { isOpen: true, item: prioridad }
}

const cerrarModalPrioridad = () => {
  modalPrioridad.value = { isOpen: false, item: null }
}

const handleModalPrioridadSuccess = async () => {
  cerrarModalPrioridad()
  // Recargar las prioridades después de la operación
  await catalogos.cargarPrioridades()
}

const eliminarPrioridad = async (id) => {
  if (!puedeEliminar()) return
  
  if (!confirm('¿Está seguro que desea eliminar esta prioridad?')) return
  
  try {
    await deletePrioridad(id)
    await cargarPrioridades()
  } catch (error) {
    console.error('Error al eliminar prioridad:', error)
  }
}

// ===== TIPOS DE SOLICITUD =====
const abrirModalCrearTipoSolicitud = () => {
  if (!puedeCrear()) return
  modalTipo.value = { isOpen: true, item: null }
}

const editarTipoSolicitud = (tipoSolicitud) => {
  if (!puedeEditar()) return
  modalTipo.value = { isOpen: true, item: tipoSolicitud }
}

const cerrarModalTipo = () => {
  modalTipo.value = { isOpen: false, item: null }
}

const handleModalTipoSuccess = async () => {
  cerrarModalTipo()
  // Recargar los tipos de solicitud después de la operación
  await catalogos.cargarTiposSolicitud()
}

const eliminarTipoSolicitud = async (id) => {
  if (!puedeEliminar()) return
  
  if (!confirm('¿Está seguro que desea eliminar este tipo de solicitud?')) return
  
  try {
    await deleteTipoSolicitud(id)
    await cargarTiposSolicitud()
  } catch (error) {
    console.error('Error al eliminar tipo de solicitud:', error)
  }
}
</script>
