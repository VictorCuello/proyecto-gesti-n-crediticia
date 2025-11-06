import React, { useState } from 'react'; 

interface SolicitudModalProps {
  onClose: () => void;
  onSubmit: (nombreCliente: string, cedulaCliente: string) => void;
}

const SolicitudModal: React.FC<SolicitudModalProps> = ({ onClose, onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && cedula) {
      onSubmit(nombre, cedula);
      // onClose() se llama dentro de onSubmit en App.tsx, pero lo llamamos aquí si preferimos la limpieza local
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Crear Nueva Solicitud</h3>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="cedula">Cédula del Cliente (ID):</label>
            <input
              id="cedula"
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo del Cliente:</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="form-input"
            />
          </div>          

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Crear Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudModal;