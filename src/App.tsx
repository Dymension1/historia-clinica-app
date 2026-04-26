import type { ReactNode } from 'react';
import { useAuth } from './hooks/useAuth';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './styles/form.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HistoriaFormPage from './pages/HistoriaFormPage';

interface GlobalLayoutProps {
  children: ReactNode;
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => (
  <div className="app-container">
    <div className="orb orb-1"></div>
    <div className="orb orb-2"></div>
    {children}
  </div>
);

function App() {
  const { usuario, userId, cargando, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Limpiar la URL si no hay sesión y no estamos en la raíz
  useEffect(() => {
    if (!cargando && !usuario && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [usuario, cargando, location.pathname, navigate]);

  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0d1b2e 0%, #0a2744 60%, #0d3866 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', Arial, sans-serif",
      }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🦷</div>
          <div style={{ fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Verificando sesión...</div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <GlobalLayout>
        <Login onLogin={() => {}} />
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard
          usuario={usuario}
          onNueva={() => navigate('/historia/nueva')}
          onEditar={(id) => navigate(`/historia/editar/${id}`)}
          onCerrarSesion={cerrarSesion}
        />} />
        <Route path="/historia/nueva" element={<HistoriaFormPage usuario={usuario} userId={userId} cerrarSesion={cerrarSesion} />} />
        <Route path="/historia/editar/:id" element={<HistoriaFormPage usuario={usuario} userId={userId} cerrarSesion={cerrarSesion} />} />
      </Routes>
    </GlobalLayout>
  );
}

export default App;
