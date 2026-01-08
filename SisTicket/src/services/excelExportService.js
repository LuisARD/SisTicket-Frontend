/**
 * Servicio para exportar datos a Excel
 */
import * as XLSX from 'xlsx'

// Función para crear archivo Excel con formato
export const exportarSolicitudesAExcel = (solicitudes) => {
  if (!solicitudes || solicitudes.length === 0) {
    throw new Error('No hay solicitudes para exportar')
  }

  // Mapeo de estados
  const estadoMap = {
    1: 'Nueva',
    2: 'En Proceso',
    3: 'Resuelta',
    4: 'Rechazada',
    5: 'Cerrada'
  }

  // Mapeo de prioridades
  const prioridadMap = {
    1: 'Baja',
    2: 'Media',
    3: 'Alta',
    4: 'Crítica'
  }

  // Mapeo de estados numéricos a textos
  const mapearEstado = (estado) => {
    if (typeof estado === 'number') {
      return estadoMap[estado] || estado
    }
    return estado
  }

  const mapearPrioridad = (prioridad) => {
    if (typeof prioridad === 'number') {
      return prioridadMap[prioridad] || prioridad
    }
    return prioridad
  }

  // Convertir datos a objetos con propiedades nombradas
  const datos = solicitudes.map((s) => ({
    'Número': s.numeroSolicitud || '',
    'Título': s.titulo || '',
    'Descripción': s.descripcion || '',
    'Solicitante': s.solicitanteNombre || '',
    'Área': s.areaNombre || '',
    'Tipo': s.tipoSolicitudNombre || s.tipoNombre || '',
    'Prioridad': mapearPrioridad(s.prioridadId) || '',
    'Estado': mapearEstado(s.estado) || '',
    'Gestor Asignado': s.gestorAsignadoNombre || s.gestorNombre || '',
    'Fecha Creación': s.fechaCreacion ? new Date(s.fechaCreacion).toLocaleDateString('es-ES') : ''
  }))

  // Crear libro de trabajo
  const ws = XLSX.utils.json_to_sheet(datos)

  // Definir ancho de columnas basado en el contenido
  const columnWidths = [
    { wch: 15 },  // Número
    { wch: 25 },  // Título
    { wch: 40 },  // Descripción
    { wch: 20 },  // Solicitante
    { wch: 15 },  // Área
    { wch: 15 },  // Tipo
    { wch: 12 },  // Prioridad
    { wch: 12 },  // Estado
    { wch: 20 },  // Gestor Asignado
    { wch: 15 }   // Fecha Creación
  ]

  ws['!cols'] = columnWidths

  // Estilizar encabezados
  const encabezados = Object.keys(datos[0] || {})
  const encabezadosEstilo = {}

  for (let i = 0; i < encabezados.length; i++) {
    const celda = XLSX.utils.encode_col(i) + '1'
    ws[celda].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '366092' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    }
  }

  // Aplicar estilos básicos a los datos
  const rango = XLSX.utils.decode_range(ws['!ref'])
  for (let R = rango.s.r + 1; R <= rango.e.r; R++) {
    for (let C = rango.s.c; C <= rango.e.c; C++) {
      const celda = XLSX.utils.encode_cell({ r: R, c: C })
      if (!ws[celda]) continue
      ws[celda].s = {
        alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      }
    }
  }

  // Congelar primera fila
  ws['!freeze'] = { xSplit: 0, ySplit: 1 }

  // Crear libro de trabajo y agregar hoja
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes')

  // Generar nombre de archivo con fecha y hora
  const ahora = new Date()
  const fecha = ahora.toISOString().split('T')[0]
  const hora = ahora.toTimeString().split(' ')[0].replace(/:/g, '-')
  const nombreArchivo = `solicitudes_${fecha}_${hora}.xlsx`

  // Descargar archivo
  XLSX.writeFile(wb, nombreArchivo)
}

export default {
  exportarSolicitudesAExcel
}
