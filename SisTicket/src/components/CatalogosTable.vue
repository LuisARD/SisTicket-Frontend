<template>
  <!-- Tabla de Catálogos (Desktop) -->
  <div class="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
    <table class="w-full">
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-300">
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Nombre</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-800">Estado</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" class="border-b border-gray-200 hover:bg-gray-50 transition">
          <td class="px-4 py-3 text-sm font-semibold text-gray-800">{{ item.id }}</td>
          <td class="px-4 py-3 text-sm text-gray-700">{{ item.nombre }}</td>
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
          <td class="px-4 py-3 text-center space-x-2">
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
          <p class="text-xs font-semibold text-gray-500">ID: {{ item.id }}</p>
          <p class="text-sm font-semibold text-gray-800">{{ item.nombre }}</p>
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

      <div class="flex gap-2 justify-end">
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
</script>
