# ahorro-app

Una app básica para llevar el conteo del ahorro que se tendrá en una alcancía o cuenta.

## Stack Tecnológico

- **Frontend:** Vite + React + TypeScript
- **Estilos:** Tailwind CSS
- **Linting/Formatting:** Ultracite (Biome)
- **Git Hooks:** Husky (pre-commit)
- **Backend/DB:** Supabase (PostgreSQL)
- **Testing:** Vitest + React Testing Library

## Estructura de Carpetas

```
src/
├── components/    # Componentes de React
├── hooks/         # Custom hooks (useAuth, useRecords)
├── lib/           # Configuración de Supabase
├── utils/         # Funciones utilitarias
└── tests/         # Tests
```

## Esquema de Base de Datos

### Tabla `registros`
| Campo      | Tipo      | Descripción                    |
|------------|-----------|--------------------------------|
| id         | uuid      | Identificador único            |
| user_id    | uuid      | FK al usuario de Supabase Auth |
| fecha      | date      | Fecha del registro             |
| monto      | numeric   | Cantidad ahorrada              |
| guardado   | boolean   | Si el dinero fue guardado      |
| created_at | timestamp | Fecha de creación              |

### Tabla `configuracion`
| Campo        | Tipo      | Descripción                    |
|--------------|-----------|--------------------------------|
| id           | uuid      | Identificador único            |
| user_id      | uuid      | FK al usuario de Supabase Auth |
| meta_diaria  | numeric   | Meta de ahorro diario          |
| fecha_inicio | date      | Fecha de inicio del ahorro     |
| created_at   | timestamp | Fecha de creación              |

**Nota:** Ambas tablas deben tener Row Level Security (RLS) habilitado para que cada usuario solo vea sus propios datos.

## Comandos

```bash
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Construir para producción
pnpm test             # Ejecutar tests
pnpm test:ui          # Tests con interfaz visual
pnpm preview          # Preview del build

# Linting y formatting (Ultracite/Biome)
npx ultracite fix     # Formatear y arreglar código
npx ultracite check   # Verificar sin modificar
```

## Variables de Entorno

```env
VITE_SUPABASE_URL=<tu-url-de-supabase>
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

## Funcionalidades Principales

### Autenticación
- Registro con correo/contraseña
- Login/Logout
- Persistencia de sesión
- Rutas protegidas

### Core
- **Balance:** Mostrar total acumulado de ahorros
- **RecordForm:** Formulario para agregar nuevo ahorro
- **History:** Lista de todos los registros ordenados por fecha
- Editar y eliminar registros

### Sistema de Sugerencias
- Detectar días sin guardar dinero
- Calcular monto sugerido para compensar días perdidos
- Fórmula: `(días_sin_guardar + 1) * meta_diaria`
- Alerta al abrir la app si hay días pendientes

## Hooks Principales

### `useAuth`
- `user` - Usuario actual
- `loading` - Estado de carga
- `signIn()` - Iniciar sesión
- `signUp()` - Registrarse
- `signOut()` - Cerrar sesión

### `useRecords`
- `records` - Lista de registros
- `loading` - Estado de carga
- `create()` - Crear nuevo registro
- `update()` - Actualizar registro existente
- `remove()` - Eliminar registro

## Convenciones de Código

- Componentes funcionales con hooks
- Nombres de componentes en PascalCase
- Hooks personalizados prefijados con `use`
- Tests junto al código que prueban o en `/tests`
- Código formateado automáticamente por Ultracite/Biome
- Pre-commit hook ejecuta tests y formatea código

## Configuración de Linting

El proyecto usa Ultracite (basado en Biome) para linting y formatting.

**biome.jsonc:**
```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["ultracite/core", "ultracite/react"]
}
```

**Pre-commit hook (.husky/pre-commit):**
1. Ejecuta `pnpm test`
2. Formatea archivos staged con `ultracite fix`
3. Re-agrega archivos formateados al commit

## Referencia Linear

Proyecto: [ahorro-app](https://linear.app/fernandocm/project/ahorro-app-d8b30da80877)

### Labels del proyecto
- `Setup` - Configuración inicial del proyecto
- `Base de datos` - Esquemas y configuración de Supabase
- `Auth` - Autenticación y manejo de sesiones
- `Core` - Funcionalidades principales
- `Sugerencias` - Sistema de sugerencias de ahorro
- `UX/UI` - Diseño e interfaz
- `Testing` - Tests automatizados
- `Extras` - Funcionalidades adicionales (meta total, gráficas, dark mode, PWA)
