// src/pages/CrearCliente.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clientes, solicitudes } from '../data/mockData';
import { RequestStatus } from '../types/index';
import type { ICliente, ISolicitud } from '../types/index';
import '../styles/pages/CrearCliente.css'; // <--- Importamos los estilos

const CrearCliente: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [nombre, setNombre] = useState('');
    const [identificacion, setIdentificacion] = useState('');
    const [correo, setCorreo] = useState('');
    const [monto, setMonto] = useState('');
    const [plazo, setPlazo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const nuevoClienteId = `c${Date.now()}`;
        const nuevaSolicitudId = `s${Date.now()}`;

        const nuevoCliente: ICliente = {
            id: nuevoClienteId,
            nombre_completo: nombre,
            identificacion: identificacion,
            correo: correo
        };

        const nuevaSolicitud: ISolicitud = {
            id: nuevaSolicitudId,
            cliente_id: nuevoClienteId,
            asesor_id: user?.id || 'u2',
            monto: Number(monto),
            plazo: Number(plazo),
            fecha_creacion: new Date(),
            estado: RequestStatus.PENDING
        };

        clientes.push(nuevoCliente);
        solicitudes.push(nuevaSolicitud);

        alert(`¡Éxito!\nCliente registrado y Solicitud #${nuevaSolicitudId} creada correctamente.`);
        navigate('/dashboard'); 
    };

    return (
        <div className="crear-cliente-container">
            <div className="crear-cliente-header">
                <h2>Nueva Solicitud de Crédito</h2>
                <p>Registra los datos del cliente y las condiciones del préstamo.</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <h3 className="section-title">1. Datos del Cliente</h3>
                
                {/* Grid Responsivo */}
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Nombre Completo:</label>
                        <input type="text" className="form-input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Identificación:</label>
                        <input type="text" className="form-input" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} required />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Correo Electrónico:</label>
                    <input type="email" className="form-input" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>

                <h3 className="section-title">2. Condiciones del Crédito</h3>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Monto a Solicitar ($):</label>
                        <input type="number" className="form-input" value={monto} onChange={(e) => setMonto(e.target.value)} required min="0" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Plazo (Meses):</label>
                        <input type="number" className="form-input" value={plazo} onChange={(e) => setPlazo(e.target.value)} required min="1" max="120" />
                    </div>
                </div>

                <div className="btn-group">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-submit">
                        Crear Solicitud
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearCliente;