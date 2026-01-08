import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import SolicitudesView from '../views/SolicitudesView.vue'
import SolicitudDetalleView from '../views/SolicitudDetalleView.vue'
import MisSolicitudesView from '../views/MisSolicitudesView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import CatalogosView from '../views/CatalogosView.vue'
import { authStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    redirect: '/solicitudes'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitudes',
    name: 'BandejaArea',
    component: SolicitudesView,
    meta: { requiresAuth: true, forbiddenRoles: [1] } // Solicitante NO puede ver
  },
  {
    path: '/detalle-solicitud/:id',
    name: 'SolicitudDetalle',
    component: SolicitudDetalleView,
    meta: { requiresAuth: true, forbiddenRoles: [1] } // Solicitante NO puede ver
  },
  {
    path: '/mis-solicitudes',
    name: 'MisSolicitudes',
    component: MisSolicitudesView,
    meta: { requiresAuth: true, forbiddenRoles: [2, 3, 4] } // Gestor, Admin, SuperAdmin NO pueden ver
  },
  {
    path: '/catalogos',
    name: 'Catalogos',
    component: CatalogosView,
    meta: { requiresAuth: true, forbiddenRoles: [1] } // Solicitante NO puede ver
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true, requiresSuperAdmin: true } // Solo SuperAdmin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard para proteger rutas
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresSuperAdmin = to.meta.requiresSuperAdmin
  const forbiddenRoles = to.meta.forbiddenRoles || []
  const rol = authStore.user?.rol
  const desdeMinsSolicitudes = to.query.desde === 'misSolicitudes'

  // 1. Verificar autenticación
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // 2. Si está autenticado y va al login, redirigir a solicitudes
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/solicitudes')
    return
  }

  // 3. Verificar si el rol está en la lista de prohibidos
  // Excepción: Los Solicitantes pueden ver detalle de solicitud si viene desde Mis Solicitudes
  if (forbiddenRoles.includes(rol)) {
    if (rol === 1 && to.path.startsWith('/detalle-solicitud/') && desdeMinsSolicitudes) {
      next()
      return
    }
    next('/solicitudes')
    return
  }

  // 4. Verificar si requiere SuperAdmin
  if (requiresSuperAdmin) {
    if (rol === 4 || rol === 'SuperAdmin') {
      next()
    } else {
      next('/solicitudes')
    }
    return
  }

  next()
})

export default router
