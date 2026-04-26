import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UseAuthReturn {
  usuario: string | null;
  userId: string | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
}

/**
 * Hook que encapsula toda la lógica de autenticación y estado de sesión interactuando contra Supabase.
 * Escucha automáticamente los cambios de estado (login/logout/caducidad de tokens).
 */
export function useAuth(): UseAuthReturn {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUsuario(session.user.email ?? null);
        setUserId(session.user.id);
      }
      setCargando(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsuario(session.user.email ?? null);
        setUserId(session.user.id);
      } else {
        setUsuario(null);
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  return { usuario, userId, cargando, cerrarSesion };
}
