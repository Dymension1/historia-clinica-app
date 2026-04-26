import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/Login.css';

interface LoginProps {
    onLogin: (email: string, userId: string) => void;
}

const MAX_INTENTOS = 5;
const BLOQUEO_MS = 30_000; // 30 segundos
const LS_BLOQUEO_KEY = 'hc_login_bloqueado_hasta';
const LS_INTENTOS_KEY = 'hc_login_intentos';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ onLogin }: LoginProps) {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [intentosFallidos, setIntentosFallidos] = useState<number>(
        () => parseInt(localStorage.getItem(LS_INTENTOS_KEY) ?? '0', 10)
    );
    const [bloqueadoHasta, setBloqueadoHasta] = useState<number | null>(
        () => {
            const val = localStorage.getItem(LS_BLOQUEO_KEY);
            if (!val) return null;
            const ts = parseInt(val, 10);
            return Date.now() < ts ? ts : null; // ignorar si ya expiró
        }
    );

    const estaBloqueado = bloqueadoHasta !== null && Date.now() < bloqueadoHasta;

    // Cuenta regresiva en tiempo real
    useEffect(() => {
        if (!estaBloqueado) {
            return;
        }
        const actualizar = () => {
            const restantes = Math.ceil(((bloqueadoHasta ?? 0) - Date.now()) / 1000);
            if (restantes <= 0) {
                setBloqueadoHasta(null);
                localStorage.removeItem(LS_BLOQUEO_KEY);
                setError('');
            } else {
                setError(`Demasiados intentos fallidos. Esperá ${restantes}s antes de intentar de nuevo.`);
            }
        };
        actualizar();
        const intervalo = setInterval(actualizar, 1000);
        return () => clearInterval(intervalo);
    }, [estaBloqueado, bloqueadoHasta]);

    const manejarSubmit = useCallback(async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (estaBloqueado) return;

        setError('');
        setCargando(true);

        try {

            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: usuario.trim().toLowerCase(),
                password: contrasena,
            });

            if (authError) {
                const nuevosIntentos = intentosFallidos + 1;
                setContrasena('');

                if (nuevosIntentos >= MAX_INTENTOS) {
                    const hasta = Date.now() + BLOQUEO_MS;
                    setBloqueadoHasta(hasta);
                    localStorage.setItem(LS_BLOQUEO_KEY, String(hasta));
                    localStorage.setItem(LS_INTENTOS_KEY, '0');
                    setIntentosFallidos(0);
                } else {
                    const restantes = MAX_INTENTOS - nuevosIntentos;
                    setIntentosFallidos(nuevosIntentos);
                    localStorage.setItem(LS_INTENTOS_KEY, String(nuevosIntentos));
                    setError(`Usuario o contraseña incorrectos. ${restantes} intento${restantes !== 1 ? 's' : ''} restante${restantes !== 1 ? 's' : ''}.`);
                }
                return;
            }

            setIntentosFallidos(0);
            setBloqueadoHasta(null);
            localStorage.removeItem(LS_BLOQUEO_KEY);
            localStorage.removeItem(LS_INTENTOS_KEY);
            onLogin(data.user.email ?? '', data.user.id);
        } finally {
            setCargando(false);
        }
    }, [usuario, contrasena, intentosFallidos, estaBloqueado, onLogin]);

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
                        <label className="login-label" htmlFor="input-usuario">Email</label>
                        <input
                            id="input-usuario"
                            type="email"
                            className={`login-input ${emailError ? 'login-input--error' : ''}`}
                            placeholder="correo@ejemplo.com"
                            value={usuario}
                            onChange={(e) => { setUsuario(e.target.value); if (emailError) setEmailError(''); }}
                            onBlur={() => {
                                if (usuario && !EMAIL_REGEX.test(usuario.trim())) {
                                    setEmailError('Ingresá un correo electrónico válido.');
                                } else {
                                    setEmailError('');
                                }
                            }}
                            autoComplete="username"
                            autoFocus
                            required
                            disabled={cargando || estaBloqueado}
                            aria-describedby={emailError ? 'email-error' : (error ? 'global-error' : undefined)}
                            aria-invalid={!!emailError || !!error}
                        />
                        {emailError && (
                            <span id="email-error" className="login-field-error" role="alert">
                                {emailError}
                            </span>
                        )}
                    </div>

                    <div className="login-input-wrapper">
                        <label className="login-label" htmlFor="input-contrasena">Contraseña</label>
                        <div className="login-input-field">
                            <input
                                id="input-contrasena"
                                type={mostrarContrasena ? 'text' : 'password'}
                                className="login-input login-input--password"
                                placeholder="Ingrese su contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                autoComplete="current-password"
                                required
                                disabled={cargando || estaBloqueado}
                                aria-describedby={error ? 'global-error' : undefined}
                                aria-invalid={!!error}
                            />
                            <button
                                type="button"
                                className="login-input-icon"
                                onClick={() => setMostrarContrasena(prev => !prev)}
                                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                aria-pressed={mostrarContrasena}
                            >
                                {mostrarContrasena ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div id="global-error" className="login-error" role="alert" aria-live="assertive">
                            <span aria-hidden="true">⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={cargando || !usuario || !EMAIL_REGEX.test(usuario.trim()) || !contrasena || estaBloqueado}
                    >
                        {cargando ? (
                            <><span className="spinner"></span>Ingresando...</>
                        ) : (
                            'Ingresar al sistema'
                        )}
                    </button>

                </form>

                <footer className="login-footer">
                    © {new Date().getFullYear()} Historia Clínica · Acceso Restringido
                </footer>

            </div>
        </div>
    );
}

export default Login;
