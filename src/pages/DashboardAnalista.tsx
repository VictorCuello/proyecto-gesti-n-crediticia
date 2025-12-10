// src/pages/DashboardAnalista.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { RequestStatus } from '../types';
import { solicitudes as allSolicitudes, usuarios, clientes } from '../data/mockData';
import '../styles/pages/DashboardAnalista.css'; 

const DashboardAnalista: React.FC = () => {
    const clienteMap = new Map(clientes.map(c => [c.id, c.nombre_completo]));
    const asesorMap = new Map(usuarios.map(u => [u.id, u.nombre]));
    const solicitudes = allSolicitudes;

    const csvData = solicitudes.map(sol => ({
        ID_Solicitud: sol.id,
        Fecha: sol.fecha_creacion.toLocaleDateString(),
        Estado: sol.estado,
        Cliente: clienteMap.get(sol.cliente_id) || 'N/A',
        Asesor: asesorMap.get(sol.asesor_id) || 'N/A',
        // NUEVOS CAMPOS DEL REQUERIMIENTO
        Resultado: sol.resultado || '-',
        Puntaje: sol.puntaje_riesgo || '-',
        Comentarios: sol.comentarios || '-'
    }));

    const getEstadoClass = (estado: RequestStatus) => {
        switch (estado) {
            case RequestStatus.PENDING: return 'Pendiente';
            case RequestStatus.IN_PROCESS: return 'En-Proceso';
            case RequestStatus.COMPLETED: return 'Completado';
            case RequestStatus.REJECTED: return 'Rechazado';
            default: return '';
        }
    };

    return (
        <div className="analista-dashboard">
            <div className="header-bar">
                <h2>Inventario General ({solicitudes.length})</h2>
                <CSVLink data={csvData} filename="reporte-historico.csv" className="btn-reporte">
                    Generar Reporte Histórico (CSV)
                </CSVLink>
            </div>
            <table className="solicitudes-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Asesor</th>
                        <th>Estado</th>
                        <th>Resultado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map((sol) => (
                        <tr key={sol.id}>
                            <td>{sol.id}</td>
                            <td>{clienteMap.get(sol.cliente_id) || sol.cliente_id}</td>
                            <td>{asesorMap.get(sol.asesor_id) || sol.asesor_id}</td>
                            <td><span className={`estado-tag ${getEstadoClass(sol.estado)}`}>{sol.estado}</span></td>
                            <td>{sol.resultado || '-'}</td>
                            <td>
                                {sol.estado === RequestStatus.PENDING ? (
                                    <Link to={`/evaluar/${sol.id}`} className="btn-evaluar">Evaluar</Link>
                                ) : <span className="evaluado-label">Cerrada</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardAnalista;