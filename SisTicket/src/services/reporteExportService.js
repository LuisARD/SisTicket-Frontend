/**
 * Servicio para exportar datos de reportes a Excel y PDF
 */
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Exportar datos de reportes a Excel
 */
export const exportarReportesAExcel = (estadisticas, datosGestores, solicitudes) => {
  // Crear libro de trabajo con múltiples hojas
  const wb = XLSX.utils.book_new()

  // Hoja 1: Resumen de Estadísticas
  const hojaEstadisticas = crearHojaEstadisticas(estadisticas)
  XLSX.utils.book_append_sheet(wb, hojaEstadisticas, 'Estadísticas')

  // Hoja 2: Desempeño de Gestores
  if (datosGestores && datosGestores.length > 0) {
    const hojaGestores = crearHojaGestores(datosGestores)
    XLSX.utils.book_append_sheet(wb, hojaGestores, 'Gestores')
  }

  // Hoja 3: Detalle de Solicitudes
  if (solicitudes && solicitudes.length > 0) {
    const hojaDetalle = crearHojaDetalleSolicitudes(solicitudes)
    XLSX.utils.book_append_sheet(wb, hojaDetalle, 'Detalle Solicitudes')
  }

  // Generar nombre de archivo con fecha y hora
  const ahora = new Date()
  const fecha = ahora.toISOString().split('T')[0]
  const hora = ahora.toTimeString().split(' ')[0].replace(/:/g, '-')
  const nombreArchivo = `reportes_${fecha}_${hora}.xlsx`

  // Descargar archivo
  XLSX.writeFile(wb, nombreArchivo)
}

/**
 * Crear hoja de estadísticas
 */
const crearHojaEstadisticas = (estadisticas) => {
  const datos = [
    { 'Métrica': 'Total de Solicitudes', 'Cantidad': estadisticas.total },
    { 'Métrica': 'Nuevas', 'Cantidad': estadisticas.nuevas },
    { 'Métrica': 'En Proceso', 'Cantidad': estadisticas.enProceso },
    { 'Métrica': 'Resueltas', 'Cantidad': estadisticas.resueltas },
    { 'Métrica': 'Cerradas', 'Cantidad': estadisticas.cerradas },
    { 'Métrica': 'Rechazadas', 'Cantidad': estadisticas.rechazadas }
  ]

  const ws = XLSX.utils.json_to_sheet(datos)
  ws['!cols'] = [{ wch: 35 }, { wch: 15 }]

  // Aplicar estilos a los encabezados
  ws['A1'].s = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, size: 12 },
    fill: { fgColor: { rgb: '366092' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  }
  ws['B1'].s = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, size: 12 },
    fill: { fgColor: { rgb: '366092' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  }

  return ws
}

/**
 * Crear hoja de desempeño de gestores
 */
