import type { ISolicitud } from '../types'; // Importa la interfaz que definiste

/**
 * Convierte un array de objetos de solicitudes a formato CSV y fuerza la descarga en el navegador.
 * @param data - Array de solicitudes (ISolicitud[]) a exportar.
 * @param filename - Nombre del archivo (debe terminar en .csv).
 */
export const exportToCsv = (data: ISolicitud[], filename: string): void => {
    if (!data || data.length === 0) {
        alert("No se encontraron solicitudes para exportar.");
        return;
    }

    // --- 1. Definir los Encabezados (Headers) ---
    const headers = [
        'ID Solicitud', 
        'Cliente Nombre', 
        'Documento ID', 
        'Asesor ID',
        'Estado', 
        'Resultado', 
        'Puntaje Riesgo',
        'Comentarios',
        'Fecha Creacion',
    ];
    
    // --- 2. Mapear los Datos a Filas CSV ---
    const rows = data.map(sol => {
        // Aseguramos que la fecha sea una cadena local legible
        const fechaCreacionLocal = new Date(sol.fecha_creacion).toLocaleDateString('es-ES');
        
        // Creamos la fila, asegurándonos de que los valores null sean cadenas vacías o 'N/A'
        return [
            sol.id,
            // Asumimos que cliente_nombre viene del JOIN en la API
            sol.cliente_nombre || 'Desconocido', 
            // Asumimos que documento_id puede venir del JOIN o se debe añadir a la consulta de la API
            // (Si documento_id no está en ISolicitud, debes agregarlo a la consulta del backend)
            (sol as any).documento_id || 'N/A', 
            sol.asesor_id,
            sol.estado,
            sol.resultado || 'Pendiente / N/A',
            sol.puntaje_riesgo || 'N/A',
            sol.comentarios || '',
            fechaCreacionLocal,
        ].map(item => {
            // Limpieza básica: elimina comas y saltos de línea para no romper la estructura CSV
            if (typeof item === 'string') {
                return `"${item.replace(/"/g, '""').replace(/,/g, ' ')}"`;
            }
            return item;
        }).join(',');
    });

    // --- 3. Combinar y Crear Contenido ---
    const csvContent = [
        headers.join(','), // La primera fila es el encabezado
        ...rows           // Luego todas las filas de datos
    ].join('\n');

    // --- 4. Forzar la Descarga ---
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Configurar la descarga
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Placeholder funcional para la exportación a PDF. 
 * Esta función usa la impresión del navegador, pero puedes reemplazarla por una librería 
 * (ej., jsPDF) para la generación real de documentos.
 * @param data - Array de solicitudes.
 * @param filename - Nombre del archivo.
 */
export const exportToPdfPlaceholder = (data: ISolicitud[], filename: string): void => {
    if (!data || data.length === 0) {
        alert("No hay datos para imprimir.");
        return;
    }
    
    // ⚠️ NOTA: Una implementación real requeriría una librería (como jsPDF o html2canvas).
    // Usamos el diálogo de impresión para simular la exportación en el navegador.
    
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>' + filename + '</title>');
    printWindow.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: left;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Reporte de Solicitudes - Filtrado: ' + data[0].estado + '</h1>');
    
    // Convertir datos a una tabla HTML simple
    let tableHtml = '<table><thead><tr>';
    const headers = ['ID', 'Cliente', 'Estado', 'Puntaje', 'Fecha Creación'];
    headers.forEach(h => tableHtml += `<th>${h}</th>`);
    tableHtml += '</tr></thead><tbody>';

    data.forEach(sol => {
        tableHtml += '<tr>';
        tableHtml += `<td>${sol.id}</td>`;
        tableHtml += `<td>${sol.cliente_nombre || 'N/A'}</td>`;
        tableHtml += `<td>${sol.estado}</td>`;
        tableHtml += `<td>${sol.puntaje_riesgo || 'N/A'}</td>`;
        tableHtml += `<td>${new Date(sol.fecha_creacion).toLocaleDateString('es-ES')}</td>`;
        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table>';

    printWindow.document.write(tableHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    // Nota para el usuario de la aplicación:
    alert(`Se abrió la vista de impresión para simular la exportación a PDF. Guárdalo como PDF.`);
};