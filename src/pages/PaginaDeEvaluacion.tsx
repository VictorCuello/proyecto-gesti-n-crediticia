// src/pages/PaginaDeEvaluacion.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { solicitudes as allSolicitudes, clientes } from '../data/mockData';

const PaginaDeEvaluacion: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const solicitud = allSolicitudes.find(s => s.id === id);
    const clienteNombre = clientes.find(c => c.id === solicitud?.cliente_id)?.nombre_completo || 'Desconocido';

    const [puntaje, setPuntaje] = useState<number>(0);
    const [resultado, setResultado] = useState<string>('Aprobado');
    const [comentarios, setComentarios] = useState<string>('');

    if (!solicitud) {
        return <div style={{padding: 20}}><h2>Error: Solicitud no encontrada</h2><Link to="/dashboard">Volver</Link></div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // SIMULACIÓN DE ACTUALIZACIÓN EN BASE DE DATOS
        alert(`¡Evaluación Guardada!\n\nSe actualizó la tabla 'Solicitudes' en MySQL:\nID: ${id}\nEstado: COMPLETADO\nResultado: ${resultado}\nPuntaje: ${puntaje}\nComentarios: ${comentarios}`);
        navigate('/dashboard');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Evaluación de Crédito</h2>
                <Link to="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>&larr; Cancelar</Link>
            </div>

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0 }}>Datos de la Solicitud #{solicitud.id}</h3>
                <p><strong>Cliente:</strong> {clienteNombre}</p>
                <p><strong>Monto:</strong> ${solicitud.monto.toLocaleString()}</p>
                <p><strong>Plazo:</strong> {solicitud.plazo} meses</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Puntaje de Riesgo (0 - 100):</label>
                    <input type="number" min="0" max="100" value={puntaje} onChange={(e) => setPuntaje(Number(e.target.value))} style={{ width: '100%', padding: '10px' }} required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Resultado:</label>
                    <select value={resultado} onChange={(e) => setResultado(e.target.value)} style={{ width: '100%', padding: '10px' }}>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Comentarios:</label>
                    <textarea rows={4} value={comentarios} onChange={(e) => setComentarios(e.target.value)} style={{ width: '100%', padding: '10px' }} required />
                </div>
                <button type="submit" style={{ background: '#28a745', color: 'white', padding: '12px', width: '100%', border: 'none', cursor: 'pointer' }}>Finalizar Evaluación</button>
            </form>
        </div>
    );
};

export default PaginaDeEvaluacion;