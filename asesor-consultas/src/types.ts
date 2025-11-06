export interface User {
    id: number;
    nombre: string;
    perfil: 'analista' | 'asesor'; // Definimos los perfiles posibles
    permisos: string[]; // Arreglo de strings para los permisos
}

// SIMULACIÓN DE SESIÓN INICIADA
export const ASESOR_LOGGED_IN: User = {
    id: 101,
    nombre: 'Asesor Principal',
    perfil: 'asesor',
    permisos: ['consultar_solicitudes'], // Único permiso requerido
};

export type EstadoSolicitud = 'Pendiente' | 'En Revisión' | 'Aprobada' | 'Negada';
export type ExportFilter = EstadoSolicitud | 'Todas';

// SIMULACIÓN DE DATOS A CONSULTAR
export interface Solicitud {
    id: number;
    asesorId: number;
    cliente: string;    
    fecha: string;
    estado: EstadoSolicitud;
    Cedula : number;
}

export const SOLICITUDES_DATA: Solicitud[] = [
    { id: 1, cliente: 'Juan Pérez', fecha: '2025-10-20', estado: 'Pendiente', asesorId: 101, Cedula: 12345},
    { id: 2, cliente: 'Maria Glez.', fecha: '2025-10-25', estado: 'En Revisión', asesorId: 101, Cedula : 11111} ,
    { id: 3, cliente: 'Empresa XYZ', fecha: '2025-10-30', estado: 'Aprobada', asesorId: 101, Cedula :22222},
    { id: 6, cliente: 'Roberto A.', fecha: '2025-11-05', estado: 'Pendiente', asesorId: 101, Cedula : 333333},
    { id: 7, cliente: 'Juan Pérez', fecha: '2025-10-20', estado: 'Pendiente', asesorId: 101, Cedula : 12345},
    { id: 8, cliente: 'Maria Glez.', fecha: '2025-10-25', estado: 'En Revisión', asesorId: 101, Cedula: 11111},
    { id: 9, cliente: 'Empresa XYZ', fecha: '2025-10-30', estado: 'Aprobada', asesorId: 101, Cedula :22222},
    { id: 10, cliente: 'Roberto A.', fecha: '2025-11-05', estado: 'Pendiente', asesorId: 101, Cedula : 333333},
    { id: 11, cliente: 'Juan Pérez', fecha: '2025-10-20', estado: 'Pendiente', asesorId: 101, Cedula : 12345},
    { id: 12, cliente: 'Maria Glez.', fecha: '2025-10-25', estado: 'En Revisión', asesorId: 101, Cedula : 11111},
    { id: 13, cliente: 'Empresa XYZ', fecha: '2025-10-30', estado: 'Aprobada', asesorId: 101, Cedula :22222},
    { id: 14, cliente: 'Roberto A.', fecha: '2025-11-05', estado: 'Pendiente', asesorId: 101, Cedula: 333333},
    
    { id: 15, cliente: 'Roberto A.', fecha: '2025-11-05', estado: 'Negada', asesorId: 101, Cedula: 333333},
    
    
    
    // Solicitudes de OTROS usuarios (ID 102)
    { id: 4, cliente: 'Pedro S.', fecha: '2025-11-01', estado: 'Aprobada', asesorId: 102,Cedula :44444 },
    { id: 5, cliente: 'Laura T.', fecha: '2025-11-03', estado: 'Negada', asesorId: 102,Cedula :55555},
];