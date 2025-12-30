<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-around items-center h-20 sm:h-24">
        <!-- Solicitudes -->
        <RouterLink
          to="/solicitudes"
          :class="[
            'flex flex-col items-center justify-center gap-1 sm:gap-2 flex-1 h-full rounded-t-lg transition',
            isActive('solicitudes')
              ? 'text-indigo-600 border-t-4 border-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:text-indigo-600'
          ]"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-xs sm:text-sm font-semibold">Solicitudes</span>
        </RouterLink>

        <!-- Catálogos -->
        <RouterLink
          to="/catalogos"
          :class="[
            'flex flex-col items-center justify-center gap-1 sm:gap-2 flex-1 h-full rounded-t-lg transition',
            isActive('catalogos')
              ? 'text-indigo-600 border-t-4 border-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:text-indigo-600'
          ]"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>
          <span class="text-xs sm:text-sm font-semibold">Catálogos</span>
        </RouterLink>

        <!-- Bandeja de Área -->
        <RouterLink
          to="/bandeja-area"
          :class="[
            'flex flex-col items-center justify-center gap-1 sm:gap-2 flex-1 h-full rounded-t-lg transition',
            isActive('bandeja-area')
              ? 'text-indigo-600 border-t-4 border-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:text-indigo-600'
          ]"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14 0H4v2h12V6zM4 12a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2a2 2 0 00-2-2H4z"
            />
          </svg>
          <span class="text-xs sm:text-sm font-semibold">Bandeja</span>
        </RouterLink>

        <!-- Mis Solicitudes -->
        <RouterLink
          to="/mis-solicitudes"
          :class="[
            'flex flex-col items-center justify-center gap-1 sm:gap-2 flex-1 h-full rounded-t-lg transition',
            isActive('mis-solicitudes')
              ? 'text-indigo-600 border-t-4 border-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:text-indigo-600'
          ]"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-xs sm:text-sm font-semibold">Mis Solicitudes</span>
        </RouterLink>

        <!-- Gestión de Usuarios -->
        <RouterLink
          to="/usuarios"
          :class="[
            'flex flex-col items-center justify-center gap-1 sm:gap-2 flex-1 h-full rounded-t-lg transition',
            isActive('usuarios')
              ? 'text-indigo-600 border-t-4 border-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:text-indigo-600'
          ]"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 11a6 6 0 016 6H3a6 6 0 016-6zM17 16h2v2h-2z"
            />
          </svg>
          <span class="text-xs sm:text-sm font-semibold">Usuarios</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'BottomNavBar',
  setup() {
    const route = useRoute()

    const isActive = computed(() => (path) => {
      return route.path.includes(path)
    })

    return {
      isActive
    }
  }
}
</script>

<style scoped>
nav {
  bottom: 0;
}
</style>
