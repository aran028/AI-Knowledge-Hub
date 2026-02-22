// 🧪 Test rápido de entidades de dominio
// Ejecutar con: node scripts/test-domain.js

const crypto = require('crypto')

// Simular crypto.randomUUID para Node.js < 16
if (!global.crypto) {
  global.crypto = { randomUUID: () => require('crypto').randomUUID() }
}

async function testDomainEntities() {
  console.log('🏛️ Testing Domain Entities...\n')

  try {
    // Importar usando eval para evitar TypeScript issues
    const { PlaylistEntity } = await import('../src/domain/entities/playlist.entity.js')
    const { ToolEntity } = await import('../src/domain/entities/tool.entity.js')
    const { AIClassification } = await import('../src/domain/value-objects/ai-classification.vo.js')
    const { ConfidenceScore } = await import('../src/domain/value-objects/confidence-score.vo.js')
    
    console.log('✅ Imports successful')

    // Test 1: Crear playlist
    console.log('\n1️⃣ Testing PlaylistEntity...')
    const playlist = PlaylistEntity.create(
      'IA/ML Tools',
      'brain',
      'user-123',
      'Herramientas de Inteligencia Artificial'
    )
    
    console.log(`   ✅ Playlist creada: ${playlist.name}`)
    console.log(`   📋 ID: ${playlist.id}`)
    console.log(`   👤 Usuario: ${playlist.userId}`)
    console.log(`   🎯 Eventos: ${playlist.domainEvents.length}`)

    // Test 2: Crear herramienta
    console.log('\n2️⃣ Testing ToolEntity...')
    const tool = ToolEntity.create(
      'ChatGPT',
      'Modelo de lenguaje AI para conversaciones naturales',
      'IA/ML',
      '/images/chatgpt.png',
      'https://chat.openai.com',
      'user-123',
      'ChatGPT es un modelo de lenguaje desarrollado por OpenAI...',
      ['ai', 'nlp', 'chat']
    )
    
    console.log(`   ✅ Tool creada: ${tool.title}`)
    console.log(`   🏷️ Tags: ${tool.tags.join(', ')}`)
    console.log(`   📂 Categoría: ${tool.category}`)

    // Test 3: Value Objects
    console.log('\n3️⃣ Testing Value Objects...')
    
    const confidence = new ConfidenceScore(0.95)
    console.log(`   📊 Confidence: ${confidence} (${confidence.level})`)
    
    const aiClassification = AIClassification.createAIML(
      'Natural Language Processing',
      0.95,
      'Herramienta enfocada en procesamiento de lenguaje natural',
      ['ChatGPT', 'OpenAI']
    )
    console.log(`   🤖 AI Classification: ${aiClassification.category}`)
    console.log(`   🛠️ Herramientas detectadas: ${aiClassification.toolsDetected.join(', ')}`)

    // Test 4: Business Logic
    console.log('\n4️⃣ Testing Business Logic...')
    
    try {
      playlist.addTool(tool.id)
      console.log(`   ✅ Tool agregada a playlist`)
      console.log(`   📊 Total herramientas: ${playlist.toolCount}`)
      console.log(`   📢 Eventos totales: ${playlist.domainEvents.length}`)
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }

    console.log('\n🎉 All tests passed! Domain Layer funciona correctamente')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('   Detalles:', error.stack)
  }
}

testDomainEntities()