<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-around items-center h-20 sm:h-24">
        <!-- Bandeja de Área (Gestor y Admin/SuperAdmin) -->
        <RouterLink
          v-if="puedeVerTodasSolicitudes"
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
          <span class="text-xs sm:text-sm font-semibold">Bandeja</span>
        </RouterLink>

        <!-- Catálogos (Todos pueden ver, solo Solicitante/Gestor/Admin/SuperAdmin) -->
        <RouterLink
          v-if="puedeVerCatalogos"
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

        <!-- Mis Solicitudes (Todos menos Gestor) -->
        <RouterLink
          v-if="puedeVerMisSolicitudes"
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

        <!-- Gestión de Usuarios (Solo SuperAdmin) -->
        <RouterLink
          v-if="puedeVerUsuarios"
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
import { authStore } from '../stores/authStore'

export default {
  name: 'BottomNavBar',
  setup() {
    const route = useRoute()
    const authStoreInstance = authStore

    const isActive = computed(() => (path) => {
      return route.path === path || route.path.startsWith(path + '/')
    })

    // Rol 1 = Solicitante, Rol 2 = Gestor, Rol 3 = Admin, Rol 4 = SuperAdmin
    const getRol = computed(() => authStoreInstance.user?.rol)

    // Solicitante (1): Solo catálogos (ver) y mis solicitudes
    const esSolicitante = computed(() => getRol.value === 1 || getRol.value === 'Solicitante')
    
    // Gestor (2)
    const esGestor = computed(() => getRol.value === 2 || getRol.value === 'Gestor')
    
    // Admin (3)
    const esAdmin = computed(() => getRol.value === 3 || getRol.value === 'Admin')
    
    // SuperAdmin (4)
    const esSuperAdmin = computed(() => getRol.value === 4 || getRol.value === 'SuperAdmin')

    // Permisos de navegación
    // Catálogos: Gestor, Admin, SuperAdmin (NO Solicitante)
    const puedeVerCatalogos = computed(() => 
      esGestor.value || esAdmin.value || esSuperAdmin.value
    )

    // Mis Solicitudes: Solo Solicitante
    const puedeVerMisSolicitudes = computed(() => 
      esSolicitante.value
    )

    // Todas las Solicitudes: Gestor, Admin, SuperAdmin (NO Solicitante)
    const puedeVerTodasSolicitudes = computed(() => 
      esGestor.value || esAdmin.value || esSuperAdmin.value
    )

    // Gestión de Usuarios: Solo SuperAdmin
    const puedeVerUsuarios = computed(() => 
      esSuperAdmin.value
    )

    return {
      isActive,
      puedeVerCatalogos,
      puedeVerMisSolicitudes,
      puedeVerTodasSolicitudes,
      puedeVerUsuarios
    }
  }
}
</script>

<style scoped>
nav {
  bottom: 0;
}
</style>
