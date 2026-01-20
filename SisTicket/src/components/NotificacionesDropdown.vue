<template>
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button
      @click="isOpen = !isOpen"
      class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      title="Notificaciones"
    >
      <!-- Icono de campana -->
      <svg
        class="w-6 h-6 text-gray-700 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <!-- Badge con contador -->
      <span
        v-if="notificaciones.length > 0"
        class="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-6 h-6"
      >
        {{ notificaciones.length > 9 ? '9+' : notificaciones.length }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Notificaciones</h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ notificaciones.length }} {{ notificaciones.length === 1 ? 'nueva' : 'nuevas' }}
            </span>
          </div>
        </div>

        <!-- Lista de notificaciones -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Estado vacío -->
          <div
            v-if="notificaciones.length === 0"
            class="flex flex-col items-center justify-center py-12 px-4 text-gray-500 dark:text-gray-400"
          >
            <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p class="text-sm">No tienes notificaciones</p>
          </div>

          <!-- Notificaciones -->
          <div
            v-for="notif in notificaciones"
            :key="notif.id"
            class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 group flex items-start gap-3 justify-between"
          >
            <!-- Contenido clickeable -->
            <div
              @click="irASolicitud(notif.solicitudId || notif.id)"
              :class="['flex items-start gap-3 flex-1', (notif.solicitudId || notif.id) ? 'cursor-pointer' : 'cursor-default']"
            >
              <!-- Icono -->
              <div
                :class="[
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg',
                  obtenerColor(notif.tipo)
                ]"
              >
                {{ obtenerIcono(notif.tipo) }}
              </div>

              <!-- Contenido -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white break-words">
                  {{ notif.mensaje }}
                </p>
                <div class="flex items-center gap-1 mt-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ notif.usuarioGeneradorRol }}
                  </span>
                  <span class="text-xs text-gray-400 dark:text-gray-500">•</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatearFecha(notif.fechaCreacion) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Botón eliminar (solo Admin/SuperAdmin) -->
            <button
              v-if="puedeEliminar"
              @click="eliminar(notif.id)"
              class="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Eliminar notificación"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="notificaciones.length > 0" class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <button
            @click="limpiarNotificaciones"
            class="w-full text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-2 transition-colors duration-150"
          >
            Limpiar todas
          </button>
        </div>
      </div>
    </Transition>

    <!-- Overlay para cerrar al hacer click afuera -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click="isOpen = false"
        class="fixed inset-0 z-40"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotificaciones } from '@/composables/useNotificaciones'

const router = useRouter()
const { user } = useAuth()
const { notificaciones, eliminarNotificacion, obtenerIcono, obtenerColor, formatearFecha } = useNotificaciones()
const isOpen = ref(false)

// Solo Admin y SuperAdmin pueden eliminar notificaciones
const puedeEliminar = computed(() => {
  return user?.rol && ['Admin', 'SuperAdmin'].includes(user.rol)
})

onMounted(() => {
  // Silent
})

const limpiarNotificaciones = () => {
  notificaciones.value = []
  isOpen.value = false
}

const irASolicitud = (solicitudId) => {
  if (solicitudId) {
    router.push({
      name: 'SolicitudDetalle',
      params: { id: solicitudId }
    })
    isOpen.value = false
  }
}

const eliminar = async (notificacionId) => {
  // Prevenir que se navegue a la solicitud
  event?.stopPropagation()
  
  await eliminarNotificacion(notificacionId)
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
