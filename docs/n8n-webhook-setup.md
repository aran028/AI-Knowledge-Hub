# Configuración del Webhook de n8n para YouTube Content

Este documento explica cómo configurar el webhook de n8n para clasificar automáticamente contenido de YouTube con IA y almacenarlo en la base de datos.

## Prerrequisitos

1. Una cuenta de n8n activa (cloud o self-hosted)
2. Acceso a la API de YouTube (clave de API)
3. Acceso a un servicio de IA (OpenAI, Anthropic, etc.)
4. Variables de entorno configuradas en tu aplicación:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `N8N_WEBHOOK_SECRET`

## Estructura del Webhook

### Endpoint
```
POST /api/webhooks/youtube
```

### Headers requeridos
```
Content-Type: application/json
Authorization: Bearer YOUR_N8N_WEBHOOK_SECRET
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
    "confidence_score": 0.95,
    "summary": "Video sobre herramientas de generación de video con IA",
    "key_points": [
      "Muestra diferentes herramientas de IA",
      "Compara características y precios",
      "Incluye tutorial paso a paso"
    ],
    "related_tools": ["runway", "pika", "stable-video"],
    "relevance_score": 0.88,
    "target_playlist": "ai-video-tools",
    "tags": ["ai", "video", "generation", "tools"]
  }
}
```

## Configuración paso a paso en n8n

### 1. Crear un nuevo workflow en n8n

1. Ve a n8n y crea un nuevo workflow
2. Nómbralo "YouTube AI Content Classifier"

### 2. Configurar el trigger de YouTube

1. Añade un nodo "HTTP Request" o "YouTube" según tu preferencia
2. Configura para monitorear nuevos videos de canales específicos
3. Usa filtros para solo procesar videos relacionados con IA/tech

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
  "confidence_score": 0.95,
  "summary": "Resumen del video en 1-2 líneas",
  "key_points": ["punto 1", "punto 2", "punto 3"],
  "related_tools": ["herramienta1", "herramienta2"],
  "relevance_score": 0.88,
  "target_playlist": "playlist-recomendada",
  "tags": ["tag1", "tag2", "tag3"]
}
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
      confidence_score: aiResponse.confidence_score,
      summary: aiResponse.summary,
      key_points: aiResponse.key_points,
      related_tools: aiResponse.related_tools,
      relevance_score: aiResponse.relevance_score,
      target_playlist: aiResponse.target_playlist,
      tags: aiResponse.tags
    }
  }
}];
```

### 5. Enviar al webhook

1. Añade un nodo "HTTP Request"
2. Configura:
   - **Method**: POST
   - **URL**: `https://tu-dominio.com/api/webhooks/youtube`
   - **Headers**: 
     ```json
     {
       "Content-Type": "application/json",
       "Authorization": "Bearer {{$env.N8N_WEBHOOK_SECRET}}"
     }
     ```
   - **Body**: Los datos mapeados del paso anterior

### 6. Manejo de errores

1. Añade nodos de manejo de errores
2. Configura notificaciones en caso de fallos
3. Implementa retry logic para fallos temporales

## Variables de entorno necesarias

Configura estas variables en tu archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# n8n Webhook
N8N_WEBHOOK_SECRET=your_secret_key_here

# YouTube API (opcional, para validaciones)
YOUTUBE_API_KEY=your_youtube_api_key
```

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
  -H "Authorization: Bearer YOUR_SECRET" \
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
      "confidence_score": 0.9,
      "summary": "Test summary",
      "key_points": ["Point 1", "Point 2"],
      "related_tools": ["tool1"],
      "target_playlist": "ai-tools"
    }
  }'
```

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