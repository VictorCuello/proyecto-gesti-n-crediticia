import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import  { useState, useEffect, useMemo } from 'react'; 
import { ASESOR_LOGGED_IN, SOLICITUDES_DATA} from './types';
import type { User, Solicitud, EstadoSolicitud, ExportFilter, ExportFormat} from './types';
import DashboardAsesor from '../../src/pages/DashboardAsesor.tsx';
import BarraUsuario from '../../src/pages/BarraUsuario.tsx';
import SolicitudModal from '../../src/pages/SolicitudModal.tsx';
import ExportModal from '../../src/pages/ExportModal.tsx';
import './componentesCss/App.css';  

function App() {


const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
const [solicitudesIniciales, setSolicitudesIniciales] = useState<Solicitud[]>([]);
// Estado para manejar el filtro seleccionado por el usuario
const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | 'Todas'>('Todas');
// Estado para manejar la página actual
const [paginaActual, setPaginaActual] = useState(1);
// 1. Simulación de carga de sesión y datos (Se ejecuta una sola vez al inicio)

const [mostrarModal, setMostrarModal] = useState(false);
const [nextId, setNextId] = useState(1);

const [mostrarExportModal, setMostrarExportModal] = useState(false);
const [solicitudesPorPagina, setSolicitudesPorPagina] = useState(8);


const exportarSolicitudes = (filtro: ExportFilter, formato: ExportFormat) => {
    let dataToExport = solicitudesIniciales;
    let fileName = `solicitudes_${filtro.toLowerCase()}`;

    if (filtro !== 'Todas') {
      dataToExport = dataToExport.filter(sol => sol.estado === filtro);
    }
    
    if (dataToExport.length === 0) {
      alert(`No hay solicitudes con el estado "${filtro}" para exportar.`);
      return;
    }

    // --- Lógica de Exportación a CSV (Existente) ---
    if (formato === 'CSV') {
        const headers = ["ID", "Cliente", "Cedula", "Fecha Creacion", "Estado", "Asesor ID"];
        
        const rows = dataToExport.map(sol => [
            sol.id,
            `"${sol.cliente}"`, 
            sol.cedula,
            sol.fecha,
            sol.estado,
            sol.asesorId
        ].join(';')); 

        const csvContent = "\uFEFF" + "sep=;\n" + headers.join(';') + "\n" + rows.join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `${fileName}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    } 
    
    // --- Lógica de Exportación a PDF (NUEVO) ---
    else if (formato === 'PDF') {
        try {
            // Aseguramos que la instancia de jsPDF se inicialice correctamente
            const doc = new jsPDF();
            
            const headers = [["ID", "Cliente", "Cédula", "Fecha Creación", "Estado", "Asesor ID"]];
            
            const body = dataToExport.map(sol => [
                sol.id.toString(),
                sol.cliente,
                sol.cedula,
                sol.fecha,
                sol.estado,
                sol.asesorId.toString()
            ]);
            
            doc.text(`Reporte de Solicitudes - Filtro: ${filtro}`, 14, 15);
            doc.setFontSize(10);
            doc.text(`Fecha de Reporte: ${new Date().toLocaleDateString()}`, 14, 22);

            // LLAMADA CRÍTICA A autoTable
            (doc as any).autoTable({
                head: headers,
                body: body,
                startY: 28, 
                styles: { fontSize: 8, cellPadding: 3 },
                headStyles: { fillColor: [0, 74, 153] }
            });

            doc.save(`${fileName}.pdf`);
            
        } catch (error) {
            // Este bloque muestra el error si la librería de PDF no cargó
            console.error("Error al generar PDF: ", error);
            alert("Error: No se pudo generar el PDF. Esto puede ser un error de inicialización de librerías (jspdf/jspdf-autotable). Por favor, reinicia tu servidor.");
            return;
        }
    }

    setMostrarExportModal(false);
    alert(`¡Exportación a ${formato} completada!`);
};


useEffect(() => {
    // ... (restos de tu lógica de carga) ...
    
    // CALCULAR EL ID MÁXIMO DE TODA LA DATA
    const currentMaxId = SOLICITUDES_DATA.reduce((max, sol) => Math.max(max, sol.id), 0);
    setNextId(currentMaxId + 1); // El próximo ID será el máximo encontrado + 1
}, []);


useEffect(() => {
// 1. Simular Login
setLoggedInUser(ASESOR_LOGGED_IN);

// 2. Simular Carga de Solicitudes (Se aplica la regla: filtrar solo por ID del asesor logueado)
const solicitudesFiltradas = SOLICITUDES_DATA.filter(sol => 
    sol.asesorId === ASESOR_LOGGED_IN.id
);

setSolicitudesIniciales(solicitudesFiltradas);


}, []);
const crearNuevaSolicitud = (nombreCliente: string, cedulaCliente: string) => {
    if (!loggedInUser) return;

    const nuevaSolicitud: Solicitud = {
      id: nextId,
      cliente: nombreCliente,
      cedula: Number(cedulaCliente), // Agregado el campo cédula
      fecha: new Date().toISOString().slice(0, 10), // Fecha actual
      estado: 'Pendiente', // Estado por defecto
      asesorId: loggedInUser.id,
    };

    setSolicitudesIniciales(prev => [nuevaSolicitud, ...prev]); // Añadir al inicio de la lista
    setNextId(prev => prev + 1); // Incrementar ID
    setMostrarModal(false); // Cerrar modal
  };
// Función para simular el cierre de sesión
const handleLogout = () => {
setLoggedInUser(null);
setSolicitudesIniciales([]);
setFiltroEstado('Todas');
setPaginaActual(1); // Resetear paginación al cerrar sesión
// En una app real: borrar token, redirigir a /login
alert('Sesión cerrada exitosamente.');
};

// 2. Lógica de Filtrado por ESTADO (APLICACIÓN SEGURA DEL FILTRO)
const solicitudesFiltradasPorEstado = useMemo(() => {

if (filtroEstado === 'Todas') {
  return solicitudesIniciales;
}
// Aplica el filtro de estado
return solicitudesIniciales.filter(sol => sol.estado === filtroEstado);
}, [solicitudesIniciales, filtroEstado]);


// 3. EFECTO CLAVE: Resetear la página a 1 cuando el filtro de estado cambie
// Esto es crucial para la paginación dinámica al cambiar el conjunto de datos.
useEffect(() => {
// Si el filtro de estado cambia, volvemos a la página 1.
setPaginaActual(1);}, [filtroEstado]);

// 4. LÓGICA DE PAGINACIÓN: Determinar el subconjunto de solicitudes a mostrar
const solicitudesMostradas = useMemo(() => {
const indiceInicio = (paginaActual - 1) * solicitudesPorPagina;
const indiceFin = indiceInicio + solicitudesPorPagina;

// Slice retorna el subconjunto de solicitudes para la página actual
return solicitudesFiltradasPorEstado.slice(indiceInicio, indiceFin);


}, [solicitudesFiltradasPorEstado, paginaActual,solicitudesPorPagina]);

// Cálculo del total de páginas: DÍNÁMICO. Se basa en el total de solicitudes filtradas.
// Esta es la fórmula clave para la paginación dinámica.
const totalPaginas = Math.ceil(solicitudesFiltradasPorEstado.length / solicitudesPorPagina);

// Manejo de carga
if (!loggedInUser) {
return <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.5em', color: '#004a99' }}>
Iniciando Sesión...
</div>;
}

// Conteo de pendientes para pasar a BarraUsuario
const solicitudesPendientesCount = solicitudesIniciales.filter(sol => sol.estado === 'Pendiente').length;


// 5. Estructura de la aplicación: BarraUsuario + Dashboard
return (
<div className="main-layout">  
            
    {mostrarModal && (
        <SolicitudModal 
          onClose={() => setMostrarModal(false)}
          onSubmit={crearNuevaSolicitud}          
        />
      )}

    {mostrarExportModal && (
        <ExportModal
          onClose={() => setMostrarExportModal(false)}
          onExportar={exportarSolicitudes}
        />
      )}

  {/* Panel Izquierdo (BarraUsuario) */}
  <BarraUsuario 
    user={loggedInUser} 
    onLogout={handleLogout}
    solicitudesPendientesCount={solicitudesPendientesCount}
    onCrearSolicitud={() => setMostrarModal(true)}
    onAbrirExportar={() => setMostrarExportModal(true)}
  />
  
  {/* Panel Derecho (Dashboard con datos paginados) */}
  <DashboardAsesor 
    user={loggedInUser} 
    solicitudes={solicitudesMostradas} // <-- Datos de la página actual
    totalSolicitudes={solicitudesFiltradasPorEstado.length} // <-- Total de solicitudes filtradas
    totalPaginas={totalPaginas} // <-- Total de páginas calculado dinámicamente
    paginaActual={paginaActual} // <-- Página actual
    onPaginaChange={setPaginaActual} // <-- Función para cambiar de página
    filtroActual={filtroEstado}
    onFiltroChange={setFiltroEstado} 
    solicitudesPorPagina={solicitudesPorPagina}
    onPaginacionChange={setSolicitudesPorPagina}
  />
</div>


);
}
 
export default App
