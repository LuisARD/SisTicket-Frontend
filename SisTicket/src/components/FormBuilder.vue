<template>
  <div class="space-y-4">
    <!-- Grupos de campos -->
    <div v-for="(field, index) in fields" :key="index" class="space-y-2">
      <!-- Input de texto -->
      <div v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'">
        <label :for="field.name" class="block text-sm font-medium text-gray-700">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <input
          :id="field.name"
          :type="field.type"
          :value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isSubmitting"
          @input="(e) => $emit('update:field', { name: field.name, value: e.target.value })"
          @blur="$emit('touch', field.name)"
          :class="[
            'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
            hasError(field.name)
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-indigo-600'
          ]"
        />
        <p v-if="hasError(field.name)" class="text-sm text-red-500 mt-1">
          {{ getError(field.name) }}
        </p>
      </div>

      <!-- Select -->
      <div v-else-if="field.type === 'select'">
        <label :for="field.name" class="block text-sm font-medium text-gray-700">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <select
          :id="field.name"
          :value="formData[field.name]"
          :disabled="isSubmitting"
          @change="(e) => $emit('update:field', { name: field.name, value: e.target.value })"
          @blur="$emit('touch', field.name)"
          :class="[
            'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
            hasError(field.name)
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-indigo-600'
          ]"
        >
          <option value="">{{ field.placeholder || 'Selecciona...' }}</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <p v-if="hasError(field.name)" class="text-sm text-red-500 mt-1">
          {{ getError(field.name) }}
        </p>
      </div>

      <!-- Textarea -->
      <div v-else-if="field.type === 'textarea'">
        <label :for="field.name" class="block text-sm font-medium text-gray-700">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <textarea
          :id="field.name"
          :value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isSubmitting"
          :rows="field.rows || 4"
          @input="(e) => $emit('update:field', { name: field.name, value: e.target.value })"
          @blur="$emit('touch', field.name)"
          :class="[
            'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition resize-none',
            hasError(field.name)
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-indigo-600'
          ]"
        ></textarea>
        <p v-if="hasError(field.name)" class="text-sm text-red-500 mt-1">
          {{ getError(field.name) }}
        </p>
      </div>

      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
        <input
          :id="field.name"
          type="checkbox"
          :checked="formData[field.name]"
          :disabled="isSubmitting"
          @change="(e) => $emit('update:field', { name: field.name, value: e.target.checked })"
          @blur="$emit('touch', field.name)"
          class="w-4 h-4 border-gray-300 rounded focus:ring-indigo-600 cursor-pointer"
        />
        <label :for="field.name" class="text-sm font-medium text-gray-700 cursor-pointer">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex gap-3 justify-end mt-6">
      <button
        @click="$emit('cancel')"
        :disabled="isSubmitting"
        class="px-6 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 font-semibold rounded-lg transition"
      >
        Cancelar
      </button>
      <button
        @click="$emit('submit')"
        :disabled="isSubmitting"
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
      >
        {{ isSubmitting ? '⏳ Enviando...' : submitText || 'Guardar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /**
   * Array de campos del formulario
   * Ejemplo:
   * [
   *   { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'tu@email.com' },
   *   { name: 'rol', type: 'select', label: 'Rol', required: true, options: [{value: 1, label: 'Admin'}] }
   * ]
   */
  fields: {
    type: Array,
    required: true
  },
  /**
   * Datos del formulario
   */
  formData: {
    type: Object,
    required: true
  },
  /**
   * Errores del formulario
   */
  errors: {
    type: Object,
    default: () => ({})
  },
  /**
   * Campos tocados (touched)
   */
  touched: {
    type: Object,
    default: () => ({})
  },
  /**
   * Estado de envío
   */
  isSubmitting: {
    type: Boolean,
    default: false
  },
  /**
   * Texto del botón de envío
   */
  submitText: {
    type: String,
    default: 'Guardar'
  }
})

const emit = defineEmits(['update:field', 'touch', 'submit', 'cancel'])

/**
 * Verifica si un campo tiene error
 */
const hasError = (fieldName) => {
  return touched[fieldName] && fieldName in errors
}

/**
 * Obtiene el error de un campo
 */
const getError = (fieldName) => {
  return errors[fieldName]?.[0]
}
</script>
