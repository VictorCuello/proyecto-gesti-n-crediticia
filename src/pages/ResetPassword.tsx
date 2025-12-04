import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import '../styles/pages/Auth.css';

interface IResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<IResetPasswordForm>({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación no válido. Por favor, solicita un nuevo enlace.');
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validaciones
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!token) {
      setError('Token de recuperación no válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.resetPassword(token, formData.newPassword);
      
      if (response.success) {
        setMessage('Tu contraseña ha sido actualizada correctamente.');
        setIsSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Error al restablecer la contraseña.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al restablecer la contraseña. El enlace puede haber expirado.');
      }
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
        <h2 className="auth-subtitle">Restablecer Contraseña</h2>
        
        {!token ? (
          <div className="error-message">
            Token de recuperación no válido. Por favor, solicita un nuevo enlace.
            <div className="auth-links" style={{ marginTop: '20px' }}>
              <Link to="/recuperar" className="link">
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="success-message">
            {message}
            <p style={{ marginTop: '10px', fontSize: '14px' }}>
              Serás redirigido al inicio de sesión...
            </p>
          </div>
        ) : (
          <>
            <p className="auth-description">
              Ingresa tu nueva contraseña.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {message && <div className="success-message">{message}</div>}

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </button>

              <div className="auth-links">
                <Link to="/login" className="link">
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
