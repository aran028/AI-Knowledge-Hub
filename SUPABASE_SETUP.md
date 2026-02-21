# Configuración de Supabase para AI Knowledge Hub

Esta aplicación ahora está configurada para usar Supabase como base de datos. Sigue estos pasos para completar la configuración:

## 1. Configurar tu proyecto de Supabase

### Crear un proyecto en Supabase
1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se configure (puede tomar unos minutos)

### Ejecutar el script SQL
1. Ve a la sección **SQL Editor** en tu panel de Supabase
2. Copia y pega todo el contenido del archivo `supabase-setup.sql`
3. Haz clic en "Run" para ejecutar el script
4. Esto creará las tablas `playlists`, `tools` y `profiles` con datos de ejemplo

### Habilitar autenticación en Supabase
1. Ve a **Authentication > Settings** en tu proyecto de Supabase
2. En **Auth Providers**, asegúrate de que **Email** esté habilitado
3. Configura las URLs de redirección en **URL Configuration**:
   - Site URL: `http://localhost:3000` (para desarrollo)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### Configurar las variables de entorno
1. Ve a **Settings > API** en tu proyecto de Supabase
2. Copia la URL del proyecto y la clave anon/public
3. El archivo `.env.local` ya está configurado con una clave, solo necesitas **actualizar la URL**:
   ```bash
   # Reemplaza solo esta línea con tu URL de Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://euldngblivgrrxjdmjwu.supabase.co"
   # La clave ya está configurada
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

## 2. Ejecutar la aplicación

```bash
npm run dev
```

## 3. Funcionalidades habilitadas

### 🔐 **Sistema de autenticación completo**
- **Registro de usuarios**: Crear cuenta con email y contraseña  
- **Inicio de sesión**: Login seguro con validación
- **Recuperación de contraseña**: Reset por email
- **Protección de rutas**: Solo usuarios autenticados pueden acceder
- **Datos personalizados**: Cada usuario tiene sus propios datos
- **Configuración inicial**: Playlists y herramientas automáticas para nuevos usuarios  
- **Logout seguro**: Cerrar sesión desde el header

### ✅ Lectura dinámica de datos
- Las categorías/playlists se cargan desde la tabla `playlists` **del usuario actual**
- Las herramientas se cargan desde la tabla `tools` **con JOIN automático a playlists**
- **Integridad referencial** garantizada por foreign keys
- Filtrado automático por categoría usando `playlist_id`
- **Conteos precisos** de herramientas por playlist
- **Datos privados**: Cada usuario solo ve sus propios datos

### ✅ Agregar nuevas herramientas
- Botón "Agregar Herramienta" en el header
- Formulario para crear nuevas herramientas
- Las herramientas se guardan automáticamente en la base de datos

### ✅ Estados de carga y error
- Indicadores de carga mientras se obtienen los datos
- Manejo de errores de conexión
- Interfaz responsive con skeleton loaders

## 4. Estructura de la base de datos

### Tabla `profiles`
- `id` (UUID, primary key) - **Referencia a auth.users(id)**
- `email` (texto) - Email del usuario
- `full_name` (texto) - Nombre completo
- `avatar_url` (texto) - URL del avatar
- Timestamps automáticos

### Tabla `playlists`
- `id` (UUID, primary key)
- `name` (texto) - Nombre de la categoría
- `icon` (texto) - Icono para la categoría
- `user_id` (UUID, foreign key) - **Referencia a auth.users(id)**
- Timestamps automáticos
- **Constraint**: Único por usuario (name + user_id)

### Tabla `tools`
- `id` (UUID, primary key)
- `title` (texto) - Título de la herramienta
- `summary` (texto) - Descripción breve
- `playlist_id` (UUID, foreign key) - **Referencia a la tabla playlists**
- `image` (texto) - URL de la imagen
- `url` (texto) - URL de la herramienta
- `tags` (array de texto) - Tags relacionados
- `user_id` (UUID, foreign key) - **Referencia a auth.users(id)**
- Timestamps automáticos
- **Constraint**: Foreign key con CASCADE DELETE hacia `playlists(id)`

### Relaciones
- **auth.users → profiles** (1:1) - Cada usuario tiene un perfil
- **auth.users → playlists** (1:N) - Un usuario puede tener muchas categorías
- **auth.users → tools** (1:N) - Un usuario puede tener muchas herramientas
- **playlists → tools** (1:N) - Una playlist puede tener muchas herramientas
- **Integridad referencial**: Si se elimina un usuario, se eliminan automáticamente todas sus playlists y herramientas
- **Privacidad**: Cada usuario solo puede ver/modificar sus propios datos
- **Una playlist puede tener muchas herramientas** (1:N)
- **Una herramienta pertenece a una playlist** (N:1)
- **Integridad referencial**: Si se elimina una playlist, se eliminan automáticamente todas sus herramientas

## 5. Personalización

### Agregar nuevas categorías
Puedes agregar nuevas categorías ejecutando este SQL en Supabase:

```sql
INSERT INTO public.playlists (name, icon) VALUES 
('Nueva Categoría', 'icon-name');
```

### Gestionar herramientas
Las herramientas se pueden agregar desde la interfaz o directamente en la base de datos:

```sql
-- Primero obtén el ID de la playlist
SELECT id FROM public.playlists WHERE name = 'NLP';

