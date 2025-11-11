// Enums (using const enums for compatibility)
export const UserRole = {
  ADMIN: 'Analista',
  ADVISOR: 'Asesor'
} as const;

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
}

export interface ISolicitud {
  id: string;
  cliente_id: string;
  asesor_id: string;
  estado: RequestStatus;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
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
