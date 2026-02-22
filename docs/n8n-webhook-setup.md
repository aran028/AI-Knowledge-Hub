# Configuración del Webhook de n8n para YouTube Content

Este documento explica cómo configurar el webhook de n8n para clasificar automáticamente contenido de YouTube con IA y almacenarlo en la base de datos.

## Prerrequisitos

### Configuración en Google Cloud Console

**Para API Key (Opción Simple):**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la YouTube Data API v3
3. Ve a "Credenciales" > "Crear credenciales" > "Clave de API"
4. Restricción recomendada: Solo "YouTube Data API v3"
5. Copia la API Key

**Para OAuth2 (Opción Avanzada):**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita la YouTube Data API v3  
3. Ve a "Credenciales" > "Crear credenciales" > "ID de cliente de OAuth 2.0"
4. Tipo de aplicación: "Aplicación web"
5. URI de redirección: Copia la que te proporciona n8n
6. Guarda Client ID y Client Secret

### Otros prerequisitos:
1. Una cuenta de n8n activa (cloud o self-hosted)
2. Acceso a un servicio de IA (OpenAI, Anthropic, etc.)
3. Variables de entorno configuradas en tu aplicación:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `N8N_WEBHOOK_SECRET`
   - `YOUTUBE_API_KEY` (si usas API Key)

## Estructura del Webhook

### Endpoint
```
POST /api/webhooks/youtube
```

### Headers requeridos
```
Content-Type: application/json
x-webhook-secret: YOUR_N8N_WEBHOOK_SECRET
```

### Estructura del payload

```json
{
  "video_id": "dQw4w9WgXcQ",
  "title": "Título del video",
  "channel_name": "Nombre del canal",
  "channel_id": "UCuAXFkgsw1L7xaCfnd5JJOw",
  "description": "Descripción del video",
  "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "published_at": "2023-12-01T10:00:00Z",
  "duration": "PT4M13S",
  "view_count": 1234567,
  "like_count": 12345,
  "user_email": "usuario@ejemplo.com",
  "ai_classification": {
    "category": "ai-tools",
    "subcategory": "video-generation",
    "tools_detected": ["runway", "pika", "stable-video"],
    "confidence": 0.95,
    "reasoning": "Video sobre herramientas de generación de video con IA que compara características y precios"
  },
  "ai_summary": "Video sobre herramientas de generación de video con IA",
  "ai_key_points": [
    "Muestra diferentes herramientas de IA",
    "Compara características y precios",
    "Incluye tutorial paso a paso"
  ]
}
```

## Configuración paso a paso en n8n

### 1. Crear un nuevo workflow en n8n

1. Ve a n8n y crea un nuevo workflow
2. Nómbralo "YouTube AI Content Classifier"

### 2. Configurar el trigger de YouTube

**OPCIÓN A: Usar API Key (Recomendado para contenido público)**

1. Añade un nodo "HTTP Request" 
2. Configura para hacer peticiones a la YouTube Data API:
   - **URL**: `https://www.googleapis.com/youtube/v3/search`
   - **Method**: GET
   - **Query Parameters**:
     ```
     key: YOUR_YOUTUBE_API_KEY
     part: snippet
     q: AI tools
     type: video
     order: date
     publishedAfter: 2024-01-01T00:00:00Z
     maxResults: 50
     ```
   - **Nota**: `maxResults` puede ser de 1 a 50 videos por llamada
   - **Recomendado**: Usar 20-30 para balance entre eficiencia y uso de cuota
3. **No necesitas configurar credenciales** en n8n, solo añadir tu API Key como parámetro

**OPCIÓN B: Usar OAuth2 (Para acceso completo)**

1. Añade un nodo "YouTube" 
2. Configura credenciales OAuth2:
   - En n8n ve a "Credentials" > "Create New" > "YouTube OAuth2 API"
   - **Client ID**: Tu Client ID de Google Cloud
   - **Client Secret**: Tu Client Secret de Google Cloud
   - **Redirect URL**: Copia la URL que te muestra n8n y añádela en Google Cloud Console
