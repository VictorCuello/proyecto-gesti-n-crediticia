
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Layout.css'; 

// 1. Aceptamos 'children' como prop
export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      
      <header className="dashboard-header">
        <h1>Plataforma de Evaluación Crediticia</h1>
        <div className="user-info">
          <span>Bienvenido, {user?.nombre}</span>
          <span className="user-role">({user?.rol})</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </header>

      
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;