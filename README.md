# 🦷 Historia Clínica App

Aplicación web para la gestión de historias clínicas odontológicas. Permite registrar, editar y consultar pacientes con toda su información médica, antecedentes, diagnóstico y seguimiento de tratamientos.

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 19 | Framework de UI |
| [Vite](https://vitejs.dev/) | 7 | Bundler / Dev server |
| [Supabase](https://supabase.com/) | 2 | Base de datos (PostgreSQL) + Auth |
| [PrimeReact](https://primereact.org/) | 10 | Componentes de UI (Calendar, Dropdown, etc.) |
| [date-fns](https://date-fns.org/) | 4 | Formateo de fechas |

---

## 📁 Estructura del proyecto

```
historia-clinica-app/
├── src/
│   ├── components/
│   │   ├── Login.jsx                  # Pantalla de inicio de sesión
│   │   ├── Dashboard.jsx              # Listado de historias clínicas
│   │   ├── DatosPersonales.jsx        # Sección: datos del paciente
│   │   ├── AntecedentesMedicos.jsx    # Sección: antecedentes médicos
│   │   ├── HistoriaOdontologica.jsx   # Sección: historia odontológica
│   │   ├── Diagnostico.jsx            # Sección: diagnóstico
│   │   ├── SeguimientoTratamiento.jsx # Sección: tabla de tratamientos
│   │   └── theme.js                   # Estilos/tokens compartidos
│   ├── App.jsx                        # Lógica principal y routing
│   ├── supabaseClient.js              # Inicialización del cliente Supabase
│   ├── main.jsx                       # Punto de entrada React
│   └── index.css                      # Estilos globales
├── .env.local                         # Variables de entorno (no commitear)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🗄️ Base de datos — Supabase

### Tabla principal: `historias_clinicas`

```sql
CREATE TABLE historias_clinicas (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now(),
  user_id                  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha                    DATE,
  nombre                   TEXT,
  dni                      TEXT,
  sexo                     TEXT,
  fecha_nacimiento         DATE,
  edad                     INTEGER,
  telefono                 TEXT,
  direccion                TEXT,
  email_paciente           TEXT,
  obra_social              TEXT,
  afiliado                 TEXT,
  motivo_consulta          TEXT,
  cond_cardiopatias        BOOLEAN DEFAULT false,
  cond_hipertension        BOOLEAN DEFAULT false,
  cond_diabetes            BOOLEAN DEFAULT false,
  cond_asma                BOOLEAN DEFAULT false,
  cond_anemia              BOOLEAN DEFAULT false,
  cond_tiroides            BOOLEAN DEFAULT false,
  cond_epilepsia           BOOLEAN DEFAULT false,
  cond_coagulacion         BOOLEAN DEFAULT false,
  cond_embarazo            BOOLEAN DEFAULT false,
  cond_autoinmunes         BOOLEAN DEFAULT false,
  cond_autoinmunes_detalle TEXT,
  cond_otras               BOOLEAN DEFAULT false,
  cond_otras_detalle       TEXT,
  fuma                     BOOLEAN DEFAULT false,
  fuma_detalle             TEXT,
  alcohol_rta              TEXT,
  hilo_frec                TEXT,
  enjuague_rta             TEXT,
  encias_rta               TEXT,
  sensibilidad_rta         TEXT,
  bruxismo_rta             TEXT,
  reacciones               BOOLEAN DEFAULT false,
  reacciones_detalle       TEXT,
  cepilla                  TEXT,
  hilo_dental2             TEXT,
  enjuague2                TEXT,
  encias2                  TEXT,
  tejidos                  TEXT,
  diagnostico              TEXT
);
```

### Tabla de seguimiento: `seguimiento_tratamiento`

Los tratamientos de cada historia se guardan en una tabla separada vinculada por `historia_id`.

```sql
CREATE TABLE seguimiento_tratamiento (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  historia_id    UUID NOT NULL REFERENCES historias_clinicas(id) ON DELETE CASCADE,
  fecha          DATE,
  tratamiento    TEXT,
  diente         TEXT,
  caras          TEXT,
  observaciones  TEXT,
  presupuesto    NUMERIC(12, 2) DEFAULT 0,
  entrega        NUMERIC(12, 2) DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seguimiento_historia ON seguimiento_tratamiento(historia_id);
```

> ⚠️ El campo **saldo** se calcula en el frontend (`presupuesto - entrega`) y no se persiste en la base de datos.

### RLS (Row Level Security)

```sql
-- historias_clinicas
ALTER TABLE historias_clinicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso autenticado" ON historias_clinicas
  FOR ALL USING (auth.role() = 'authenticated');

-- seguimiento_tratamiento
ALTER TABLE seguimiento_tratamiento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso autenticado" ON seguimiento_tratamiento
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## ⚙️ Configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Dymension1/historia-clinica-app.git
cd historia-clinica-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> Las credenciales se obtienen desde **Supabase → Project Settings → API**.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

### 5. Build para producción

```bash
npm run build
```

---

## ✨ Funcionalidades

- 🔐 **Autenticación** con Supabase Auth (email/contraseña)
- 📋 **Dashboard** con listado, búsqueda y eliminación de historias clínicas
- 📝 **Formulario completo** dividido en secciones:
  - Datos personales del paciente
  - Antecedentes médicos (condiciones, hábitos, alergias)
  - Historia odontológica
  - Diagnóstico
  - Seguimiento de tratamientos (tabla dinámica con filas editables)
- 💰 **Cálculo automático de saldo** (presupuesto − entrega) por tratamiento
- 🖨️ **Impresión / exportación a PDF** optimizada con estilos específicos para impresión
- 💾 **Guardado en Supabase** con soporte para crear y editar historias

---

## 🌿 Ramas

| Rama | Descripción |
|---|---|
| `main` | Producción estable |
| `develop` | Desarrollo activo |

---

## 📄 Licencia

Uso interno — todos los derechos reservados.