3. Haz clic en "Connect my account" y autoriza
4. Configura la búsqueda:
   - **Operation**: Search > List
   - **For**: Videos
   - **Q**: AI tools
   - **Order**: Date
   - **Published After**: 2024-01-01T00:00:00Z
   - **Max Results**: 50 (máximo videos por ejecución)

### Frecuencia de ejecución en n8n:

**Para obtener contenido regularmente:**
1. Añade un nodo **"Cron"** o **"Schedule Trigger"** al inicio
2. Configuraciones recomendadas:
   - **Cada hora**: `0 * * * *` (24 ejecuciones/día)
   - **Cada 6 horas**: `0 */6 * * *` (4 ejecuciones/día) 
   - **Cada día**: `0 9 * * *` (1 ejecución/día a las 9 AM)

**Cálculo de videos obtenidos:**
- Cada 6 horas + 30 videos = **120 videos/día**
- Cada hora + 10 videos = **240 videos/día**
- Solo usa **4-24 requests** de tu cuota de **10,000**

### Solucionar el problema actual en n8n:

Si ya tienes el nodo YouTube configurado pero te pide OAuth2:

1. **Elimina el nodo** YouTube actual
2. **Añade un nodo HTTP Request** en su lugar  
3. **Usa tu API Key** existente (OPCIÓN A más arriba)
4. Es más simple y **funciona perfectamente** para contenido público

### ¿Cuál elegir?

| Característica | API Key | OAuth2 |
|---|---|---|
| **Configuración** | ✅ Simple | ❌ Compleja |
| **Acceso público** | ✅ Sí | ✅ Sí |
| **Acceso privado** | ❌ No | ✅ Sí |
| **Rate limits** | 🔶 10,000 requests/día | ✅ 1,000,000 requests/día |
| **Videos por request** | ✅ 1-50 videos | ✅ 1-50 videos |
| **Total videos/día** | 🔶 ~500,000 teórico | ✅ ~50,000,000 teórico |
| **Para tu caso** | ✅ **Recomendado** | 🔶 Opcional |

### 📊 Límites explicados:

**`maxResults` (videos por llamada):**
- Mínimo: 1 video
- Máximo: 50 videos  
- Recomendado: 20-30 videos (balance eficiencia/cuota)

**Cuota diaria (requests totales):**
- API Key: 10,000 requests/día
- OAuth2: 1,000,000 requests/día

**Ejemplo práctico:**
```
Ejecución cada 6 horas + 30 videos por ejecución:
• 4 requests/día × 30 videos = 120 videos/día
• Usa solo 4 de 10,000 requests disponibles (0.04%)
• Puedes aumentar a maxResults: 50 sin problema
```

**Usa API Key si:**
- Solo necesitas contenido público
- Quieres simplicidad
- Monitorizas canales específicos públicos  
- Necesitas menos de ~1,000 videos/día

**Usa OAuth2 si:**
- Necesitas acceso a datos privados
- Quieres tasas más altas
- Planeas funciones avanzadas futuras
- Necesitas miles de videos/día

### 3. Procesar video con IA

1. Añade un nodo "OpenAI" (o tu servicio de IA preferido)
2. Crea un prompt que analice:
   - Título y descripción del video
   - Transcripción (opcional, usando YouTube API)
   - Thumbnail (usando visión AI)

Ejemplo de prompt:
```
Analiza este video de YouTube y clasifícalo según estas categorías:

Título: {{$node["YouTube"].json["title"]}}
Descripción: {{$node["YouTube"].json["description"]}}
Canal: {{$node["YouTube"].json["channelTitle"]}}

Categorías disponibles:
- ai-tools: Herramientas de IA
- data-science: Ciencia de datos  
- web-development: Desarrollo web
- design: Diseño y creatividad
- productivity: Productividad

Responde en formato JSON:
{
  "category": "categoria-principal",
  "subcategory": "subcategoria-especifica", 
  "tools_detected": ["herramienta1", "herramienta2"],
  "confidence": 0.95,
  "reasoning": "Explicación de por qué se clasificó así"
}

// Campos opcionales separados:
"ai_summary": "Resumen del video en 1-2 líneas",
"ai_key_points": ["punto 1", "punto 2", "punto 3"]
```

