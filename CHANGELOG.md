# Changelog

Todas las novedades y cambios del proyecto.

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
