<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Navbar -->
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header con Botón Exportar -->
      <div class="mb-8 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Reportes</h1>
          <p class="text-gray-600">Estadísticas y análisis de solicitudes del sistema</p>
        </div>
        
        <!-- Dropdown de Exportar -->
        <div class="relative">
          <button
            @click="mostrarDropdownExportar = !mostrarDropdownExportar"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
          
          <!-- Dropdown Menu -->
          <div
            v-if="mostrarDropdownExportar"
            @click.stop="mostrarDropdownExportar = false"
            class="fixed inset-0 z-40"
          />
          <div
            v-if="mostrarDropdownExportar"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <button
              @click="exportarExcel"
              class="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-2 text-gray-700 font-medium"
            >
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Excel
            </button>
            <button
              @click="exportarPDF"
              class="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-2 text-gray-700 font-medium border-t"
            >
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Exportar PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas Generales -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Total Solicitudes</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-800">{{ estadisticas.total }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Resueltas</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600">{{ estadisticas.resueltas }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Cerradas</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600">{{ estadisticas.cerradas }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">Rechazadas</p>
          <p class="text-2xl sm:text-3xl font-bold text-red-600">{{ estadisticas.rechazadas }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-600 mb-2">En Proceso</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600">{{ estadisticas.enProceso }}</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de Solicitudes por Estado -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h2>
          <div v-if="!isLoading" class="h-96">
            <Bar
              :data="datosEstados"
              :options="opcionesGraficos"
            />
          </div>
          <div v-else class="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <p class="text-gray-500">Cargando gráfico...</p>
          </div>
        </div>

        <!-- Gráfico de Solicitudes por Área -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Solicitudes por Área</h2>
          <div v-if="!isLoading && datosAreas.datasets[0].data.length > 0" class="h-96">
            <PolarArea
              :data="datosAreas"
              :options="opcionesGraficos"
            />
          </div>
          <div v-else class="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <p class="text-gray-500">{{ isLoading ? 'Cargando gráfico...' : 'Sin datos disponibles' }}</p>
          </div>
        </div>

        <!-- Gráfico de Solicitudes Resueltas vs Rechazadas -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Resueltas vs Rechazadas</h2>
          <div v-if="!isLoading" class="h-96">
            <Doughnut
              :data="datosResuelvasVsRechazadas"
              :options="opcionesGraficos"
            />
          </div>
          <div v-else class="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <p class="text-gray-500">Cargando gráfico...</p>
          </div>
        </div>

        <!-- Top de Gestores -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Top de Gestores</h2>
          <div v-if="!isLoading && solicitudesPorGestor.length > 0" class="overflow-y-auto" style="max-height: 350px">
            <table class="w-full text-xs">
              <thead class="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b-2 border-indigo-300 sticky top-0">
                <tr>
                  <th class="px-2 py-2 text-left font-bold text-indigo-900 w-8">#</th>
                  <th class="px-2 py-2 text-left font-bold text-indigo-900 flex-1">Gestor</th>
                  <th class="px-2 py-2 text-center font-bold text-green-700 w-12">✓</th>
                  <th class="px-2 py-2 text-center font-bold text-red-700 w-12">✗</th>
                  <th class="px-2 py-2 text-center font-bold text-indigo-900 w-12">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(gestor, index) in solicitudesPorGestor.slice(0, 10).map((g, i) => ({ ...g, posicion: i + 1 }))"
                  :key="gestor.id"
                  class="border-b border-gray-200 hover:bg-indigo-50 transition duration-150"
                >
                  <td class="px-2 py-2 text-center font-bold">
                    <span v-if="gestor.posicion === 1">🥇</span>
                    <span v-else-if="gestor.posicion === 2">🥈</span>
                    <span v-else-if="gestor.posicion === 3">🥉</span>
                    <span v-else class="text-gray-500">{{ gestor.posicion }}</span>
                  </td>
                  <td class="px-2 py-2 text-gray-800 font-medium truncate">{{ gestor.gestor }}</td>
                  <td class="px-2 py-2 text-center text-green-600 font-bold">{{ gestor.cerradas }}</td>
                  <td class="px-2 py-2 text-center text-red-600 font-bold">{{ gestor.rechazadas }}</td>
                  <td class="px-2 py-2 text-center font-bold text-indigo-700 bg-indigo-50 rounded">{{ gestor.cerradas + gestor.rechazadas }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p class="text-gray-500 text-sm">{{ isLoading ? 'Cargando datos...' : 'Sin gestores disponibles' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BottomNavBar -->
    <BottomNavBar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import BottomNavBar from '../components/BottomNavBar.vue'
import { Bar, PolarArea, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js'
import { useReportes } from '../composables/useReportes'
import { computed, ref } from 'vue'
import { exportarReportesAExcel, exportarReportesAPDF } from '../services/reporteExportService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
)

export default {
  name: 'ReportesView',
  components: {
    Navbar,
    BottomNavBar,
    Bar,
    PolarArea,
    Doughnut
  },
  setup() {
    const {
      estadisticas,
      datosEstados,
      datosResuelvasVsRechazadas,
      datosAreas,
      datosGestores,
      solicitudesPorGestor,
      isLoading,
      solicitudes
    } = useReportes()

    const mostrarDropdownExportar = ref(false)

    // Opciones comunes para los gráficos
    const opcionesGraficos = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12,
              weight: '500'
            },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 4
        }
      }
    }

    const exportarExcel = () => {
      try {
        // Convertir estadísticas computed a objeto plano
        const stats = {
          total: estadisticas.value.total || 0,
          nuevas: estadisticas.value.nuevas || 0,
          enProceso: estadisticas.value.enProceso || 0,
          resueltas: estadisticas.value.resueltas || 0,
          cerradas: estadisticas.value.cerradas || 0,
          rechazadas: estadisticas.value.rechazadas || 0
        }
        exportarReportesAExcel(stats, solicitudesPorGestor.value, solicitudes.value)
        mostrarDropdownExportar.value = false
      } catch (error) {
        console.error('Error al exportar Excel:', error)
        alert('Error al exportar a Excel: ' + error.message)
      }
    }

    const exportarPDF = () => {
      try {
        // Convertir estadísticas computed a objeto plano
        const stats = {
          total: estadisticas.value.total || 0,
          nuevas: estadisticas.value.nuevas || 0,
          enProceso: estadisticas.value.enProceso || 0,
          resueltas: estadisticas.value.resueltas || 0,
          cerradas: estadisticas.value.cerradas || 0,
          rechazadas: estadisticas.value.rechazadas || 0
        }
        exportarReportesAPDF(stats, solicitudesPorGestor.value, solicitudes.value)
        mostrarDropdownExportar.value = false
      } catch (error) {
        console.error('Error al exportar PDF:', error)
        alert('Error al exportar a PDF: ' + error.message)
      }
    }

    return {
      estadisticas,
      datosEstados,
      datosResuelvasVsRechazadas,
      datosAreas,
      datosGestores,
      solicitudesPorGestor,
      isLoading,
      opcionesGraficos,
      mostrarDropdownExportar,
      exportarExcel,
      exportarPDF
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
