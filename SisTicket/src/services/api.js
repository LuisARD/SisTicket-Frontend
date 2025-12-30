import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5146/api',
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
      // Redirigir a login si no está autenticado
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
