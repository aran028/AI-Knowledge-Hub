const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Verificando Formato de Datos para la App\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDataFormat() {
  try {
    console.log('1. 📋 Verificando formato de PLAYLISTS...')
    
    const { data: playlists, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .order('name', { ascending: true })
    
    if (playlistError) {
      console.log(`   ❌ Error: ${playlistError.message}`)
    } else {
      console.log(`   ✅ Total: ${playlists.length} playlists`)
      console.log('   📄 Estructura esperada: { id, name, icon, created_at, updated_at }')
      
      if (playlists.length > 0) {
        const sample = playlists[0]
        console.log('   📄 Campos encontrados:', Object.keys(sample).join(', '))
        console.log('   📄 Sample:', JSON.stringify(sample, null, 2))
        
        // Verificar campos requeridos
        const requiredFields = ['id', 'name', 'icon']
        const missingFields = requiredFields.filter(field => !(field in sample))
        
        if (missingFields.length > 0) {
          console.log(`   ⚠️ Campos faltantes: ${missingFields.join(', ')}`)
        } else {
          console.log('   ✅ Todos los campos necesarios presentes')
        }
      }
    }
    
    console.log('\n2. 🛠️ Verificando formato de TOOLS...')
    
    const { data: tools, error: toolError } = await supabase
      .from('tools')
      .select(`
        id,
        title,
        summary,
        image,
        url,
        tags,
        created_at,
        playlists(
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
    
    if (toolError) {
      console.log(`   ❌ Error: ${toolError.message}`)
    } else {
      console.log(`   ✅ Total: ${tools.length} tools`)
      console.log('   📄 Estructura esperada: { id, title, summary, image, url, tags, playlists }')
      
      if (tools.length > 0) {
        const sample = tools[0]
        console.log('   📄 Campos encontrados:', Object.keys(sample).join(', '))
        console.log('   📄 Sample:', JSON.stringify(sample, null, 2))
        
        // Verificar campos requeridos
        const requiredFields = ['id', 'title', 'summary', 'image', 'url']
        const missingFields = requiredFields.filter(field => !(field in sample))
        
        if (missingFields.length > 0) {
          console.log(`   ⚠️ Campos faltantes: ${missingFields.join(', ')}`)
        } else {
          console.log('   ✅ Todos los campos necesarios presentes')
        }
        
        // Verificar relación con playlists
        if (sample.playlists) {
          console.log('   ✅ Relación con playlists funciona')
        } else {
          console.log('   ⚠️ Relación con playlists falla - verificar foreign key')
        }
      }
    }
    
    console.log('\n3. 📊 Verificando conteo por playlist...')
    
    if (playlists && tools) {
      console.log('   Herramientas por categoria:')
      playlists.forEach(playlist => {
        const toolCount = tools.filter(tool => 
          tool.playlists && tool.playlists.id === playlist.id
        ).length
        console.log(`   - ${playlist.name}: ${toolCount} tools`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkDataFormat()