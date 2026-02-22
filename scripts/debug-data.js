const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugData() {
  console.log('🔍 Diagnosticando datos en Supabase...\n')

  try {
    // Verificar playlists
    console.log('📋 PLAYLISTS:')
    const { data: playlists, error: playlistsError } = await supabase
      .from('playlists')
      .select('*')
      .order('name')
    
    if (playlistsError) {
      console.log('❌ Error:', playlistsError.message)
    } else {
      console.log(`   Total: ${playlists.length}`)
      playlists.forEach((p, i) => console.log(`   ${i + 1}. ${p.name} (${p.id})`))
    }

    // Verificar tools
    console.log('\n🛠️ TOOLS:')
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select(`
        id, 
        title, 
        playlist_id,
        playlists(name)
      `)
      .order('title')
    
    if (toolsError) {
      console.log('❌ Error:', toolsError.message)
    } else {
      console.log(`   Total: ${tools.length}`)
      tools.forEach((t, i) => {
        const playlistName = t.playlists?.name || 'Sin categoría'
        console.log(`   ${i + 1}. ${t.title} → ${playlistName}`)
      })
    }

    // Verificar YouTube content
    console.log('\n🎥 YOUTUBE CONTENT:')
    const { data: youtube, error: youtubeError } = await supabase
      .from('youtube_content')
      .select('id, title, channel_name')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (youtubeError) {
      console.log('❌ Error:', youtubeError.message)
    } else {
      console.log(`   Total videos: ${youtube.length}`)
      youtube.forEach((v, i) => console.log(`   ${i + 1}. ${v.title} (${v.channel_name})`))
    }

    console.log('\n✅ Diagnóstico completado!')

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message)
  }
}

debugData()