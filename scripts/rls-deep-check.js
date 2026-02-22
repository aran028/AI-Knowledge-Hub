const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔐 Diagnóstico RLS y Autenticación\n')

async function diagnoseData() {
  // Cliente con clave anónima (como en la app)
  const supabasePublic = createClient(supabaseUrl, supabaseAnonKey)
  
  // Cliente con clave de servicio (sin RLS)
  const supabaseAdmin = serviceKey ? createClient(supabaseUrl, serviceKey) : null

  console.log('1. 🔍 Probando con clave ANÓNIMA (como en la app)...')
  
  try {
    const { data: publicPlaylists, error: publicError } = await supabasePublic
      .from('playlists')
      .select('*')
    
    if (publicError) {
      console.log(`   ❌ Error: ${publicError.message}`)
      console.log(`   🔍 Código: ${publicError.code || 'N/A'}`)
      console.log(`   📄 Detalles: ${publicError.details || 'N/A'}`)
    } else {
      console.log(`   ✅ Playlists encontradas: ${publicPlaylists.length}`)
    }
    
    const { data: publicTools, error: toolError } = await supabasePublic
      .from('tools')
      .select('*')
    
    if (toolError) {
      console.log(`   ❌ Error tools: ${toolError.message}`)
    } else {
      console.log(`   ✅ Tools encontradas: ${publicTools.length}`)
    }
    
  } catch (error) {
    console.log(`   ❌ Error general: ${error.message}`)
  }

  if (supabaseAdmin) {
    console.log('\n2. 🔓 Probando con clave de SERVICIO (sin RLS)...')
    
    try {
      const { data: adminPlaylists, error: adminError } = await supabaseAdmin
        .from('playlists')
        .select('*')
      
      if (adminError) {
        console.log(`   ❌ Error admin: ${adminError.message}`)
      } else {
        console.log(`   ✅ Playlists (admin): ${adminPlaylists.length}`)
        if (adminPlaylists.length > 0) {
          console.log('   📋 Nombres:', adminPlaylists.map(p => p.name).join(', '))
        }
      }
      
      const { data: adminTools, error: adminToolError } = await supabaseAdmin
        .from('tools')
        .select('*')
      
      if (adminToolError) {
        console.log(`   ❌ Error tools admin: ${adminToolError.message}`)
      } else {
        console.log(`   ✅ Tools (admin): ${adminTools.length}`)
        if (adminTools.length > 0) {
          console.log('   🛠️ Primeras 3:', adminTools.slice(0,3).map(t => t.title).join(', '))
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error admin general: ${error.message}`)
    }
  } else {
    console.log('\n2. ⚠️ No hay clave de servicio configurada')
    console.log('   Agrega SUPABASE_SERVICE_ROLE_KEY a .env.local para testing sin RLS')
  }

  console.log('\n3. 📊 Verificando policies RLS...')
  
  try {
    // Intentar ver qué policies existen
    const { data: policies, error: policyError } = await supabasePublic
      .from('pg_policies')
      .select('*')
      .in('tablename', ['playlists', 'tools'])
    
    if (policyError) {
      console.log(`   ❌ No se pueden ver policies: ${policyError.message}`)
    } else {
      console.log(`   📄 Policies encontradas: ${policies.length}`)
      policies.forEach(policy => {
        console.log(`   - ${policy.tablename}: ${policy.policyname} (${policy.cmd || 'ALL'})`)
      })
    }
  } catch (error) {
    console.log(`   ❌ Error policies: ${error.message}`)
  }

  console.log('\n4. 🔐 Estado de autenticación...')
  const { data: { session } } = await supabasePublic.auth.getSession()
  
  if (session) {
    console.log(`   ✅ Usuario autenticado: ${session.user.email}`)
  } else {
    console.log('   ❌ No hay sesión activa')
    console.log('   💡 Las policies RLS podrían requerir autenticación')
  }
}

diagnoseData()