# 🦷 Historia Clínica App

Aplicación web profesional para la gestión de historias clínicas odontológicas. Diseñada con una interfaz moderna, responsiva y optimizada para el flujo de trabajo clínico. Permite registrar, editar y consultar pacientes con toda su información médica, antecedentes, diagnóstico y seguimiento de tratamientos.

---

## 🎨 Diseño y UI

La aplicación cuenta con una interfaz de usuario **Premium** centrada en la experiencia del usuario (UX):
- **Glassmorphism**: Uso de transparencias y desenfoques (backdrop-filter) para un aspecto moderno.
- **Micro-animaciones**: Transiciones suaves y feedback visual en interacciones.
- **CSS Grid Layout**: Estructura de formularios robusta y adaptable.
- **Modo Oscuro**: Paleta de colores optimizada para reducir la fatiga visual en entornos clínicos.

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca principal de UI |
| [Vite](https://vitejs.dev/) | 7 | Servidor de desarrollo y construcción |
| [Supabase](https://supabase.com/) | 2 | Backend-as-a-Service (PostgreSQL + Auth + RLS) |
| [PrimeReact](https://primereact.org/) | 10 | Suite de componentes premium |
| [date-fns](https://date-fns.org/) | 4 | Manipulación y formateo de fechas |
| [CSS Vanilla](https://developer.mozilla.org/en-US/docs/Web/CSS) | - | Estilizado personalizado de alta fidelidad |

---

## 📁 Estructura del proyecto

```
historia-clinica-app/
├── src/
│   ├── components/            # Componentes de la interfaz
│   │   ├── Topbar.jsx         # Barra de navegación superior
│   │   ├── Login.jsx          # Acceso al sistema
│   │   ├── Dashboard.jsx      # Gestión y listado de pacientes
│   │   ├── DatosPersonales.jsx # Refactorizado con CSS Grid
│   │   ├── SeguimientoTratamiento.jsx # Tabla dinámica de tratamientos
│   │   └── ...
│   ├── hooks/                 # Lógica reutilizable
│   │   ├── useAuth.js         # Gestión de sesiones con Supabase
│   │   └── useHistoriaClinica.js # Operaciones CRUD sincronizadas
│   ├── styles/                # CSS Modular por componente
│   │   ├── form.css           # Estilos base del sistema de formularios
│   │   └── ...
│   ├── supabaseClient.js      # Configuración de conexión
│   └── main.jsx                       # Inicialización de la App
├── .env.local                         # Variables de entorno
└── package.json
```

---

## 🗄️ Arquitectura y Base de Datos

### Multi-tenancy & Seguridad (RLS)
La aplicación utiliza **Row Level Security (RLS)** de Supabase para garantizar el aislamiento de los datos:
- **Aislamiento**: Los datos están filtrados a nivel de base de datos mediante el `user_id` del profesional autenticado.
- **Políticas**: Control de acceso granular para que cada médico solo vea sus historias clínicas.

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
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### 3. Ejecución
```bash
npm run dev
```

---

## ✨ Funcionalidades Clave

- 🔐 **Autenticación Robusta**: Flujo de login persistente con Supabase.
- 🔍 **Búsqueda Avanzada**: Filtrado inteligente de pacientes en tiempo real.
- 🛠️ **Formulario Dinámico**: Validación automática, cálculos de edad y saldos.
- 🖨️ **Modo Impresión**: Estilos CSS específicos (Media Print) para generar informes profesionales.
- 🔄 **Sincronización en Tiempo Real**: Los cambios se sincronizan automáticamente con la nube.

---

## 🌿 Gestión de Versiones

- `main`: Versión estable para uso en producción.
- `develop`: Rama de integración para nuevas características y mejoras de UI.

---

## 📄 Licencia

Uso privado — Todos los derechos reservados.