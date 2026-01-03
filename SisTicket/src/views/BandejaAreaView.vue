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
import { authStore } from '../stores/authStore'

const router = useRouter()
const { solicitudes, isLoading, esAdmin, esGestor, cargarSolicitudes, cambiarEstado } = useBandejaArea()

// Verificar permisos: solo gestores y admins pueden acceder
onMounted(() => {
  const rol = authStore.user?.rol
  if (rol === 'Solicitante' || rol === 1) {
    router.push('/solicitudes')
  }
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
