import React from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv'; // <-- Para el Reporte CSV (Feedback Profe)

// Importamos todos los datos y tipos que necesitamos
import { 
    solicitudes as allSolicitudes, 
    usuarios, 
    clientes 
}  from '../data/mockData'; // <-- Este puede estar bien si el archivo se llama mockData.ts
// 1. Importa los TIPOS (interfaces) usando la palabra "type"
import type { ISolicitud, IUsuario, ICliente } from '../types';

// 2. Importa los VALORES (enums) por separado
import { RequestStatus } from '../types';
// Importa el CSS que crearemos en el siguiente paso
import '../styles/pages/DashboardAnalista.css'; 

const DashboardAnalista: React.FC = () => {

    // --- Lógica para "Humanizar" los Datos ---
    // Para no mostrar solo IDs, creamos "mapas" para buscar nombres
    const clienteMap = new Map(clientes.map(c => [c.id, c.nombre_completo]));
    const asesorMap = new Map(usuarios.map(u => [u.id, u.nombre]));

    // El analista ve TODAS las solicitudes
    const solicitudes = allSolicitudes;

    // --- Lógica para el Reporte CSV (Feedback Profe) ---
    const csvData = solicitudes.map(sol => ({
        ID_Solicitud: sol.id,
        Fecha: sol.fecha_creacion.toLocaleDateString(),
        Estado: sol.estado,
        ID_Cliente: sol.cliente_id,
        Nombre_Cliente: clienteMap.get(sol.cliente_id) || 'N/A',
        ID_Asesor: sol.asesor_id,
        Nombre_Asesor: asesorMap.get(sol.asesor_id) || 'N/A',
    }));

    // Función para dar color a los estados (igual que la del Asesor)
    const getEstadoClass = (estado: RequestStatus) => {
        switch (estado) {
            case RequestStatus.PENDING: return 'Pendiente';
            case RequestStatus.IN_PROCESS: return 'En-Proceso'; // CSS no usa espacios
            case RequestStatus.COMPLETED: return 'Completado';
            default: return '';
        }
    };

    return (
        <div className="analista-dashboard">
            <div className="header-bar">
                <h2>Inventario General de Solicitudes ({solicitudes.length})</h2>
                
                {/* --- ESTE ES EL BOTÓN DE REPORTE (Feedback Profe) --- */}
                <CSVLink 
                    data={csvData} 
                    filename="reporte-historico-solicitudes.csv"
                    className="btn-reporte"
                >
                    Generar Reporte Histórico (CSV)
                </CSVLink>
            </div>

            {/* --- La Tabla de Solicitudes --- */}
            <table className="solicitudes-table">
                <thead>
                    <tr>
                        <th>ID Solicitud</th>
                        <th>Cliente</th>
                        <th>Asesor</th>
                        <th>Fecha Creación</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map((sol) => (
                        <tr key={sol.id}>
                            <td>{sol.id}</td>
                            {/* Mostramos el nombre usando el mapa, o el ID si no lo encuentra */}
                            <td>{clienteMap.get(sol.cliente_id) || sol.cliente_id}</td>
                            <td>{asesorMap.get(sol.asesor_id) || sol.asesor_id}</td>
                            <td>{sol.fecha_creacion.toLocaleDateString()}</td>
                            <td>
                                <span className={`estado-tag ${getEstadoClass(sol.estado)}`}>
                                    {sol.estado}
                                </span>
                            </td>
                            <td>
                                {/* Mostramos "Evaluar" solo si está PENDIENTE */}
                                {sol.estado === RequestStatus.PENDING ? (
                                    <Link 
                                        to={`/evaluar/${sol.id}`} // <-- Link a tu próxima tarea
                                        className="btn-evaluar"
                                    >
                                        Evaluar
                                    </Link>
                                ) : (
                                    <span className="evaluado-label">
                                        {sol.estado === RequestStatus.COMPLETED ? 'Finalizada' : 'En Proceso'}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardAnalista;