# Changelog

Todas las novedades y cambios del proyecto.

## [1.0.1] - 2026-04-18
### Mejoras Técnicas & Refactorización
- **Migración total a TypeScript**: El proyecto ahora es 100% Type-Safe, mejorando la robustez y mantenibilidad.
- **Optimización de Dashboard**:
    - Implementación de **ordenamiento por servidor (Server-side sorting)** en la DataTable de pacientes.
    - Implementación de **paginación perezosa (Lazy loading)** conectada directamente a Supabase.
    - Added **Skeleton loading** para mejorar la percepción de carga en la lista de pacientes.
- **Mejoras en Formularios**:
    - Se agregó lógica de detección de cambios antes de cerrar o abandonar el formulario de historia clínica.
    - Refactorización de tipos e interfaces para alinearse con el esquema de la base de datos y validaciones Zod.
- **Correcciones de Errores**:
    - Se solucionó un problema de tipos en la inicialización de la DataTable durante estados de carga.

### UI/UX & Identidad
- **Actualización de Metadatos**: Se estableció el título oficial ("Historia Clínica · Sistema Odontológico"), el idioma (`lang="es"`) y se agregó el favicon institucional.
- **Feedback Visual**: Integración de notificaciones Toast y diálogos de confirmación para acciones críticas (eliminar, cancelar cambios).

## [1.0.0] - 2026-03-20
### Lanzamiento Inicial
- Funcionalidad básica de ABM (Alta, Baja, Modificación) de historias clínicas.
- Integración con Supabase para autenticación y base de datos.
- Diseño inicial responsivo con PrimeReact.
