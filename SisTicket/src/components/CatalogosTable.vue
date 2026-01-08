<template>
  <!-- Tabla de Catálogos (Desktop) -->
  <div class="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-300">
          <th v-if="!isGestor" class="px-4 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Nombre</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
          <th v-if="!isGestor" class="px-4 py-3 text-center text-sm font-semibold text-gray-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-b border-gray-200 hover:bg-gray-50 transition">
          <td v-if="!isGestor" class="px-4 py-3 text-sm font-semibold text-gray-800">{{ item.id }}</td>
          <td class="px-4 py-3 text-sm text-gray-700">
            <div class="flex items-center gap-2">
              <span>{{ item.nombre }}</span>
              <div v-if="item.descripcion" class="relative group cursor-help">
                <svg class="w-4 h-4 text-gray-400 hover:text-gray-600 transition flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              <div class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal max-w-sm z-10">
                  {{ item.descripcion }}
                  <div class="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                </div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-sm">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                item.activo || item.estado
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ item.activo || item.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td v-if="!isGestor" class="px-4 py-3 text-center space-x-2">
            <button
              v-if="isAdmin"
              @click="$emit('editar', item)"
              class="text-blue-600 hover:text-blue-800 transition inline-block"
              title="Editar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              v-if="isAdmin"
              @click="$emit('eliminar', item.id)"
              class="text-red-600 hover:text-red-800 transition inline-block"
              title="Eliminar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <span v-if="!isAdmin" class="text-gray-400 text-xs italic">Solo lectura</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="items.length === 0" class="text-center py-12 text-gray-500">
      No hay elementos para mostrar
    </div>
  </div>

  <!-- Tarjetas de Catálogos (Mobile) -->
  <div class="md:hidden space-y-4">
    <div v-for="item in items" :key="item.id" class="bg-white rounded-2xl shadow-lg p-4">
      <div class="flex justify-between items-start mb-3">
        <div>
          <p v-if="!isGestor" class="text-xs font-semibold text-gray-500">ID: {{ item.id }}</p>
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-gray-800">{{ item.nombre }}</p>
            <div v-if="item.descripcion" class="relative group cursor-help">
              <svg class="w-4 h-4 text-gray-400 hover:text-gray-600 transition flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal max-w-sm z-10">
                {{ item.descripcion }}
                <div class="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-semibold',
            item.activo || item.estado
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          ]"
        >
          {{ item.activo || item.estado ? 'Activo' : 'Inactivo' }}
        </span>
      </div>

      <div v-if="!isGestor" class="flex gap-2 justify-end">
        <button
          v-if="isAdmin"
          @click="$emit('editar', item)"
          class="text-blue-600 hover:text-blue-800 transition"
          title="Editar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          v-if="isAdmin"
          @click="$emit('eliminar', item.id)"
          class="text-red-600 hover:text-red-800 transition"
          title="Eliminar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <span v-if="!isAdmin" class="text-gray-400 text-xs italic">Solo lectura</span>
      </div>
    </div>

    <div v-if="items.length === 0" class="text-center py-12 text-gray-500">
      No hay elementos para mostrar
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authStore } from '../stores/authStore'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

defineEmits(['editar', 'eliminar'])

// Validar si es admin
const isAdmin = computed(() => {
  const rol = authStore.user?.rol
  return rol === 'Admin' || rol === 'SuperAdmin' || rol === 3 || rol === 4
})

// Validar si es gestor
const isGestor = computed(() => {
  const rol = authStore.user?.rol
  return rol === 'Gestor' || rol === 2
})
</script>
