const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Test de Conexión Simple a Supabase\n')

// Verificar variables de entorno
console.log('📋 Verificando configuración...')
console.log(`- SUPABASE_URL: ${supabaseUrl ? '✅' : '❌ FALTA'}`)
console.log(`- ANON_KEY: ${supabaseAnonKey ? '✅' : '❌ FALTA'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Faltan credenciales en .env.local')
  console.log('📖 Ve las instrucciones en DATABASE_SETUP.md')
  process.exit(1)
}

// Test de conexión simple
console.log('\n🚀 Probando conexión...')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test más simple - solo verificar que Supabase responda
    const { data, error } = await supabase.auth.getSession()
    
    if (error && !error.message.includes('session')) {
      throw error
    }
    
    console.log('✅ Conexión exitosa!')
    console.log('\n🎯 Siguiente paso: Ejecutar el SQL para crear tablas')
    console.log('📖 Instrucciones completas en DATABASE_SETUP.md')
    
  } catch (error) {
    console.log('❌ Error de conexión:', error.message)
    console.log('\n🔧 Soluciones:')
    console.log('1. Verifica que las credenciales en .env.local sean correctas')
    console.log('2. Ve a tu Dashboard de Supabase y verifica que el proyecto esté activo')
    console.log('3. Consulta DATABASE_SETUP.md para instrucciones detalladas')
  }
}

testConnection()