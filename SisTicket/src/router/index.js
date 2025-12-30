import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import SolicitudesView from '../views/SolicitudesView.vue'
import SolicitudDetalleView from '../views/SolicitudDetalleView.vue'
import MisSolicitudesView from '../views/MisSolicitudesView.vue'
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
    name: 'Solicitudes',
    component: SolicitudesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitudes/:id',
    name: 'SolicitudDetalle',
    component: SolicitudDetalleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-solicitudes',
    name: 'MisSolicitudes',
    component: MisSolicitudesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/catalogos',
    name: 'Catalogos',
    redirect: '/catalogos/areas',
    meta: { requiresAuth: true }
  },
  {
    path: '/bandeja-area',
    name: 'BandejaArea',
    redirect: '/solicitudes',
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    redirect: '/usuarios/lista',
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard para proteger rutas
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/solicitudes')
  } else {
    next()
  }
})

export default router