### 4. Mapear datos para el webhook

1. Añade un nodo "Function" o "Set" para formatear los datos
2. Mapea todos los campos requeridos:

```javascript
// Ejemplo de función de mapeo
const youtubeData = $input.first().json;
const aiResponse = $node["OpenAI"].json;

return [{
  json: {
    video_id: youtubeData.id.videoId,
    title: youtubeData.snippet.title,
    channel_name: youtubeData.snippet.channelTitle,
    channel_id: youtubeData.snippet.channelId,
    description: youtubeData.snippet.description,
    thumbnail_url: youtubeData.snippet.thumbnails.maxres?.url || youtubeData.snippet.thumbnails.high.url,
    video_url: `https://www.youtube.com/watch?v=${youtubeData.id.videoId}`,
    published_at: youtubeData.snippet.publishedAt,
    duration: youtubeData.contentDetails?.duration,
    view_count: parseInt(youtubeData.statistics?.viewCount || 0),
    like_count: parseInt(youtubeData.statistics?.likeCount || 0),
    user_email: "admin@tu-dominio.com", // o dinámico según tu lógica
    ai_classification: {
      category: aiResponse.category,
      subcategory: aiResponse.subcategory,
      tools_detected: aiResponse.tools_detected || [],
      confidence: aiResponse.confidence,
      reasoning: aiResponse.reasoning
    },
    ai_summary: aiResponse.summary || null,
    ai_key_points: aiResponse.key_points || []
  }
}];
```

### 5. Enviar al webhook

1. Añade un nodo "HTTP Request"
2. Configura:
   - **Method**: POST
   - **URL**: `https://tu-dominio.com/api/webhooks/youtube`
   - **Send Headers**: ✅ Activar
   - **Headers**: 
     ```
     Name: Content-Type
     Value: application/json
     
     Name: x-webhook-secret  
     Value: {{$env.N8N_WEBHOOK_SECRET}}
     ```
   - **Send Body**: ✅ Activar (JSON)
   - **Body**: Los datos mapeados del paso anterior

**📋 Configuración paso a paso en n8n:**

**Para los HEADERS (NO uses JSON):**
1. En el nodo HTTP Request, ve a **"Headers"**
2. **Send Headers**: ✅ Activar
3. **Specify Headers**: Selecciona **"Using Fields"** (NO JSON)
4. Añade **primer header**:
   - **Name**: `Content-Type`
   - **Value**: `application/json`
5. Añade **segundo header**:
   - **Name**: `x-webhook-secret`
   - **Value**: `{{$env.N8N_WEBHOOK_SECRET}}` 
   
   **⚠️ IMPORTANTE sobre las llaves {{}}:**
   - **SÍ debes poner las llaves** `{{}}` en n8n
   - Sin las llaves, n8n enviará el texto literal "N8N_WEBHOOK_SECRET"
   - Con las llaves, n8n usa el valor real de la variable de entorno
   
   **🔐 ¿Qué es N8N_WEBHOOK_SECRET?**
   - **NO es** tu contraseña de n8n
   - **SÍ es** una clave secreta que TÚ generas para autenticar webhooks
   - Ejemplo: `N8N_WEBHOOK_SECRET=mi-clave-super-secreta-123`
   - Debe ser la **misma clave** en n8n Y en tu aplicación

