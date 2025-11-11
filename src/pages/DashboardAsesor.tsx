import React, { useState, useMemo } from 'react';
// <-- 1. Importa los 'hooks' de React que vamos a usar

// <-- 2. CORRIGE LA RUTA DE IMPORTACIÓN
import type { IUsuario, ISolicitud } from '../types';
import { UserRole, RequestStatus, EvaluationResult } from '../types';

// <-- 3. Importa el Contexto de Autenticación
import { useAuth } from '../context/AuthContext';

// <-- 4. Importa los datos falsos
import { solicitudes as allSolicitudes } from '../data/mockData';

import "../styles/pages/DashboardAsesor.css";

// <-- 6. BORRAMOS TODA LA INTERFAZ 'DashboardAsesorProps'
//    El componente ya no recibirá props.


const DashboardAsesor: React.FC = () => { // <-- 6. (Continuación) Borramos las props

    // <-- 7. OBTENEMOS AL USUARIO DEL CONTEXTO
    const { user } = useAuth();

    // <-- 8. CREAMOS EL ESTADO INTERNO
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroActual, setFiltroActual] = useState<RequestStatus | 'Todas'>('Todas');
    const [solicitudesPorPagina, setSolicitudesPorPagina] = useState(5); // <-- Pon un valor inicial


    // Lógica para verificar el permiso (ahora usa el 'user' del contexto)
    // Usamos 'user?' (optional chaining) por si el usuario aún no ha cargado
    const tienePermisoConsulta = user?.rol === UserRole.ADVISOR;


    // <-- 9. LÓGICA DE FILTRADO Y PAGINACIÓN
    // Filtramos las solicitudes que le pertenecen a este asesor
    const solicitudesDelAsesor = useMemo(() => {
        return allSolicitudes.filter(s => s.asesor_id === user?.id);
    }, [user?.id]);

    // Filtramos por el estado seleccionado
    const solicitudesFiltradas = useMemo(() => {
        if (filtroActual === 'Todas') {
            return solicitudesDelAsesor;
        }
        return solicitudesDelAsesor.filter(s => s.estado === filtroActual);
    }, [filtroActual, solicitudesDelAsesor]);

    // Calculamos el total de páginas
    const totalSolicitudes = solicitudesFiltradas.length;
    const totalPaginas = Math.ceil(totalSolicitudes / solicitudesPorPagina);

    // Obtenemos solo las solicitudes de la página actual
    const solicitudesPaginadas = useMemo(() => {
        const inicio = (paginaActual - 1) * solicitudesPorPagina;
        const fin = inicio + solicitudesPorPagina;
        return solicitudesFiltradas.slice(inicio, fin);
    }, [solicitudesFiltradas, paginaActual, solicitudesPorPagina]);
    // (Fin de la lógica de filtrado)


    const estadosFiltro: (RequestStatus | 'Todas')[] = [
        'Todas',
        RequestStatus.PENDING,
        RequestStatus.IN_PROCESS,
        RequestStatus.COMPLETED
    ];
    const getEstadoClass = (estado: RequestStatus) => {
        switch (estado) {
            case RequestStatus.PENDING: return 'Pendiente';
            case RequestStatus.IN_PROCESS: return 'Revisión';
            case RequestStatus.COMPLETED: return 'Completada'; // O 'Aprobada' / 'Negada' si quieres
            default: return '';
        }
    };

    const renderPaginacion = () => {
        if (totalPaginas <= 1) {
            return null;
        }
        const pages = Array.from({ length: totalPaginas }, (_, i) => i + 1);

        return (
            <div className="pagination-container">
                <button
                    onClick={() => setPaginaActual(paginaActual - 1)} // <-- USA EL STATE
                    disabled={paginaActual === 1}
                    className="pagination-button"
                >
                    &laquo; Anterior
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setPaginaActual(page)} // <-- USA EL STATE
                        className={`pagination-button ${page === paginaActual ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => setPaginaActual(paginaActual + 1)} // <-- USA EL STATE
                    disabled={paginaActual === totalPaginas}
                    className="pagination-button"
                >
                    Siguiente &raquo;
                </button>
            </div>
        );
    };

    // <-- 10. VERIFICAMOS EL USUARIO DEL CONTEXTO
    if (!user) {
        return <p>Cargando usuario...</p>; // O un spinner
    }

    return (
        <div className="dashboard-content-main">
            <h2 className="content-title">Detalle de Solicitudes ({totalSolicitudes} encontradas)</h2>
            <div className="pagination-settings" style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <label htmlFor="solicitudes-per-page" style={{ fontWeight: 'bold', color: '#070505ff' }}>
                    Solicitudes por Página:
                </label>
                <input
                    id="solicitudes-per-page"
                    type="number"
                    min="1"
                    value={solicitudesPorPagina} // <-- USA EL STATE
                    onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10);
                        if (newValue > 0) {
                            setSolicitudesPorPagina(newValue); // <-- USA EL STATE
                            setPaginaActual(1);                // <-- USA EL STATE
                        }
                    }}
                    style={{ padding: '8px', width: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            {tienePermisoConsulta ? (
                <div>
                    <div className="filter-controls">

                        <div className="filter-button">
                            {estadosFiltro.map(estado => (
                                <button
                                    key={estado}
                                    onClick={() => setFiltroActual(estado)} // <-- USA EL STATE
                                    className={`filter-button ${filtroActual === estado ? 'active' : ''}`}
                                >
                                    {estado}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="requests-grid">
                        {/* <-- 11. USA LAS SOLICITUDES CALCULADAS */}
                        {solicitudesPaginadas.length > 0 ? (
                            solicitudesPaginadas.map(sol => (
                                <div key={sol.id} className="request-card">
                                    <p>
                                        <span className={`state-tag ${getEstadoClass(sol.estado)}`}>
                                            {sol.estado}
                                        </span>
                                    </p>
                                    <h3 className="request-title">Solicitud #{sol.id}</h3>
                                    <p className="request-detail"><strong>Cliente ID:</strong> {sol.cliente_id}</p>
                                    <p className="request-detail"><strong>Fecha:</strong> {sol.fecha_creacion.toLocaleDateString()}</p>
                                    <button disabled className="disabled-action-button">
                                        Ver Detalles (Solo Consulta)
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-results-message">No se encontraron solicitudes con el filtro '{filtroActual}'.</p>
                        )}
                    </div>

                    {renderPaginacion()}

                </div>
            ) : (
                <div className="permission-error">
                    <p>Acceso Denegado. Su perfil no tiene el permiso de consulta.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardAsesor;