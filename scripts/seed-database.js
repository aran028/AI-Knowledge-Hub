const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Datos iniciales basados en los datos estáticos del proyecto
const initialPlaylists = [
  { name: 'Recently Added', icon: '🆕' },
  { name: 'Popular Tools', icon: '🔥' },
  { name: 'Trending Now', icon: '📈' },
  { name: 'My Projects', icon: '💼' },
  { name: 'AI/ML', icon: '🤖' },
  { name: 'Productivity', icon: '⚡' },
  { name: 'Design', icon: '🎨' },
  { name: 'Development', icon: '💻' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Business', icon: '💼' }
]

const sampleTools = [
  {
    title: 'ChatGPT',
    summary: 'Conversational AI assistant for various tasks',
    image: 'https://via.placeholder.com/300x200/009688/white?text=ChatGPT',
    url: 'https://chat.openai.com',
    tags: ['ai', 'chatbot', 'productivity'],
    playlist_name: 'AI/ML'
  },
  {
    title: 'Midjourney',
    summary: 'AI-powered image generation tool',
    image: 'https://via.placeholder.com/300x200/673AB7/white?text=Midjourney',
    url: 'https://midjourney.com',
    tags: ['ai', 'image-generation', 'design'],
    playlist_name: 'AI/ML'
  },
  {
    title: 'Notion',
    summary: 'All-in-one workspace for notes and productivity',
    image: 'https://via.placeholder.com/300x200/000000/white?text=Notion',
    url: 'https://notion.so',
    tags: ['productivity', 'notes', 'workspace'],
    playlist_name: 'Productivity'
  },
  {
    title: 'Figma',
    summary: 'Collaborative design tool for teams',
    image: 'https://via.placeholder.com/300x200/F24E1E/white?text=Figma',
    url: 'https://figma.com',
    tags: ['design', 'collaboration', 'ui-ux'],
    playlist_name: 'Design'
  },
  {
    title: 'VS Code',
    summary: 'Popular code editor with extensive extensions',
    image: 'https://via.placeholder.com/300x200/007ACC/white?text=VS+Code',
    url: 'https://code.visualstudio.com',
    tags: ['development', 'editor', 'coding'],
    playlist_name: 'Development'
  }
]

async function seedDatabase() {
  console.log('🌱 Poblando base de datos con datos iniciales...\n')

  try {
    // 1. Crear playlists
    console.log('1. Insertando playlists...')
    const { data: playlistsData, error: playlistsError } = await supabase
      .from('playlists')
      .insert(initialPlaylists)
      .select()

    if (playlistsError) {
      throw new Error(`Error insertando playlists: ${playlistsError.message}`)
    }

    console.log(`✅ ${playlistsData.length} playlists insertadas`)

    // 2. Crear herramientas
    console.log('\n2. Insertando herramientas...')
    const playlistMap = new Map()
    playlistsData.forEach(playlist => {
      playlistMap.set(playlist.name, playlist.id)
    })

    const toolsWithIds = sampleTools.map(tool => ({
      title: tool.title,
      summary: tool.summary,
      image: tool.image,
      url: tool.url,
      tags: tool.tags,
      playlist_id: playlistMap.get(tool.playlist_name)
    }))

    const { data: toolsData, error: toolsError } = await supabase
      .from('tools')
      .insert(toolsWithIds)
      .select()

    if (toolsError) {
      throw new Error(`Error insertando herramientas: ${toolsError.message}`)
    }

    console.log(`✅ ${toolsData.length} herramientas insertadas`)

    // 3. Crear contenido de ejemplo de YouTube (opcional)
    console.log('\n3. Insertando contenido de YouTube de ejemplo...')
    const sampleYouTubeContent = [
      {
        video_id: 'sample_chatgpt_tutorial',
        title: 'Guía Completa de ChatGPT para Desarrolladores',
        description: 'Aprende a integrar ChatGPT en tus aplicaciones y flujos de trabajo de desarrollo.',
        channel_name: 'AI Development Tutorial',
        channel_url: 'https://youtube.com/@aidevelopment',
        video_url: 'https://youtube.com/watch?v=sample1',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: 'PT15M30S',
        published_at: new Date().toISOString(),
        view_count: 15420,
        like_count: 892,
        ai_classification: {
          category: 'IA/ML',
          subcategory: 'ChatGPT',
          relevance: 'Alta',
          context: 'Desarrollo'
        },
        confidence_score: 0.95,
        related_tools: ['ChatGPT', 'OpenAI API'],
        playlist_id: playlistMap.get('AI/ML'),
        tags: ['chatgpt', 'openai', 'desarrollo', 'api'],
        ai_summary: 'Tutorial completo sobre integración de ChatGPT',
        ai_key_points: ['Configuración de API', 'Mejores prácticas', 'Casos de uso']
      }
    ]

    const { data: youtubeData, error: youtubeError } = await supabase
      .from('youtube_content')
      .insert(sampleYouTubeContent)
      .select()

    if (youtubeError) {
      console.log(`⚠️  Error insertando contenido de YouTube: ${youtubeError.message}`)
      console.log('Esto es normal si la tabla youtube_content no está creada aún')
    } else {
      console.log(`✅ ${youtubeData.length} videos de YouTube insertados`)
    }

    console.log('\n🎉 Base de datos poblada exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`- Playlists: ${playlistsData.length}`)
    console.log(`- Herramientas: ${toolsData.length}`)
    console.log(`- Videos de YouTube: ${youtubeData?.length || 0}`)

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error.message)
    console.log('\n🔧 Asegúrate de que:')
    console.log('- Las tablas estén creadas en Supabase (ejecuta create-tables.sql)')
    console.log('- Las variables de entorno estén configuradas')
    console.log('- Tu proyecto de Supabase esté activo')
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }