# Configuración del Webhook de n8n para YouTube Content

Este documento explica cómo configurar el webhook de n8n para clasificar automáticamente contenido de YouTube con IA y almacenarlo en la base de datos.

## ✅ SISTEMA COMPLETAMENTE FUNCIONAL - PROBLEMA RESUELTO

**URL del webhook:** `https://ai-knowledge-hub-six.vercel.app/api/n8n`
**Webhook secret:** `webhook_secret_n8n_production_ai_hub_xyz789`

🎉 **ÚLTIMA ACTUALIZACIÓN:** Problema de duplicados resuelto (23 Feb 2026)
- ✅ Restricciones NOT NULL corregidas
- ✅ Valores por defecto configurados para todos los campos requeridos
- ✅ UPSERT implementado - maneja videos duplicados automáticamente
- ✅ Testing exitoso - el sistema funciona perfectamente

**🔧 Comportamiento actual:**
- **Videos nuevos:** Se insertan normalmente
- **Videos existentes:** Se actualizan con nuevos datos (clasificación AI mejorada, etc.)
- **Sin errores de duplicate key** - El sistema maneja automáticamente cualquier `video_id`

El sistema está completamente operativo. Los videos se procesan automáticamente:
- 🎥 **YouTube API** → Extrae datos del video
- 🤖 **OpenAI** → Clasifica contenido con IA  
- 💾 **Webhook** → Guarda/actualiza en base de datos Supabase

**Resultado esperado al ejecutar workflow:**
```json
{
  "success": true,
  "message": "Video content saved successfully to database",
  "data": { "saved_record": { ... } }
}
```

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
     part: snippet,statistics,contentDetails
     q: AI tools
     type: video
     order: date
     publishedAfter: 2026-01-01T00:00:00Z
     maxResults: 20
     ```

**� IMPORTANTE - Configuración en n8n:**
- **NO** crees 3 parámetros separados `part`
- **SÍ** usa UN SOLO parámetro `part` con valores separados por comas
- **Ejemplo correcto**:
  ```
  Parameter Name: part
  Parameter Value: snippet,statistics,contentDetails
  ```
- **Ejemplo INCORRECTO**:
  ```
  ❌ part: snippet
  ❌ part: statistics  
  ❌ part: contentDetails
  ```

**�💡 Importante:** Cambié `part: snippet` por `part: snippet,statistics,contentDetails` para obtener:
- **snippet**: Título, descripción, canal, thumbnail, fecha
- **statistics**: Views, likes, comentarios  
- **contentDetails**: Duración del video
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
   - Datos del canal
   - Metadatos (duración, vistas, etc.)

**Prompt mejorado para OpenAI:**
```
Analiza este video de YouTube y clasifícalo según estas categorías:

Título: {{$node["YouTube Data API"].json["items"][0]["snippet"]["title"]}}
Descripción: {{$node["YouTube Data API"].json["items"][0]["snippet"]["description"]}}
Canal: {{$node["YouTube Data API"].json["items"][0]["snippet"]["channelTitle"]}}
Duración: {{$node["YouTube Data API"].json["items"][0]["contentDetails"]["duration"]}}
Vistas: {{$node["YouTube Data API"].json["items"][0]["statistics"]["viewCount"]}}

Categorías disponibles:
- AI-Tools: Herramientas de IA
- Data-Science: Ciencia de datos  
- Web-Development: Desarrollo web
- Design: Diseño y creatividad
- Educational: Contenido educativo
- Productivity: Productividad

Responde en formato JSON:
{
  "category": "categoria-principal",
  "reasoning": "Explicación detallada de por qué se clasificó así",
  "confidence": 0.95,
  "tools_detected": ["herramienta1", "herramienta2"],
  "key_points": ["punto clave 1", "punto clave 2", "punto clave 3"],
  "tags": ["tag1", "tag2", "tag3"]
}
```

### 4. Mapear datos para el webhook

1. Añade un nodo "Function" o "Set" para formatear los datos
2. Mapea todos los campos requeridos:

```javascript
// Mapeo de datos MEJORADO (incluye todos los campos de la DB)
const youtubeData = $input.first().json;
const aiResponse = $node["OpenAI"].json;

return [{
  json: {
    video_id: youtubeData.items[0].id.videoId,
    title: youtubeData.items[0].snippet.title,
    description: youtubeData.items[0].snippet.description,
    channel_name: youtubeData.items[0].snippet.channelTitle,
    channel_url: `https://youtube.com/channel/${youtubeData.items[0].snippet.channelId}`,
    thumbnail_url: youtubeData.items[0].snippet.thumbnails.high.url,
    published_at: youtubeData.items[0].snippet.publishedAt,
    view_count: parseInt(youtubeData.items[0].statistics?.viewCount || 0),
    like_count: parseInt(youtubeData.items[0].statistics?.likeCount || 0),
    duration: youtubeData.items[0].contentDetails?.duration,
    ai_classification: {
      category: aiResponse.category,
      reasoning: aiResponse.reasoning,
      confidence: aiResponse.confidence,
      tools_detected: aiResponse.tools_detected || []
    },
    ai_key_points: aiResponse.key_points || [],
    tags: aiResponse.tags || [],
    user_email: "afa028@gmail.com"
  }
}];
```

**🎯 JSON DIRECTO MEJORADO (sin nodo Set previo):**
```json
{
  "video_id": "{{ $node['YouTube Data API'].json['items'][0]['id']['videoId'] }}",
  "title": "{{ $node['YouTube Data API'].json['items'][0]['snippet']['title'] }}",
  "description": "{{ $node['YouTube Data API'].json['items'][0]['snippet']['description'] }}",
  "channel_name": "{{ $node['YouTube Data API'].json['items'][0]['snippet']['channelTitle'] }}",
  "channel_url": "https://youtube.com/channel/{{ $node['YouTube Data API'].json['items'][0]['snippet']['channelId'] }}",
  "thumbnail_url": "{{ $node['YouTube Data API'].json['items'][0]['snippet']['thumbnails']['high']['url'] }}",
  "published_at": "{{ $node['YouTube Data API'].json['items'][0]['snippet']['publishedAt'] }}",
  "view_count": {{ $node['YouTube Data API'].json['items'][0]['statistics']['viewCount'] || 0 }},
  "like_count": {{ $node['YouTube Data API'].json['items'][0]['statistics']['likeCount'] || 0 }},
  "duration": "{{ $node['YouTube Data API'].json['items'][0]['contentDetails']['duration'] }}",
  "ai_classification": {
    "category": "{{ $node['OpenAI'].json['category'] }}",
    "reasoning": "{{ $node['OpenAI'].json['reasoning'] }}",
    "confidence": {{ $node['OpenAI'].json['confidence'] }},
    "tools_detected": {{ $node['OpenAI'].json['tools_detected'] }}
  },
  "ai_key_points": {{ $node['OpenAI'].json['key_points'] || [] }},
  "tags": {{ $node['OpenAI'].json['tags'] || [] }},
  "user_email": "afa028@gmail.com"
}
```

**⚠️ Importante:** Reemplaza los nombres de nodos por los exactos de tu workflow:
- `YouTube Data API` → Nombre real de tu nodo HTTP Request
- `OpenAI` → Nombre real de tu nodo de IA

### 5. Enviar al webhook

1. Añade un nodo "HTTP Request"
2. Configura:
   - **Method**: POST
   - **URL**: `https://ai-knowledge-hub-six.vercel.app/api/n8n`
   - **Send Headers**: ✅ Activar
   - **Headers**: 
     ```
     Name: Content-Type
     Value: application/json
     
     Name: x-webhook-secret  
     Value: webhook_secret_n8n_production_ai_hub_xyz789
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
   - **Valor actual**: `webhook_secret_n8n_production_ai_hub_xyz789`

## 🔧 **Configuración paso a paso mejorada en n8n**

### **Paso 1: Nodo YouTube Data API**
1. **Crear** nodo "HTTP Request"  
2. **Nombrar**: "YouTube Data API" (importante para las referencias)
3. **URL**: `https://www.googleapis.com/youtube/v3/search`
4. **Parameters**:
   ```
   key: [TU_API_KEY]
   part: snippet,statistics,contentDetails  ← ¡Importante!
   q: AI tools
   type: video
   order: date
   publishedAfter: 2026-01-01T00:00:00Z
   maxResults: 20
   ```

### **Paso 2: Nodo OpenAI**
1. **Crear** nodo "OpenAI" (Message a model)
2. **Nombrar**: "OpenAI" (importante para las referencias)
3. **Prompt** (usar el prompt mejorado de arriba)
4. **Model**: gpt-4o-mini
5. **Response Format**: JSON

### **Paso 3: Nodo HTTP Request (Webhook)**
1. **Crear** nodo "HTTP Request"
2. **URL**: `https://ai-knowledge-hub-six.vercel.app/api/n8n`
3. **Method**: POST
4. **Headers** → **Using Fields**:
   - `Content-Type`: `application/json`
   - `x-webhook-secret`: `webhook_secret_n8n_production_ai_hub_xyz789`
5. **Body** → **JSON**: Usar el JSON mejorado de arriba

### **🎯 Resultado: Base de datos completamente poblada**
Con esta configuración, cada ejecución guardará:
- ✅ **22 campos** en la base de datos
- ✅ **Datos completos** de YouTube (título, descripción, canal, estadísticas)
- ✅ **Clasificación AI** completa (categoría, confianza, herramientas)
- ✅ **URLs** construidas automáticamente
- ✅ **Metadatos** completos (duración, vistas, likes)
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
     "ai_classification": {
       "category": "{{ $node['OpenAI'].json['category'] }}",
       "reasoning": "{{ $node['OpenAI'].json['reasoning'] }}",
       "confidence": {{ $node['OpenAI'].json['confidence'] }},
       "tools_detected": {{ $node['OpenAI'].json['tools_detected'] }}
     },
     "user_email": "afa028@gmail.com"
   }
   ```
   *(Cambia `HTTP Request` y `OpenAI` por los nombres reales de tus nodos)*
   
   **Opción 2: JSON estático para testing**
   ```json
   {
     "video_id": "test123",
     "title": "Test Video",
     "ai_classification": {
       "category": "Educational",
       "reasoning": "Test reasoning",
       "confidence": 0.9,
       "tools_detected": ["Test"]
     },
     "user_email": "afa028@gmail.com"
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
  "video_id": "test123",
  "title": "Título del video",
  "ai_classification": {
    "category": "Educational",
    "reasoning": "Video educativo sobre herramientas de IA",
    "confidence": 0.9,
    "tools_detected": ["Test"]
  },
  "user_email": "afa028@gmail.com"
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
curl -X POST https://ai-knowledge-hub-six.vercel.app/api/n8n \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: webhook_secret_n8n_production_ai_hub_xyz789" \
  -d '{
    "video_id": "test123",
    "title": "Test Video", 
    "ai_classification": {
      "category": "Educational",
      "reasoning": "Test reasoning",
      "confidence": 0.9,
      "tools_detected": ["Test"]
    },
    "user_email": "afa028@gmail.com"
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
     "ai_classification": {
       "category": "Educational",
       "reasoning": "Test reasoning", 
       "confidence": 0.9,
       "tools_detected": ["Test"]
     },
     "user_email": "afa028@gmail.com"
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

---

## 🎉 **ESTADO ACTUAL: SISTEMA 100% FUNCIONAL** (Febrero 23, 2026)

### ✅ **COMPLETADO EXITOSAMENTE**

**🚀 Pipeline de automatización funcionando end-to-end:**

1. **✅ YouTube Data API** → Obtiene videos automáticamente
2. **✅ OpenAI Classification** → Clasifica contenido con IA  
3. **✅ Webhook Delivery** → Entrega datos a la aplicación
4. **✅ Database Storage** → Guarda en Supabase con UPSERT
5. **✅ Production Environment** → Sistema desplegado y estable

**🛡️ Configuración de seguridad confirmada:**
- **✅ Webhook Secret**: Autenticación funcionando
- **✅ HTTPS**: Conexión segura verificada  
- **✅ Environment Variables**: Configuración de producción lista
- **✅ Duplicate Handling**: UPSERT maneja videos existentes automáticamente

**🔧 Servicios integrados:**
- **Production URL**: `https://ai-knowledge-hub-six.vercel.app`
- **Webhook Endpoint**: `/api/n8n` (funcional y probado)
- **n8n Cloud**: Workflow ejecutándose correctamente
- **Vercel Deployment**: Ambiente de producción estable
- **Supabase Database**: Almacenamiento persistente operativo

**🎯 El sistema está completamente funcional y listo para automatización continua de contenido de YouTube con análisis AI.**

### 📈 **Próximos pasos recomendados:**
1. **Automatización:** Configura schedule en n8n para ejecución regular
2. **Monitoreo:** Revisa logs de n8n para tracking de videos procesados
3. **Interfaz:** Implementa visualización de videos clasificados en `/youtube`
4. **Optimización:** Ajusta prompts de OpenAI según resultados observados