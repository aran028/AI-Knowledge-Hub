const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Diagnóstico Avanzado de Permisos y Datos\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function advancedDiagnostic() {
  try {
    console.log('1. 🧪 Probando acceso directo a tablas...')
    
    // Test básico de conectividad
    console.log('\n📡 Test de conectividad:')
    const { data: authData } = await supabase.auth.getUser()
    console.log(`   Estado auth: ${authData.user ? 'Autenticado' : 'Anónimo'}`)
    
    // Test playlists con diferentes enfoques
    console.log('\n📋 Test Playlists:')
    
    // Enfoque 1: Select simple
    const { data: p1, error: pe1 } = await supabase.from('playlists').select('*')
    console.log(`   Select simple: ${pe1 ? `❌ ${pe1.message}` : `✅ ${p1?.length || 0} registros`}`)
    
    // Enfoque 2: Count
    const { count: p2, error: pe2 } = await supabase.from('playlists').select('*', { count: 'exact', head: true })
    console.log(`   Count: ${pe2 ? `❌ ${pe2.message}` : `✅ ${p2 || 0} registros`}`)
    
    // Test tools
    console.log('\n🛠️ Test Tools:')
    
    const { data: t1, error: te1 } = await supabase.from('tools').select('*')
    console.log(`   Select simple: ${te1 ? `❌ ${te1.message}` : `✅ ${t1?.length || 0} registros`}`)
    
    // Test tools con join
    const { data: t2, error: te2 } = await supabase
      .from('tools')
      .select(`
        id,
        title,
        playlists(name)
      `)
    console.log(`   Con join: ${te2 ? `❌ ${te2.message}` : `✅ ${t2?.length || 0} registros`}`)
    
    // Test YouTube content
    console.log('\n🎥 Test YouTube Content:')
    const { data: y1, error: ye1 } = await supabase.from('youtube_content').select('*')
    console.log(`   Select simple: ${ye1 ? `❌ ${ye1.message}` : `✅ ${y1?.length || 0} registros`}`)
    
    console.log('\n🔧 Posibles problemas detectados:')
    
    if (pe1?.message?.includes('permission') || te1?.message?.includes('permission')) {
      console.log('   ⚠️ Problema de permisos RLS - Revisa las políticas en Supabase')
    }
    
    if (pe1?.message?.includes('does not exist') || te1?.message?.includes('does not exist')) {
      console.log('   ⚠️ Tabla no existe - Ejecuta create-tables.sql')
    }
    
    if (!pe1 && !te1 && (!p1?.length && !t1?.length)) {
      console.log('   ℹ️ Tablas existen pero sin datos - Inserta registros manualmente')
    }
    
    if (!pe1 && !te1 && (p1?.length || t1?.length)) {
      console.log('   ✅ Datos encontrados - El problema puede estar en la aplicación')
    }

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

advancedDiagnostic()