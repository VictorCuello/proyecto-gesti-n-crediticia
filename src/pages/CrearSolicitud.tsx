import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Importa el nuevo servicio desde api.ts
import { solicitudApi } from '../services/api'; 
import '../styles/pages/CrearSolicitud.css'; // Debes crear este CSS

// Interfaz mínima para los clientes (adaptar a tus tipos)
interface Cliente {
    id: number;
    nombre_completo: string;
    documento_id: string;
}

const CrearSolicitud: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const asesorId = user!.id;

    useEffect(() => {
        if (!asesorId) return; 

        const fetchClientes = async () => {
            
            setLoading(true);
            
            try {
                const response = await solicitudApi.getClientes();
                
                if (response.success && Array.isArray(response.data)) {
                    setClientes(response.data);
                } else {
                    setError('Fallo al cargar clientes: ' + (response.message || 'Error desconocido del API.'));
                }
            } catch (err: any) {
                // Esto captura errores de red (500, 404, conexión)
                setError(`Error de red: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, [asesorId]);

    // --- Manejar el Envío ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!selectedClientId) {
            alert('Debe seleccionar un cliente.');
            setIsSubmitting(false);
            return;
        }

        const solicitudData = {
            cliente_id: parseInt(selectedClientId),
            asesor_id: parseInt(asesorId), // Aseguramos que sea número si la DB lo requiere
            estado: 'Pendiente', // El backend DEBE usar esto como fallback/default.
        };

        try {
            const response = await solicitudApi.createSolicitud(solicitudData);
            
            if (response.success) {
                alert('🚀 Solicitud de crédito creada exitosamente!');
                navigate('/dashboard'); 
            } else {
                setError(response.message || 'Error al crear la solicitud en el servidor.');
            }
        } catch (err: any) {
            setError('Error de conexión al servidor: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return <div className="page-container">No autenticado.</div>;
    if (loading) return <div className="page-container">Cargando clientes...</div>;
    
    return (
        <div className="page-container-centered">
            <div className="form-card-solicitud">
                <h1 className="content-title-secondary">📝 Nueva Solicitud de Crédito</h1>
                
                <form onSubmit={handleSubmit} className="solicitud-form">
                    
                    {error && <p className="form-error-message">{error}</p>}

                    <div className="form-group">
                        <label htmlFor="clienteId" className="form-label">Cliente Requerido</label>
                        <select
                            id="clienteId"
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="form-input"
                            required
                            disabled={clientes.length === 0}
                        >
                            <option value="">-- Seleccione un cliente --</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre_completo} (ID: {cliente.documento_id})
                                </option>
                            ))}
                        </select>
                        {clientes.length === 0 && (
                             <p className="nota-alerta">⚠️ No se encontraron clientes. Registre uno primero.</p>
                        )}
                    </div>

                    <div className="form-actions-footer">
                        <button type="submit" className="btn-submit-solicitud" disabled={isSubmitting || clientes.length === 0}>
                            {isSubmitting ? 'Creando...' : 'Crear Solicitud'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            className="btn-cancel-volver-solicitud"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearSolicitud;