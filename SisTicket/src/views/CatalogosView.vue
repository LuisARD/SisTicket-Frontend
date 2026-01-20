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

      <!-- Tab: Áreas -->
      <div v-if="activeTab === 'areas'">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Áreas</h3>
          <button
            v-if="isAdmin"
            @click="abrirModalCrearArea"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            + Nueva Área
          </button>
          <span v-else class="text-gray-500 text-sm italic"></span>
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
          <h3 class="text-xl font-semibold text-gray-800">Prioridades</h3>
          <button
            v-if="isAdmin"
            @click="abrirModalCrearPrioridad"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            + Nueva Prioridad
          </button>
          <span v-else class="text-gray-500 text-sm italic"></span>
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
          <h3 class="text-xl font-semibold text-gray-800">Tipos de Solicitudes</h3>
          <button
            v-if="isAdmin"
            @click="abrirModalCrearTipoSolicitud"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            + Nuevo Tipo
          </button>
          <span v-else class="text-gray-500 text-sm italic"></span>
        </div>
        <CatalogosTable
          :items="tiposSolicitudOrdenados"
          @editar="editarTipoSolicitud"
          @eliminar="eliminarTipoSolicitud"
        />
      </div>
    </div>

    <!-- BottomNavBar -->
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

    <!-- Toast de Notificaciones -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-24 right-4 p-5 rounded-lg shadow-2xl flex items-start gap-4 max-w-md animate-in border-4 font-semibold z-50',
          toast.type === 'success'
            ? 'bg-green-100 border-green-400 text-green-900'
            : toast.type === 'error'
            ? 'bg-red-100 border-red-500 text-red-900'
            : 'bg-yellow-100 border-yellow-400 text-yellow-900'
        ]"
      >
        <!-- Icono -->
        <div class="flex-shrink-0 pt-1">
          <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <!-- Mensaje -->
        <div class="flex-grow">
          <p class="text-base">{{ toast.message }}</p>
        </div>
        <!-- Botón cerrar -->
        <button
          @click="toast.show = false"
          class="flex-shrink-0 ml-2 text-2xl leading-none font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import CatalogosTable from '../components/CatalogosTable.vue'
import CatalogosModal from '../components/CatalogosModal.vue'
import { useCatalogos } from '../composables/useCatalogos'
import { useSolicitudes } from '../composables/useSolicitudes'
import { authStore } from '../stores/authStore'

const catalogos = useCatalogos()
const { solicitudes } = useSolicitudes()
const {
  cargarAreas,
  cargarPrioridades,
  cargarTiposSolicitud,
  eliminarArea: deleteArea,
  eliminarPrioridad: deletePrioridad,
  eliminarTipoSolicitud: deleteTipoSolicitud
} = catalogos

const activeTab = ref('areas')
const loading = ref(false)

// Toast de notificaciones
const toast = ref({
  show: false,
  type: 'success', // success, error, warning
  message: ''
})

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

/**
 * Verifica si un área está siendo usada en solicitudes
 */
const areaEstaEnUso = (areaId) => {
  return solicitudes.value.some(s => s.areaId === areaId)
}

/**
 * Verifica si una prioridad está siendo usada en solicitudes
 */
const prioridadEstaEnUso = (prioridadId) => {
  return solicitudes.value.some(s => s.prioridadId === prioridadId)
}

/**
 * Verifica si un tipo de solicitud está siendo usado en solicitudes
 */
const tipoEstaEnUso = (tipoId) => {
  return solicitudes.value.some(s => s.tipoSolicitudId === tipoId)
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

// ===== FUNCIONES DE NOTIFICACIÓN =====
const mostrarNotificacion = (mensaje, tipo = 'success') => {
  // Resetear y mostrar toast
  toast.value = { show: true, type: tipo, message: mensaje }
  // Auto-cerrar después de 4 segundos
  const timeoutId = setTimeout(() => {
    toast.value.show = false
  }, 4000)
  
  return timeoutId
}

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
  await cargarAreas()
}

