import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IAuthContext, IUsuario } from '../types';
import { authApi } from '../services/api';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      if (authApi.hasToken()) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data?.user) {
            const userData = response.data.user;
            setUser({
              id: String(userData.id),
              nombre: userData.nombre,
              email: userData.email,
              password: '', // No almacenamos la contraseña
              rol: userData.rol as IUsuario['rol'],
              fecha_creacion: new Date(userData.fecha_creacion)
            });
          } else {
            authApi.logout();
          }
        } catch {
          authApi.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser({
          id: String(userData.id),
          nombre: userData.nombre,
          email: userData.email,
          password: '',
          rol: userData.rol as IUsuario['rol'],
          fecha_creacion: new Date(userData.fecha_creacion)
        });
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.register(nombre, email, password);

      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser({
          id: String(userData.id),
          nombre: userData.nombre,
          email: userData.email,
          password: '',
          rol: userData.rol as IUsuario['rol'],
          fecha_creacion: new Date(userData.fecha_creacion)
        });
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value: IAuthContext = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  // Mostrar loading mientras se verifica el token
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
