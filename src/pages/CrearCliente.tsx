import React from 'react';
import ClienteForm from '../components/ClienteForm.tsx'; // Nuevo componente
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Para obtener el user.id
import '../styles/pages/CrearCliente.css'; // Nuevo CSS

const CrearCliente: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return <div>Error: Sesión no detectada.</div>;
    }

    const asesorId = user.id;

    // Función para manejar el éxito del formulario
    const handleClientCreated = () => {
        alert('Cliente registrado exitosamente!');
        navigate(-1); // Volver a la página anterior (BarraUsuario)
    };

    return (
        <div className="page-container-centered">
            <div className="crear-cliente-card">
                <h1 className="content-title-secondary">Registro de Nuevo Cliente</h1>
                
                {/* Mostramos el asesor logueado */}
                <p className="creado-por-info">
                    Registrado por: <strong>{user.nombre} (ID: {asesorId})</strong>
                </p>

                <ClienteForm 
                    asesorId={asesorId} 
                    onSubmitSuccess={handleClientCreated} 
                />

                <button onClick={() => navigate(-1)} className="btn-cancel-volver">
                    &larr; Cancelar
                </button>
            </div>
        </div>
    );
};

export default CrearCliente;