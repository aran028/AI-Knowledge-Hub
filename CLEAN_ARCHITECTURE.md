# 🏛️ Refactoring hacia Clean Architecture

## 📁 **Estructura Actual** (Típica Next.js)
```
├── components/          # UI Components mezclados
├── hooks/              # Logic hooks mezclados  
├── lib/                # Utils y configs mezclados
├── app/                # Next.js app router
├── public/             # Static assets
└── styles/             # Global styles
```

## 🎯 **Estructura Propuesta** (Clean Architecture)

```
├── src/                     # Todo el código source
│   ├── application/         # ⚡ Application Layer
│   │   ├── use-cases/      # Use cases específicos
│   │   │   ├── playlists/
│   │   │   │   ├── get-playlists.use-case.ts
│   │   │   │   ├── create-playlist.use-case.ts
│   │   │   │   └── delete-playlist.use-case.ts
│   │   │   ├── tools/
│   │   │   │   ├── search-tools.use-case.ts
│   │   │   │   ├── get-tool-by-id.use-case.ts
│   │   │   │   └── filter-tools.use-case.ts
│   │   │   └── youtube/
│   │   │       ├── analyze-video.use-case.ts
│   │   │       └── classify-content.use-case.ts
│   │   ├── ports/          # Interfaces/Contracts
│   │   │   ├── repositories/
│   │   │   │   ├── playlist.repository.ts
│   │   │   │   ├── tool.repository.ts
│   │   │   │   └── youtube.repository.ts
│   │   │   └── services/
│   │   │       ├── ai-classification.service.ts
│   │   │       └── search.service.ts
│   │   └── services/       # Application services
│   │
│   ├── domain/             # 🏛️ Domain Layer (Core Business)
│   │   ├── entities/       # Core entities
│   │   │   ├── playlist.entity.ts
│   │   │   ├── tool.entity.ts
│   │   │   ├── youtube-content.entity.ts
│   │   │   └── user.entity.ts
│   │   ├── value-objects/  # Value objects
│   │   │   ├── tool-id.vo.ts
│   │   │   ├── confidence-score.vo.ts
│   │   │   └── ai-classification.vo.ts
│   │   ├── events/         # Domain events
│   │   │   ├── playlist-created.event.ts
│   │   │   └── tool-added.event.ts
│   │   └── exceptions/     # Domain exceptions
│   │
│   ├── infrastructure/     # 🔧 Infrastructure Layer
│   │   ├── adapters/       # External adapters
│   │   │   ├── database/
│   │   │   │   ├── supabase.adapter.ts
│   │   │   │   ├── playlist.repository.impl.ts
│   │   │   │   └── tool.repository.impl.ts
│   │   │   ├── http/
│   │   │   │   ├── youtube.api.adapter.ts
│   │   │   │   └── openai.api.adapter.ts
│   │   │   └── storage/
│   │   │       └── image.storage.adapter.ts
│   │   ├── config/         # Infrastructure configs
│   │   │   ├── database.config.ts
│   │   │   ├── auth.config.ts
│   │   │   └── env.config.ts
│   │   └── persistence/    # Data persistence
│   │       ├── models/
│   │       └── migrations/
│   │
│   ├── presentation/       # 🎨 Presentation Layer (UI)
│   │   ├── components/     # UI Components organizados
│   │   │   ├── ui/         # Generic UI components
│   │   │   ├── features/   # Feature-specific components
│   │   │   │   ├── playlists/
│   │   │   │   │   ├── playlist-sidebar.component.tsx
│   │   │   │   │   └── playlist-card.component.tsx
│   │   │   │   ├── tools/
│   │   │   │   │   ├── tool-grid.component.tsx
│   │   │   │   │   └── tool-card.component.tsx
│   │   │   │   └── youtube/
│   │   │   │       └── youtube-content.component.tsx
│   │   │   └── layout/     # Layout components
│   │   │       ├── header.component.tsx
│   │   │       └── sidebar.component.tsx
│   │   ├── hooks/          # React hooks organizados
│   │   │   ├── use-playlists.hook.ts
│   │   │   ├── use-tools.hook.ts
│   │   │   └── use-youtube.hook.ts
│   │   ├── pages/          # Next.js pages/app
│   │   └── styles/         # Styling
│   │
│   └── shared/             # 🤝 Shared/Common
│       ├── types/          # TypeScript types
│       ├── constants/      # App constants
│       ├── utils/          # Pure utility functions
│       └── validations/    # Schema validations
│
├── app/                    # Next.js 14 App Router (solo routing)
│   ├── (auth)/
│   ├── api/
│   └── globals.css
├── public/                 # Static assets
└── tests/                  # Tests organizados por layer
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🚀 **Beneficios de esta estructura:**

1. **✅ Separación clara** - Cada layer tiene responsabilidades específicas
2. **✅ Testeable** - Fácil testing por layer y feature
3. **✅ Escalable** - Agregar features sin afectar otras partes
4. **✅ Mantenible** - Código organizado por dominio
5. **✅ SOLID** - Principios SOLID aplicados
6. **✅ DDD** - Domain-Driven Design

## 📦 **Migration Plan:**

### Fase 1: Reorganización básica ✅ COMPLETADA
- [x] Crear carpeta `src/`
- [x] Mover components a `src/presentation/components/features/`
- [x] Mover hooks a `src/presentation/hooks/`
- [x] Mover lib a `src/shared/`

### Fase 2: Domain Layer ✅ COMPLETADA
- [x] Crear entities de dominio
- [x] Definir value objects
- [x] Implementar domain events

### Fase 3: Application Layer
- [ ] Extraer use cases de hooks actuales
- [ ] Definir ports (interfaces)
- [ ] Implementar services

### Fase 4: Infrastructure Layer
- [ ] Mover lógica Supabase a adapters
- [ ] Configuraciones en config/
- [ ] Implementar repository pattern

¿Quieres que implemente **Fase 1** ahora? Solo reorganización básica sin romper funcionalidad.