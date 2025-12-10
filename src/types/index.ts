// src/types/index.ts

// 1. Constantes (Simulación de Enums compatible con tu configuración)
export const UserRole = {
    ADMIN: 'Admin',
    ADVISOR: 'Asesor',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const RequestStatus = {
    PENDING: 'Pendiente',
    IN_PROCESS: 'En Proceso',
    COMPLETED: 'Completado',
    REJECTED: 'Rechazado',
} as const;
export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

// 2. Interfaces
export interface IUsuario {
    id: string;
    nombre: string;
    email: string;
    rol: UserRole;
    fecha_creacion: Date;
    password?: string; // <-- Agregado para evitar errores en AuthContext
}

export interface ICliente {
    id: string;
    nombre_completo: string;
    identificacion: string;
    correo: string;
}

export interface ISolicitud {
    id: string;
    cliente_id: string;
    asesor_id: string;
    monto: number;
    plazo: number; // meses
    fecha_creacion: Date;
    estado: RequestStatus;

    // Campos de Evaluación
    fecha_evaluacion?: Date;
    resultado?: 'Aprobado' | 'Rechazado';
    puntaje_riesgo?: number;
    comentarios?: string;
}

// 3. Interface del Contexto (¡ESTA FALTABA!)
export interface IAuthContext {
    user: IUsuario | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (nombre: string, email: string, password: string) => Promise<boolean>;
    isAuthenticated: boolean;
}