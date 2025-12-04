// API Configuration
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

export { getToken, setToken, removeToken };
export default authApi;
