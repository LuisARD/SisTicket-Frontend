import axios from 'axios'

// Detectar si estamos en desarrollo
const isDevelopment = import.meta.env.DEV
const backendUrl = isDevelopment ? 'http://localhost:5146/api' : import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de requests
api.interceptors.request.use(
  config => {
    console.log('Request:', config.method?.toUpperCase(), config.baseURL + config.url)
    return config
  },
  error => Promise.reject(error)
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data)
    return response
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message)
    if (error.response?.status === 401) {
      // Solo redirigir si el usuario estaba autenticado (sesión expirada)
      // No hacer reload en la página de login (credenciales incorrectas)
      const currentPath = window.location.pathname
      if (currentPath !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