const eliminarArea = async (id) => {
  if (!puedeEliminar()) return
  
  // Buscar el nombre del área
  const area = areasOrdenadas.value.find(a => a.id === id)
  
  // Verificar si el área está en uso en solicitudes
  if (areaEstaEnUso(id)) {
    mostrarNotificacion(
      `No se puede eliminar el área "${area?.nombre}" porque está siendo usada en solicitudes.`,
      'warning'
    )
    return
  }
  
  const confirmacion = confirm(`¿Está seguro que desea eliminar el área "${area?.nombre}"?`)
  if (!confirmacion) return
  
  loading.value = true
  try {
    const resultado = await deleteArea(id)
    await cargarAreas()
    mostrarNotificacion(`Área "${area?.nombre}" eliminada exitosamente`, 'success')
  } catch (error) {
    console.error('Error al eliminar el área:', error)
    
    let mensaje = 'Error al eliminar el área'
    
    // Captura el mensaje del servidor
    if (error?.response?.data?.message) {
      mensaje = error.response.data.message
    } else if (error?.response?.data?.detail) {
      mensaje = error.response.data.detail
    } else if (typeof error?.response?.data === 'string') {
      mensaje = error.response.data
    } else if (error?.message) {
      mensaje = error.message
    }
    
    mostrarNotificacion(mensaje, 'error')
  } finally {
    loading.value = false
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
  await cargarPrioridades()
}

const eliminarPrioridad = async (id) => {
  if (!puedeEliminar()) return
  
  const prioridad = prioridadesOrdenadas.value.find(p => p.id === id)
  
  // Verificar si la prioridad está en uso en solicitudes
  if (prioridadEstaEnUso(id)) {
    mostrarNotificacion(
      `No se puede eliminar la prioridad "${prioridad?.nombre}" porque está siendo usada en solicitudes.`,
      'warning'
    )
    return
  }
  
  const confirmacion = confirm('¿Está seguro que desea eliminar esta prioridad?')
  if (!confirmacion) return
  
  loading.value = true
  try {
    await deletePrioridad(id)
    await cargarPrioridades()
    mostrarNotificacion('Prioridad eliminada exitosamente', 'success')
  } catch (error) {
    console.error('Error al eliminar la prioridad:', error)
    
    let mensaje = 'Error al eliminar la prioridad'
    
    // Intenta capturar mensaje del servidor
    if (error?.response?.data?.message) {
      mensaje = error.response.data.message
    } else if (error?.response?.data?.detail) {
      mensaje = error.response.data.detail
    } else if (typeof error?.response?.data === 'string') {
      mensaje = error.response.data
    } else if (error?.message) {
      mensaje = error.message
    }
    
    mostrarNotificacion(mensaje, 'error')
  } finally {
    loading.value = false
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
  await cargarTiposSolicitud()
}

const eliminarTipoSolicitud = async (id) => {
  if (!puedeEliminar()) return
  
  const tipo = tiposSolicitudOrdenados.value.find(t => t.id === id)
  
  // Verificar si el tipo está en uso en solicitudes
  if (tipoEstaEnUso(id)) {
    mostrarNotificacion(
      `No se puede eliminar el tipo "${tipo?.nombre}" porque está siendo usado en solicitudes.`,
      'warning'
    )
    return
  }
  
  const confirmacion = confirm('¿Está seguro que desea eliminar este tipo de solicitud?')
  if (!confirmacion) return
  
  loading.value = true
  try {
    await deleteTipoSolicitud(id)
    await cargarTiposSolicitud()
    mostrarNotificacion('Tipo de solicitud eliminada exitosamente', 'success')
  } catch (error) {
    console.error('Error al eliminar el tipo de solicitud:', error)
    
    let mensaje = 'Error al eliminar el tipo de solicitud'
    
    // Intenta capturar mensaje del servidor
    if (error?.response?.data?.message) {
      mensaje = error.response.data.message
    } else if (error?.response?.data?.detail) {
      mensaje = error.response.data.detail
    } else if (typeof error?.response?.data === 'string') {
      mensaje = error.response.data
    } else if (error?.message) {
      mensaje = error.message
    }
    
    mostrarNotificacion(mensaje, 'error')
  } finally {
    loading.value = false
  }
}

// Cargar solicitudes al montar el componente
onMounted(async () => {
  const { cargarSolicitudes } = useSolicitudes()
  await cargarSolicitudes()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
