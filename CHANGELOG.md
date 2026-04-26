# Changelog

Todas las novedades y cambios del proyecto.

## [1.2.0] - 2026-04-25

### Topbar — Navegación y Menú de Usuario
- **Logo clicable**: El icono del diente y el texto "HistoriaClínica" ahora navegan al Dashboard. En el formulario, respeta la validación de cambios sin guardar.
- **Botón Dashboard eliminado**: Se quitó el botón redundante de la barra del formulario; el logo y el botón "Cancelar" cubren esa función.
- **Menú de usuario desplegable**: El badge del email ahora abre un menú contextual con opciones de *Mi Perfil*, *Ajustes* y *Cerrar Sesión* al hacer clic.
- **Cierre por `Escape`**: El menú desplegable se puede cerrar con la tecla Escape.
- **Flecha animada**: El ícono `˅` del badge rota 180° suavemente al abrir el menú.

### Topbar — Refactorización y Calidad
- **`useMemo`** aplicado a `items` y `userMenuItems` para evitar recreaciones en cada render.
- **Tipado estricto**: Reemplazado `any` por `MenuItem` y `MenuItemOptions` de PrimeReact.
- **Estilos inline eliminados**: El template de "Cerrar Sesión" ahora usa la clase `.menu-item-danger` con efecto hover rojo incluido.
- **`<button>` semántico** para el badge de usuario con atributos `aria-haspopup`, `aria-expanded` y `aria-label`.
- **`useEffect` optimizado**: El listener de clic externo solo se registra mientras el menú está abierto.

### Login — Seguridad
- **Rate limiting local**: Tras 5 intentos fallidos, el formulario se bloquea 30 segundos.
- **Persistencia en `localStorage`**: El bloqueo sobrevive recargas de página; el contador continúa desde donde estaba.
- **Cuenta regresiva en tiempo real**: El mensaje de error se actualiza cada segundo y el formulario se habilita automáticamente al expirar.
- **Limpieza de contraseña**: En cada intento fallido, el campo de contraseña se limpia por seguridad.
- **Email normalizado**: El email se convierte a minúsculas antes de enviarse.

### Login — Accesibilidad y Calidad
- **`type="email"`**: El campo de usuario ahora usa el tipo correcto (teclado de email en móvil, autocompletado del navegador).
- **Toggle de contraseña**: Cambiado de `<span>` a `<button>` con `aria-label` (activable con Tab y Enter).
- **`role="alert"`**: El div de error notifica automáticamente a lectores de pantalla.
- **`finally` block**: `setCargando(false)` garantizado tanto en éxito como en error.
- **`useCallback`** aplicado a `manejarSubmit`.
- **`React.SyntheticEvent`**: Reemplazado `React.FormEvent` que estaba marcado como deprecado.
- **Inputs deshabilitados** durante la carga y el período de bloqueo.

## [1.1.0] - 2026-04-18
### Migración y Tipado Estricto
- **TypeScript Migration**: Conversión total del proyecto de JS/JSX a TS/TSX.
- **Definiciones Globales**: Creación de `src/types/index.ts` para centralizar interfaces de base de datos y negocio.
- **Configuración de Entorno**: Adición de `tsconfig.json`, `tsconfig.app.json` y migración a `vite.config.ts`.
- **Filtros Clínicos Rápidos**: Implementación de un sistema de "Chips" para filtrar pacientes con Riesgo Médico (diabetes, hipertensión, etc.), Fumadores y registros con datos incompletos.
- **Limpieza de búsqueda**: Se agregó un botón para limpiar el campo de búsqueda global instantáneamente.

## [1.0.1] - 2026-04-01
### Optimización de Dashboard & UI
- **Server-Side Sorting**: Implementación de ordenamiento directamente en la consulta de Supabase desde la DataTable.
- **SEO & Metadatos**: Configuración de `lang="es"`, título oficial y adición de favicon institucional en `index.html`.
- **Skeleton UI**: Mejora de la experiencia de carga en el Dashboard mediante componentes Skeleton de PrimeReact.
- **Validación de Salida**: Implementación de lógica `hasChanges` y diálogos de confirmación para evitar pérdida de datos al cancelar ediciones (`HistoriaFormPage`).

## [1.0.0] - 2026-03-17
### Reestructuración Profunda (Major Refactor)
- **Arquitectura**: Migración a una estructura basada en páginas y ruteo declarativo con `react-router-dom` v7.
- **Estado Asíncrono**: Integración de **TanStack Query v5** para la gestión de caché y estados de carga del servidor.
- **Formularios Pro**: Implementación de **React Hook Form** junto con validación estricta de esquemas mediante **Zod**.
- **Paginación Inteligente**: Switch a Paginación por Servidor (.range) en el Dashboard para escalabilidad.
- **Backend**: Fortalecimiento de la conexión con Supabase e integración de políticas de seguridad RLS.

---
*Para más detalles, consultar el historial de Git.*
