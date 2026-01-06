// Mapeo bidireccional de estados
export const MAPEO_ESTADOS = {
  // Nombre a número
  nombres: {
    'Nueva': 1,
    'EnProceso': 2,
    'En Proceso': 2,
    'Resuelta': 3,
    'Rechazada': 4,
    'Cerrada': 5,
    'Cancelada': 5
  },
  // Número a nombre
  numeros: {
    1: 'Nueva',
    2: 'En Proceso',
    3: 'Resuelta',
    4: 'Rechazada',
    5: 'Cerrada'
  }
}

/**
 * Convierte un estado (nombre, número o string) a su número correspondiente
 * @param {string|number} estado - El estado a convertir
 * @returns {number|null} El número del estado o null si no es válido
 */
export const mapearEstadoANumero = (estado) => {
  if (!estado) return null
  
  // Si ya es número, devolverlo
  if (typeof estado === 'number') return estado
  
  // Si es string, mapear por nombre
  if (typeof estado === 'string') {
    return MAPEO_ESTADOS.nombres[estado] || null
  }
  
  return null
}

/**
 * Convierte un número de estado a su nombre correspondiente
 * @param {number|string} estadoNum - El número del estado
 * @returns {string} El nombre del estado o 'Desconocido'
 */
export const mapearEstadoANombre = (estadoNum) => {
  const num = typeof estadoNum === 'string' ? parseInt(estadoNum) : estadoNum
  return MAPEO_ESTADOS.numeros[num] || 'Desconocido'
}
