# 💰 ahorro-app

Una app básica para llevar el conteo del ahorro que se tendrá en una alcancía o cuenta.

## 📋 Descripción

Aplicación web para gestionar y hacer seguimiento de tus ahorros diarios. Permite registrar depósitos, visualizar el balance total, y recibir sugerencias para mantener tu meta de ahorro.

## 🛠️ Stack Tecnológico

- **Frontend:** Vite + React + TypeScript
- **Estilos:** Tailwind CSS
- **Linting/Formatting:** Ultracite (Biome)
- **Git Hooks:** Husky (pre-commit)
- **Backend/DB:** Supabase (PostgreSQL)
- **Testing:** Vitest + React Testing Library

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **pnpm** >= 9.x (recomendado) o npm
- Cuenta en [Supabase](https://supabase.com) (gratis)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd ahorro-app
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` y agrega tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu-url-de-supabase
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   ```

   La app estará disponible en `http://localhost:5173`

## 📝 Comandos Disponibles

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

## 📁 Estructura del Proyecto

```
ahorro-app/
├── src/
│   ├── components/    # Componentes de React
│   ├── hooks/         # Custom hooks (useAuth, useRecords)
│   ├── lib/           # Configuración de Supabase
│   ├── utils/         # Funciones utilitarias
│   ├── tests/         # Tests y setup
│   ├── App.tsx        # Componente principal
│   └── main.tsx       # Punto de entrada
├── public/            # Archivos estáticos
├── .husky/            # Git hooks
├── biome.jsonc        # Configuración de Ultracite
├── vitest.config.ts   # Configuración de tests
└── vite.config.ts     # Configuración de Vite
```

## 🎯 Funcionalidades Principales

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
- Alerta al abrir la app si hay días pendientes

## 🔧 Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)

2. Ejecuta las siguientes migraciones SQL:

```sql
-- Tabla de registros
CREATE TABLE registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  fecha DATE NOT NULL,
  monto NUMERIC NOT NULL,
  guardado BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de configuración
CREATE TABLE configuracion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  meta_diaria NUMERIC DEFAULT 50,
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can only see own data" ON registros
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see own config" ON configuracion
  FOR ALL USING (auth.uid() = user_id);
```

## 🧪 Testing

Los tests se ejecutan automáticamente en el pre-commit hook. Para ejecutarlos manualmente:

```bash
pnpm test           # Modo watch
pnpm test:ui        # Interfaz gráfica
pnpm test:coverage  # Con cobertura
```

## 🎨 Convenciones de Código

- Componentes funcionales con hooks
- Nombres de componentes en PascalCase
- Hooks personalizados prefijados con `use`
- Código formateado automáticamente por Ultracite/Biome
- Pre-commit hook ejecuta tests y formatea código

## 📚 Documentación Adicional

Para más detalles sobre la arquitectura y especificaciones del proyecto, consulta [CLAUDE.md](./CLAUDE.md).

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
