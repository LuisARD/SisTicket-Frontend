<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div class="flex-1">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Bienvenido, {{ authStore.user?.nombre || 'Usuario' }}
          </h1>
          <p class="text-gray-600 mt-2 text-sm sm:text-base">
            Rol: <span class="font-semibold text-indigo-600">{{ authStore.user?.rol || 'No disponible' }}</span>
          </p>
        </div>
        <button
          @click="handleLogout"
          class="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-200 text-sm sm:text-base"
        >
          Cerrar Sesión
        </button>
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
                {{ authStore.user?.nombreUsuario || 'No disponible' }}
              </p>
            </div>
            <div class="border-l-4 border-indigo-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Email</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base break-all">
                {{ authStore.user?.email || 'No disponible' }}
              </p>
            </div>
            <div class="border-l-4 border-green-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Área</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ authStore.user?.area || 'No disponible' }}
              </p>
            </div>
            <div class="border-l-4 border-purple-600 pl-4">
              <p class="text-gray-600 text-xs sm:text-sm font-medium mb-1">Rol</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ authStore.user?.rol || 'No disponible' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Card de Información del Sistema -->
        <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-6">Información del Sistema</h2>
          
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-blue-50 rounded-lg">
              <span class="text-gray-700 font-medium text-sm sm:text-base">Estado de Autenticación</span>
              <span class="mt-2 sm:mt-0 inline-block px-3 py-1 bg-green-200 text-green-800 text-xs sm:text-sm font-semibold rounded-full">
                {{ authStore.isAuthenticated ? 'Autenticado' : 'No autenticado' }}
              </span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-purple-50 rounded-lg">
              <span class="text-gray-700 font-medium text-sm sm:text-base">Sesión Activa</span>
              <span class="mt-2 sm:mt-0 inline-block px-3 py-1 bg-indigo-200 text-indigo-800 text-xs sm:text-sm font-semibold rounded-full">
                Sí
              </span>
            </div>
            <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p class="text-gray-700 text-xs sm:text-sm">
                <strong>Tip:</strong> Utiliza el menú de navegación para acceder a solicitudes, usuarios y catálogos según tus permisos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug info (solo en desarrollo) -->
      <div class="mt-8 bg-yellow-50 border-l-4 border-yellow-600 p-4 sm:p-6 rounded text-xs sm:text-sm">
        <h3 class="font-bold text-yellow-900 mb-3">📋 Información de Debug</h3>
        <div class="space-y-2 font-mono text-yellow-800 break-all">
          <p><strong>Estado Autenticado:</strong> {{ authStore.isAuthenticated }}</p>
          <p><strong>Usuario ID:</strong> {{ authStore.user?.id || 'N/A' }}</p>
          <p><strong>Usuario Almacenado:</strong> {{ authStore.user ? 'Disponible' : 'No disponible' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'

export default {
  name: 'DashboardView',
  setup() {
    const router = useRouter()

    console.log('Dashboard cargado. Estado del store:', authStore)

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>
