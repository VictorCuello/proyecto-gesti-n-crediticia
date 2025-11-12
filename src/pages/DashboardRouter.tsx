
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import DashboardAsesor from './DashboardAsesor';
import DashboardAnalista from './DashboardAnalista'; // (Importa el que ya creaste)

const DashboardRouter = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Cargando...</p>;
    }

    // Aquí decide qué "foto" poner en el "marco"
    switch (user.rol) {
      case UserRole.ADVISOR:
        return <DashboardAsesor />;
      
      case UserRole.ADMIN:
        return <DashboardAnalista />;

      default:
        return <p>Rol no reconocido.</p>;
    }
};

export default DashboardRouter;