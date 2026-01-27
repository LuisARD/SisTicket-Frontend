# SisTicket - Sistema de Gestión de Solicitudes

## Descripción del Proyecto

SisTicket es una aplicación web moderna para la gestión integral de solicitudes (tickets) en una organización. Permite a usuarios de diferentes roles crear, asignar, seguir y resolver solicitudes de forma eficiente.

El sistema está diseñado con una arquitectura de dos capas:
- Frontend: Vue 3 con Vite (aplicación que ves aquí)
- Backend: .NET 10 con API REST

---

## Características Principales

### Sistema de Roles y Permisos
- Solicitante: Crear y ver sus propias solicitudes, comentar y editar si están en estado Nueva
- Gestor: Ver solicitudes de su área, asignarse a ellas, cambiar estado, comentar y rechazar
- Admin: Acceso a todas las solicitudes, gestión de catálogos, ver usuarios
- SuperAdmin: Control total del sistema, incluida gestión de usuarios

### Gestión de Solicitudes
- Crear solicitudes con tipos personalizados
- Cambiar estados (Nueva → En Proceso → Resuelta → Cerrada)
- Rechazar solicitudes con comentario obligatorio
- Asignar solicitudes a gestores o autoasignarse
- Ver detalles completos de cada solicitud
- Agregar archivos adjuntos

### Sistema de Comentarios
- Comentar en solicitudes con identificación de rol
- Eliminar comentarios según permisos
- Histórico de comentarios con fecha y usuario

### Filtros y Búsqueda
- Filtrar por estado, prioridad, área, fechas
- Búsqueda de texto en solicitudes
- Estadísticas en tiempo real (total, activas, inactivas, etc.)

### Exportación
- Descargar solicitudes a Excel (.xlsx)
- Formato profesional con columnas ajustadas
- Disponible solo para Admin y SuperAdmin

### Gestión de Catálogos
- Administración de Áreas, Tipos de Solicitud y Prioridades
- Validación para no eliminar catálogos con solicitudes activas
- Solo para Admin y SuperAdmin

### Gestión de Usuarios
- Crear, editar, activar/desactivar usuarios
- Asignar roles y áreas
- Validación para no desactivar gestores con solicitudes pendientes
- Eliminar usuarios inactivos

---

## Tecnologías Utilizadas

### Frontend
Tecnologia
- Vue  3.5.26  Framework JavaScript reactivo 
- Vite  7.3.0 Build tool y dev server 
- Tailwind CSS  4.1.18  Framework de estilos CSS 
 - Vue Router  4.6.4  Enrutamiento de la aplicación 
- Axios  1.13.2  Cliente HTTP para APIs 
 - XLSX  0.18.5  Exportación a Excel 

### Herramientas de Desarrollo
- Node.js: v20.19.0 o superior
- npm: Gestor de paquetes

---

## Requisitos para Ejecutar el Proyecto

### En tu Computador
1. Node.js v20.19.0 o superior
2. npm (viene incluido con Node.js)
3. Backend ejecutándose en http://localhost:5146
4. Git (opcional, para clonar el repositorio)

### Verificar requisitos
```bash
node --version  # Debe mostrar v20.19.0 o superior
npm --version   # Debe mostrar versión 10.x o superior
```

---

## Instalación y Configuración

### Paso 1: Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd SisTicket-Frontend/SisTicket
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Verificar Configuración del Backend
En src/services/api.js, asegúrate que la URL del backend sea correcta:
- URL esperada: http://localhost:5146/api

### Paso 4: Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación se abrirá en http://localhost:5173

### Paso 5: Compilar para Producción
```bash
npm run build
```

Esto genera una carpeta dist/ con los archivos optimizados.

---

## Estructura del Proyecto

```
src/
├── views/              # Páginas principales (Login, Solicitudes, Usuarios, etc.)
├── components/         # Componentes reutilizables (Modales, Tablas, Navbar)
├── composables/        # Lógica compartida (useAuth, useSolicitudes, etc.)
├── services/           # Servicios de API y exportación
├── stores/             # Estado global (Pinia/Vuex alternativa)
├── router/             # Configuración de rutas
├── utils/              # Funciones auxiliares
├── constants/          # Constantes de la aplicación
└── assets/             # Imágenes e iconos
```

---

## Flujo de Autenticación

1. Usuario ingresa credenciales en el login
2. Backend autentica y retorna cookie HTTP-Only con token JWT
3. Frontend guarda datos del usuario en el store
4. Axios envía automáticamente la cookie en cada petición
5. Al logout, se llama POST /api/auth/logout y se limpia el estado

---

## Estados de Solicitudes

1. Nueva: Solicitud creada, sin gestor asignado
2. En Proceso: Asignada a un gestor
3. Resuelta: Gestor completó el trabajo
4. Rechazada: Solicitud rechazada (estado final)
5. Cerrada: Solicitud cerrada (estado final)

