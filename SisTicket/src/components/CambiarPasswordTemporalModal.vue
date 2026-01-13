<template>
  <Transition name="modal">
    <div
      v-if="mostrarModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
      @keydown.esc="!isRequired && cerrarModal"
      @click="!isRequired && cerrarModal"
    >
      <!-- Modal Container -->
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 flex justify-between items-center shrink-0">
          <h2 class="text-lg sm:text-xl font-bold text-white">Cambiar Contraseña</h2>
          <button
            v-if="!isRequired"
            @click="cerrarModal"
            class="text-white hover:bg-white/20 rounded-full p-1.5 transition duration-200 flex-shrink-0"
            aria-label="Cerrar modal"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <!-- Mensaje Informativo -->
          <transition name="fade">
            <div
              v-if="isRequired"
              class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg text-sm sm:text-base"
              role="alert"
            >
              Esta es tu primera sesión. Por favor, cambia tu contraseña para continuar.
            </div>
          </transition>

          <!-- Campo Contraseña Actual -->
          <div v-if="!isRequired" class="space-y-2">
            <label for="passwordActual" class="block text-sm sm:text-base font-medium text-gray-700">
              Contraseña Actual
            </label>
            <input
              id="passwordActual"
              v-model="passwordActual"
              type="password"
              placeholder="Ingresa tu contraseña actual"
              class="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
              :disabled="isLoading"
            />
          </div>

          <!-- Campo Nueva Contraseña -->
          <div class="space-y-2">
            <label for="passwordNueva" class="block text-sm sm:text-base font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <input
              id="passwordNueva"
              v-model="passwordNueva"
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              class="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
              :disabled="isLoading"
            />
          </div>

          <!-- Campo Confirmar Contraseña -->
          <div class="space-y-2">
            <label for="confirmarPassword" class="block text-sm sm:text-base font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              id="confirmarPassword"
              v-model="confirmarPassword"
              type="password"
              placeholder="Confirma tu nueva contraseña"
              class="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
              :disabled="isLoading"
            />
          </div>

          <!-- Requisitos de Seguridad -->
          <div class="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 space-y-3 sm:space-y-4">
            <p class="text-sm sm:text-base font-semibold text-gray-800">Requisitos de Seguridad:</p>
            <div class="space-y-2 sm:space-y-2.5">
              <!-- Requisito: Longitud -->
              <div
                :class="[
                  'flex items-center gap-2.5 sm:gap-3 py-1.5 px-2 rounded transition duration-200',
                  validacionesNuevaPassword.longitud
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-500'
                ]"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  :fill="validacionesNuevaPassword.longitud ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs sm:text-sm">Mínimo 8 caracteres</span>
              </div>

              <!-- Requisito: Mayúscula -->
              <div
                :class="[
                  'flex items-center gap-2.5 sm:gap-3 py-1.5 px-2 rounded transition duration-200',
                  validacionesNuevaPassword.mayuscula
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-500'
                ]"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  :fill="validacionesNuevaPassword.mayuscula ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs sm:text-sm">Al menos 1 letra mayúscula</span>
              </div>

              <!-- Requisito: Número -->
              <div
                :class="[
                  'flex items-center gap-2.5 sm:gap-3 py-1.5 px-2 rounded transition duration-200',
                  validacionesNuevaPassword.numero
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-500'
                ]"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  :fill="validacionesNuevaPassword.numero ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs sm:text-sm">Al menos 1 número</span>
              </div>

              <!-- Requisito: Símbolo -->
              <div
                :class="[
                  'flex items-center gap-2.5 sm:gap-3 py-1.5 px-2 rounded transition duration-200',
                  validacionesNuevaPassword.simbolo
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-500'
                ]"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  :fill="validacionesNuevaPassword.simbolo ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs sm:text-sm">1 símbolo (-, *, @, !, #, $, %, ^, &, +, =)</span>
              </div>

              <!-- Requisito: Diferente a actual -->
              <div
                :class="[
                  'flex items-center gap-2.5 sm:gap-3 py-1.5 px-2 rounded transition duration-200',
                  validacionesNuevaPassword.noIgual
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-500'
                ]"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  :fill="validacionesNuevaPassword.noIgual ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs sm:text-sm">Diferente a la contraseña actual</span>
              </div>

              <!-- Requisito: Coincidencia -->
              <div
                :class="[
                  'flex items-center gap-2.5 sm:gap-3 py-1.5 px-2 rounded transition duration-200',
                  validacionesNuevaPassword.coincidencia
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-500'
                ]"
              >
                <svg
                  class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  :fill="validacionesNuevaPassword.coincidencia ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-xs sm:text-sm">Las contraseñas coinciden</span>
              </div>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <transition name="fade">
            <div
              v-if="error"
              class="bg-red-50 border-l-4 border-red-400 text-red-800 px-4 py-3 rounded-lg text-xs sm:text-sm"
              role="alert"
            >
              {{ error }}
            </div>
          </transition>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 shrink-0">
          <button
            v-if="!isRequired"
            @click="cerrarModal"
            :disabled="isLoading"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            v-else
            @click="handleLogout"
            :disabled="isLoading"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            Cerrar Sesión
          </button>
          <button
            @click="handleCambiarPassword"
            :disabled="!todasValidacionesCumplen || isLoading"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            {{ isLoading ? 'Cambiando...' : 'Cambiar Contraseña' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, watch } from 'vue'
import { useCambiarPassword } from '../composables/useCambiarPassword'
import { authStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'CambiarPasswordTemporalModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'cambio-exitoso'],
  setup(props, { emit }) {
    const router = useRouter()
    const mostrarModal = ref(props.visible)

    const {
      passwordActual,
      passwordNueva,
      confirmarPassword,
      isLoading,
      error,
      validacionesNuevaPassword,
      todasValidacionesCumplen,
      cambiarPassword,
      limpiarFormulario,
      limpiarError
    } = useCambiarPassword()

    // Si es contraseña temporal obligatoria, asignar la contraseña predeterminada
    if (props.isRequired) {
      passwordActual.value = 'Password@88'
    }

    // Sincronizar la visibilidad del modal
    watch(
      () => props.visible,
      (newVal) => {
        mostrarModal.value = newVal
      }
    )

    const cerrarModal = () => {
      if (!props.isRequired) {
        limpiarFormulario()
        limpiarError()
        emit('close')
      }
    }

    const handleLogout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
      } catch (err) {
        console.error('Error en logout:', err)
      }
    }

    const handleCambiarPassword = async () => {
      const exitoso = await cambiarPassword()
      if (exitoso) {
        emit('cambio-exitoso')
        // Actualizar el estado en el store
        authStore.tienePasswordTemporal = false
        if (authStore.user) {
          authStore.user.tienePasswordTemporal = false
        }
        // Cerrar el modal después de un pequeño delay
        setTimeout(() => {
          limpiarFormulario()
          limpiarError()
          emit('close')
          // Si viene desde login, redirigir al dashboard
          if (props.isRequired) {
            console.log('[CambiarPasswordTemporalModal] Cambio de contraseña exitoso, redirigiendo a /mis-solicitudes')
            router.push('/mis-solicitudes')
          }
        }, 500)
      }
    }

    return {
      mostrarModal,
      passwordActual,
      passwordNueva,
      confirmarPassword,
      isLoading,
      error,
      validacionesNuevaPassword,
      todasValidacionesCumplen,
      cerrarModal,
      handleCambiarPassword,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* Transición del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

/* Transición de fade para mensajes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
