<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-gray-400 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <!-- Modal -->
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-bold">{{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}</h2>
          <button @click="cerrar" class="text-white hover:text-gray-200 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mensaje de Error -->
        <div v-if="error" class="m-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">
          {{ error }}
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardar" class="p-6 space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.nombre"
              type="text"
              placeholder="Juan"
              @blur="validarCampo('nombre')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('nombre')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            />
            <p v-if="getError('nombre')" class="text-sm text-red-500 mt-1">{{ getError('nombre') }}</p>
          </div>

          <!-- Apellido -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Apellido
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.apellido"
              type="text"
              placeholder="García"
              @blur="validarCampo('apellido')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('apellido')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            />
            <p v-if="getError('apellido')" class="text-sm text-red-500 mt-1">{{ getError('apellido') }}</p>
          </div>

          <!-- Nombre de Usuario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.nombreUsuario"
              type="text"
              placeholder="jgarcia"
              @blur="validarCampo('nombreUsuario')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('nombreUsuario')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            />
            <p v-if="getError('nombreUsuario')" class="text-sm text-red-500 mt-1">{{ getError('nombreUsuario') }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="juan@example.com"
              @blur="validarCampo('email')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('email')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            />
            <p v-if="getError('email')" class="text-sm text-red-500 mt-1">{{ getError('email') }}</p>
          </div>

          <!-- Restablecer Contraseña (Solo en edición - Expandible) -->
          <div v-if="isEditing" class="border-t-2 border-gray-200 pt-4 mt-4">
            <button
              type="button"
              @click="mostrarSeccionRestablecer = !mostrarSeccionRestablecer"
              class="w-full flex items-center justify-between px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition border border-orange-200"
            >
              <span class="text-sm sm:text-base font-medium text-orange-800">Restablecer Contraseña</span>
              <svg 
                :class="['w-5 h-5 text-orange-600 transition-transform', mostrarSeccionRestablecer ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            <!-- Contenido expandible -->
            <transition name="expand">
              <div v-if="mostrarSeccionRestablecer" class="mt-3 p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-3">
                <p class="text-sm text-orange-800">
                  Restablece la contraseña del usuario a la contraseña por defecto. El usuario deberá cambiarla en su próximo inicio de sesión.
                </p>
                <button
                  type="button"
                  @click="mostrarConfirmacionRestablecer = true"
                  :disabled="isSubmitting || isRestableciendo"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Restablecer Contraseña</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Rol
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.rol"
              @blur="validarCampo('rol')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('rol')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            >
              <option value="">Selecciona un rol</option>
              <option value="1">Solicitante</option>
              <option value="2">Gestor</option>
              <option value="3">Admin</option>
              <option value="4">Super Admin</option>
            </select>
            <p v-if="getError('rol')" class="text-sm text-red-500 mt-1">{{ getError('rol') }}</p>
          </div>

          <!-- Área (solo requerida para Gestor) -->
          <div v-if="formData.rol === '2'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Área
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.areaId"
              @blur="validarCampo('areaId')"
              :class="[
                'w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition',
                hasError('areaId')
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-indigo-600'
              ]"
            >
              <option value="">-- Selecciona un área --</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">
                {{ area.nombre }}
              </option>
            </select>
            <p v-if="getError('areaId')" class="text-sm text-red-500 mt-1">{{ getError('areaId') }}</p>
          </div>

          <!-- Botones -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-6">
            <button
              type="button"
              @click="cerrar"
              class="flex-1 px-4 py-2.5 sm:py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm sm:text-base"
            >
              {{ isSubmitting ? '⏳ Guardando...' : isEditing ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <!-- Modal de Confirmación para Restablecer Contraseña -->
  <Transition name="fade">
    <div v-if="mostrarConfirmacionRestablecer" class="fixed inset-0 bg-gray-400 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4">
          <h3 class="text-lg font-bold">Restablecer Contraseña</h3>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          <p class="text-gray-700">
            ¿Estás seguro de que deseas restablecer la contraseña de <strong>{{ props.usuario?.nombre }} {{ props.usuario?.apellido }}</strong> a la contraseña por defecto?
          </p>
          <p class="text-sm text-gray-500">
            El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
          </p>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            @click="mostrarConfirmacionRestablecer = false"
            :disabled="isRestableciendo"
            class="flex-1 px-4 py-2.5 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="restablecerPassword"
            :disabled="isRestableciendo"
            class="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
          >
            {{ isRestableciendo ? 'Restableciendo...' : 'Sí, Restablecer' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usuariosService } from '../services/usuariosService'
import { MENSAJES } from '../constants/app.constants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  usuario: {
    type: Object,
    default: null
  },
  areas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const error = ref(null)
const touched = ref({})
const errors = ref({})
const mostrarConfirmacionRestablecer = ref(false)
const mostrarSeccionRestablecer = ref(false)
const isRestableciendo = ref(false)

const isEditing = computed(() => !!props.usuario?.id)

const formData = ref({
  nombre: '',
  apellido: '',
  nombreUsuario: '',
  email: '',
  rol: '',
  areaId: ''
})

/**
 * Obtiene las reglas de validación dinámicamente
 */
const getValidationRules = () => {
  if (isEditing.value) {
    // Al editar: NO hay campos requeridos, todo es opcional
    // Solo validamos formato si el campo tiene contenido
    return {
      nombre: { required: false, minLength: 2, maxLength: 100 },
      apellido: { required: false, minLength: 2, maxLength: 100 },
      nombreUsuario: { required: false, minLength: 3, maxLength: 50 },
      email: { required: false, email: true },
      rol: { required: false },
      areaId: { required: false }
    }
  } else {
    // Al crear: campos requeridos
    // areaId es requerido solo si el rol es Gestor (2)
    const areaRequired = formData.value.rol === '2'
    return {
      nombre: { required: true, minLength: 2, maxLength: 100 },
      apellido: { required: true, minLength: 2, maxLength: 100 },
      nombreUsuario: { required: true, minLength: 3, maxLength: 50 },
      email: { required: true, email: true },
      rol: { required: true },
      areaId: { required: areaRequired }
    }
  }
}

/**
 * Carga los datos del usuario a editar
 */
watch(
  () => props.usuario,
  (usuario) => {
    if (usuario) {
      formData.value = {
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        nombreUsuario: usuario.nombreUsuario || '',
        email: usuario.email || '',
        rol: usuario.rol ? getRolId(usuario.rol) : '',
        areaId: usuario.areaId || ''
      }
    } else {
      formData.value = {
        nombre: '',
        apellido: '',
        nombreUsuario: '',
        email: '',
        rol: '',
        areaId: ''
      }
    }
    touched.value = {}
    errors.value = {}
    error.value = null
    mostrarSeccionRestablecer.value = false
  }
)

/**
 * Convierte rol string a ID
 */
const getRolId = (rol) => {
  const rolMap = {
    'Solicitante': '1',
    'Gestor': '2',
    'Admin': '3',
    'SuperAdmin': '4'
  }
  return rolMap[rol] || ''
}

/**
 * Valida un campo individual
 */
const validarCampo = (fieldName) => {
  touched.value[fieldName] = true
  const validationRules = getValidationRules()
  const rules = validationRules[fieldName]
  const value = formData.value[fieldName]
  const fieldErrors = []

  // Si es requerido y está vacío
  if (rules.required && (!value || value.toString().trim() === '')) {
    fieldErrors.push('Este campo es requerido')
  }

  // Solo validar formato/longitud si tiene contenido
  if (value && value.toString().trim() !== '') {
    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Mínimo ${rules.minLength} caracteres`)
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Máximo ${rules.maxLength} caracteres`)
    }

    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        fieldErrors.push('Email inválido')
      }
    }
  }

  if (fieldErrors.length > 0) {
    errors.value[fieldName] = fieldErrors
  } else {
    delete errors.value[fieldName]
  }
}