const crearHojaGestores = (datosGestores) => {
  const datos = datosGestores.map((g, index) => ({
    'Posición': index + 1,
    'Gestor': g.gestor || '',
    'Cerradas': g.cerradas || 0,
    'Rechazadas': g.rechazadas || 0,
    'Total': (g.cerradas || 0) + (g.rechazadas || 0)
  }))

  const ws = XLSX.utils.json_to_sheet(datos)

  ws['!cols'] = [
    { wch: 12 },  // Posición
    { wch: 25 },  // Gestor
    { wch: 12 },  // Cerradas
    { wch: 12 },  // Rechazadas
    { wch: 12 }   // Total
  ]

  // Estilos para encabezados
  const encabezados = Object.keys(datos[0] || {})
  for (let i = 0; i < encabezados.length; i++) {
    const celda = XLSX.utils.encode_col(i) + '1'
    ws[celda].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '70AD47' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  }

  // Estilos para datos
  const rango = XLSX.utils.decode_range(ws['!ref'])
  for (let R = rango.s.r + 1; R <= rango.e.r; R++) {
    for (let C = rango.s.c; C <= rango.e.c; C++) {
      const celda = XLSX.utils.encode_cell({ r: R, c: C })
      if (!ws[celda]) continue
      ws[celda].s = {
        alignment: { horizontal: C === 1 ? 'left' : 'center' },
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

  return ws
}

/**
 * Crear hoja de detalle de solicitudes
 */
const crearHojaDetalleSolicitudes = (solicitudes) => {
  const datos = solicitudes.map((s) => ({
    'Número': s.numeroSolicitud || '',
    'Título': s.titulo || '',
    'Solicitante': s.solicitanteNombre || '',
    'Área': s.areaNombre || '',
    'Prioridad': s.prioridadNombre || '',
    'Estado': s.estado || '',
    'Gestor': s.gestorAsignadoNombre || '',
    'Fecha Creación': s.fechaCreacion ? new Date(s.fechaCreacion).toLocaleDateString('es-ES') : ''
  }))

  const ws = XLSX.utils.json_to_sheet(datos)

  ws['!cols'] = [
    { wch: 15 },  // Número
    { wch: 25 },  // Título
    { wch: 20 },  // Solicitante
    { wch: 15 },  // Área
    { wch: 12 },  // Prioridad
    { wch: 12 },  // Estado
    { wch: 20 },  // Gestor
    { wch: 15 }   // Fecha
  ]

  // Estilos para encabezados
  const encabezados = Object.keys(datos[0] || {})
  for (let i = 0; i < encabezados.length; i++) {
    const celda = XLSX.utils.encode_col(i) + '1'
    ws[celda].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '366092' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
    }
  }

  // Congelar primera fila
  ws['!freeze'] = { xSplit: 0, ySplit: 1 }

  return ws
}

/**
 * Exportar datos de reportes a PDF
 */
export const exportarReportesAPDF = (estadisticas, datosGestores, solicitudes) => {
  try {
    const doc = new jsPDF()
    let yPosition = 20

    // Título principal
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text('REPORTE DE SOLICITUDES', 14, yPosition)
    yPosition += 12

    // Fecha del reporte
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const ahora = new Date()
    doc.text(`Fecha: ${ahora.toLocaleDateString('es-ES')} ${ahora.toLocaleTimeString('es-ES')}`, 14, yPosition)
    yPosition += 10

    // Sección: Estadísticas Generales
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('1. Estadísticas Generales', 14, yPosition)
    yPosition += 8

    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    const estadisticasTexto = [
      `Total de Solicitudes: ${estadisticas.total || 0}`,
      `Nuevas: ${estadisticas.nuevas || 0}`,
      `En Proceso: ${estadisticas.enProceso || 0}`,
      `Resueltas: ${estadisticas.resueltas || 0}`,
      `Cerradas: ${estadisticas.cerradas || 0}`,
      `Rechazadas: ${estadisticas.rechazadas || 0}`
    ]

    estadisticasTexto.forEach((texto) => {
      doc.text(texto, 20, yPosition)
      yPosition += 6
    })

    yPosition += 10

    // Sección: Top Gestores
    if (datosGestores && datosGestores.length > 0) {
      // Verificar si necesitamos nueva página
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('2. Desempeño de Gestores (Top 10)', 14, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')

      datosGestores.slice(0, 10).forEach((g, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        const texto = `${index + 1}. ${g.gestor} - Cerradas: ${g.cerradas}, Rechazadas: ${g.rechazadas}, Total: ${g.cerradas + g.rechazadas}`
        doc.text(texto, 20, yPosition)
        yPosition += 6
      })
    }

    // Sección: Detalle de Solicitudes
    if (solicitudes && solicitudes.length > 0) {
      doc.addPage()
      yPosition = 20

      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('3. Detalle de Solicitudes', 14, yPosition)
      yPosition += 8

      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')

      solicitudes.forEach((s, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFont(undefined, 'bold')
        doc.text(`${index + 1}. ${s.numeroSolicitud}`, 14, yPosition)
        yPosition += 4

        doc.setFont(undefined, 'normal')
        const detalles = [
          `   Título: ${s.titulo || ''}`,
          `   Solicitante: ${s.solicitanteNombre || ''}`,
          `   Área: ${s.areaNombre || ''}`,
          `   Estado: ${s.estado || ''}`,
          `   Gestor: ${s.gestorAsignadoNombre || ''}`
        ]

        detalles.forEach((detalle) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(detalle, 14, yPosition)
          yPosition += 4
        })

        yPosition += 2
      })
    }

    // Generar nombre de archivo
    const fecha = ahora.toISOString().split('T')[0]
    const hora = ahora.toTimeString().split(' ')[0].replace(/:/g, '-')
    const nombreArchivo = `reportes_${fecha}_${hora}.pdf`

    doc.save(nombreArchivo)
  } catch (error) {
    console.error('Error al exportar PDF detallado:', error)
    throw new Error('Error al generar PDF: ' + error.message)
  }
}

export default {
  exportarReportesAExcel,
  exportarReportesAPDF
}
