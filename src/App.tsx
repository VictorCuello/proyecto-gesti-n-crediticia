
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components';


import Layout from './pages/Layout';
import { Login, Register, RecoverPassword } from './pages';
import DashboardRouter from './pages/DashboardRouter';
import PaginaDeEvaluacion from './pages/PaginaDeEvaluacion';


import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<RecoverPassword />} />


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
            path="/evaluar/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaginaDeEvaluacion />
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