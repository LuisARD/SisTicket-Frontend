<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Título y Botón Crear -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <button
          @click="abrirFormularioCrear"
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
            placeholder="Buscar usuarios..."
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 text-sm sm:text-base"
          />
        </div>

        <!-- Filtro por Rol -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <div class="mt-4 flex gap-3">
          <button
            @click="aplicarFiltros"
            :disabled="isLoading"
            class="flex-1 sm:flex-initial px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm sm:text-base"
          >
            {{ isLoading ? 'Filtrando...' : 'Filtrar' }}
          </button>
          <button
            @click="limpiarFiltros"
            class="flex-1 sm:flex-initial px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm sm:text-base"
          >
            Limpiar
          </button>
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
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    getRolColor(usuario.rol)
                  ]"
                >
                  {{ getRolLabel(usuario.rol) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ usuario.area?.nombre || '-' }}</td>
              <td class="px-4 py-3 text-sm">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                </span>
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
                  @click="eliminarUsuario(usuario.id)"
                  class="text-red-600 hover:text-red-800 transition inline-block"
                  title="Eliminar usuario"
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
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-semibold',
                usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ usuario.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <div class="space-y-2 mb-4 text-xs">
            <p><strong>Email:</strong> {{ usuario.email }}</p>
            <p><strong>Rol:</strong> <span :class="['px-2 py-1 rounded', getRolColor(usuario.rol)]">{{ getRolLabel(usuario.rol) }}</span></p>
            <p><strong>Área:</strong> {{ usuario.area?.nombre || '-' }}</p>
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
              @click="eliminarUsuario(usuario.id)"
              class="text-red-600 hover:text-red-800 transition"
              title="Eliminar usuario"
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
      @click="abrirFormularioCrear"
      class="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition sm:hidden"
      title="Crear nuevo usuario"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'

const searchQuery = ref('')
const filtroRol = ref('')
const filtroEstado = ref('')
const isLoading = ref(false)

// Datos de ejemplo (reemplazar con datos del API)
const usuarios = ref([
  {
    id: 1,
    nombre: 'Juan García',
    nombreUsuario: 'jgarcia',
    email: 'juan@example.com',
    rol: 1,
    area: { nombre: 'Soporte' },
    activo: true
  },
  {
    id: 2,
    nombre: 'María López',
    nombreUsuario: 'mlopez',
    email: 'maria@example.com',
    rol: 2,
    area: { nombre: 'Ventas' },
    activo: true
  },
  {
    id: 3,
    nombre: 'Carlos Pérez',
    nombreUsuario: 'cperez',
    email: 'carlos@example.com',
    rol: 3,
    area: { nombre: 'Administración' },
    activo: false
  }
])

const usuariosFiltrados = computed(() => {
  let resultado = usuarios.value

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    resultado = resultado.filter(
      u =>
        u.nombre.toLowerCase().includes(query) ||
        u.nombreUsuario.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    )
  }

  // Filtrar por rol
  if (filtroRol.value) {
    resultado = resultado.filter(u => u.rol === parseInt(filtroRol.value))
  }

  // Filtrar por estado
  if (filtroEstado.value) {
    resultado = resultado.filter(u => u.activo === (filtroEstado.value === 'activo'))
  }

  return resultado
})

const getRolLabel = (rol) => {
  const roles = {
    1: 'Solicitante',
    2: 'Gestor',
    3: 'Admin',
    4: 'Super Admin'
  }
  return roles[rol] || 'Desconocido'
}

const getRolColor = (rol) => {
  const colores = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-red-100 text-red-800'
  }
  return colores[rol] || 'bg-gray-100 text-gray-800'
}

const aplicarFiltros = () => {
  isLoading.value = true
  // Aquí irá la lógica para obtener usuarios del API
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const limpiarFiltros = () => {
  searchQuery.value = ''
  filtroRol.value = ''
  filtroEstado.value = ''
}

const abrirFormularioCrear = () => {
  // Aquí se abrirá un modal para crear usuario
  console.log('Crear nuevo usuario')
}

const editarUsuario = (usuario) => {
  // Aquí se abrirá un modal para editar usuario
  console.log('Editar usuario:', usuario)
}

const eliminarUsuario = (id) => {
  // Aquí se eliminará el usuario
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    usuarios.value = usuarios.value.filter(u => u.id !== id)
  }
}
</script>