**Para el BODY (SÍ usa JSON):**
6. **Send Body**: ✅ Activar 
7. **Body Content Type**: Selecciona **"JSON"**
8. **JSON**: En este campo, tienes dos opciones:

   **OPCIÓN A: Referenciar el nodo anterior (⚠️ Requiere nodo previo)**
   ```
   {{ $json }}
   ```
   *(SOLO funciona si has créado un nodo "Set" o "Function" antes del HTTP Request para mapear los datos)*
   
   **📋 Para usar esta opción primero debes:**
   1. Añadir un nodo **"Set"** antes del HTTP Request
   2. En el nodo "Set", mapear todos los campos necesarios 
   3. Luego en HTTP Request usar simplemente `{{ $json }}`

   **OPCIÓN B: JSON completo manual (✅ Sin nodos adicionales)**
   
   **⚠️ IMPORTANTE - Error "Referenced node doesn't exist":**
   
   Si al pegar el JSON ves un bloque "fx" y el error "Referenced node doesn't exist", es porque:
   - El JSON hace referencia a nodos (`$node['YouTube']`, `$node['OpenAI']`) que NO existen en tu workflow
   - El bloque "fx" significa que n8n detectó variables/funciones en el JSON
   
   **🛠️ SOLUCIONES:**
   
   **Opción 1: Cambiar nombres de nodos (Recomendado)**
   ```json
   {
     "video_id": "{{ $node['HTTP Request'].json['items'][0]['id']['videoId'] }}",
     "title": "{{ $node['HTTP Request'].json['items'][0]['snippet']['title'] }}",
     "channel_name": "{{ $node['HTTP Request'].json['items'][0]['snippet']['channelTitle'] }}",
     "channel_id": "{{ $node['HTTP Request'].json['items'][0]['snippet']['channelId'] }}",
     "description": "{{ $node['HTTP Request'].json['items'][0]['snippet']['description'] }}",
     "thumbnail_url": "{{ $node['HTTP Request'].json['items'][0]['snippet']['thumbnails']['high']['url'] }}",
     "video_url": "https://www.youtube.com/watch?v={{ $node['HTTP Request'].json['items'][0]['id']['videoId'] }}",
     "published_at": "{{ $node['HTTP Request'].json['items'][0]['snippet']['publishedAt'] }}",
     "user_email": "admin@tu-dominio.com"
   }
   ```
   *(Cambia `HTTP Request` por el nombre real de tu nodo de YouTube API)*
   
   **Opción 2: JSON estático para testing**
   ```json
   {
     "video_id": "dQw4w9WgXcQ",
     "title": "Test Video Title",
     "channel_name": "Test Channel",
     "channel_id": "UC123456",
     "description": "Test description for video",
     "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
     "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
     "published_at": "2024-12-01T10:00:00Z",
     "user_email": "admin@tu-dominio.com",
     "ai_classification": {
       "category": "ai-tools",
       "subcategory": "general",
       "tools_detected": ["test-tool"],
       "confidence": 0.9,
       "reasoning": "Test classification"
     }
   }
   ```
   *(Sin variables, funciona siempre pero con datos fijos)*

   **💡 Recomendación**: 
   - **Para empezar rápido**: Usa **Opción 2** (JSON estático) primero 
   - **Para testing**: Verifica que el webhook funciona con datos fijos
   - **Para producción**: Usa **Opción 1** con nombres correctos de nodos
   
   **📋 Cómo encontrar el nombre correcto de tus nodos:**
   1. En n8n, mira el nombre que aparece encima de cada nodo
   2. Si tu nodo de YouTube API se llama "HTTP Request" usa: `$node['HTTP Request']`
   3. Si tu nodo de IA se llama "OpenAI" usa: `$node['OpenAI']`
   4. Los nombres deben coincidir **exactamente** (mayúsculas y espacios)
   
   **🔧 Pasos para evitar el error:**
   ```
   1. Empieza con JSON estático (Opción 2)
   2. Haz testing para verificar que funciona
   3. Una vez confirmado, cambia a variables dinámicas (Opción 1)
   4. Usa los nombres exactos de tus nodos
   ```

### ⚠️ **Importante - No confundir:**
- **Headers**: Usa **"Using Fields"** (name/value pairs)
- **Body**: Usa **"JSON"** (datos del webhook)

