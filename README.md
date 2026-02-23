# 🤖 AI Knowledge Hub

> Una plataforma moderna para organizar, clasificar y gestionar herramientas de inteligencia artificial, con integración automática de contenido de YouTube.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [APIs](#-apis)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)

## ✨ Características

- 🎯 **Gestión de Herramientas IA**: Organización inteligente de herramientas de inteligencia artificial
- 📋 **Playlists Dinámicas**: Categorización automática y manual por temáticas
- 🎥 **Integración YouTube**: Análisis automático de contenido multimedia
- 🤖 **ChatBot Inteligente**: Asistente AI con soporte de voz (Speech-to-Text y Text-to-Speech)
- 🏗️ **Arquitectura Limpia**: Implementación siguiendo principios de Clean Architecture
- ⚡ **Tiempo Real**: Actualizaciones en vivo con Supabase
- 🔄 **Webhooks N8N**: Automatización de workflows
- 🎨 **UI Moderna**: Interfaz responsive con Tailwind CSS
- 📊 **Analytics**: Dashboard de métricas y estadísticas
- 🔍 **Búsqueda Avanzada**: Filtrado inteligente de contenido
- 🌙 **Modo Oscuro**: Tema adaptativo

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Gestión de formularios
- **Recharts** - Visualización de datos

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Supabase** - Base de datos PostgreSQL + Auth + Storage
- **N8N** - Automatización de workflows
- **YouTube Data API** - Integración de contenido

### DevOps & Deployment
- **Vercel** - Plataforma de despliegue
- **GitHub Actions** - CI/CD
- **ESLint** - Linter de código
- **Prettier** - Formateador de código

## ✨ Funcionalidades Recientes

### 🤖 ChatBot con Capacidades de Voz
- **Entrada por Voz**: Reconocimiento de voz usando Web Speech API nativa del navegador
- **Respuestas Habladas**: Text-to-Speech integrado para respuestas del asistente
- **Interfaz Intuitiva**: Botones de grabación con indicadores visuales de estado
- **Compatibilidad**: Detección automática de soporte del navegador con degradación elegante
- **Preservación**: Sistema completo conservado y mejorado según requerimientos

### 🔐 Sistema de Autenticación Mejorado
- **Flujo de Email Corregido**: Solucionado el problema donde "el correo cascaba" en confirmación
- **Callback Route**: Nuevo endpoint `/auth/callback` para manejo adecuado de tokens de Supabase
- **Gestión de Errores**: Manejo robusto de errores en todo el flujo de autenticación
- **Testing Completo**: Interfaces visuales y CLI para validación de todos los casos de uso
- **Configuración PKCE**: Implementación de mejores prácticas de seguridad

### 🧹 Optimización Modo "Solo Lectura"
- **Simplificación**: Removidas todas las opciones de crear/editar/eliminar playlists y herramientas
- **Enfoque**: App centrada en **visualización + ChatBot + autenticación**
- **Estabilidad**: Solo funcionalidades probadas y estables para entrega
- **Limpieza**: Removidos modales, formularios y handlers CRUD innecesarios
- **Preservación**: Mantenida toda la funcionalidad de búsqueda, filtrado y navegación

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** con las siguientes capas:

```
src/
├── domain/           # Entidades, Value Objects, Eventos de Dominio
├── application/      # Casos de Uso, Servicios de Aplicación
├── infrastructure/   # Adaptadores externos, Repositories
└── presentation/     # UI Components, Hooks, Controllers
```

### Principios Aplicados
- **Separación de Responsabilidades**
- **Inversión de Dependencias**
- **Principio de Responsabilidad Única**
- **Domain-Driven Design (DDD)**

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Cuenta Supabase** (para base de datos)
- **API Key YouTube** (para integración de contenido)
- **Instancia N8N** (opcional, para automatizaciones)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/aran028/AI-Knowledge-Hub.git
cd AI-Knowledge-Hub
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Configurar base de datos**
```bash
npm run setup:db
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local` con:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# YouTube API
YOUTUBE_API_KEY=your-youtube-api-key

# N8N Webhooks
N8N_WEBHOOK_SECRET=your-webhook-secret
N8N_BASE_URL=your-n8n-instance-url

# NextAuth (opcional)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Base de Datos

1. **Crear proyecto en Supabase**
2. **Ejecutar migraciones**
```bash
npm run db:migrate
```

3. **Insertar datos de prueba**
```bash
npm run db:seed
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción
npm run lint             # Ejecutar linter
npm run type-check       # Verificar tipos TypeScript

# Base de Datos
npm run setup:db         # Configuración inicial de BD
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Insertar datos de prueba
npm run test:connection  # Probar conexión a Supabase

# Testing & QA
npm run test:auth        # Test visual completo de autenticación
npm run test:auth-flow   # Test por línea de comandos de auth
npm run test:speech      # Test de funcionalidades de voz
npm run test:db          # Tests de base de datos
npm run test:supabase    # Tests de Supabase
npm run test:webhook     # Tests de webhooks

# Utilidades
npm run generate:images  # Generar imágenes placeholder
npm run check:tables     # Verificar estructura de tablas
```

## 🧪 Testing Completo

### 🔐 Autenticación
- **Test Visual**: `npm run test:auth` - Interfaz web completa en `http://localhost:3000/test-auth.html`
- **Test CLI**: `npm run test:auth-flow` - Pruebas por línea de comandos con reportes detallados
- **Casos Cubiertos**: Registro, login, verificación de email, reset de contraseña, callbacks de Supabase

### 🎤 Funcionalidades de Voz  
- **Test Speech**: `npm run test:speech` - Interfaz para verificar APIs de voz en `http://localhost:3000/test-speech.html`
- **Compatibilidad**: Speech-to-Text y Text-to-Speech con detección automática de soporte del navegador
- **ChatBot con Voz**: Implementación completa con entrada por voz y respuestas habladas

### 🗄️ Base de Datos
- **Conexión**: `npm run test:connection` - Verificación de conectividad con Supabase
- **Estructura**: `npm run test:supabase` - Validación de tablas y políticas RLS  
- **APIs**: `npm run test:db` - Tests de endpoints de inserción y consulta

### 🔗 Webhooks y Integraciones
- **YouTube**: `npm run test:webhook` - Validación de endpoints de YouTube
- **N8N**: Tests de integración incluidos en API routes de `/api/n8n/`

### 📊 Configuración de Tests
Los tests incluyen configuración automática de Supabase, manejo de errores detallado, y interfaces visuales para validación manual de flujos complejos.

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── playlists/     # Gestión de playlists
│   │   ├── tools/         # Gestión de herramientas
│   │   ├── youtube/       # Integración YouTube
│   │   └── webhooks/      # Endpoints N8N
│   ├── auth/              # Páginas de autenticación
│   └── youtube/           # Dashboard YouTube
├── components/            # Componentes UI reutilizables
│   └── ui/               # Componentes base
├── src/                  # Clean Architecture
│   ├── domain/           # Lógica de negocio
│   ├── presentation/     # Componentes y hooks
│   └── shared/           # Utilidades compartidas
├── scripts/              # Scripts de utilidad
├── docs/                 # Documentación
└── public/               # Archivos estáticos
```

## 🌐 APIs

### Playlists
- `GET /api/playlists` - Obtener todas las playlists
- `POST /api/playlists` - Crear nueva playlist
- `PUT /api/playlists/:id` - Actualizar playlist
- `DELETE /api/playlists/:id` - Eliminar playlist

### Tools
- `GET /api/tools` - Obtener herramientas (con filtros)
- `POST /api/tools` - Crear nueva herramienta
- `PUT /api/tools/:id` - Actualizar herramienta
- `DELETE /api/tools/:id` - Eliminar herramienta

### YouTube
- `GET /api/youtube/videos` - Obtener videos analizados
- `GET /api/youtube/stats` - Estadísticas de contenido
- `POST /api/youtube/reclassify` - Reclasificar contenido

### Webhooks
- `POST /api/webhooks/youtube` - Webhook de YouTube
- `POST /api/n8n` - Webhook genérico N8N
- `POST /api/n8n-capture` - Captura de datos N8N

## 🤖 ChatBot Inteligente

El proyecto incluye un **asistente AI conversacional** con funcionalidades avanzadas:

### 💬 **Capacidades del ChatBot**
- **Conocimiento Técnico**: Responde sobre +30 tecnologías (React, Python, Docker, AWS, etc.)
- **Contextual**: Conoce tu ubicación actual y herramientas disponibles
- **Guía de Navegación**: Te ayuda a usar la plataforma eficientemente
- **Enlaces Directos**: Proporciona URLs oficiales y documentación

### 🎤 **Funcionalidades de Voz**
- **Speech-to-Text**: Habla tus preguntas usando el micrófono
- **Text-to-Speech**: Escucha las respuestas del asistente
- **Control Intuitivo**: Botones para habilitar/deshabilitar funciones de voz
- **Reproducción Bajo Demanda**: Haz clic en cualquier respuesta para escucharla

### 🚀 **Compatibilidad**
- Compatible con navigadores modernos (Chrome, Firefox, Safari, Edge)
- Funciona tanto en escritorio como móvil
- Graceful degradation si el navegador no soporta speech APIs

## 👨‍💻 Desarrollo

### Ejecutar en modo desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Testing de APIs
```bash
# Test conexión Supabase
npm run test:supabase

# Test endpoints
npm run test:webhook
```

### Estructura de Commits
Sigue [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactoring de código
test: añadir tests
chore: cambios de configuración
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio**
2. **Configurar variables de entorno**
3. **Deploy automático**

```bash
# O manual
npm run build
vercel --prod
```

### Docker (Alternativo)

```bash
# Construir imagen
docker build -t ai-knowledge-hub .

# Ejecutar contenedor
docker run -p 3000:3000 ai-knowledge-hub
```

### Variables de Producción
Asegurar todas las variables de entorno están configuradas en la plataforma de despliegue.

## 🤝 Contribuir

1. **Fork el repositorio**
2. **Crear rama feature** (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit cambios** (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. **Push a la rama** (`git push origin feature/nueva-funcionalidad`)
5. **Abrir Pull Request**

### Guías de Contribución
- Seguir la arquitectura establecida
- Escribir tests para nuevas funcionalidades
- Actualizar documentación cuando sea necesario
- Revisar que el código pase el linter

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces Útiles

- [Documentación Supabase](https://supabase.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [N8N Documentation](https://docs.n8n.io/)

---

<div align="center">

**[AI Knowledge Hub](https://github.com/aran028/AI-Knowledge-Hub)** fue desarrollado con ❤️ por [aran028](https://github.com/aran028)

⭐ ¡Si te gusta este proyecto, dale una estrella!

</div>

El Domain Layer contiene la lógica pura de negocio, sin dependencias de infraestructura o frameworks externos. Es el corazón de la aplicación donde se definen las reglas de negocio.

## 📁 Estructura

```
domain/
├── entities/           # Entidades de negocio con identidad
├── value-objects/     # Objetos de valor inmutables
├── events/            # Eventos de dominio
├── exceptions/        # Excepciones específicas del dominio
└── index.ts          # Exports centralizados
```

## 🏗️ Entidades Principales

### 📋 PlaylistEntity
Representa una lista de herramientas organizada por categoría o tema.

**Responsabilidades:**
- Gestionar colección de herramientas
- Validar reglas de negocio (nombre, iconos)
- Emitir eventos de dominio
- Controlar acceso público/privado

**Reglas de Negocio:**
- Nombre debe tener mínimo 2 caracteres, máximo 100
- Debe tener un icono válido
- No puede tener herramientas duplicadas
- Emite evento `PlaylistCreated` al crearse

### 🛠️ ToolEntity  
Representa una herramienta o aplicación de software.

**Responsabilidades:**
- Gestionar información de la herramienta
- Manejar tags y clasificación por IA
- Controlar contadores (vistas, favoritos)
- Validar URLs y metadatos

**Reglas de Negocio:**
- Título mínimo 2 caracteres, máximo 100
- Resumen mínimo 10 caracteres, máximo 500
- URL debe ser válida y accesible
- Tags normalizados en minúsculas
- Categoría obligatoria

### 🎥 YouTubeContentEntity
Representa contenido de YouTube clasificado por IA.

**Responsabilidades:**
- Gestionar metadatos de video
- Almacenar clasificación y análisis por IA
- Vincular con herramientas relacionadas
- Manejar puntos clave y resúmenes

**Reglas de Negocio:**
- Video ID debe ser formato YouTube válido (11 caracteres)
- Título máximo 200 caracteres
- URL debe ser de YouTube válido
- Puntuación de confianza entre 0 y 1
- Herramientas relacionadas deben existir

### 👤 UserEntity
Representa un usuario del sistema.

**Responsabilidades:**
- Gestionar perfil e información personal
- Manejar roles y permisos
- Configurar preferencias
- Controlar verificación de email

**Reglas de Negocio:**
- Email debe tener formato válido
- Display name máximo 100 caracteres  
- Roles: 'user', 'moderator', 'admin'
- Email debe verificarse al cambiar
- Preferencias por defecto definidas

## ⚡ Value Objects

### 🆔 ToolId
- Identificador único UUID v4 para herramientas
- Inmutable y validado
- Factor métodos para generación

### 📊 ConfidenceScore  
- Puntuación entre 0 y 1
- Niveles: low (< 0.5), medium (0.5-0.8), high (>= 0.8)
- Conversión automática a porcentajes

### 🤖 AIClassification
- Categorización inteligente por IA
- Subcategorías y herramientas detectadas
- Razonamiento y confianza incluidos
- Serialización JSON compatible

## 📢 Domain Events

### PlaylistCreated
- Se emite cuando se crea una nueva playlist
- Incluye ID, nombre, usuario y timestamp
- Útil para notificaciones y auditoría

### ToolAdded
- Se emite cuando se agrega herramienta a playlist  
- Incluye IDs de playlist y herramienta
- Útil para actualizaciones de UI

### ToolCreated
- Se emite cuando se crea nueva herramienta
- Incluye metadatos básicos
- Útil para indexación y análisis

### YoutubeContentAnalyzed
- Se emite cuando IA analiza contenido
- Incluye resultados de clasificación
- Útil para métricas de calidad

## ❌ Domain Exceptions

### Playlist Exceptions
- `PlaylistNotFoundException`: Playlist no encontrada
- `PlaylistNameAlreadyExistsException`: Nombre duplicado
- `PlaylistAccessDeniedException`: Sin permisos
- `MaxToolsPerPlaylistExceededException`: Límite excedido

### Tool Exceptions  
- `ToolNotFoundException`: Herramienta no encontrada
- `DuplicateToolUrlException`: URL duplicada
- `ToolValidationException`: Error de validación
- `ToolWebsiteNotAccessibleException`: Sitio web inaccesible

## 🎯 Principios Aplicados

### 1. **Domain-Driven Design (DDD)**
- Entidades encapsulan identidad y lógica de negocio
- Value objects para conceptos sin identidad
- Eventos de dominio para comunicación

### 2. **Single Responsibility**
- Cada entidad tiene una responsabilidad clara
- Value objects encapsulan validaciones específicas
- Eventos representan un solo suceso de negocio

### 3. **Encapsulación**
- Campos privados con getters públicos
- Métodos de negocio públicos
- Validación en constructores y setters

### 4. **Inmutabilidad**
- Value objects son inmutables
- Entidades exponen métodos para cambios controlados
- Eventos inmutables después de creación

### 5. **Rich Domain Model**
- Entidades contienen lógica de negocio
- Métodos expresan intención de negocio
- Validaciones integradas en el modelo

## 🚀 Uso en la Aplicación

```typescript
// Crear playlist
const playlist = PlaylistEntity.create(
  'IA/ML Tools',
  'brain', 
  'user-123',
  'Herramientas de Inteligencia Artificial'
)

// Agregar herramienta
const toolId = new ToolId('tool-uuid')
playlist.addTool(toolId) // Emite ToolAdded event

// Crear clasificación IA
const classification = AIClassification.createAIML(
  'Machine Learning',
  0.95,
  'Video enfocado en algoritmos ML',
  ['TensorFlow', 'PyTorch']
)

// Procesar eventos
const events = playlist.domainEvents
events.forEach(event => {
  if (event instanceof PlaylistCreated) {
    // Enviar notificación
  }
})
```

## 📈 Estado Actual

✅ **Completado:**
- 4 entidades principales con lógica de negocio
- 3 value objects con validaciones
- 4 eventos de dominio
- 7 excepciones específicas  
- Exports organizados e índices
- Documentación completa

📋 **Próximos pasos:**  
- Fase 3: Application Layer (use cases, ports)
- Tests unitarios para entidades
- Más eventos según necesidades
- Validaciones adicionales basadas en uso real