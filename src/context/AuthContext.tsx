import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { IAuthContext, IUsuario } from '../types';
import { UserRole } from '../types';
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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = usuarios.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    const existingUser = usuarios.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Create new user (advisor by default)
    const newUser: IUsuario = {
      id: `user_${Date.now()}`,
      nombre,
      email,
      password,
      rol: UserRole.ADVISOR, // New users are advisors
      fecha_creacion: new Date()
    };

    // Add to mock data
    usuarios.push(newUser);
    
    // Auto-login after registration
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
