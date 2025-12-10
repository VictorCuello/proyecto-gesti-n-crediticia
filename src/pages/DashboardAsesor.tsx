// src/pages/DashboardAsesor.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook de navegación
import { useAuth } from '../context/AuthContext';
import { solicitudes as allSolicitudes } from '../data/mockData';
import { RequestStatus } from '../types/index';
import '../styles/pages/DashboardAsesor.css';

const DashboardAsesor: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 2. Inicializamos el hook
  const [filterState, setFilterState] = useState<string>('Todas');

  // Filtramos: Solo las de este asesor
  const mySolicitudes = useMemo(() => {
    if (!user) return [];
    return allSolicitudes.filter(sol => sol.asesor_id === user.id);
  }, [user]);

  // Filtramos: Por estado (botón seleccionado)
  const filteredSolicitudes = useMemo(() => {
    if (filterState === 'Todas') return mySolicitudes;
    return mySolicitudes.filter(sol => sol.estado === filterState);
  }, [filterState, mySolicitudes]);

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
    <div className="dashboard-content">
      <div className="header-actions">
          <h2>Mis Solicitudes ({mySolicitudes.length})</h2>
          
          {/* BOTÓN ACTUALIZADO: Redirige al formulario real */}
          <button 
            className="btn-crear-cliente"
            onClick={() => navigate('/crear-cliente')}
          >
            + Nuevo Cliente
          </button>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        {['Todas', RequestStatus.PENDING, RequestStatus.IN_PROCESS, RequestStatus.COMPLETED].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filterState === status ? 'active' : ''}`}
            onClick={() => setFilterState(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Grid de Tarjetas */}
      <div className="cards-grid">
        {filteredSolicitudes.length > 0 ? (
           filteredSolicitudes.map((sol) => (
            <div key={sol.id} className="solicitud-card">
              <div className="card-header">
                <h3>Solicitud #{sol.id}</h3>
                <span className={`estado-badge ${getEstadoClass(sol.estado)}`}>
                  {sol.estado}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Cliente ID:</strong> {sol.cliente_id}</p>
                <p><strong>Monto:</strong> ${sol.monto.toLocaleString()}</p>
                <p><strong>Fecha:</strong> {sol.fecha_creacion.toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron solicitudes.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardAsesor;