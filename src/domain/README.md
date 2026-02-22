# 🏛️ Domain Layer - Core Business Logic

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