import React, { useMemo,useState } from 'react';
import type { IUsuario,ExportFormat,ExportFilter,ISolicitud } from '../types';
import { useAuth } from '../context/AuthContext'; // Para obtener user y logout
import { useNavigate } from 'react-router-dom'; // Para navegar a otras páginas
import ExportModal from './ExportModal';
import { solicitudApi } from '../services/api';
import { exportToCsv, exportToPdfPlaceholder } from '../utils/exportUtils';

// NOTA: Asumimos que esta página reutiliza estilos globales, pero no el estilo '.BarraUsuario' de panel lateral.
import '../styles/pages/BarraUsuario.css';

// Ya no recibe props, obtiene todo del contexto y hooks
const BarraUsuario: React.FC = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const solicitudesPendientesCount = 15; // Placeholder: Reemplazar con lógica real

    // --- Handlers de Acción ---
    const handleGoBack = () => {
        // -1 indica "ir a la página anterior del historial"
        navigate(-1);
    };

    const handleCrearSolicitud = () => {
        // Navegar a la ruta de creación de solicitudes
        navigate('/solicitudes/crear');
    };

    const handleAbrirExportar = () => {
        setExportError(null); // Limpiar errores
        setIsExportModalOpen(true);
    };

    const handleExportarSolicitudes = async (filtro: ExportFilter, formato: ExportFormat) => {
        if (!user || !user.id) {
            setExportError('Usuario no autenticado para exportar.');
            return;
        }

        setIsExporting(true);
        setExportError(null);
        
        try {
            // 1. Llamar a la API para obtener los datos filtrados
            // Utilizamos el mismo endpoint que en el Dashboard
            const response = await solicitudApi.getSolicitudesByAsesor(
                user.id.toString(), // Aseguramos que sea string
                filtro
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Fallo al obtener los datos para exportar.');
            }

            const solicitudes: ISolicitud[] = response.data;
            const fileName = `solicitudes_${filtro}_${new Date().toLocaleDateString('es-CL')}`;

            // 2. Ejecutar la función de utilidad según el formato
            if (formato === 'CSV') {
                exportToCsv(solicitudes, fileName + '.csv');
            } else if (formato === 'PDF') {
                exportToPdfPlaceholder(solicitudes, fileName + '.pdf');
            }

            // 3. Cerrar el modal al finalizar con éxito
            setIsExportModalOpen(false); 

        } catch (err) {
            console.error('Error durante la exportación:', err);
            setExportError(err instanceof Error ? err.message : 'Error desconocido de red/API.');
        } finally {
            setIsExporting(false);
        }
    };
    const handleCrearCliente = () => {
        navigate('/usuarios/crear');
    };

    const handleLogout = () => {
        console.log("Cerrando sesión...");
        logout(); // Ejecuta el logout del contexto
        navigate('/login'); // Redirige al login
    };

    if (!user) {
        return <div>Cargando perfil o no autenticado...</div>;
    }

    return (
        // Contenedor principal para centrar el contenido de la página
        <div className="page-container">
            <div className="perfil-card-grande">
            <div className="back-button-container">
                    <button 
                        onClick={handleGoBack}
                        // Usaremos una clase limpia y la clase de acción secundaria (azul claro)
                        className="btn-volver btn-accion-secundaria" >&larr; Volver al Dashboard
                    </button>
                </div>


                <h1 className="content-title">👤 Perfil y Acciones del Asesor</h1>

                {/* Detalles del Perfil */}
                <div className="profile-details-section">
                    <p><strong>Nombre:</strong> {user.nombre}</p>
                    <p><strong>Correo:</strong> {user.email}</p>
                    <p><strong>Rol:</strong> {user.rol.toUpperCase()}</p>
                    <p><strong>ID de Usuario:</strong> {user.id}</p>
                    <p><strong>Fecha de Creación:</strong> {user.fecha_creacion.toLocaleDateString()}</p>
                </div>

                {/* Sección de Acciones (Botones) */}
                <div className="actions-grid-BarraUsuario">

                    {/* Botón 1: Crear Solicitud */}
                    <button
                        onClick={handleCrearSolicitud}
                        className="btn-accion-principal btn-grande">Crear Nueva Solicitud</button>

                    {/* Botón 2: Exportar Solicitudes */}
                    <button
                        onClick={handleAbrirExportar}
                        className="btn-accion-secundaria btn-grande"
                        disabled={isExporting} > {isExporting ? 'Procesando...' : 'Exportar Solicitudes'}
                    </button>
                    
                    <button
                        onClick={handleCrearCliente}
                        className="btn-accion-secundaria btn-grande">Registrar Cliente
                    </button>

                    {/* Indicador de Pendientes */}
                    <div className="solicitudes-pendientes-info">
                        Tienes
                        <span className="badge-pending-grande">{solicitudesPendientesCount}</span>
                        Solicitudes Pendientes de Revisión.
                    </div>
                </div>
                {exportError && <p className="error-message">{exportError}</p>}
                {/* Botón 3: Cerrar Sesión */}
                <button
                    className="logout-button-grande"
                    onClick={handleLogout}>Cerrar Sesión</button>
            </div>
            <ExportModal 
                isOpen={isExportModalOpen} 
                onClose={() => setIsExportModalOpen(false)} 
                onExportar={handleExportarSolicitudes} 
                isExporting={isExporting} // Pasar el estado de carga al modal
                exportError={exportError} // Pasar el error
            />
        </div>
    );
};

export default BarraUsuario;