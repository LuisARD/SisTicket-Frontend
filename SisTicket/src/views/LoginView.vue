<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md">
      <!-- Card del Login -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <!-- Header -->
        <div class="text-center mb-8">
          <!-- Icono de Usuario -->
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg
                class="w-8 h-8 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
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
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Sistema de Solicitudes
          </h1>
          <!-- Subtítulo -->
          <p class="text-gray-500 text-sm md:text-base">
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

        <!-- Footer -->
        <p class="text-center text-gray-500 text-xs mt-8">
          Usuarios de prueba: cesar/cesar, admin/password, gestor/password, usuario/password
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const formData = ref({
      nombreUsuario: '',
      password: ''
    })
    const isLoading = ref(false)
    const error = ref(null)

    const handleLogin = async () => {
      error.value = null

      if (!formData.value.nombreUsuario || !formData.value.password) {
        error.value = 'Por favor complete todos los campos'
        return
      }

      isLoading.value = true
      try {
        await authStore.login(
          formData.value.nombreUsuario,
          formData.value.password
        )
        // Redirigir al dashboard después del login exitoso
        router.push('/dashboard')
      } catch (err) {
        error.value = authStore.error || 'Error al iniciar sesión'
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      isLoading,
      error,
      handleLogin
    }
  }
}
</script>
