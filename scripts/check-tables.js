const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('🔍 Verificando tablas en Supabase...\n')

  try {
    // Verificar playlists
    console.log('1. Verificando tabla playlists...')
    const { data: playlists, error: playlistsError } = await supabase
      .from('playlists')
      .select('count', { count: 'exact', head: true })
    
    if (playlistsError) {
      console.log('❌ Tabla playlists no encontrada o sin acceso')
      console.log(`   Error: ${playlistsError.message}`)
    } else {
      console.log('✅ Tabla playlists existe')
    }

    // Verificar tools
    console.log('\n2. Verificando tabla tools...')
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('count', { count: 'exact', head: true })
    
    if (toolsError) {
      console.log('❌ Tabla tools no encontrada o sin acceso')
      console.log(`   Error: ${toolsError.message}`)
    } else {
      console.log('✅ Tabla tools existe')
    }

    // Verificar youtube_content
    console.log('\n3. Verificando tabla youtube_content...')
    const { data: youtube, error: youtubeError } = await supabase
      .from('youtube_content')
      .select('count', { count: 'exact', head: true })
    
    if (youtubeError) {
      console.log('❌ Tabla youtube_content no encontrada o sin acceso')
      console.log(`   Error: ${youtubeError.message}`)
    } else {
      console.log('✅ Tabla youtube_content existe')
    }

    // Contar datos existentes si las tablas están
    if (!playlistsError && !toolsError) {
      console.log('\n📊 Contando datos existentes...')
      
      const { count: playlistCount } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true })
      
      const { count: toolCount } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
      
      let youtubeCount = 0
      if (!youtubeError) {
        const { count } = await supabase
          .from('youtube_content')
          .select('*', { count: 'exact', head: true })
        youtubeCount = count || 0
      }

      console.log(`   📋 Playlists: ${playlistCount || 0}`)
      console.log(`   🛠️  Tools: ${toolCount || 0}`)
      console.log(`   🎥 YouTube content: ${youtubeCount}`)

      if ((playlistCount || 0) === 0) {
        console.log('\n💡 Las tablas existen pero están vacías.')
        console.log('   Ejecuta: npm run db:seed (para poblar con datos iniciales)')
      } else {
        console.log('\n🎉 ¡Base de datos configurada y con datos!')
      }
    }

  } catch (error) {
    console.error('❌ Error verificando tablas:', error.message)
    console.log('\n🔧 Posibles soluciones:')
    console.log('- Verifica que hayas ejecutado el SQL para crear las tablas')
    console.log('- Asegúrate de que las políticas RLS permitan lectura')
    console.log('- Ve a tu Dashboard de Supabase y verifica las tablas')
  }
}

checkTables()