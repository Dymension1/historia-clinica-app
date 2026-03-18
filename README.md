# 🦷 Historia Clínica App

Aplicación web profesional para la gestión de historias clínicas odontológicas. Diseñada con una interfaz moderna, responsiva y optimizada para el flujo de trabajo clínico. Permite registrar, editar y consultar pacientes con toda su información médica, antecedentes, diagnóstico y seguimiento de tratamientos.

Recientemente refactorizada siguiendo principios de **Clean Architecture**, escalabilidad empresarial y herramientas de vanguardia bajo el ecosistema de React.

---

## 🚀 Tecnologías Core

| Tecnología | Versión | Uso Core |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca principal de UI |
| [Vite](https://vitejs.dev/) | 7 | Motor de compilación y servidor de desarrollo ultrarrápido |
| [Supabase](https://supabase.com/) | 2 | Backend-as-a-Service (PostgreSQL, Auth y RLS) |
| [React Router](https://reactrouter.com/) | 7 | Enrutador declarativo para arquitectura SPA (Single Page Application) |
| [TanStack Query](https://tanstack.com/query) | 5 | Sistema de Caché asíncrono y Server-State Pagination |
| [React Hook Form](https://react-hook-form.com/) | 7 | Gestión de formularios de alto rendimiento |
| [Zod](https://zod.dev/) | 3 | Declaración de esquemas y validación estricta de datos (Type Safety) |
| [PrimeReact](https://primereact.org/) | 10 | Suite de componentes premium y tablas de datos avanzadas |
| [date-fns](https://date-fns.org/) | 4 | Manipulación y formateo de fechas |

---

## 📁 Arquitectura y Estructura del Proyecto

El proyecto está diseñado bajo un paradigma modular estricto para prever el crecimiento a gran escala:

```
historia-clinica-app/
├── src/
│   ├── components/       # Fragmentos visuales reutilizables o partes de formulario
│   │   ├── Topbar.jsx                 # Barra de navegación principal
│   │   ├── DatosPersonales.jsx        # Bloques del formulario dinámico
│   │   ├── HistoriaOdontologica.jsx
│   │   └── ...
│   ├── hooks/            # Lógica centralizada, estado y comunicación
│   │   ├── useAuth.js                 # Hook de sesión e identidad (Supabase Auth)
│   │   └── useHistoriaClinica.js      # Operaciones CRUD principales
│   ├── lib/              # Configuraciones nativas de servicios de terceros
│   │   └── supabaseClient.js
│   ├── pages/            # Las vistas o pantallas ensambladas enrutadas
│   │   ├── Dashboard.jsx              # Tablero estadístico y lista paginada
│   │   ├── HistoriaFormPage.jsx       # Wrapper del form controlado por URL
│   │   └── Login.jsx                  # Entrada de Identidad
│   ├── schemas/          # Reglas estrictas, validación y control de integridad
│   │   └── historiaClinicaSchema.js   # Esquema Zod de pacientes
│   ├── styles/           # Archivos CSS encapsulados y variables
│   │   ├── theme.js                   # Tokens de diseño y colores
│   │   └── css...
│   ├── App.jsx           # Árbol de rutas (React Router) central
│   └── main.jsx          # Providers de estado (QueryClient, Auth, Router)
├── .env.local            # Entorno y variables
└── package.json
```

---

## 🗄️ Backend y Control (Supabase)

### Multi-tenancy & Seguridad (RLS)
La aplicación utiliza **Row Level Security (RLS)** protegido enteramente a nivel de la base de datos de PostgreSQL (vía Supabase):
- **Aislamiento Absoluto**: Los datos están filtrados con la política del `user_id` en el JWT del dentista activo.
- **Acceso Granular**: Ningún script ni frontend puede "saltarse" o visualizar historias clínicas ajenas gracias a esta política restrictiva desde la nube.

### Rendimiento (Paginación Server-Side)
El `Dashboard` no descarga gigabytes de datos de miles de pacientes, sino que está impulsado por **Supabase Server-Side Pagination** acoplado asíncronamente a TanStack Query (React Query) bajo caché inteligente `staleTime`.

---

## ⚙️ Configuración local

### 1. Clonar e Instalar
```bash
git clone https://github.com/Dymension1/historia-clinica-app.git
cd historia-clinica-app
npm install
```

### 2. Variables de entorno (.env.local)
Deberás solicitar o crear estas claves copiándolas de las API Keys del panel de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase_proyecto
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon_de_supabase
```

### 3. Ejecución y Compilación
```bash
npm run dev    # Levanta el servidor local instantáneo para desarrollo
npm run build  # Construye los binarios optimizados (dist/) listos para Vercel o Nginx
```

---

## ✨ Características y Capacidades Finales

- 🔐 **Autenticación en Tiempo Real**: Prevención anti-flaps.
- ⚡ **Formulario Incorruptible Zod**: Validación antes del envío que previene inserciones con nombres vacíos, formatos de mails erróneos, o IDs duplicados.
- 📂 **Paginación Inteligente**: Visualiza millones de expedientes al instante sin usar RAM adicional del cliente mediante `<DataTable lazy>` .
- 🖨️ **Media Print Avanzado**: Botones embebidos que ocultan la UI de navegación y compilan un PDF nativo listo con hoja clínica sellada.
- 🎨 **Interfaz Glassmorphism**: Transparencias premium, efectos *backdrop-filter*, inputs responsivos CSS-Grid y un esquema Dark Mode adaptativo para trabajo de baja fatiga ocular.

---

## 📄 Licencia

Uso privado — Todos los derechos reservados.