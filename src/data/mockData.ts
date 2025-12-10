// src/data/mockData.ts

// 1. IMPORTANTE: Aquí importamos SOLO los tipos (Interfaces)
import type { ISolicitud, IUsuario, ICliente } from '../types/index';

// 2. Aquí importamos los VALORES reales (los que usamos como constantes)
import { RequestStatus, UserRole } from '../types/index';

export const usuarios: IUsuario[] = [
    {
        id: 'u1',
        nombre: 'Admin User',
        email: 'admin@crediticia.com',
        rol: UserRole.ADMIN,
        fecha_creacion: new Date('2024-01-01')
    },
    {
        id: 'u2',
        nombre: 'Juan Pérez',
        email: 'asesor1@crediticia.com',
        rol: UserRole.ADVISOR,
        fecha_creacion: new Date('2024-02-15')
    },
    {
        id: 'u3',
        nombre: 'María García',
        email: 'asesor2@crediticia.com',
        rol: UserRole.ADVISOR,
        fecha_creacion: new Date('2024-03-10')
    }
];

export const clientes: ICliente[] = [
    { id: 'c1', nombre_completo: 'Carlos Rodríguez', identificacion: '123456789', correo: 'carlos@mail.com' },
    { id: 'c2', nombre_completo: 'Ana Martínez', identificacion: '987654321', correo: 'ana@mail.com' },
    { id: 'c3', nombre_completo: 'Roberto López', identificacion: '456123789', correo: 'roberto@mail.com' }
];

export const solicitudes: ISolicitud[] = [
    {
        id: 's1',
        cliente_id: 'c1',
        asesor_id: 'u2',
        monto: 5000000,
        plazo: 12,
        fecha_creacion: new Date('2024-05-31'),
        estado: RequestStatus.COMPLETED,
        
        fecha_evaluacion: new Date('2024-06-01'),
        resultado: 'Aprobado',
        puntaje_riesgo: 85,
        comentarios: 'Cliente con capacidad de pago verificada.'
    },
    {
        id: 's2',
        cliente_id: 'c2',
        asesor_id: 'u2',
        monto: 15000000,
        plazo: 36,
        fecha_creacion: new Date('2024-06-19'),
        estado: RequestStatus.IN_PROCESS
    },
    {
        id: 's3',
        cliente_id: 'c3',
        asesor_id: 'u3',
        monto: 800000,
        plazo: 6,
        fecha_creacion: new Date('2024-06-30'),
        estado: RequestStatus.PENDING 
    }
];