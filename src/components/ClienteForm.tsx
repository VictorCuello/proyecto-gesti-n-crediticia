// En src/components/ClienteForm.tsx
import React, { useState } from 'react';
import type { IClienteForm } from '../types'; 
import { clientApi } from '../services/api';

interface ClienteFormProps {
    asesorId: string;
    onSubmitSuccess: () => void;
}

// ⚠️ NOTA: Necesitas crear y exportar un clienteApi similar a authApi ⚠️
// Asumimos que existe un 'clientApi' con un método 'createClient'

const ClienteForm: React.FC<ClienteFormProps> = ({ asesorId, onSubmitSuccess }) => {
    const [formData, setFormData] = useState<IClienteForm>({
        nombre_completo: '',
        documento_id: '',
        info_adicional: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const clientData = {
                ...formData,
                creado_por: asesorId, // Campo 'creado_por' para el backend
            };
            
            // 🚀 LLAMADA AL NUEVO ENDPOINT DEL BACKEND 🚀
            const response = await clientApi.createClient(clientData);

            if (response.success) {
                onSubmitSuccess();
            } else {
                setError(response.message || 'Error desconocido al registrar cliente.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor o datos inválidos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="cliente-form">
            {error && <p className="form-error-message">{error}</p>}
            
            <div className="form-group">
                <label className="form-label" htmlFor="nombre_completo">Nombre Completo</label>
                <input
                    type="text"
                    id="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>
            
            <div className="form-group">
                <label className="form-label" htmlFor="documento_id">Documento de Identificación</label>
                <input
                    type="text"
                    id="documento_id"
                    value={formData.documento_id}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="info_adicional">Información Adicional (Opcional)</label>
                <textarea
                    id="info_adicional"
                    value={formData.info_adicional}
                    onChange={handleChange}
                    className="form-input"
                    rows={3}
                />
            </div>
            
            <div className="form-actions-footer">
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Cliente'}
                </button>
            </div>
        </form>
    );
};

export default ClienteForm;