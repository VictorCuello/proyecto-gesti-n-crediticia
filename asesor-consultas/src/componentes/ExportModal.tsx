// src/componentes/ExportModal.tsx
import React, { useState } from 'react';
import type {  ExportFilter } from '../types';

interface ExportModalProps {
    onClose: () => void;
    onExportar: (filtro: ExportFilter) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExportar }) => {
    const [filtro, setFiltro] = useState<ExportFilter>('Todas');
    const estadosExportables: ExportFilter[] = ['Todas', 'Pendiente', 'En Revisión', 'Aprobada', 'Negada'];

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        onExportar(filtro);
        // onClose() se llama dentro de onExportar en App.tsx si la exportación es exitosa.
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content small-modal"> {/* Usamos una clase CSS para un modal más pequeño */}
                <div className="modal-header">
                    <h3>Exportar Solicitudes a CSV</h3>                    
                </div>

                <form onSubmit={handleExport} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="export-filter">Seleccionar Filtro:</label>
                        <select
                            id="export-filter"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value as ExportFilter)}
                            required
                            className="form-input"
                        >
                            {estadosExportables.map(estado => (
                                <option key={estado} value={estado}>
                                    {estado === 'Todas' ? 'Todas las Solicitudes' : `Solo ${estado}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="modal-note">El archivo se generará en formato CSV con delimitador ";".</p>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit">
                            Descargar CSV
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExportModal;