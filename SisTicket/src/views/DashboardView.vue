<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">
            Bienvenido, {{ authStore.user?.nombre || 'Usuario' }}
          </h1>
          <p class="text-gray-600 mt-2">
            Rol: <span class="font-semibold">{{ authStore.user?.rol || 'No disponible' }}</span>
          </p>
        </div>
        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Cerrar Sesión
        </button>
      </div>

      <!-- Información del Usuario -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Información del Perfil</h2>
        
        <!-- Debug info (solo en desarrollo) -->
        <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
          <p><strong>Estado Autenticado:</strong> {{ authStore.isAuthenticated }}</p>
          <p><strong>Usuario Almacenado:</strong> {{ JSON.stringify(authStore.user) }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600 text-sm">Nombre de Usuario</p>
            <p class="font-semibold text-gray-800">{{ authStore.user?.nombreUsuario || 'No disponible' }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Email</p>
            <p class="font-semibold text-gray-800">{{ authStore.user?.email || 'No disponible' }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Área</p>
            <p class="font-semibold text-gray-800">{{ authStore.user?.area || 'No disponible' }}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Rol</p>
            <p class="font-semibold text-gray-800">{{ authStore.user?.rol || 'No disponible' }}</p>
          </div>
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
