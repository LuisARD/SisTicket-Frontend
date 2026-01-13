<template>
  <nav class="bg-white shadow-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y Nombre -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
            <img 
              src="@/assets/icons/Header-solicitudes.svg" 
              alt="Sistema de Solicitudes" 
              class="w-6 h-6 sm:w-7 sm:h-7"
            />
          </div>
          <h1 class="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">
            Sistema de Solicitudes
          </h1>
        </div>

        <!-- Info Usuario y Botones -->
        <div class="flex items-center gap-3 sm:gap-6">
          <div class="text-right hidden sm:block">
            <div class="flex items-center justify-end gap-2 mb-1">
                            <img 
                src="@/assets/icons/SesionNombre.svg" 
                alt="Usuario" 
                class="w-5 h-5"
              />
              <p class="text-sm sm:text-base font-semibold text-gray-800">
                {{ user?.nombre }}
              </p>
            </div>
            <p class="text-xs sm:text-sm text-gray-500">
              {{ user?.rol }}
            </p>
          </div>

          <!-- Botón Cambiar Contraseña -->
          <button
            @click="mostrarModalPassword = true"
            class="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 border-2 border-blue-400 rounded-lg hover:border-blue-600 hover:text-blue-800 transition"
            title="Cambiar contraseña"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span class="hidden sm:inline">Cambiar Contraseña</span>
            <span class="sm:hidden">Contraseña</span>
          </button>

          <!-- Botón Cerrar Sesión -->
          <button
            @click="logout"
            class="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 border-2 border-gray-400 rounded-lg hover:border-gray-600 hover:text-gray-900 transition"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span class="hidden sm:inline">Cerrar Sesión</span>
            <span class="sm:hidden">Salir</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Cambio de Contraseña (Voluntario) -->
    <CambiarPasswordTemporalModal
      :visible="mostrarModalPassword"
      :is-required="false"
      @close="mostrarModalPassword = false"
      @cambio-exitoso="mostrarModalPassword = false"
    />
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import CambiarPasswordTemporalModal from './CambiarPasswordTemporalModal.vue'

export default {
  name: 'Navbar',
  components: {
    CambiarPasswordTemporalModal
  },
  setup() {
    const { user, logout } = useAuth()
    const mostrarModalPassword = ref(false)

    return {
      user,
      logout,
      mostrarModalPassword
    }
  }
}
</script>