---

## Permisos por Rol

### Solicitante
- Ver sus solicitudes
- Crear solicitudes
- Editar solicitudes en estado Nueva
- Comentar en solicitudes asignadas a gestor
- Eliminar sus propios comentarios

### Gestor
- Ver solicitudes de su área
- Asignarse a solicitudes sin gestor
- Cambiar estado a Resuelta o Rechazada
- Comentar (solo si está asignado)
- No puede eliminar comentarios

### Admin
- Ver todas las solicitudes
- Cambiar cualquier estado
- Asignar gestores
- Gestionar catálogos
- Eliminar comentarios (excepto SuperAdmin)
- No puede gestionar usuarios

### SuperAdmin
- Control total del sistema
- Gestionar usuarios (crear, activar, desactivar, eliminar)
- Todos los permisos de Admin

---

## Vistas Principales

### Login
- Autenticación de usuarios
- Validación de credenciales
- Guardado automático de sesión

### Mis Solicitudes
- Vista personal de solicitudes del solicitante
- Filtros por estado, prioridad y fechas
- Edición de solicitudes en estado Nueva
- Creación de nuevas solicitudes

### Bandeja de Área
- Para Gestores: Solicitudes asignadas a ellos
- Para Admins: Todas las solicitudes del sistema
- Filtros avanzados (estado, prioridad, área, fechas)
- Asignación de solicitudes a gestores
- Cambio de estados
- Exportación a Excel

### Detalle de Solicitud
- Información completa de la solicitud
- Historial de comentarios
- Adjuntos disponibles
- Cambio de estado y asignación
- Panel de acciones según rol

### Catálogos
- Gestión de Áreas
- Gestión de Prioridades
- Gestión de Tipos de Solicitud
- CRUD completo (crear, leer, actualizar, eliminar)
- Validaciones de uso

### Usuarios (SuperAdmin)
- Listado de usuarios del sistema
- Crear nuevos usuarios
- Editar información de usuarios
- Activar/Desactivar usuarios
- Eliminar usuarios inactivos
- Filtros por rol y estado

---

## Funcionalidades Especiales

### Exportación a Excel
- Descarga todas las solicitudes en formato Excel (.xlsx)
- Columnas: Número, Título, Descripción, Solicitante, Área, Tipo, Prioridad, Estado, Gestor, Fecha Creación
- Formato profesional con encabezados estilizados
- Disponible solo para Admin y SuperAdmin

### Sistema de Comentarios
- Los comentarios muestran el rol del usuario (Solicitante, Gestor, Admin, SuperAdmin)
- Eliminación restringida según permisos
- En estados terminales (Rechazada, Cerrada), solo SuperAdmin puede eliminar

### Validaciones de Negocio
- No se puede desactivar un Gestor con solicitudes activas
- No se puede eliminar un catálogo con solicitudes asociadas
- El rechazo de solicitud requiere comentario obligatorio
- Autoasignación de solicitudes para gestores

### Estadísticas
- Contador de solicitudes por estado
- Cálculo en tiempo real según filtros aplicados
- Panel de resumen visual

---

## Solución de Problemas

### La aplicación no conecta con el backend
- Verifica que el backend esté ejecutándose en http://localhost:5146
- Revisa la consola del navegador (F12) para ver errores
- Comprueba que la URL en src/services/api.js sea correcta

### Error "No match for" al navegar
- Limpia el cache del navegador (Ctrl+Shift+Delete)
- Recarga la página (Ctrl+Shift+R)

### Problemas con estilos de Tailwind
- Asegúrate de que npm install se ejecutó correctamente
- Reinicia el servidor de desarrollo (npm run dev)

### Las cookies no se guardan
- Verifica que el backend envíe headers de CORS correctamente
- Las cookies deben ser HTTP-Only y Secure en producción
- Asegúrate que credentials: 'include' está configurado en axios

### El botón de exportar no aparece
- Verifica que estés logueado como Admin o SuperAdmin
- Asegúrate que la librería xlsx se instaló correctamente (npm install xlsx)

---

Si necesitas configurar la aplicación para un servidor diferente, edita:
- src/services/api.js - URL base de la API

---
### CAMBIOS RECIENTES
- Se agrego boton de notificaciones para roles de gestor, admin, superadmin
- Se agregaron logs que se registran todo a la BD (No visibles aqui)
- Se agrego boton para resetear contraseña
- Se fortalecieron las contraseñas
- Cambiar contraseña obligatorio con primer login del usuario.
- Vista de Reportes con graficos y top gestores.
- Exportar datos PDF y Excel
- Validaciones de tamaño y tipo en carga de archivos en solicitudes
- Contraseña por Default: "Password@88"