### 📋 **¿Qué poner exactamente en el JSON del Body?**

**✅ Método recomendado para workflows avanzados:**
1. Crea un nodo **"Set"** antes del HTTP Request
2. Mapea todos los datos en el nodo "Set" 
3. En el HTTP Request JSON, simplemente pon: `{{ $json }}`

**✅ Método directo (para empezar rápido):**
- Puedes poner el JSON completo con las variables de n8n directamente
- No necesitas nodos adicionales
- Perfecto para primeros workflows o testing

**🎯 El JSON final debe tener esta estructura:**
```json
{
  "video_id": "dQw4w9WgXcQ",
  "title": "Título del video",
  "channel_name": "Nombre del canal",
  "channel_id": "UCuAXFkgsw1L7xaCfnd5JJOw",
  "description": "Descripción del video",
  "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "published_at": "2023-12-01T10:00:00Z",
  "user_email": "admin@tu-dominio.com",
  "ai_classification": {
    "category": "ai-tools",
    "subcategory": "video-generation",
    "tools_detected": ["runway", "pika"],
    "confidence": 0.95,
    "reasoning": "Video sobre herramientas de IA"
  }
}
```

### 6. Manejo de errores

1. Añade nodos de manejo de errores
2. Configura notificaciones en caso de fallos
3. Implementa retry logic para fallos temporales

## Variables de entorno necesarias

### En tu aplicación Next.js (.env.local):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# n8n Webhook Secret (TÚ generas esta clave)
N8N_WEBHOOK_SECRET=mi-clave-super-secreta-123

# YouTube API (para validaciones o búsquedas directas)
YOUTUBE_API_KEY=your_youtube_api_key

# OpenAI para clasificación IA (opcional)
OPENAI_API_KEY=your_openai_api_key
```

### En n8n (Variables de entorno):

**📋 Cómo configurar en n8n:**
1. Ve a **Settings** > **Environments** en n8n
2. Añade variable de entorno:
   - **Name**: `N8N_WEBHOOK_SECRET`
   - **Value**: `mi-clave-super-secreta-123` (la misma que en .env.local)

**🔐 ¿Cómo generar N8N_WEBHOOK_SECRET?**
- Usa cualquier generador de contraseñas
- O genera una manualmente: `webhook-secret-2024-abc123`
- **Debe ser la MISMA** en n8n y en tu aplicación
- **NO es** tu contraseña de n8n (es solo para este webhook)

## Seguridad

1. **Secret verification**: El webhook verifica el token de autorización
2. **User validation**: Solo usuarios existentes pueden tener contenido asociado
3. **Rate limiting**: Implementa límites de velocidad si es necesario
4. **Input sanitization**: Todos los inputs se validan antes del almacenamiento

## Testing

Puedes probar el webhook usando curl:

```bash
curl -X POST https://tu-dominio.com/api/webhooks/youtube \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_SECRET" \
  -d '{
    "video_id": "test123",
    "title": "Test Video",
    "channel_name": "Test Channel",
    "channel_id": "test_channel",
    "description": "Test description",
    "thumbnail_url": "https://example.com/thumb.jpg",
    "video_url": "https://youtube.com/watch?v=test123",
    "published_at": "2023-12-01T10:00:00Z",
    "user_email": "test@example.com",
    "ai_classification": {
      "category": "ai-tools",
      "subcategory": "general",
      "tools_detected": ["tool1"],
      "confidence": 0.9,
      "reasoning": "Test video about AI tools"
    },
    "ai_summary": "Test summary",
    "ai_key_points": ["Point 1", "Point 2"]
  }'
```

## Troubleshooting

### Problema: n8n pide OAuth2 pero tengo API Key

**Solución:**
1. Elimina el nodo "YouTube" de n8n
2. Usa un nodo "HTTP Request" en su lugar
3. URL: `https://www.googleapis.com/youtube/v3/search?key=TU_API_KEY&part=snippet&q=AI&type=video&order=date`
4. ✅ **Funciona igual** pero sin complicaciones OAuth2

