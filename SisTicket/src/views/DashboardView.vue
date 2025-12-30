<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Bienvenido, {{ user?.nombre || 'Usuario' }}
          </h1>
          <p class="text-gray-600 mt-2 text-sm sm:text-base">
            Rol: <span class="font-semibold text-indigo-600">{{ user?.rol || 'No disponible' }}</span>
          </p>
        </div>
      </div>

      <!-- Grid de Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Card de Información del Usuario -->
        <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-6">Información del Perfil</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="border-l-4 border-indigo-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Nombre de Usuario</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base break-all">
                {{ user?.nombreUsuario || 'No disponible' }}
              </p>
            </div>
            <div class="border-l-4 border-indigo-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Email</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base break-all">
                {{ user?.email || 'No disponible' }}
              </p>
            </div>
            <div class="border-l-4 border-green-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Área</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ user?.area || 'No disponible' }}
              </p>
            </div>
            <div class="border-l-4 border-purple-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Rol</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ user?.rol || 'No disponible' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Card de Información del Sistema -->
        <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-6">Acciones Rápidas</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RouterLink
              to="/solicitudes"
              class="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-lg transition text-center"
            >
              <p class="text-xs sm:text-sm text-blue-800 font-semibold">Ver Solicitudes</p>
            </RouterLink>
            <RouterLink
              to="/solicitudes/nueva"
              class="p-4 bg-green-50 hover:bg-green-100 border-2 border-green-300 rounded-lg transition text-center"
            >
              <p class="text-xs sm:text-sm text-green-800 font-semibold">Nueva Solicitud</p>
            </RouterLink>
            <RouterLink
              to="/catalogos"
              class="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-lg transition text-center"
            >
              <p class="text-xs sm:text-sm text-purple-800 font-semibold">Catálogos</p>
            </RouterLink>
            <RouterLink
              to="/usuarios"
              class="p-4 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-lg transition text-center"
            >
              <p class="text-xs sm:text-sm text-amber-800 font-semibold">Usuarios</p>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Debug info (solo en desarrollo) -->
      <div v-if="isDevelopment" class="mt-8 bg-yellow-50 border-l-4 border-yellow-600 p-4 sm:p-6 rounded text-xs sm:text-sm">
        <h3 class="font-bold text-yellow-900 mb-3">📋 Información de Debug</h3>
        <div class="space-y-2 font-mono text-yellow-800 break-all">
          <p><strong>Estado Autenticado:</strong> {{ isAuthenticated }}</p>
          <p><strong>Usuario ID:</strong> {{ user?.id || 'N/A' }}</p>
          <p><strong>Usuario Almacenado:</strong> {{ user ? 'Disponible' : 'No disponible' }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />
  </div>
</template>

<script>
import { computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import { authStore } from '../stores/authStore'

export default {
  name: 'DashboardView',
  components: {
    Navbar,
    BottomNavBar
  },
  setup() {
    const user = computed(() => authStore.user)
    const isDevelopment = import.meta.env.DEV

    return {
      user,
      isDevelopment
    }
  }
}
</script>
