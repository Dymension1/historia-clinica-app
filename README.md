# 🦷 Historia Clínica App

Aplicación web profesional para la gestión de historias clínicas odontológicas. Diseñada con una interfaz moderna, responsiva y optimizada para el flujo de trabajo clínico. Permite registrar, editar y consultar pacientes con toda su información médica, antecedentes, diagnóstico y seguimiento de tratamientos.

Recientemente refactorizada siguiendo principios de **Clean Architecture**, escalabilidad empresarial y herramientas de vanguardia bajo el ecosistema de React y TypeScript.

---

## 🚀 Tecnologías Core

| Tecnología | Versión | Uso Core |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca principal de UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipado estático y seguridad en tiempo de desarrollo |
| [Vite](https://vitejs.dev/) | 7 | Motor de compilación y servidor de desarrollo ultrarrápido |
| [Supabase](https://supabase.com/) | 2 | Backend-as-a-Service (PostgreSQL, Auth y RLS) |
| [React Router](https://reactrouter.com/) | 7 | Enrutador declarativo para arquitectura SPA (Single Page Application) |
| [TanStack Query](https://tanstack.com/query) | 5 | Sistema de Caché asíncrono y Server-State Pagination |
| [React Hook Form](https://react-hook-form.com/) | 7 | Gestión de formularios de alto rendimiento |
| [Zod](https://zod.dev/) | 3 | Declaración de esquemas y validación estricta de datos (Type Safety) |
| [PrimeReact](https://primereact.org/) | 10 | Suite de componentes premium y tablas de datos avanzadas |

---

## 📁 Arquitectura y Estructura del Proyecto

El proyecto utiliza un paradigma modular estricto y tipado integral:

```
historia-clinica-app/
├── src/
│   ├── components/       # Componentes visuales reutilizables
│   │   ├── Topbar.tsx
│   │   ├── DatosPersonales.tsx
│   │   ├── SeguimientoTratamiento.tsx
│   │   └── ...
│   ├── hooks/            # Lógica centralizada y estado
│   │   ├── useAuth.ts
│   │   └── useHistoriaClinica.ts
│   ├── types/            # Definiciones de tipos e interfaces globales
│   │   └── index.ts
│   ├── pages/            # Vistas principales (Ensamblado de componentes)
│   │   ├── Dashboard.tsx
│   │   ├── HistoriaFormPage.tsx
│   │   └── Login.tsx
│   ├── schemas/          # Reglas de validación (Zod)
│   │   └── historiaClinicaSchema.ts
│   ├── lib/              # Clientes de servicios externos
│   │   └── supabaseClient.ts
│   ├── styles/           # CSS Modular y Tokens de diseño
│   ├── App.tsx           # Configuración de rutas
│   └── main.tsx          # Punto de entrada y Providers
├── tsconfig.json         # Configuración de TypeScript
└── vite.config.ts        # Configuración de Bundler
```

---

## 🗄️ Backend y Control (Supabase)

### Multi-tenancy & Seguridad (RLS)
La aplicación utiliza **Row Level Security (RLS)** protegido enteramente a nivel de la base de datos de PostgreSQL (vía Supabase):
- **Aislamiento Absoluto**: Los datos están filtrados con la política del `user_id` en el JWT del dentista activo.
- **Acceso Granular**: Ningún script ni frontend puede "saltarse" o visualizar historias clínicas ajenas gracias a esta política restrictiva desde la nube.

### Rendimiento (Paginación Server-Side)
El `Dashboard` utiliza **Lazy Loading** y **Server-Side Pagination/Sorting** acoplado a TanStack Query. Esto permite manejar miles de registros sin degradar el rendimiento del navegador.

---

## ⚙️ Configuración local

### 1. Clonar e Instalar
```bash
git clone https://github.com/Dymension1/historia-clinica-app.git
cd historia-clinica-app
npm install
```

### 2. Variables de entorno (.env.local)
```env
VITE_SUPABASE_URL=tu_url_de_supabase_proyecto
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon_de_supabase
```

### 3. Ejecución y Compilación
```bash
npm run dev    # Servidor de desarrollo
npm run build  # Build de producción con chequeo de tipos
```

---

## ✨ Características Principales

- 🔐 **Autenticación en Tiempo Real**: Gestión de sesiones segura con Supabase.
- ⚡ **Type Safety Integral**: Migración completa a TypeScript para robustez y autocompletado avanzado.
- 📊 **Dashboard Avanzado**: Tabla interactiva con ordenamiento y búsqueda en tiempo real directamente desde la base de datos.
- 📂 **Validación con Zod**: Formularios con validación en tiempo real y tipado fuerte compartido entre servidor y cliente.
- 🖨️ **Media Print**: Optimización para impresión de historias clínicas en formato profesional.
- 🎨 **Diseño Moderno**: Interfaz basada en Glassmorphism con soporte para Dark Mode.

---

## 📄 Licencia

Uso privado — Todos los derechos reservados.