### Problema: "Referenced node doesn't exist" en JSON del webhook

**Causa:** El JSON hace referencia a nodos (`$node['YouTube']`, `$node['OpenAI']`) que no existen.

**Solución rápida:**
1. **Usa JSON estático** para testing:
   ```json
   {
     "video_id": "test123",
     "title": "Test Video",
     "channel_name": "Test Channel",
     "channel_id": "UC123",
     "description": "Test description",
     "thumbnail_url": "https://example.com/thumb.jpg",
     "video_url": "https://youtube.com/watch?v=test123",
     "published_at": "2024-12-01T10:00:00Z",
     "user_email": "admin@tu-dominio.com"
   }
   ```
2. **Primero verifica** que el webhook funciona con datos fijos
3. **Después** cambia a variables cuando tengas los nodos configurados

**Solución completa:**
1. **Identifica los nombres** reales de tus nodos en n8n
2. **Reemplaza en el JSON**:
   - `$node['YouTube']` → `$node['TU_NODO_YOUTUBE']`
   - `$node['OpenAI']` → `$node['TU_NODO_IA']`
3. **Ejemplo**: Si tu nodo se llama "HTTP Request":
   ```json
   "video_id": "{{ $node['HTTP Request'].json['items'][0]['id']['videoId'] }}"
   ```

### Problema: "API Key restriction" 

**Solución:**
1. Ve a Google Cloud Console > Credenciales
2. Edita tu API Key
3. En "Restricciones de API" selecciona "YouTube Data API v3"
4. Guarda cambios

### Problema: Cuota excedida

**Solución:**
- API Key: 10,000 **requests**/día (no videos)
- OAuth2: 1,000,000 **requests**/día
- Cada request puede traer 1-50 videos
- Considera cambiar a OAuth2 si necesitas más

### Problema: "Muy pocos videos obtenidos"

**Solución:**
1. Aumenta `maxResults` de 10 a 30-50
2. Ejecuta n8n más frecuentemente (cada hora vs cada día)
3. Usa múltiples búsquedas con términos diferentes
4. Ejemplo: `q=AI tools` + `q=machine learning` + `q=ChatGPT`

### Problema: Webhook retorna 401 Unauthorized

**Solución:**
1. **Verifica N8N_WEBHOOK_SECRET** sea igual en n8n Y en tu .env.local
2. **Verifica las llaves** en n8n: `{{$env.N8N_WEBHOOK_SECRET}}`
3. **Configura la variable** en n8n Settings > Environments:
   ```
   Name: N8N_WEBHOOK_SECRET
   Value: mi-clave-super-secreta-123
   ```
4. **Reinicia n8n** después de añadir variables de entorno

### Problema: n8n envía texto literal "N8N_WEBHOOK_SECRET"

**Solución:**
- **Usa las llaves**: `{{$env.N8N_WEBHOOK_SECRET}}`
- **NO pongas**: `N8N_WEBHOOK_SECRET` (sin llaves)
- Las llaves `{{}}` son necesarias para variables en n8n

## Testing

Puedes probar tu API Key directamente:

```bash
curl "https://www.googleapis.com/youtube/v3/search?key=TU_API_KEY&part=snippet&q=AI%20tools&type=video&maxResults=1"
```

Si devuelve JSON con videos, ✅ **tu API Key funciona correctamente**.

## Monitoreo

1. Revisa los logs de n8n para errores en el workflow
2. Monitorea la respuesta del webhook (200 = éxito)
3. Verifica que los datos se almacenan correctamente en Supabase
4. Usa las métricas de YouTube Dashboard para validar funcionamiento

## Próximos pasos

Una vez configurado:
1. Los videos aparecerán automáticamente en `/youtube`
2. Se organizarán por categorías según la clasificación AI
3. Los usuarios podrán buscar y filtrar el contenido
4. Las estadísticas se actualizarán en tiempo real