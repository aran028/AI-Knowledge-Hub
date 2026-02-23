#!/usr/bin/env node

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAIClassification() {
  console.log('🔍 Fixing AI tool classification...\n');

  try {
    // 1. Ver todas las playlists disponibles
    const { data: allPlaylists, error: allPlaylistsError } = await supabase
      .from('playlists')
      .select('id, name')
      .order('name');

    if (allPlaylistsError) {
      console.log('❌ Error obteniendo playlists:', allPlaylistsError.message);
      return;
    }

    console.log('📋 Playlists disponibles:');
    allPlaylists.forEach(p => {
      console.log(`   • ${p.name} (${p.id})`);
    });

    // 2. Buscar playlist que contenga "AI" o similar
    const aiPlaylist = allPlaylists.find(p => 
      p.name.toLowerCase().includes('generative') || 
      p.name.toLowerCase().includes('ai') || 
      p.name === 'Motores y modelos de IA'
    );

    if (!aiPlaylist) {
      console.log('\n❌ No se encontró playlist de IA/Generative AI');
      return;
    }

    console.log(`\n✅ Playlist AI encontrada: "${aiPlaylist.name}" (${aiPlaylist.id})`);

    // 3. Buscar herramientas que usan la imagen generative-ai.jpg
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, title, image, playlist_id')
      .like('image', '%generative-ai.jpg%');

    if (toolsError) {
      console.log('❌ Error buscando herramientas:', toolsError.message);
      return;
    }

    console.log(`\n📊 Herramientas con imagen generative-ai.jpg: ${tools.length}`);

    // 4. Corregir herramientas mal clasificadas
    const toFix = tools.filter(tool => tool.playlist_id !== aiPlaylist.id);
    
    if (toFix.length === 0) {
      console.log('✅ Todas las herramientas ya están correctamente clasificadas');
      return;
    }

    console.log(`\n🔧 Herramientas a corregir: ${toFix.length}`);

    for (const tool of toFix) {
      console.log(`   📝 "${tool.title}" - Moviendo a ${aiPlaylist.name}...`);
      
      const { error: updateError } = await supabase
        .from('tools')
        .update({ playlist_id: aiPlaylist.id })
        .eq('id', tool.id);

      if (updateError) {
        console.log(`   ❌ Error actualizando "${tool.title}":`, updateError.message);
      } else {
        console.log(`   ✅ "${tool.title}" corregido`);
      }
    }

    // 5. Verificación final
    console.log('\n🔍 Verificación final...');
    const { data: finalTools, error: finalError } = await supabase
      .from('tools')
      .select('title')
      .eq('playlist_id', aiPlaylist.id)
      .like('image', '%generative-ai.jpg%');

    if (!finalError) {
      console.log(`✅ Herramientas en "${aiPlaylist.name}" con imagen AI: ${finalTools.length}`);
      finalTools.forEach(tool => {
        console.log(`   • ${tool.title}`);
      });
    }

    console.log('\n🎉 Clasificación corregida exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixAIClassification();
}

module.exports = { fixAIClassification };