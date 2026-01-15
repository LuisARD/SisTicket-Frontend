import { ref, computed, onMounted } from 'vue'
import solicitudesService from '../services/solicitudesService'
import { usuariosService } from '../services/usuariosService'
import { mapearEstadoANumero } from '../utils/estadoMapper'

export const useReportes = () => {
  const solicitudes = ref([])
  const gestores = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Cargar todas las solicitudes del sistema
  const cargarSolicitudes = async () => {
    try {
      const data = await solicitudesService.getSolicitudes()
      solicitudes.value = Array.isArray(data) ? data : []
    } catch (err) {
      console.error('Error al cargar solicitudes para reportes:', err)
      error.value = 'Error al cargar datos de solicitudes'
      solicitudes.value = []
    }
  }

  // Cargar todos los gestores
  const cargarGestores = async () => {
    try {
      const data = await usuariosService.getUsuarios()
      // Filtrar solo los gestores (rol 2)
      gestores.value = Array.isArray(data) 
        ? data.filter(u => u.idRol === 2 || u.rol === 'Gestor')
        : []
    } catch (err) {
      console.error('Error al cargar gestores:', err)
      gestores.value = []
    }
  }

  // Cargar ambos al mismo tiempo
  const cargarDatos = async () => {
    isLoading.value = true
    error.value = null
    try {
      await Promise.all([cargarSolicitudes(), cargarGestores()])
    } finally {
      isLoading.value = false
    }
  }

  // Estadísticas generales
  const estadisticas = computed(() => {
    const stats = {
      total: solicitudes.value.length,
      resueltas: 0,
      cerradas: 0,
      rechazadas: 0,
      enProceso: 0,
      nuevas: 0
    }

    solicitudes.value.forEach((s) => {
      const estado = mapearEstadoANumero(s.estado)
      
      switch (estado) {
        case 1: // Nueva
          stats.nuevas++
          break
        case 2: // En Proceso
          stats.enProceso++
          break
        case 3: // Resuelta
          stats.resueltas++
          break
        case 4: // Rechazada
          stats.rechazadas++
          break
        case 5: // Cerrada
          stats.cerradas++
          break
      }
    })

    return stats
  })

  // Datos para gráfico de estados
  const datosEstados = computed(() => {
    return {
      labels: ['Nueva', 'En Proceso', 'Resuelta', 'Rechazada', 'Cerrada'],
      datasets: [
        {
          label: 'Cantidad de Solicitudes',
          data: [
            estadisticas.value.nuevas,
            estadisticas.value.enProceso,
            estadisticas.value.resueltas,
            estadisticas.value.rechazadas,
            estadisticas.value.cerradas
          ],
          backgroundColor: [
            '#a855f7',
            '#3b82f6',
            '#10b981',
            '#ef4444',
            '#6b7280'
          ],
          borderColor: [
            '#9333ea',
            '#1e40af',
            '#059669',
            '#dc2626',
            '#4b5563'
          ],
          borderWidth: 2
        }
      ]
    }
  })

  // Datos para gráfico de Resueltas vs Rechazadas
  const datosResuelvasVsRechazadas = computed(() => {
    return {
      labels: ['Resueltas', 'Cerradas', 'Rechazadas'],
      datasets: [
        {
          label: 'Cantidad',
          data: [
            estadisticas.value.resueltas,
            estadisticas.value.cerradas,
            estadisticas.value.rechazadas
          ],
          backgroundColor: [
            '#10b981',
            '#3b82f6',
            '#ef4444'
          ],
          borderColor: [
            '#059669',
            '#1e40af',
            '#dc2626'
          ],
          borderWidth: 2
        }
      ]
    }
  })

  // Datos para gráfico de áreas
  const solicitudesPorArea = computed(() => {
    const areaMap = {}

    solicitudes.value.forEach((s) => {
      const area = s.areaNombre || 'Sin Área'
      if (!areaMap[area]) {
        areaMap[area] = 0
      }
      areaMap[area]++
    })

    return Object.entries(areaMap).map(([area, cantidad]) => ({
      area,
      cantidad
    }))
  })

  // Datos para gráfico de áreas - mejorado
  const datosAreas = computed(() => {
    const areas = solicitudesPorArea.value
    const colores = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#a855f7',
      '#06b6d4',
      '#ec4899',
      '#8b5cf6',
      '#14b8a6',
      '#f43f5e'
    ]

    return {
      labels: areas.length > 0 ? areas.map((a) => a.area) : ['Sin datos'],
      datasets: [
        {
          label: 'Solicitudes',
          data: areas.length > 0 ? areas.map((a) => a.cantidad) : [0],
          backgroundColor: areas.length > 0 
            ? colores.slice(0, areas.length)
            : ['#e5e7eb'],
          borderColor: areas.length > 0
            ? colores.slice(0, areas.length).map(c => 
                c.replace(/[\d.]/g, (d, i) => i === 0 ? Math.max(0, parseInt(d) - 20) : d)
              )
            : ['#9ca3af'],
          borderWidth: 2
        }
      ]
    }
  })

  // Solicitudes por gestor (Cerradas y Rechazadas)
  const solicitudesPorGestor = computed(() => {
    // Crear un mapa con todos los gestores inicializados en 0 usando ID
    const gestorMap = {}
    
    gestores.value.forEach((g) => {
      gestorMap[g.id] = {
        id: g.id,
        gestor: g.nombre || g.nombreUsuario || 'Sin nombre',
        cerradas: 0,
        rechazadas: 0
      }
    })

    // Contar las solicitudes cerradas y rechazadas por ID de gestor
    solicitudes.value.forEach((s) => {
      const gestorId = s.gestorAsignadoId
      
      // Solo contar si el gestor existe en nuestro mapa
      if (gestorId && gestorMap[gestorId]) {
        if (s.estado === 'Cerrada') {
          gestorMap[gestorId].cerradas++
        } else if (s.estado === 'Rechazada') {
          gestorMap[gestorId].rechazadas++
        }
      }
    })

    const resultado = Object.values(gestorMap).sort((a, b) => (b.cerradas + b.rechazadas) - (a.cerradas + a.rechazadas))
    return resultado
  })

  // Datos para gráfico de gestores - Top de gestores
  const datosGestores = computed(() => {
    const gestores = solicitudesPorGestor.value
      .map(g => ({
        ...g,
        total: g.cerradas + g.rechazadas
      }))
      .sort((a, b) => b.total - a.total)

    return {
      labels: gestores.length > 0 ? gestores.map((g) => g.gestor) : ['Sin gestores'],
      datasets: [
        {
          label: 'Solicitudes Completadas (Cerradas + Rechazadas)',
          data: gestores.length > 0 ? gestores.map((g) => g.total) : [0],
          backgroundColor: '#6366f1',
          borderColor: '#4f46e5',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    }
  })

  // Cargar datos al montar
  onMounted(() => {
    cargarDatos()
  })

  return {
    solicitudes,
    gestores,
    isLoading,
    error,
    estadisticas,
    datosEstados,
    datosResuelvasVsRechazadas,
    datosAreas,
    datosGestores,
    solicitudesPorArea,
    solicitudesPorGestor,
    cargarDatos,
    cargarSolicitudes
  }
}
