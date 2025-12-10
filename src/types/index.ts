// Enums (using const enums for compatibility)
export const UserRole = {
  ADMIN: 'Analista',
  ADVISOR: 'Asesor'
} as const;

export type ExportFilter = 'Todas' | 'Pendiente' | 'En Revisión' | 'Aprobada' | 'Negada';
export type ExportFormat = 'CSV' | 'PDF';
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const RequestStatus = {
  PENDING: 'Pendiente',
  IN_PROCESS: 'En Proceso',
  COMPLETED: 'Completado'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export const EvaluationResult = {
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado'
} as const;

export type EvaluationResult = typeof EvaluationResult[keyof typeof EvaluationResult];

// Interfaces
export interface IUsuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  fecha_creacion: Date;
}

export interface ICliente {
  id: string;
  nombre_completo: string;
  documento_id: string;
  info_adicional?: string;
  fecha_registro: Date;
  asesor_id: string;
}

export interface IClienteForm {
  nombre_completo: string;
  documento_id: string;
  info_adicional: string; 
}

export interface ISolicitud {
  id: number;
    cliente_id: number;
    asesor_id: number;
    estado: 'PENDING' | 'IN_PROCESS' | 'COMPLETED'; // O usa RequestStatus
    fecha_creacion: Date; // Usar Date para la fecha
    fecha_actualizacion?: Date | null;
    resultado: 'APROBADO' | 'RECHAZADO' | null; // O EvaluationResult
    puntaje_riesgo: number | null;
    comentarios: string | null;
    fecha_evaluacion?: Date | null;

    // 🚀 CAMPO CLAVE QUE FALTA O NO COINCIDE: 
    // Debe coincidir con el alias de la consulta SQL: c.nombre_completo AS cliente_nombre
    cliente_nombre: string;
}

export interface IEvaluacion {
  id: string;
  solicitud_id: string;
  analista_id: string;
  resultado: EvaluationResult;
  puntaje_riesgo: number;
  comentarios: string;
  fecha_evaluacion: Date;
}

// Auth Context Types
export interface IAuthContext {
  user: IUsuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Form Types
export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRecoverPasswordForm {
  email: string;
}