/**
 * Valida el formulario completo
 */
const validarFormulario = () => {
  errors.value = {}
  const validationRules = getValidationRules()

  Object.keys(validationRules).forEach((fieldName) => {
    validarCampo(fieldName)
  })

  return Object.keys(errors.value).length === 0
}

/**
 * Obtiene el error de un campo
 */
const getError = (fieldName) => {
  return touched.value[fieldName] ? errors.value[fieldName]?.[0] : null
}

/**
 * Verifica si un campo tiene error
 */
const hasError = (fieldName) => {
  return touched.value[fieldName] && fieldName in errors.value
}

/**
 * Guarda el usuario
 */
const guardar = async () => {
  if (!validarFormulario()) {
    return
  }

  try {
    isSubmitting.value = true
    error.value = null

    if (isEditing.value) {
      // Editar: solo enviar campos que tengan valor (no vacíos)
      const datosActualizar = {}

      if (formData.value.nombre?.trim()) datosActualizar.nombre = formData.value.nombre
      if (formData.value.apellido?.trim()) datosActualizar.apellido = formData.value.apellido
      if (formData.value.nombreUsuario?.trim()) datosActualizar.nombreUsuario = formData.value.nombreUsuario
      if (formData.value.email?.trim()) datosActualizar.email = formData.value.email
      
      if (formData.value.rol) datosActualizar.rol = parseInt(formData.value.rol)
      // areaId puede ser vacío (desasignar área), pero solo enviar si estaba asignado
      if (formData.value.areaId) datosActualizar.areaId = parseInt(formData.value.areaId)

      await usuariosService.updateUsuario(props.usuario.id, datosActualizar)
      emit('success', { action: 'update', data: datosActualizar })
    } else {
      // Crear: enviar todos los datos requeridos (SIN contraseña - se asigna "Password@88" en backend)
      const datosCrear = {
        nombre: formData.value.nombre,
        apellido: formData.value.apellido,
        nombreUsuario: formData.value.nombreUsuario,
        email: formData.value.email,
        rol: parseInt(formData.value.rol),
        ...(formData.value.areaId && { areaId: parseInt(formData.value.areaId) })
      }

      await usuariosService.createUsuario(datosCrear)
      emit('success', { action: 'create', data: datosCrear })
    }

    cerrar()
  } catch (err) {
    console.error('Error al guardar:', err)
    error.value = err.message || (isEditing.value ? 'Error al actualizar el usuario' : 'Error al crear el usuario')
  } finally {
    isSubmitting.value = false
  }
}

/**
 * Restablece la contraseña del usuario
 */
const restablecerPassword = async () => {
  try {
    isRestableciendo.value = true
    error.value = null
    
    await usuariosService.restablecerPassword(props.usuario.id)
    
    // Cerrar modal de confirmación
    mostrarConfirmacionRestablecer.value = false
    
    // Mostrar éxito
    emit('success', { 
      action: 'restablecer-password', 
      data: { 
        usuarioId: props.usuario.id,
        mensaje: 'Contraseña restablecida a Password@88'
      }
    })
    
    cerrar()
  } catch (err) {
    console.error('[UsuarioModal] Error al restablecer contraseña:', err)
    error.value = err.message || 'Error al restablecer la contraseña'
  } finally {
    isRestableciendo.value = false
  }
}

/**
 * Cierra el modal
 */
const cerrar = () => {
  emit('close')
}
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
