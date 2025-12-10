// src/context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
// Importamos Tipos y Valores por separado para evitar el error de 'verbatimModuleSyntax'
import type { IAuthContext, IUsuario } from '../types/index';
import { UserRole } from '../types/index';
import { usuarios } from '../data/mockData';

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
  const [user, setUser] = useState<IUsuario | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // --- FUNCIÓN LOGIN ARREGLADA (BYPASS DE CONTRASEÑA) ---
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulamos delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Intentando login con:", email);

    // TRUCO: Buscamos SOLO por email. 
    // Quitamos la parte de "&& u.password === password" para que entres fácil.
    const foundUser = usuarios.find(u => u.email === email);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };
  // -----------------------------------------------------

  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = usuarios.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: IUsuario = {
      id: `user_${Date.now()}`,
      nombre,
      email,
      rol: UserRole.ADVISOR, // Nuevos usuarios son asesores por defecto
      fecha_creacion: new Date(),
      password // Guardamos la pass aunque no la validemos
    };
  
    usuarios.push(newUser);
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: IAuthContext = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};