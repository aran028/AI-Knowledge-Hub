const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('🎯 Test Directo al Proyecto Específico\n')

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📋 Configuración actual:')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Anon Key: ${supabaseAnonKey?.substring(0, 30)}...`)

// Verificar que la URL coincida con el proyecto
const expectedProjectId = 'euldngblivgrrxjdmjwu'
const urlProjectId = supabaseUrl?.split('.')[0]?.split('//')[1]

console.log(`   Proyecto esperado: ${expectedProjectId}`)
console.log(`   Proyecto en URL: ${urlProjectId}`)
console.log(`   ✅ URLs coinciden: ${urlProjectId === expectedProjectId ? 'Sí' : 'NO - PROBLEMA AQUÍ!'}`)

if (urlProjectId !== expectedProjectId) {
  console.log('\n❌ PROBLEMA: La URL no coincide con el proyecto del dashboard!')
  console.log('   Actualiza .env.local con la URL correcta.')
  process.exit(1)
}

// Test de conexión directa
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSpecificProject() {
  try {
    console.log('\n🔗 Probando conexión al proyecto específico...')
    
    // Test 1: Verificar que podemos conectar
    const { data: session, error: sessionError } = await supabase.auth.getSession()
    console.log(`   Sesión auth: ${sessionError ? '❌ Error' : '✅ OK'}`)
    
    // Test 2: Intentar leer tabla específica que sabemos que existe
    console.log('\n📊 Probando lectura de tabla playlists...')
    
    const { data: playlists, error: playlistError } = await supabase
      .from('playlists') 
      .select('*')
      
    if (playlistError) {
      console.log(`   ❌ Error: ${playlistError.message}`)
      console.log(`   📝 Código de error: ${playlistError.code}`)
      console.log(`   📝 Detalles: ${JSON.stringify(playlistError.details)}`)
      
      if (playlistError.message.includes('JWT')) {
        console.log('\n💡 SOLUCIÓN: Problema con el token JWT')
        console.log('   - Verifica que NEXT_PUBLIC_SUPABASE_ANON_KEY sea correcto')
        console.log('   - Ve a Settings > API y copia la anon key nueva')
      }
      
      if (playlistError.message.includes('permission') || playlistError.message.includes('RLS')) {
        console.log('\n💡 SOLUCIÓN: Problema de permisos RLS')
        console.log('   - Ve a Authentication > Policies en tu dashboard')
        console.log('   - Crea política para tabla playlists: allow_read_all')
        console.log('   - O temporalmente: SQL > ALTER TABLE playlists DISABLE ROW LEVEL SECURITY;')
      }
      
    } else {
      console.log(`   ✅ Éxito: ${playlists?.length || 0} playlists encontradas`)
      
      if (playlists && playlists.length > 0) {
        console.log('   📄 Primera playlist:')
        console.log(`      ID: ${playlists[0].id}`)
        console.log(`      Nombre: ${playlists[0].name}`)
        console.log(`      Icono: ${playlists[0].icon}`)
      }
    }
    
    // Test 3: Tools
    console.log('\n🛠️ Probando lectura de tabla tools...')
    const { data: tools, error: toolError } = await supabase
      .from('tools')
      .select('*')
      .limit(3)
      
    if (toolError) {
      console.log(`   ❌ Error: ${toolError.message}`)
    } else {
      console.log(`   ✅ Éxito: ${tools?.length || 0} tools encontradas`)
      tools?.forEach((tool, i) => {
        console.log(`      ${i + 1}. ${tool.title}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

testSpecificProject()