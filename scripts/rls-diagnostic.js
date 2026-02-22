const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Diagnóstico de Row Level Security (RLS)\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function diagnoseRLS() {
  try {
    console.log('1. 🔐 Verificando políticas RLS...\n')
    
    // Check si RLS está habilitado
    console.log('📋 PLAYLISTS - Diagnóstico RLS:')
    
    // Test con diferentes métodos
    const tests = [
      { name: 'Select *', query: () => supabase.from('playlists').select('*') },
      { name: 'Select count', query: () => supabase.from('playlists').select('*', { count: 'exact', head: true }) },
      { name: 'Select id only', query: () => supabase.from('playlists').select('id') },
      { name: 'Select name only', query: () => supabase.from('playlists').select('name') },
    ]
    
    for (const test of tests) {
      try {
        const { data, error, count } = await test.query()
        if (error) {
          console.log(`   ❌ ${test.name}: ${error.message}`)
          if (error.message.includes('RLS')) {
            console.log(`      💡 Problema RLS detectado!`)
          }
        } else {
          console.log(`   ✅ ${test.name}: ${count !== undefined ? count : data?.length || 0} registros`)
        }
      } catch (e) {
        console.log(`   ❌ ${test.name}: ${e.message}`)
      }
    }
    
    console.log('\n🛠️ TOOLS - Diagnóstico RLS:')
    
    const toolTests = [
      { name: 'Select *', query: () => supabase.from('tools').select('*') },
      { name: 'Select con JOIN', query: () => supabase.from('tools').select('*, playlists(name)') },
    ]
    
    for (const test of toolTests) {
      try {
        const { data, error } = await test.query()
        if (error) {
          console.log(`   ❌ ${test.name}: ${error.message}`)
        } else {
          console.log(`   ✅ ${test.name}: ${data?.length || 0} registros`)
        }
      } catch (e) {
        console.log(`   ❌ ${test.name}: ${e.message}`)
      }
    }
    
    console.log('\n💡 SOLUCIONES sugeridas:')
    console.log('   1. En Supabase Dashboard → Authentication → Policies')
    console.log('   2. Para tabla playlists, agregar política:')
    console.log('      - "allow_read_playlists" FOR SELECT USING (true)')
    console.log('   3. Para tabla tools, agregar política:')
    console.log('      - "allow_read_tools" FOR SELECT USING (true)')
    console.log('   4. O temporalmente: ALTER TABLE playlists DISABLE ROW LEVEL SECURITY;')

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message)
  }
}

diagnoseRLS()