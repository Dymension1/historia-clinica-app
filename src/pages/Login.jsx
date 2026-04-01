import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Login.css';

/**
 * Pantalla monolítica de Autenticación que gestiona las identidades operativas de odontólogos/admin.
 * Controla visualmente el ingreso, ofusca contraseñas y propaga los permisos a Supabase.
 *
 * @param {Object} props
 * @param {Function} props.onLogin - Callback accionado tras la verificación exitosa de credenciales remota (inyectado desde base para control).
 * @returns {JSX.Element} Target visual para el formuario de ingreso al sistema.
 */
function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: usuario.trim(),
            password: contrasena,
        });

        if (error) {
            setError('Usuario o contraseña incorrectos');
            setCargando(false);
            return;
        }

        // Autenticación exitosa — pasamos email y userId
        onLogin(data.user.email, data.user.id);
    };

    /*
    const manejarLoginGoogle = async () => {
        setError('');
        setCargando(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            setError('Error al conectar con Google');
            setCargando(false);
        }
    };
    */

    return (
        <div className="login-wrapper">
            <div className="login-card">

                {/* Logo / Marca */}
                <div className="login-logo">
                    <div className="login-logo-icon">🦷</div>
                    <div className="login-logo-text">Historia<span>Clínica</span></div>
                </div>
                <p className="login-subtitle">Sistema de gestión odontológica</p>

                {/* Formulario */}
                <form onSubmit={manejarSubmit} noValidate>

                    <div className="login-input-wrapper">
                        <label className="login-label" htmlFor="input-usuario">Usuario</label>
                        <input
                            id="input-usuario"
                            type="text"
                            className="login-input"
                            placeholder="Ingrese su usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            autoComplete="username"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="login-input-wrapper">
                        <label className="login-label" htmlFor="input-contrasena">Contraseña</label>
                        <div className="login-input-field">
                            <input
                                id="input-contrasena"
                                type={mostrarContrasena ? 'text' : 'password'}
                                className="login-input"
                                placeholder="Ingrese su contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                autoComplete="current-password"
                                required
                                style={{ paddingRight: '44px' }}
                            />
                            <span
                                className="login-input-icon"
                                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                title={mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                            >
                                {mostrarContrasena ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="login-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={cargando || !usuario || !contrasena}
                    >
                        {cargando ? (
                            <><span className="spinner"></span>Ingresando...</>
                        ) : (
                            'Ingresar al sistema'
                        )}
                    </button>

                    {/*
                    <div className="login-divider">
                        <span>o continuar con</span>
                    </div>

                    <button
                        type="button"
                        className="login-google-btn"
                        onClick={manejarLoginGoogle}
                        disabled={cargando}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>Google</span>
                    </button>
                    */}

                </form>

                <div className="login-footer">
                    © {new Date().getFullYear()} Historia Clínica · Acceso restringido
                </div>

            </div>
        </div>
    );
}

export default Login;