-- Luego inserta la herramienta usando el playlist_id
INSERT INTO public.tools (title, summary, playlist_id, image, url, tags) VALUES 
('Nueva Herramienta', 'Descripción...', '11111111-1111-1111-1111-111111111111', '/image.jpg', 'https://url.com', ARRAY['tag1', 'tag2']);
```

### Políticas de seguridad
Las tablas tienen Row Level Security (RLS) habilitado:
- Lectura pública permitida
- Escritura solo para usuarios autenticados
- Puedes modificar las políticas según tus necesidades

## 6. Próximos pasos sugeridos

### 🚀 **Cómo usar la aplicación con autenticación**

#### Primera vez:
1. **Visita** `http://localhost:3000` 
2. **Serás redirigido** automáticamente a `/auth/login` 
3. **Haz clic** en "Regístrate aquí" para crear tu cuenta
4. **Completa el registro** con email y contraseña
5. **Confirma tu email** (revisa tu bandeja de entrada)
6. **Inicia sesión** y ¡disfruta tu dashboard personalizado!

#### Cada sesión:
1. **Inicia sesión** con tu email y contraseña
2. **Ve tu contenido personalizado** en el dashboard
3. **Agrega herramientas** usando el botón en el header
4. **Organiza por categorías** usando el sidebar
5. **Cierra sesión** seguramente desde el menú de usuario (header)

### ✨ **Funcionalidades avanzadas implementadas**

#### 🔒 **Seguridad**
- **Row Level Security (RLS)**: Datos completamente privados por usuario
- **Políticas automáticas**: Solo puedes ver/editar tus propios datos
- **Autenticación PKCE**: Flujo de OAuth más seguro
- **Protección de rutas**: Redirección automática si no hay sesión

#### 🎯 **Personalización**
- **Datos únicos por usuario**: Tu propio conjunto de herramientas y categorías
- **Configuración inicial**: Se crean automáticamente playlists y herramientas de ejemplo
- **Perfil de usuario**: Nombre completo, avatar, email
- **Conteo dinámico**: Número real de herramientas por categoría

#### 📱 **Experiencia de usuario**
- **Estados de carga**: Loading skeletons mientras cargan los datos
- **Manejo de errores**: Mensajes descriptivos para problemas de conexión 
- **Responsive design**: Funciona perfecto en móvil y desktop
- **Toast notifications**: Confirmaciones para acciones importantes

### 💡 **Próximas funcionalidades sugeridas**

1. **Imágenes**: Usar Supabase Storage para las imágenes de herramientas
2. **Búsqueda**: Agregar funcionalidad de búsqueda full-text
3. **Favoritos**: Sistema de herramientas favoritas dentro de cada categoría  
4. **Compartir**: Posibilidad de hacer públicas ciertas herramientas o listas
5. **Comentarios**: Sistema de notas personales por herramienta
6. **Filtros avanzados**: Filtros por tags, fecha, popularidad, etc.
7. **Exportar/Importar**: Backup y restauración de datos
8. **Teams**: Colaboración entre usuarios en workspaces compartidos

## Troubleshooting

### Error de conexión
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el proyecto de Supabase esté activo  
- Revisa que las políticas RLS permitan acceso a los datos

### Problemas de autenticación
- **No puedo registrarme**: Verifica que la autenticación por email esté habilitada en Supabase
- **No recibo email de confirmación**: Revisa la carpeta de spam o configura un proveedor SMTP
- **Error al iniciar sesión**: Verifica que las credenciales sean correctas y que el email esté confirmado
- **Redirige constantemente al login**: Verifica que el usuario esté autenticado correctamente

### No se muestran datos
- **First time users**: Los datos aparecerán después de registrarte e iniciar sesión
- Verifica que las tablas se crearon correctamente con el trigger para nuevos usuarios
- Ejecuta el script SQL completo incluyendo las funciones de trigger
- Revisa la consola del navegador para errores de RLS

### Problemas con imágenes
- Las imágenes usan URLs relativas (`/images/categoria.jpg`)
- Asegúrate de tener las imágenes en la carpeta `public/images/`
- O actualiza las URLs para usar imágenes externas

### Errores de foreign key
- Si una herramienta no se puede insertar, verifica que el `playlist_id` exista
- Usa los UUIDs exactos de las playlists (puedes consultarlos con `SELECT id, name FROM playlists`)
- No se puede eliminar una playlist que tiene herramientas asociadas a menos que elimines las herramientas primero

## ✅ Ventajas de la nueva estructura con Foreign Keys

### 🔗 Integridad referencial
- **Garantiza** que cada herramienta pertenezca a una playlist válida
- **Previene** herramientas "huérfanas" con categorías inexistentes
- **Limpieza automática** cuando se elimina una playlist (CASCADE DELETE)

### 📊 Rendimiento optimizado
- **Índices en foreign keys** para consultas rápidas
- **JOINs eficientes** entre tools y playlists
- **Conteos precisos** sin consultas lentas de texto

### 🛡️ Consistencia de datos
- **No hay duplicados** de nombres de categorías
- **Cambios centralizados** - modificar un nombre de playlist actualiza todas las herramientas
- **Validación automática** de relaciones

### 🔄 Facilita futuras funcionalidades
- **Metadatos adicionales** por playlist (descripción, colores, etc.)
- **Permisos granulares** por playlist
- **Estadísticas avanzadas** por categoría