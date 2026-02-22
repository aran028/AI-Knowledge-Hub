-- Script SQL para crear las tablas necesarias en Supabase
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- 1. Crear tabla de playlists/categorías
CREATE TABLE IF NOT EXISTS playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crear tabla de herramientas
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    image TEXT NOT NULL,
    url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Crear tabla de contenido de YouTube
CREATE TABLE IF NOT EXISTS youtube_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    channel_name TEXT NOT NULL,
    channel_url TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    ai_classification JSONB,
    confidence_score DECIMAL(3,2),
    related_tools TEXT[] DEFAULT '{}',
    playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    ai_summary TEXT,
    ai_key_points TEXT[],
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tools_playlist_id ON tools(playlist_id);
CREATE INDEX IF NOT EXISTS idx_youtube_content_playlist_id ON youtube_content(playlist_id);
CREATE INDEX IF NOT EXISTS idx_youtube_content_video_id ON youtube_content(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_content_created_at ON youtube_content(created_at);
CREATE INDEX IF NOT EXISTS idx_youtube_content_confidence_score ON youtube_content(confidence_score);

-- 5. Configurar RLS (Row Level Security)
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_content ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS básicas (permitir lectura pública para demo)
CREATE POLICY "Allow public read access on playlists" ON playlists
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on tools" ON tools
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on youtube_content" ON youtube_content
    FOR SELECT USING (true);

-- 7. Funciones de trigger para updated_at
CREATE OR REPLACE FUNCTION updated_at_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear triggers
CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW EXECUTE FUNCTION updated_at_trigger();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION updated_at_trigger();

CREATE TRIGGER update_youtube_content_updated_at
    BEFORE UPDATE ON youtube_content
    FOR EACH ROW EXECUTE FUNCTION updated_at_trigger();