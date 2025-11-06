import React from 'react';
import type{ User, Solicitud, EstadoSolicitud } from '../types'; // Importamos los tipos
import '../componentesCss/DashboardAsesor.css';

interface DashboardAsesorProps {
    user: User;
    solicitudes: Solicitud[];  
    totalSolicitudes: number;  
    totalPaginas: number;
    paginaActual: number;
    onPaginaChange: (pagina: number) => void;
    filtroActual: EstadoSolicitud | 'Todas';
    onFiltroChange: (estado: EstadoSolicitud | 'Todas') => void;

    solicitudesPorPagina: number; // Cantidad actual de solicitudes por página
    onPaginacionChange: (cantidad: number) => void;
}


const DashboardAsesor: React.FC<DashboardAsesorProps> = ({ 
    user, 
    solicitudes, 
    totalSolicitudes,
    totalPaginas,
    paginaActual,
    onPaginaChange,
    filtroActual, 
    onFiltroChange,
    solicitudesPorPagina,
    onPaginacionChange
}) => {
    
    // Lógica para verificar el permiso específico de consulta
    const tienePermisoConsulta = user.permisos.includes('consultar_solicitudes');    

    const estadosFiltro: (EstadoSolicitud | 'Todas')[] = ['Todas', 'Pendiente', 'En Revisión', 'Aprobada', 'Negada'];

    // Función para obtener la clase CSS según el estado
    const getEstadoClass = (estado: Solicitud['estado']) => {
        // Mapea los estados a las clases CSS que definimos
        if (estado === 'En Revisión') return 'Revisión'; // Si lo usaras
        return estado;
    }; 

    const renderPaginacion = () => {
        if (totalPaginas <= 1) {
            return null;
        }

        const pages = Array.from({ length: totalPaginas }, (_, i) => i + 1);

        return (
            <div className="pagination-container">
                <button
                    onClick={() => onPaginaChange(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="pagination-button"
                >
                    &laquo; Anterior
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPaginaChange(page)}
                        className={`pagination-button ${page === paginaActual ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPaginaChange(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="pagination-button"
                >
                    Siguiente &raquo;
                </button>
            </div>
        );
    }; 
    if (!user) {
    return <p>Error: Usuario no autenticado.</p>;
}
     return (

        
        <div className="dashboard-content-main"> {/* Contenedor principal del panel derecho */}
        <h2 className="content-title">Detalle de Solicitudes ({totalSolicitudes} encontradas)</h2>
        <div className="pagination-settings" style={{ padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <label htmlFor="solicitudes-per-page" style={{ fontWeight: 'bold', color: '#070505ff'}}>
            Solicitudes por Página:
        </label>
        <input 
            id="solicitudes-per-page"
            type="number" 
            min="1" 
            value={solicitudesPorPagina} 
            onChange={(e) => {
                const newValue = parseInt(e.target.value, 10);
                // Validar que el valor sea un número positivo antes de actualizar
                if (newValue > 0) {
                    onPaginacionChange(newValue); // Actualiza la cantidad de elementos por página
                    onPaginaChange(1);           // **IMPORTANTE**: Resetea a la página 1
                }
            }}
            style={{ padding: '8px', width: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
    </div>

            {/* Renderizado Condicional basado en el Permiso */}
            {tienePermisoConsulta ? (
                <div>
                    {/* Controles de Filtro */}
                    <div className="filter-controls">
                         
                        <div className="filter-button">
                            {estadosFiltro.map(estado => (
                                <button
                                    key={estado}
                                    onClick={() => onFiltroChange(estado)}
                                    className={`filter-button ${filtroActual === estado ? 'active' : ''}`}
                                >
                                    {estado}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Lista de Solicitudes */}
                    <div className="requests-grid">
                        {solicitudes.length > 0 ? (
                            solicitudes.map(sol => (
                                <div key={sol.id} className="request-card">
                                    <p>
                                         
                                        <span className={`state-tag ${getEstadoClass(sol.estado)}`}>
                                            {sol.estado}
                                        </span>
                                    </p>
                                    <h3 className="request-title">Solicitud #{sol.id}</h3>
                                    <p className="request-detail"><strong>Cliente:</strong> {sol.cliente}</p>
                                    <p className="request-detail"><strong>Fecha:</strong> {sol.fecha}</p>
                                    {/* Botón de acción inactivo */}
                                    <button disabled className="disabled-action-button">
                                        Ver Detalles (Solo Consulta)
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-results-message">No se encontraron solicitudes con el filtro '{filtroActual}'.</p>
                        )}
                    </div>

                    {/* Componente de Paginación */}
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