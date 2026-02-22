const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Diagnóstico Profundo de Datos\n')
console.log(`🌐 URL: ${supabaseUrl}`)
console.log(`🔑 Key: ${supabaseAnonKey?.substring(0, 20)}...`)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function deepDiagnostic() {
  try {
    // Verificar schemas y tablas disponibles
    console.log('\n1. 📊 Verificando estructura de base de datos...')
    
    // Query para ver todas las tablas
    const { data: tables, error: tableError } = await supabase
      .rpc('get_schema_tables') // Si existe esta función
      .catch(() => ({ data: null, error: { message: 'RPC no disponible' } }))
    
    if (tableError) {
      console.log(`   ⚠️ No se puede consultar metadata: ${tableError.message}`)
    }
    
    // Verificar información de las tablas conocidas
    console.log('\n2. 🔍 Verificando tablas específicas...')
    
    const tableChecks = ['playlists', 'tools', 'youtube_content']
    
    for (const tableName of tableChecks) {
      console.log(`\n📋 Tabla: ${tableName}`)
      
      // Método 1: COUNT directo
      try {
        const { count, error: countError } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        console.log(`   Count method: ${countError ? `❌ ${countError.message}` : `✅ ${count} registros`}`)
      } catch (e) {
        console.log(`   Count method: ❌ ${e.message}`)
      }
      
      // Método 2: Select con limit 1
      try {
        const { data, error: selectError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        console.log(`   Select method: ${selectError ? `❌ ${selectError.message}` : `✅ ${data?.length || 0} registros (sample)`}`)
        
        if (data && data.length > 0) {
          console.log(`   📄 Sample record keys: ${Object.keys(data[0]).join(', ')}`)
        }
      } catch (e) {
        console.log(`   Select method: ❌ ${e.message}`)
      }
    }
    
    // Verificar configuración de conexión
    console.log('\n3. ⚙️ Verificando configuración...')
    
    // Test de auth
    const { data: authData, error: authError } = await supabase.auth.getUser()
    console.log(`   Auth status: ${authError ? 'Error' : (authData.user ? 'Authenticated' : 'Anonymous')}`)
    
    // Test de session
    const { data: sessionData } = await supabase.auth.getSession()
    console.log(`   Session: ${sessionData.session ? 'Active' : 'None'}`)
    
    console.log('\n💡 PRÓXIMOS PASOS:')
    console.log('   1. Verifica en Supabase Dashboard → Table Editor si ves los datos')
    console.log('   2. En SQL Editor ejecuta: SELECT COUNT(*) FROM playlists;')
    console.log('   3. Verifica que estés en el proyecto correcto de Supabase')
    console.log('   4. Comprueba las variables de entorno (.env.local)')
    
  } catch (error) {
    console.error('❌ Error en diagnóstico profundo:', error.message)
  }
}

deepDiagnostic()