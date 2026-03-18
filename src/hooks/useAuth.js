import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Hook que encapsula toda la lógica de autenticación y estado de sesión interactuando contra Supabase.
 * Escucha automáticamente los cambios de estado (login/logout/caducidad de tokens).
 *
 * @returns {Object} Contexto de autenticación.
 * @returns {string|null} return.usuario - Correo electrónico del usuario logueado. `null` si no hay sesión.
 * @returns {string|null} return.userId - UUID Identificador único del usuario. `null` si no hay sesión.
 * @returns {boolean} return.cargando - `true` mientras se resuelve la sesión inicial contra Supabase (útil para prevenir flashes y saltos a `/login`).
 * @returns {Function} return.cerrarSesion - Método para despachar asíncronamente un "Sign Out".
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
