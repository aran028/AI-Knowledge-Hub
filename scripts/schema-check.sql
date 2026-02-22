-- Script SQL para ejecutar en Supabase SQL Editor
-- Esto te mostrará exactamente dónde están los datos

-- 1. Ver todos los schemas disponibles
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
ORDER BY schema_name;

-- 2. Ver todas las tablas en schema public
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. Contar registros en playlists (schema public)
SELECT COUNT(*) as total_playlists FROM public.playlists;

-- 4. Contar registros en tools (schema public)
SELECT COUNT(*) as total_tools FROM public.tools;

-- 5. Ver sample de datos si existen
SELECT * FROM public.playlists LIMIT 3;
SELECT * FROM public.tools LIMIT 3;

-- 6. Verificar si hay otros schemas con estas tablas
SELECT 
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = schemaname AND table_name = tablename) as column_count
FROM pg_tables 
WHERE tablename IN ('playlists', 'tools')
ORDER BY schemaname, tablename;