import { useAuth } from './hooks/useAuth';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './styles/form.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HistoriaFormPage from './pages/HistoriaFormPage';

/**
 * Componente decorativo global que inyecta elementos visuales (ej. Orbes de fondo) 
 * recurrentes para las distintas pantallas (Login, Dashboard, Formulario).
 * Se declara fuera de `App` para evitar rómper la referencialidad y evitar re-montajes.
 * 
 * @param {Object} props - Propiedades estándar de React.
 * @param {React.ReactNode} props.children - Contenido embebido a renderizar.
 * @returns {JSX.Element} Layout contenedor oscuro global.
 */
const GlobalLayout = ({ children }) => (
  <div className="app-container">
    <div className="orb orb-1"></div>
    <div className="orb orb-2"></div>
    {children}
  </div>
);

/**
 * Punto de entrada principal enrutado inteligente de la aplicación (`react-router-dom`).
 * Intercepta y coordina el estado general de autenticación a través de `useAuth()`.
 * Protege las rutas mediante evaluación condicional directa y dispara la navegación segura.
 * 
 * @returns {JSX.Element} Árbol de enrutamiento principal.
 */
function App() {
  const { usuario, userId, cargando, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  // ── Verificando sesión inicial (evita flash de login) ──
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

  // ── Sin sesión → Login ──
  if (!usuario) {
    return (
      <GlobalLayout>
        <Login onLogin={() => {}} />
      </GlobalLayout>
    );
  }

  // ── Modos Conectados → Rutas ──
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
