import type { ISolicitud } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

interface LoginResponse {
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    fecha_creacion: string;
  };
  token: string;
}

interface ClientCreationResponse {
    id: string; // Asumimos que la respuesta incluye la ID del cliente creado
    nombre_completo: string;
    // ... otros campos
}

// Tipo para los datos que se envían desde el formulario
interface ClientCreationData {
    nombre_completo: string;
    documento_id: string;
    info_adicional: string;
    creado_por: string; // ID del asesor
}

interface RegisterResponse {
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    fecha_creacion: string;
  };
  token: string;
}

interface ClienteData {
    id: number;
    nombre_completo: string;
    documento_id: string;
}

interface SolicitudCreationData {
    cliente_id: number;
    asesor_id: number;
    estado?: string; // Opcional si el backend lo maneja
}

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Base fetch function with error handling
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};
export const solicitudApi = {
    
    getClientes: async (): Promise<ApiResponse<ClienteData[]>> => {
        // ⚠️ Asume que tu backend tiene esta ruta: GET /api/clientes
        // Si tu backend devuelve un array directamente en 'data', usa esta ruta
        return apiFetch<ClienteData[]>('/clientes', {
            method: 'GET',
        });
    },
    getSolicitudesByAsesor: async (
        asesorId: string, // Se pasa el ID del asesor desde el Contexto
        estadoFiltro: string | 'Todas' = 'Todas'
    ): Promise<ApiResponse<ISolicitud[]>> => {
        
        let endpoint = `/solicitudes/asesor?asesorId=${asesorId}`;

        if (estadoFiltro !== 'Todas') {
            endpoint += `&estado=${estadoFiltro}`;
        }
        
        // Asumimos que esta ruta está protegida y registrada en tu backend.
        return apiFetch<ISolicitud[]>(endpoint, {
            method: 'GET',
        });
    },

    createSolicitud: async (
        data: SolicitudCreationData
    ): Promise<ApiResponse> => {
        // ⚠️ Asume esta ruta en tu backend: POST /api/solicitudes/crear
        return apiFetch('/solicitudes/crear', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    
};
// Auth API functions
export const authApi = {
  /**
   * Iniciar sesión
   */
  login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (
    nombre: string,
    email: string,
    password: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    const response = await apiFetch<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });

    if (response.success && response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  },

  /**
   * Solicitar recuperación de contraseña
   */
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Restablecer contraseña
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    return apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser: async (): Promise<ApiResponse<{ user: LoginResponse['user'] }>> => {
    return apiFetch('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Verificar token
   */
  verifyToken: async (): Promise<ApiResponse<{ user: LoginResponse['user'] }>> => {
    return apiFetch('/auth/verify-token', {
      method: 'POST',
    });
  },

  /**
   * Cerrar sesión (limpiar token local)
   */
  logout: (): void => {
    removeToken();
  },
  

  /**
   * Verificar si hay un token almacenado
   */
  hasToken: (): boolean => {
    return !!getToken();
  },
};

export const clientApi = {
    createClient: async (
        clientData: ClientCreationData
    ): Promise<ApiResponse<ClientCreationResponse>> => {
        // ⚠️ NOTA: Asume que tienes un endpoint en tu backend: POST /api/clientes/crear
        return apiFetch<ClientCreationResponse>('/clientes/crear', {
            method: 'POST',
            body: JSON.stringify(clientData),
        });
    },

    // Aquí puedes agregar otras funciones como getClient, updateClient, etc.
};

export { getToken, setToken, removeToken };
export default authApi;
