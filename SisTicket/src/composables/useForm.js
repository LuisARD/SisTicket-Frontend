import { ref } from 'vue'

/**
 * Composable para manejar formularios con validación
 * @param {Object} initialData - Datos iniciales del formulario
 * @param {Function} onSubmit - Función a ejecutar al validar
 * @returns {Object} - Estado del formulario y métodos
 */
export function useForm(initialData = {}, onSubmit = null) {
  const formData = ref({ ...initialData })
  const errors = ref({})
  const isSubmitting = ref(false)
  const touched = ref({})

  /**
   * Valida un campo individual
   */
  const validateField = (fieldName, value, rules = {}) => {
    const fieldErrors = []

    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push('Este campo es requerido')
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(`Mínimo ${rules.minLength} caracteres`)
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      fieldErrors.push(`Máximo ${rules.maxLength} caracteres`)
    }

    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        fieldErrors.push('Email inválido')
      }
    }

    if (rules.custom && value) {
      const customError = rules.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[fieldName] = fieldErrors
    } else {
      delete errors.value[fieldName]
    }

    return fieldErrors.length === 0
  }

  /**
   * Valida el formulario completo
   */
  const validateForm = (validationRules = {}) => {
    errors.value = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const rules = validationRules[fieldName]
      const value = formData.value[fieldName]
      if (!validateField(fieldName, value, rules)) {
        isValid = false
      }
    })

    return isValid
  }

  /**
   * Maneja el cambio de un campo
   */
  const handleFieldChange = (fieldName, value) => {
    formData.value[fieldName] = value
    touched.value[fieldName] = true
  }

  /**
   * Envía el formulario
   */
  const submitForm = async (validationRules = {}) => {
    if (!validateForm(validationRules)) {
      return false
    }

    if (!onSubmit) {
      return false
    }

    try {
      isSubmitting.value = true
      await onSubmit(formData.value)
      return true
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Resetea el formulario
   */
  const resetForm = (newInitialData = null) => {
    formData.value = newInitialData ? { ...newInitialData } : { ...initialData }
    errors.value = {}
    touched.value = {}
  }

  /**
   * Obtiene el error de un campo
   */
  const getFieldError = (fieldName) => {
    return touched.value[fieldName] ? errors.value[fieldName]?.[0] : null
  }

  /**
   * Verifica si un campo tiene error
   */
  const hasFieldError = (fieldName) => {
    return touched.value[fieldName] && fieldName in errors.value
  }

  return {
    formData,
    errors,
    isSubmitting,
    touched,
    validateField,
    validateForm,
    handleFieldChange,
    submitForm,
    resetForm,
    getFieldError,
    hasFieldError
  }
}
