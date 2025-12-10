
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import  AuthProvider  from './context/AuthContext';
import { ProtectedRoute } from './components';


import Layout from './pages/Layout';
import { Login, Register, RecoverPassword, ResetPassword, BarraUsuario } from './pages';
import DashboardRouter from './pages/DashboardRouter';
import PaginaDeEvaluacion from './pages/PaginaDeEvaluacion';
import CrearUsuario from './pages/CrearCliente';
import CrearSolicitud from './pages/CrearSolicitud';


import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<RecoverPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitudes/crear"
            element={
              <ProtectedRoute>
                <Layout>
                  <CrearSolicitud />
                </Layout>
              </ProtectedRoute>
            }
/>

          <Route
            path="/evaluar/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaginaDeEvaluacion />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/crear" // ⬅️ Definimos la ruta de navegación
            element={
              <ProtectedRoute>
                <Layout>
                  <CrearUsuario />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil-usuario"
            element={
              <ProtectedRoute>
                <Layout>
                  <BarraUsuario />
                </Layout>
              </ProtectedRoute>
            }
          />

          { }
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;