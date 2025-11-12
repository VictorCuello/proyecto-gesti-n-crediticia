import React from 'react';
import { useParams, Link } from 'react-router-dom';

import { solicitudes as allSolicitudes } from '../data/mockData';
import type { ISolicitud } from '../types';



const PaginaDeEvaluacion: React.FC = () => {
    // 1. Obtenemos el ID de la URL
    const { id } = useParams<{ id: string }>();

    // 2. Buscamos la solicitud en los datos
    const solicitud = allSolicitudes.find(s => s.id === id);

    if (!solicitud) {
        return (
            <div>
                <h2>Error: Solicitud no encontrada</h2>
                <Link to="/dashboard">Volver al Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="evaluacion-container">
            <h2>Evaluando Solicitud #{solicitud.id}</h2>
            <p><strong>Cliente ID:</strong> {solicitud.cliente_id}</p>
            <p><strong>Asesor ID:</strong> {solicitud.asesor_id}</p>
            <p><strong>Estado Actual:</strong> {solicitud.estado}</p>
            
            <hr />

            
            <form>
                <p>Formulario de evaluación (Próximamente)...</p>
                
            </form>
        </div>
    );
};

export default PaginaDeEvaluacion;