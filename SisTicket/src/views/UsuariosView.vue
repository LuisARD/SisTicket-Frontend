<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Mensaje de Error -->
      <div v-if="error" class="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Mensaje de Éxito -->
      <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Título y Botón Crear -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p class="text-sm text-gray-600 mt-1">Total: <span class="font-semibold">{{ totalUsuarios }}</span> | Activos: <span class="font-semibold text-green-600">{{ usuariosActivos }}</span> | Inactivos: <span class="font-semibold text-red-600">{{ usuariosInactivos }}</span></p>
        </div>
        <button
          @click="abrirModalCrear"
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base"
        >
          + Crear Usuario
        </button>
      </div>

      <!-- Buscador y Filtros -->
      <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <!-- Buscador -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, usuario o email..."
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm sm:text-base"
          />
        </div>

        <!-- Filtros -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              v-model="filtroRol"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">Todos los roles</option>
              <option value="1">Solicitante</option>
              <option value="2">Gestor</option>
              <option value="3">Admin</option>
              <option value="4">Super Admin</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="filtroEstado"
              class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <!-- Botones Filtrar y Limpiar -->
        <div class="flex gap-3">
          <button
            @click="aplicarFiltros"
            :disabled="isLoading"
            class="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm sm:text-base"
          >
            {{ isLoading ? '⏳ Filtrando...' : '🔍 Filtrar' }}
          </button>
          <button
            @click="limpiarFiltros"
            class="flex-1 sm:flex-initial px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm sm:text-base"
          >
            ✕ Limpiar
          </button>
        </div>
      </div>

      <!-- Estadísticas de Usuarios -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Total</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-800">{{ estadisticas.total }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Activos</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ estadisticas.activos }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Inactivos</p>
          <p class="text-2xl sm:text-3xl font-bold text-red-600">{{ estadisticas.inactivos }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Solicitantes</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ estadisticas.solicitantes }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Gestores</p>
          <p class="text-2xl sm:text-3xl font-bold text-purple-600">{{ estadisticas.gestores }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Admins</p>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">{{ estadisticas.admins }}</p>
        </div>
      </div>

      <!-- Tabla de Usuarios (Desktop) -->
      <div class="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-100 border-b-2 border-gray-300">
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Nombre</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Usuario</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Rol</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Área</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-800">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuariosFiltrados" :key="usuario.id" class="border-b border-gray-200 hover:bg-gray-50 transition">
              <td class="px-4 py-3 text-sm text-gray-800">{{ usuario.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-800 font-semibold">{{ usuario.nombre }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ usuario.nombreUsuario }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ usuario.email }}</td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="['px-3 py-1 rounded-full text-xs font-semibold', getRolColor(usuario.rol)]"
                >
                  {{ getRolLabel(usuario.rol) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ usuario.areaNombre || usuario.area?.nombre || '-' }}</td>
              <td class="px-4 py-3 text-sm">
                <button
                  @click="cambiarEstadoUsuario(usuario.id, !usuario.activo)"
                  :class="['px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition hover:scale-105 hover:shadow-lg', getEstadoColor(usuario.activo)]"
                  :disabled="isLoading"
                  :title="usuario.activo ? 'Click para desactivar' : 'Click para reactivar'"
                >
                  {{ getEstadoLabel(usuario.activo) }}
                </button>
              </td>
              <td class="px-4 py-3 text-center space-x-2">
                <button
                  @click="editarUsuario(usuario)"
                  class="text-blue-600 hover:text-blue-800 transition inline-block"
                  title="Editar usuario"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="eliminarUsuarioPropuesto(usuario.id)"
                  :disabled="usuario.activo || isLoading"
                  :class="usuario.activo ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-800'"
                  class="text-red-600 hover:text-red-800 transition inline-block disabled:opacity-50 disabled:cursor-not-allowed"
                  :title="usuario.activo ? 'Desactivar usuario primero' : 'Eliminar usuario'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="usuariosFiltrados.length === 0" class="text-center py-12 text-gray-500">
          No hay usuarios que coincidan con los filtros
        </div>
      </div>

      <!-- Tarjetas de Usuarios (Mobile) -->
      <div class="md:hidden space-y-4">
        <div v-for="usuario in usuariosFiltrados" :key="usuario.id" class="bg-white rounded-2xl shadow-lg p-4">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-xs font-semibold text-gray-500">#{{ usuario.id }}</p>
              <p class="text-sm font-semibold text-gray-800">{{ usuario.nombre }}</p>
              <p class="text-xs text-gray-600">{{ usuario.nombreUsuario }}</p>
            </div>
            <button
              @click="cambiarEstadoUsuario(usuario.id, !usuario.activo)"
              :class="['px-3 py-1 rounded text-xs font-semibold cursor-pointer transition hover:scale-105 hover:shadow-lg', getEstadoColor(usuario.activo)]"
              :disabled="isLoading"
              :title="usuario.activo ? 'Click para desactivar' : 'Click para reactivar'"
            >
              {{ getEstadoLabel(usuario.activo) }}
            </button>
          </div>

          <div class="space-y-2 mb-4 text-xs">
            <p><strong>Email:</strong> {{ usuario.email }}</p>
            <p>
              <strong>Rol:</strong> 
              <span :class="['px-2 py-1 rounded text-xs font-semibold', getRolColor(usuario.rol)]">
                {{ getRolLabel(usuario.rol) }}
              </span>
            </p>
            <p><strong>Área:</strong> {{ usuario.areaNombre || usuario.area?.nombre || '-' }}</p>
          </div>

          <div class="flex gap-2 justify-end">
            <button
              @click="editarUsuario(usuario)"
              class="text-blue-600 hover:text-blue-800 transition"
              title="Editar usuario"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="eliminarUsuarioPropuesto(usuario.id)"
              :disabled="usuario.activo || isLoading"
              :class="usuario.activo ? 'opacity-50 cursor-not-allowed' : 'text-red-600 hover:text-red-800'"
              class="text-red-600 hover:text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :title="usuario.activo ? 'Desactivar usuario primero' : 'Eliminar usuario'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="usuariosFiltrados.length === 0" class="text-center py-12 text-gray-500">
          No hay usuarios que coincidan con los filtros
        </div>
      </div>
    </div>

    <!-- Bottom NavBar -->
    <BottomNavBar />

    <!-- Botón FAB para crear (Mobile) -->
    <button
      @click="abrirModalCrear"
      class="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition sm:hidden"
      title="Crear nuevo usuario"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Modal de Crear/Editar Usuario -->
    <UsuarioModal
      :is-open="mostrarModal"
      :usuario="usuarioEditar"
      :areas="areas"
      @close="cerrarModal"
      @success="handleModalSuccess"
    />

    <!-- Toast de Notificaciones -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-24 right-4 p-5 rounded-lg shadow-2xl flex items-start gap-4 max-w-md animate-in border-4 font-semibold z-50',
          toast.type === 'success'
            ? 'bg-green-100 border-green-400 text-green-900'
            : toast.type === 'error'
            ? 'bg-red-100 border-red-500 text-red-900'
            : 'bg-yellow-100 border-yellow-400 text-yellow-900'
        ]"
      >
        <!-- Icono -->
        <div class="flex-shrink-0 pt-1">
          <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-red-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <!-- Mensaje -->
        <div class="flex-grow">
          <p class="text-base">{{ toast.message }}</p>
        </div>
        <!-- Botón cerrar -->
        <button
          @click="toast.show = false"
          class="flex-shrink-0 ml-2 text-2xl leading-none font-bold hover:opacity-70"
        >
          ×
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import UsuarioModal from '../components/UsuarioModal.vue'
import { useUsuarios } from '../composables/useUsuarios'
import { useSolicitudes } from '../composables/useSolicitudes'
import { useCatalogos } from '../composables/useCatalogos'
import { mapearEstadoANumero } from '../utils/estadoMapper'

// Usar composables
const {
  usuariosFiltrados,
  searchQuery,
  filtroRol,
  filtroEstado,
  isLoading,
  error,
  successMessage,
  totalUsuarios,
  usuariosActivos,
  usuariosInactivos,
  estadisticas,
  aplicarFiltros,
  limpiarFiltros,
  eliminarUsuario,
  cambiarEstadoUsuario: cambiarEstadoUsuarioComposable,
  getRolLabel,
  getRolColor,
  getEstadoColor,
  getEstadoLabel
} = useUsuarios()

const { solicitudes, cargarSolicitudes } = useSolicitudes()

const { areas } = useCatalogos()

/**
 * Verifica si un Gestor tiene solicitudes activas (no Rechazadas ni Cerradas)
 */
const tieneActividadActiva = (usuarioId, rolUsuario) => {
  // Solo verificar para Gestores (rol 2)
  const rolMap = { 'Solicitante': 1, 'Gestor': 2, 'Admin': 3, 'SuperAdmin': 4 }
  const rolId = typeof rolUsuario === 'number' ? rolUsuario : rolMap[rolUsuario] || 0
  
  if (rolId !== 2) return false // No es Gestor
  
  // Buscar solicitudes asignadas a este Gestor que NO estén en Rechazada (4) o Cerrada (5)
  const solicitudesActivas = solicitudes.value.filter(s => {
    const mismoGestor = s.gestorAsignadoId === usuarioId
    // Normalizar estado a número para comparación consistente
    const estadoNumerico = mapearEstadoANumero(s.estado)
    const estadoActivo = estadoNumerico !== 4 && estadoNumerico !== 5
    return mismoGestor && estadoActivo
  })
  
  return solicitudesActivas.length > 0
}

/**
 * Obtiene cantidad de solicitudes activas de un Gestor
 */
const obtenerCantidadSolicitudesActivas = (usuarioId, rolUsuario) => {
  const rolMap = { 'Solicitante': 1, 'Gestor': 2, 'Admin': 3, 'SuperAdmin': 4 }
  const rolId = typeof rolUsuario === 'number' ? rolUsuario : rolMap[rolUsuario] || 0
  
  if (rolId !== 2) return 0 // No es Gestor
  
  const solicitudesActivas = solicitudes.value.filter(s => {
    const mismoGestor = s.gestorAsignadoId === usuarioId
    // Normalizar estado a número para comparación consistente
    const estadoNumerico = mapearEstadoANumero(s.estado)
    const estadoActivo = estadoNumerico !== 4 && estadoNumerico !== 5
    return mismoGestor && estadoActivo
  })
  
  return solicitudesActivas.length
}

// Modal state
const mostrarModal = ref(false)
const usuarioEditar = ref(null)

// Toast state
const toast = ref({
  show: false,
  type: 'success', // success, error, warning
  message: ''
})

/**
 * Muestra un toast de notificación
 */
const mostrarToast = (mensaje, tipo = 'success') => {
  toast.value = { show: true, type: tipo, message: mensaje }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

/**
 * Cambia el estado del usuario con confirmación
 */
const cambiarEstadoUsuario = async (id, nuevoEstado) => {
  // Buscar el usuario para obtener su nombre
  const usuario = usuariosFiltrados.value.find(u => u.id === id)
  
  // Si es Gestor y lo queremos desactivar, verificar que no tenga solicitudes activas
  if (!nuevoEstado && tieneActividadActiva(id, usuario?.rol)) {
    const cantidadActivas = obtenerCantidadSolicitudesActivas(id, usuario?.rol)
    mostrarToast(
      `No se puede desactivar. El gestor "${usuario?.nombre}" tiene ${cantidadActivas} solicitud(es) activa(s) asignada(s). Reasígnelas primero.`,
      'warning'
    )
    return
  }
  
  const accion = nuevoEstado ? 'activar' : 'desactivar'
  const confirmacion = confirm(`¿Desea ${accion} al usuario "${usuario?.nombre}"?`)
  
  if (!confirmacion) return

  try {
    await cambiarEstadoUsuarioComposable(id, nuevoEstado)
    const estado = nuevoEstado ? 'activado' : 'desactivado'
    mostrarToast(`Usuario "${usuario?.nombre}" ${estado} exitosamente`, 'success')
  } catch (err) {
    mostrarToast(`Error al cambiar estado: ${err.message}`, 'error')
  }
}

/**
 * Abre el modal para crear usuario
 */
const abrirModalCrear = () => {
  usuarioEditar.value = null
  mostrarModal.value = true
}

/**
 * Abre el modal para editar usuario
 */
const editarUsuario = (usuario) => {
  usuarioEditar.value = usuario
  mostrarModal.value = true
}

/**
 * Cierra el modal
 */
const cerrarModal = () => {
  mostrarModal.value = false
  usuarioEditar.value = null
}

/**
 * Maneja éxito del modal
 */
const handleModalSuccess = async (event) => {
  const { action } = event
  
  if (action === 'create') {
    mostrarToast('Usuario creado exitosamente', 'success')
  } else if (action === 'update') {
    mostrarToast('Usuario actualizado exitosamente', 'success')
  }

  // Recargar usuarios manteniendo filtros actuales (NO limpiar)
  await aplicarFiltros()
  
  cerrarModal()
}

/**
 * Elimina un usuario (solo si está inactivo y no tiene solicitudes activas)
 */
const eliminarUsuarioPropuesto = async (id) => {
  const usuario = usuariosFiltrados.value.find(u => u.id === id)
  
  if (usuario.activo) {
    mostrarToast('Debe desactivar el usuario primero', 'warning')
    return
  }
  
  // Verificar que el Gestor no tenga solicitudes activas
  if (tieneActividadActiva(id, usuario?.rol)) {
    const cantidadActivas = obtenerCantidadSolicitudesActivas(id, usuario?.rol)
    mostrarToast(
      `No se puede eliminar. El gestor "${usuario?.nombre}" tiene ${cantidadActivas} solicitud(es) activa(s) asignada(s). Reasígnelas primero.`,
      'warning'
    )
    return
  }
  
  const confirmacion = confirm(`¿Desea eliminar permanentemente a "${usuario?.nombre}"? Las solicitudes asignadas quedarán sin asignar.`)
  if (!confirmacion) return
  
  try {
    await eliminarUsuario(id)
    mostrarToast(`Usuario "${usuario?.nombre}" eliminado exitosamente`, 'success')
  } catch (err) {
    mostrarToast(`Error al eliminar usuario: ${err.message}`, 'error')
  }
}

/**
 * Carga los usuarios al montar el componente
 */
onMounted(async () => {
  // Cargar solicitudes primero
  await cargarSolicitudes()
  // Luego cargar usuarios
  limpiarFiltros()
  aplicarFiltros()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
