// src/App.tsx - (VERSIÓN FINAL)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components';

// 1. Importa todo lo que necesitas
import Layout from './pages/Layout';
import { Login, Register, RecoverPassword } from './pages';
import DashboardRouter from './pages/DashboardRouter';
// (Aquí importarás tu futura página de evaluación)
// import PaginaDeEvaluacion from './pages/PaginaDeEvaluacion';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<RecoverPassword />} />
          
          {/* Ruta Protegida del Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout> {/* 2. El Marco envuelve */}
                  <DashboardRouter /> {/* 3. El Cerebro decide */}
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta Protegida de Evaluación (LA QUE TIENE EL ERROR) */}
          <Route 
            path="/evaluar/:id"
            element={
              <ProtectedRoute>
                <Layout> {/* 4. El Marco envuelve */}
                  {/* 5. El error desaparece! */}
                  <div>Página de Evaluación (Próximamente)</div>
                  {/* <PaginaDeEvaluacion /> */}
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Default y 404 */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;