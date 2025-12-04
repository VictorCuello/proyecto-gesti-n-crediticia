import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { IRecoverPasswordForm } from '../types';
import { authApi } from '../services/api';
import '../styles/pages/Auth.css';

export const RecoverPassword = () => {
  const [formData, setFormData] = useState<IRecoverPasswordForm>({
    email: ''
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword(formData.email);
      
      if (response.success) {
        setMessage(response.message || 'Se ha enviado un correo electrónico con instrucciones para recuperar su contraseña.');
        setFormData({ email: '' });
      } else {
        setError(response.message || 'Error al procesar la solicitud.');
      }
    } catch (err) {
      // Por seguridad, mostramos mensaje genérico
      setMessage('Si el email está registrado, recibirás instrucciones para recuperar tu contraseña.');
      setFormData({ email: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Plataforma de Evaluación Crediticia</h1>
        <h2 className="auth-subtitle">Recuperar Contraseña</h2>
        
        <p className="auth-description">
          Ingrese su correo electrónico y le enviaremos instrucciones para restablecer su contraseña.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="ejemplo@correo.com"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>

          <div className="auth-links">
            <Link to="/login" className="link">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
