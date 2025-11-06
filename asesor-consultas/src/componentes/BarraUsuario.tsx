import React from 'react';
import type { User } from '../types';
import '../componentesCss/DashboardAsesor.css';

interface BarraUsuarioProps {
    user: User;
    onLogout: () => void;
    solicitudesPendientesCount: number; 
    onCrearSolicitud: () => void;
    onAbrirExportar: () => void;
}

const BarraUsuario: React.FC<BarraUsuarioProps> = ({ user, onLogout, solicitudesPendientesCount, onCrearSolicitud, onAbrirExportar }) => {        


    const handleExportClick = (e: React.MouseEvent) => {
        e.preventDefault(); 
        onAbrirExportar();
    };

    return (        
        <div className="BarraUsuario">
            {/*Datos perfil*/}
            <div className="profile-card">
                <div className="profile-icon">👤</div>
                <h3>{user.nombre}</h3>
                <p className="profile-perfil">{user.perfil.toUpperCase()} (ID: {user.id})</p>
            </div>
        {/*Boton crear solicitud */}
            <button 
                        onClick={onCrearSolicitud}
                        className="btn-accion-principal">
                        Crear Solicitud
            </button>
        {/*botones de usuario */}
            <nav className="BarraUsuario-nav">
                <h4>Configuración y Acciones</h4>
                <ul>                    
                    <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Navegando a Ajustes de Cuenta..."); }}>Ajustes de Cuenta</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Navegando a Historial de Logins..."); }}>Historial de Logins</a></li>
                    <li className="nav-item-Export">
                        <a href="#" onClick={handleExportClick} className="menu-link">
                            Exportar a CSV
                        </a>
                    </li>
                </ul>   
            </nav> 

        {/* 3. Conteo de Solicitudes */}
            <div className="navigation-section">                 
                <ul className="nav-list">
                    {/* Conteo Dinámico */}
                    <li className="menu-item-count">
                        <span className="menu-link">
                            Solicitudes Pendientes
                        </span>
                        <span className="badge-pending">{solicitudesPendientesCount}</span>
                    </li> 
                </ul>
            </div>
         {/* boton cerrar sesión */}           
            <button className="logout-button-BarraUsuario" onClick={onLogout}>
                Cerrar Sesión
            </button>
            <p className="BarraUsuario-version">v1.0. Asesor Dashboard</p>
        </div>
    );
};

export default BarraUsuario;