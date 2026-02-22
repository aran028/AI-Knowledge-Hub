const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Falta')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurada' : '❌ Falta')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Configurando base de datos de Supabase...\n')

  try {
    // 1. Probar conexión básica
    console.log('1. Probando conexión a Supabase...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('playlists')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      throw new Error(`Error de conexión: ${connectionError.message}`)
    }
    console.log('✅ Conexión exitosa\n')

    // 2. Verificar tablas existentes
    console.log('2. Verificando estructura de tablas...')
    
    // Verificar tabla playlists
    const { data: playlists, error: playlistsError } = await supabase
      .from('playlists')
      .select('*')
      .limit(1)
    
    if (playlistsError) {
      console.log('⚠️  Tabla playlists no encontrada, se debe crear manualmente en Supabase')
    } else {
      console.log('✅ Tabla playlists existe')
    }

    // Verificar tabla tools
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1)
    
    if (toolsError) {
      console.log('⚠️  Tabla tools no encontrada, se debe crear manualmente en Supabase')
    } else {
      console.log('✅ Tabla tools existe')
    }

    // Verificar tabla youtube_content
    const { data: youtube, error: youtubeError } = await supabase
      .from('youtube_content')
      .select('*')
      .limit(1)
    
    if (youtubeError) {
      console.log('⚠️  Tabla youtube_content no encontrada, se debe crear manualmente en Supabase')
    } else {
      console.log('✅ Tabla youtube_content existe')
    }

    // 3. Contar datos existentes
    console.log('\n3. Contando datos existentes...')
    
    const { data: playlistCount } = await supabase
      .from('playlists')
      .select('*', { count: 'exact', head: true })
    
    const { data: toolCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
    
    const { data: youtubeCount } = await supabase
      .from('youtube_content')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Playlists: ${playlistCount?.length || 0}`)
    console.log(`📊 Tools: ${toolCount?.length || 0}`)
    console.log(`📊 YouTube content: ${youtubeCount?.length || 0}`)

    console.log('\n✅ Verificación completada!')
    
    if (!playlists || playlists.length === 0) {
      console.log('\n📝 Para crear datos iniciales, ejecuta:')
      console.log('   node scripts/seed-database.js')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n🔧 Verifica:')
    console.log('- Que las variables de entorno estén configuradas correctamente')
    console.log('- Que tu proyecto de Supabase esté activo')
    console.log('- Que las tablas estén creadas en Supabase Dashboard')
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }