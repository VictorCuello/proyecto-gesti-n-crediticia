import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Dashboard.css';

export const Dashboard = () => {
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
        <div className="dashboard-content">
          <h2>Dashboard - {user?.rol}</h2>
          <p>Esta es la vista principal del dashboard.</p>
          <div className="info-card">
            <h3>Información del Usuario</h3>
            <p><strong>Nombre:</strong> {user?.nombre}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.rol}</p>
            <p><strong>Fecha de registro:</strong> {user?.fecha_creacion.toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};
