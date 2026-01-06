// Estados de Solicitud
export const ESTADOS_SOLICITUD = {
  NUEVA: 1,
  EN_PROCESO: 2,
  RESUELTA: 3,
  RECHAZADA: 4,
  CERRADA: 5
}

export const ESTADO_LABELS = {
  1: 'Nueva',
  2: 'En Proceso',
  3: 'Resuelta',
  4: 'Rechazada',
  5: 'Cerrada'
}

export const ESTADO_COLORS = {
  1: 'bg-purple-100 text-purple-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-green-100 text-green-800',
  4: 'bg-red-100 text-red-800',
  5: 'bg-gray-100 text-gray-800'
}

// Prioridades
export const PRIORIDADES = {
  BAJA: 1,
  MEDIA: 2,
  ALTA: 3,
  CRITICA: 4
}

export const PRIORIDAD_LABELS = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
  4: 'Crítica'
}

export const PRIORIDAD_COLORS = {
  1: 'bg-blue-500',
  2: 'bg-yellow-500',
  3: 'bg-orange-500',
  4: 'bg-red-600'
}

// Roles
export const ROLES = {
  SOLICITANTE: 1,
  GESTOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4
}

export const ROLE_LABELS = {
  1: 'Solicitante',
  2: 'Gestor',
  3: 'Admin',
  4: 'Super Admin'
}

export const ROLE_COLORS = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-orange-100 text-orange-800',
  4: 'bg-red-100 text-red-800'
}

// Estados de Usuario
export const USUARIO_ESTADOS = {
  ACTIVO: true,
  INACTIVO: false
}

// Validaciones
export const VALIDACIONES = {
  NOMBRE_MIN: 3,
  NOMBRE_MAX: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_MIN: 3,
  USERNAME_MAX: 50
}

// Mensajes
export const MENSAJES = {
  CONFIRMACION_ELIMINAR: '¿Estás seguro de que deseas eliminar este usuario?',
  USUARIO_CREADO: 'Usuario creado exitosamente',
  USUARIO_ACTUALIZADO: 'Usuario actualizado exitosamente',
  USUARIO_ELIMINADO: 'Usuario eliminado exitosamente',
  ERROR_CARGAR_USUARIOS: 'Error al cargar los usuarios',
  ERROR_CREAR_USUARIO: 'Error al crear el usuario',
  ERROR_ACTUALIZAR_USUARIO: 'Error al actualizar el usuario',
  ERROR_ELIMINAR_USUARIO: 'Error al eliminar el usuario'
}

// Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    LOGOUT: '/Auth/logout',
    ME: '/Auth/me'
  },
  SOLICITUDES: {
    LIST: '/Solicitudes',
    GET: (id) => `/Solicitudes/${id}`,
    CREATE: '/Solicitudes',
    UPDATE: (id) => `/Solicitudes/${id}`,
    DELETE: (id) => `/Solicitudes/${id}`,
    CAMBIAR_ESTADO: (id) => `/Solicitudes/${id}/cambiar-estado`,
    ASIGNAR_GESTOR: (id) => `/Solicitudes/${id}/asignar-gestor`,
    COMENTARIOS: (id) => `/Solicitudes/${id}/comentarios`,
    CREAR_COMENTARIO: (id) => `/Solicitudes/${id}/comentarios`
  },
  USUARIOS: {
    LIST: '/usuarios',
    GET: (id) => `/usuarios/${id}`,
    CREATE: '/usuarios',
    UPDATE: (id) => `/usuarios/${id}`,
    DELETE: (id) => `/usuarios/${id}`,
    POR_AREA: (areaId) => `/usuarios/area/${areaId}`,
    GESTORES_AREA: (areaId) => `/usuarios/gestores/area/${areaId}`
  },
  CATALOGOS: {
    AREAS: '/Catalogos/areas',
    PRIORIDADES: '/Catalogos/prioridades',
    TIPOS_SOLICITUD: '/Catalogos/tipos-solicitud'
  }
}
