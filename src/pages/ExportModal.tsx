// src/componentes/ExportModal.tsx
import React, { useState } from 'react';
import type {  ExportFilter, ExportFormat } from '../../asesor-consultas/src/types';

interface ExportModalProps {
    onClose: () => void;
    onExportar: (filtro: ExportFilter,formato: ExportFormat) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExportar }) => {
    const [filtro, setFiltro] = useState<ExportFilter>('Todas');
    const estadosExportables: ExportFilter[] = ['Todas', 'Pendiente', 'En Revisión', 'Aprobada', 'Negada'];
    const [formato, setFormato] = useState<ExportFormat>('CSV');

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        onExportar(filtro,formato);
        // onClose() se llama dentro de onExportar en App.tsx si la exportación es exitosa.
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content small-modal"> 
                {/* ... (Header) ... */}

                <form onSubmit={handleExport} className="modal-form">
                    
                    {/* SELECTOR DE FILTRO DE ESTADO (EXISTENTE) */}
                    <div className="form-group">
                        <label htmlFor="export-filter" className="form-label">Seleccionar Estado:</label>
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

                    {/* NUEVO SELECTOR DE FORMATO DE ARCHIVO */}
                    <div className="form-group">
                        <label htmlFor="export-format" className="form-label">Formato de Archivo:</label>
                        <select
                            id="export-format"
                            value={formato}
                            onChange={(e) => setFormato(e.target.value as ExportFormat)}
                            required
                            className="form-input"
                        >
                            <option value="CSV">Excel (CSV)</option>
                            <option value="PDF">Documento (PDF)</option>
                        </select>
                    </div>  

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit">
                            Descargar 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExportModal;