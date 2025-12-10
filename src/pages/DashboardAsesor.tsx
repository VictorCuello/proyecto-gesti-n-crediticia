import React, { useState, useMemo, useEffect } from 'react';
import type { IUsuario, ISolicitud } from '../types';
import { UserRole, RequestStatus, EvaluationResult } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { solicitudApi } from '../services/api';

import "../styles/pages/DashboardAsesor.css";

const DashboardAsesor: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // 1. ESTADO DE LA DATA Y CONTROL DE CARGA
    const [solicitudesCargadas, setSolicitudesCargadas] = useState<ISolicitud[]>([]); // 🆕 Data real
    const [isLoading, setIsLoading] = useState(true); // 🆕 Estado de carga
    const [apiError, setApiError] = useState<string | null>(null); // 🆕 Estado de error

    // ESTADO DE FILTROS Y PAGINACIÓN
    const [paginaActual, setPaginaActual] = useState(1);
    const [filtroActual, setFiltroActual] = useState<RequestStatus | 'Todas'>('Todas');
    const [solicitudesPorPagina, setSolicitudesPorPagina] = useState(5);
    const tienePermisoConsulta = user?.rol === UserRole.ADVISOR;
    const asesorId = user!.id; // Obtenemos el ID de forma segura

    // 2. LÓGICA DE CARGA DE DATOS DESDE LA API
    // Usamos useEffect para cargar las solicitudes solo una vez o cuando cambie el filtro/asesor
    useEffect(() => {
        if (!asesorId || !tienePermisoConsulta) {
            setIsLoading(false);
            return;
        }

        const fetchSolicitudes = async () => {
            setIsLoading(true);
            setApiError(null);
            setPaginaActual(1); // Resetear a la primera página al aplicar filtro

            try {
                // ⚠️ NOTA: El backend DEBE implementar el endpoint /solicitudes/asesor?estado=X
                const response = await solicitudApi.getSolicitudesByAsesor(asesorId, filtroActual);

                if (response.success && Array.isArray(response.data)) {
                    // La API ya nos devuelve las solicitudes filtradas y solo las del asesor
                    setSolicitudesCargadas(response.data);
                } else {
                    setApiError(response.message || 'Fallo al obtener solicitudes.');
                    setSolicitudesCargadas([]);
                }
            } catch (error) {
                console.error("Error al cargar solicitudes:", error);
                setApiError('Error de conexión con el servidor de solicitudes.');
                setSolicitudesCargadas([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSolicitudes();

    }, [asesorId, filtroActual, tienePermisoConsulta]); // Dependencias: asesorId y filtroActual

    // 3. LÓGICA DE FILTRADO (Solo se mantiene la Paginación, ya que la API filtra por asesor y estado)

    // Antes: solicitudesFiltradas = useMemo(() => { ... });
    // Ahora: solicitudesFiltradas es directamente solicitudesCargadas, pero necesitamos paginar

    const solicitudesFiltradas = solicitudesCargadas; // La API ya nos dio el set filtrado

    const totalSolicitudes = solicitudesFiltradas.length;
    const totalPaginas = Math.ceil(totalSolicitudes / solicitudesPorPagina);

    const solicitudesPaginadas = useMemo(() => {
        const inicio = (paginaActual - 1) * solicitudesPorPagina;
        const fin = inicio + solicitudesPorPagina;
        // Solo necesitamos rebanar el array ya filtrado por la API
        return solicitudesFiltradas.slice(inicio, fin);
    }, [solicitudesFiltradas, paginaActual, solicitudesPorPagina]);

    // ... (rest of the handlers and utility functions remain the same) ...

    const handleAbrirPerfil = () => {
        navigate('/perfil-usuario');
    };

    const estadosFiltro: (RequestStatus | 'Todas')[] = [
        'Todas',
        RequestStatus.PENDING,
        RequestStatus.IN_PROCESS,
        RequestStatus.COMPLETED
    ];
    // ... (getEstadoClass y renderPaginacion remain the same) ...

    // <-- 4. VERIFICAMOS EL ESTADO DE CARGA
    if (!user || isLoading) {
        return <p>Cargando datos del asesor y solicitudes...</p>;
    }

    if (apiError) {
        return (
            <div className="dashboard-content-main">
                <p className="error-message">❌ Error: {apiError}</p>
                <button onClick={() => setFiltroActual('Todas')} className="btn-retry">
                    Intentar Recargar
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-content-main">

            <div className="dashboard-header-controls">
                <h2 className="content-title">Detalle de Solicitudes ({totalSolicitudes} encontradas)</h2>

                <button
                    onClick={handleAbrirPerfil}
                    className="btn-acceso-perfil"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#004a99',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Ver Perfil y Acciones
                </button>
            </div>

            <div className="pagination-settings" style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                {/* ... (Solicitudes por página input) ... */}
            </div>

            {tienePermisoConsulta ? (
                <div>
                    <div className="filter-controls">
                        <div className="filter-button">
                            {estadosFiltro.map(estado => (
                                <button
                                    key={estado}
                                    onClick={() => setFiltroActual(estado)} // 🚀 ESTO DISPARA EL useEffect
                                    className={`filter-button ${filtroActual === estado ? 'active' : ''}`}
                                >
                                    {estado}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="requests-grid">
                        {/* ... (Renderizado de solicitudesPaginadas) ... */}
                        {solicitudesPaginadas.length > 0 ? (
                            solicitudesPaginadas.map(sol => (
                                <div key={sol.id} className="request-card">
                                    <div key={sol.id} className="request-card">

                                        <h3 className="request-title">Solicitud #{sol.id}</h3>

                                        {/* 🚀 USAR EL NOMBRE DEL CLIENTE OBTENIDO DEL JOIN */}
                                        <p className="request-detail">
                                            <strong>Cliente:</strong> {sol.cliente_nombre || 'ID: ' + sol.cliente_id}
                                        </p>

                                        <p className="request-detail">
                                            <strong>Fecha:</strong> {new Date(sol.fecha_creacion).toLocaleDateString()}
                                        </p>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-results-message">No se encontraron solicitudes con el filtro '{filtroActual}'.</p>
                        )}
                    </div>

                    {/* ... (renderPaginacion) ... */}

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