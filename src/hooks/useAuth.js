import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Hook que encapsula toda la lógica de autenticación con Supabase.
 *
 * Devuelve:
 *  - usuario      → email del usuario logueado (null si no hay sesión)
 *  - userId       → UUID del usuario (null si no hay sesión)
 *  - cargando     → true mientras se verifica la sesión inicial (evita flash de login)
 *  - cerrarSesion → función para hacer sign-out
 */
export function useAuth() {
  const [usuario, setUsuario]   = useState(null);
  const [userId, setUserId]     = useState(null);
  const [cargando, setCargando] = useState(true); // true hasta que getSession() resuelva

  useEffect(() => {
    // 1. Recuperar sesión existente guardada en localStorage (p.ej. tras un refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUsuario(session.user.email);
        setUserId(session.user.id);
      }
      setCargando(false);
    });

    // 2. Escuchar todos los cambios futuros: login, logout, renovación de token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsuario(session.user.email);
        setUserId(session.user.id);
      } else {
        setUsuario(null);
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut(); // onAuthStateChange limpia usuario/userId automáticamente
  };

  return { usuario, userId, cargando, cerrarSesion };
}
