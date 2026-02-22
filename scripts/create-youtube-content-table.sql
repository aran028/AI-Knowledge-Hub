-- 🎥 Crear tabla youtube_content con todas las columnas necesarias
-- Ejecuta esto en tu SQL Editor de Supabase

-- ✅ Crear tabla youtube_content
CREATE TABLE youtube_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  channel_name TEXT NOT NULL,
  channel_url TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT, -- Formato ISO 8601 como PT15M30S
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  
  -- IA Classification como JSONB
  ai_classification JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Arrays para herramientas, tags y puntos clave
  related_tools TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_key_points TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Resumen por IA
  ai_summary TEXT,
  
  -- Foreign key a playlists
  playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
  
  -- Usuario que agregó el contenido
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ✅ Crear índices para optimizar búsquedas
CREATE INDEX idx_youtube_content_playlist_id ON youtube_content(playlist_id);
CREATE INDEX idx_youtube_content_user_id ON youtube_content(user_id);
CREATE INDEX idx_youtube_content_video_id ON youtube_content(video_id);
CREATE INDEX idx_youtube_content_tags ON youtube_content USING GIN(tags);
CREATE INDEX idx_youtube_content_related_tools ON youtube_content USING GIN(related_tools);
CREATE INDEX idx_youtube_content_ai_classification ON youtube_content USING GIN(ai_classification);
CREATE INDEX idx_youtube_content_created_at ON youtube_content(created_at DESC);

-- ✅ Trigger para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_youtube_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_youtube_content_updated_at
  BEFORE UPDATE ON youtube_content
  FOR EACH ROW
  EXECUTE FUNCTION update_youtube_content_updated_at();

-- ✅ Habilitar Row Level Security
ALTER TABLE youtube_content ENABLE ROW LEVEL SECURITY;

-- ✅ Policy para lectura pública (como las otras tablas)
CREATE POLICY "Allow public read access on youtube_content" 
ON youtube_content FOR SELECT 
USING (true);

-- ✅ Policy para que usuarios autenticados puedan insertar
CREATE POLICY "Allow authenticated users to insert youtube_content" 
ON youtube_content FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- ✅ Policy para que usuarios editen solo su contenido
CREATE POLICY "Allow users to update their own youtube_content" 
ON youtube_content FOR UPDATE 
USING (auth.uid() = user_id);

-- ✅ Policy para que usuarios borren solo su contenido
CREATE POLICY "Allow users to delete their own youtube_content" 
ON youtube_content FOR DELETE 
USING (auth.uid() = user_id);

-- 📊 Insertar algunos datos de ejemplo
INSERT INTO youtube_content (
  video_id, 
  title, 
  description, 
  channel_name, 
  video_url, 
  thumbnail_url,
  ai_classification, 
  confidence_score,
  related_tools, 
  tags,
  ai_summary,
  ai_key_points
) VALUES
(
  'dQw4w9WgXcQ',
  'Guía Completa de ChatGPT para Desarrolladores',
  'Aprende a integrar ChatGPT en tus aplicaciones y flujos de trabajo de desarrollo.',
  'AI Development Tutorial',
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  '{"category": "IA/ML", "subcategory": "ChatGPT", "tools_detected": ["ChatGPT", "OpenAI API"], "confidence": 0.95, "reasoning": "Video centrado en desarrollo con ChatGPT"}',
  0.95,
  ARRAY['ChatGPT', 'OpenAI API'],
  ARRAY['chatgpt', 'openai', 'desarrollo', 'api'],
  'Tutorial completo sobre integración de ChatGPT en aplicaciones de desarrollo',
  ARRAY['Configuración de API', 'Mejores prácticas', 'Casos de uso', 'Ejemplos prácticos']
),
(
  'abc123def45',
  'Diseño con Figma: De Wireframes a Prototipos',
  'Workflow completo de diseño UX/UI usando Figma desde conceptos básicos hasta prototipos avanzados.',
  'Design Masters',
  'https://youtube.com/watch?v=abc123def45',
  'https://img.youtube.com/vi/abc123def45/mqdefault.jpg',
  '{"category": "Diseño", "subcategory": "UI/UX", "tools_detected": ["Figma"], "confidence": 0.92, "reasoning": "Tutorial completo de Figma para diseño"}',
  0.92,
  ARRAY['Figma'],
  ARRAY['figma', 'diseño', 'ui', 'ux', 'prototipo'],
  'Guía completa para dominar Figma en proyectos de diseño UX/UI',
  ARRAY['Componentes reutilizables', 'Sistema de diseño', 'Prototipado interactivo', 'Colaboración en equipo']
),
(
  'xyz789ghi01',
  'Automatización con GitHub Actions',
  'Configura workflows de CI/CD usando GitHub Actions para automatizar tus proyectos de desarrollo.',
  'DevOps Pro',
  'https://youtube.com/watch?v=xyz789ghi01',
  'https://img.youtube.com/vi/xyz789ghi01/mqdefault.jpg',
  '{"category": "Desarrollo", "subcategory": "DevOps", "tools_detected": ["GitHub Actions", "GitHub"], "confidence": 0.88, "reasoning": "Tutorial de automatización con GitHub Actions"}',
  0.88,
  ARRAY['GitHub Actions', 'GitHub'],
  ARRAY['github', 'actions', 'ci-cd', 'automatización', 'devops'],
  'Tutorial sobre automatización de workflows con GitHub Actions',
  ARRAY['Configuración de workflows', 'Deploy automático', 'Testing automatizado', 'Integración continua']
);

-- 📊 Verificar que la tabla se creó correctamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'youtube_content' 
ORDER BY ordinal_position;

-- 📊 Verificar datos insertados
SELECT 
  id,
  title,
  channel_name,
  array_length(related_tools, 1) as tools_count,
  array_length(tags, 1) as tags_count,
  created_at
FROM youtube_content 
ORDER BY created_at DESC;