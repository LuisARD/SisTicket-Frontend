<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
    <div class="w-full max-w-sm sm:max-w-md">
      <!-- Card del Login -->
      <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
        <!-- Header -->
        <div class="text-center mb-8">
          <!-- Icono de Login -->
          <div class="flex justify-center mb-4">
            <img 
              src="@/assets/icons/login.svg" 
              alt="Sistema de Solicitudes" 
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>

          <!-- Puntos decorativos -->
          <div class="flex justify-center gap-1 mb-6">
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
          </div>

          <!-- Título -->
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Sistema de Solicitudes
          </h1>
          <!-- Subtítulo -->
          <p class="text-gray-500 text-xs sm:text-sm md:text-base">
            Ingresar sus credenciales para continuar
          </p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Campo Usuario -->
          <div>
            <label for="usuario" class="block text-gray-700 font-medium mb-2">
              Usuario
            </label>
            <input
              id="usuario"
              v-model="formData.nombreUsuario"
              type="text"
              placeholder="Ingrese usuario"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              :disabled="isLoading"
            />
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label for="password" class="block text-gray-700 font-medium mb-2">
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="mostrarPassword ? 'text' : 'password'"
                placeholder="Ingrese contraseña"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="mostrarPassword = !mostrarPassword"
                :disabled="isLoading"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <!-- Icono ojo abierto (contraseña visible) -->
                <svg v-if="mostrarPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                  <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                  <path d="M3 3l18 18" />
                </svg>
                <!-- Icono ojo cerrado (contraseña oculta) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Botón Iniciar Sesión -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

      </div>
    </div>

    <!-- Modal de Cambio de Contraseña Temporal -->
    <CambiarPasswordTemporalModal
      :visible="mostrarModalPassword"
      :is-required="true"
      @close="handleCerrarModalPassword"
      @cambio-exitoso="handleCambioExitoso"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useLogin } from '../composables/useLogin'
import { authStore } from '../stores/authStore'
import CambiarPasswordTemporalModal from '../components/CambiarPasswordTemporalModal.vue'

export default {
  name: 'LoginView',
  components: {
    CambiarPasswordTemporalModal
  },
  setup() {
    const formData = ref({
      nombreUsuario: '',
      password: ''
    })
    const mostrarModalPassword = ref(false)
    const mostrarPassword = ref(false)
    const { login, isLoading, error, clearError } = useLogin()

    // Detectar cuando se debe mostrar el modal de cambio de contraseña
    watch(
      () => authStore.tienePasswordTemporal,
      (newVal) => {
        if (newVal === true) {
          mostrarModalPassword.value = true
        }
      },
      { immediate: true, flush: 'post' }
    )

    const handleLogin = async () => {
      clearError()
      try {
        await login(formData.value.nombreUsuario, formData.value.password)
        // El watch se encargará de mostrar el modal
      } catch (err) {
        console.error('[LoginView] Error en login:', err)
      }
    }

    const handleCerrarModalPassword = () => {
      // El modal no debería cerrarse porque es obligatorio
      // Solo se cierra después de un cambio exitoso
    }

    const handleCambioExitoso = () => {
      mostrarModalPassword.value = false
      // El modal ya maneja la redirección a /mis-solicitudes
    }

    return {
      formData,
      isLoading,
      error,
      clearError,
      handleLogin,
      mostrarModalPassword,
      mostrarPassword,
      handleCerrarModalPassword,
      handleCambioExitoso
    }
  }
}
</script>
