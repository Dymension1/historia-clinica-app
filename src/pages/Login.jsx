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

                </form>

                <div className="login-footer">
                    © {new Date().getFullYear()} Historia Clínica · Acceso restringido
                </div>

            </div>
        </div>
    );
}

export default Login;
