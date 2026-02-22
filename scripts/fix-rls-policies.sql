-- Crear policies que permitan lectura pública
-- Ejecuta esto en tu SQL Editor de Supabase

-- ✅ Permitir lectura pública de playlists
CREATE POLICY "Allow public read access on playlists" 
ON playlists FOR SELECT 
USING (true);

-- ✅ Permitir lectura pública de tools
CREATE POLICY "Allow public read access on tools" 
ON tools FOR SELECT 
USING (true);

-- ✅ Permitir lectura pública de youtube_content
CREATE POLICY "Allow public read access on youtube_content" 
ON youtube_content FOR SELECT 
USING (true);

-- 📊 Verificar que las policies se crearon
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('playlists', 'tools', 'youtube_content');