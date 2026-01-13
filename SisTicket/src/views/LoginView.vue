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
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Ingrese contraseña"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              :disabled="isLoading"
            />
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
    const { login, isLoading, error, clearError } = useLogin()

    // Detectar cuando se debe mostrar el modal de cambio de contraseña
    watch(
      () => authStore.tienePasswordTemporal,
      (newVal) => {
        console.log('[LoginView] tienePasswordTemporal cambió a:', newVal)
        console.log('[LoginView] mostrarModalPassword.value ANTES de asignar:', mostrarModalPassword.value)
        
        if (newVal === true) {
          console.log('[LoginView] ✓ Asignando mostrarModalPassword = true')
          mostrarModalPassword.value = true
          console.log('[LoginView] mostrarModalPassword.value DESPUÉS de asignar:', mostrarModalPassword.value)
        }
      },
      { immediate: true, flush: 'post' }
    )

    const handleLogin = async () => {
      clearError()
      try {
        console.log('[LoginView] Iniciando login...')
        await login(formData.value.nombreUsuario, formData.value.password)
        console.log('[LoginView] Login completado. authStore.tienePasswordTemporal:', authStore.tienePasswordTemporal)
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
      handleCerrarModalPassword,
      handleCambioExitoso
    }
  }
}
</script>
