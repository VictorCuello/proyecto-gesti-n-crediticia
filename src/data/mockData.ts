import type { IUsuario, ICliente, ISolicitud, IEvaluacion } from '../types';
import { UserRole, RequestStatus, EvaluationResult } from '../types';

// Mock users - Includes admin and advisors
export const usuarios: IUsuario[] = [
  {
    id: '1',
    nombre: 'Admin User',
    email: 'admin@crediticia.com',
    password: 'admin123', // In production, passwords should be hashed
    rol: UserRole.ADMIN,
    fecha_creacion: new Date('2024-01-15')
  },
  {
    id: '2',
    nombre: 'Juan Pérez',
    email: 'asesor1@crediticia.com',
    password: 'password123',
    rol: UserRole.ADVISOR,
    fecha_creacion: new Date('2024-02-20')
  },
  {
    id: '3',
    nombre: 'María García',
    email: 'asesor2@crediticia.com',
    password: 'password123',
    rol: UserRole.ADVISOR,
    fecha_creacion: new Date('2024-03-10')
  }
];

// Mock clients
export const clientes: ICliente[] = [
  {
    id: 'c1',
    nombre_completo: 'Carlos Rodríguez',
    documento_id: '12345678',
    info_adicional: 'Cliente preferencial',
    fecha_registro: new Date('2024-04-01')
  },
  {
    id: 'c2',
    nombre_completo: 'Ana Martínez',
    documento_id: '87654321',
    info_adicional: 'Nuevo cliente',
    fecha_registro: new Date('2024-04-15')
  },
  {
    id: 'c3',
    nombre_completo: 'Roberto López',
    documento_id: '45678912',
    fecha_registro: new Date('2024-05-01')
  }
];

// Mock requests
export const solicitudes: ISolicitud[] = [
  {
    id: 's1',
    cliente_id: 'c1',
    asesor_id: '2',
    estado: RequestStatus.COMPLETED,
    fecha_creacion: new Date('2024-06-01'),
    fecha_actualizacion: new Date('2024-06-15')
  },
  {
    id: 's2',
    cliente_id: 'c2',
    asesor_id: '2',
    estado: RequestStatus.IN_PROCESS,
    fecha_creacion: new Date('2024-06-20'),
    fecha_actualizacion: new Date('2024-06-25')
  },
  {
    id: 's3',
    cliente_id: 'c3',
    asesor_id: '3',
    estado: RequestStatus.PENDING,
    fecha_creacion: new Date('2024-07-01'),
    fecha_actualizacion: new Date('2024-07-01')
  }
];

// Mock evaluations
export const evaluaciones: IEvaluacion[] = [
  {
    id: 'e1',
    solicitud_id: 's1',
    analista_id: '1',
    resultado: EvaluationResult.APPROVED,
    puntaje_riesgo: 85,
    comentarios: 'Cliente con excelente historial crediticio',
    fecha_evaluacion: new Date('2024-06-15')
  },
  {
    id: 'e2',
    solicitud_id: 's2',
    analista_id: '1',
    resultado: EvaluationResult.APPROVED,
    puntaje_riesgo: 72,
    comentarios: 'Aprobado con condiciones estándar',
    fecha_evaluacion: new Date('2024-06-25')
  }
];
