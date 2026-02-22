const fs = require('fs');
const path = require('path');
const https = require('https');

// Función para generar una imagen placeholder personalizada
function generatePlaceholder(text, width = 400, height = 400, bgColor = '6366f1', textColor = 'ffffff') {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
}

// Función para generar avatar usando DiceBear (más visual)
function generateAvatar(seed, style = 'initials') {
  return `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seed)}&backgroundColor=6366f1,8b5cf6,06b6d4,F875AA,f59e0b,ef4444&size=400`;
}

// Lista de herramientas que necesitan imágenes (basado en errores 404 del terminal)
const missingImages = [
  'PlantUML',
  'OpenAPI', 
  'Structurizr',
  'ADR',
  'AWSLambda',
  'Cypress',
  'Playwright',
  'ESLint',
  'RefactoringGuru',
  'GitLabCI',
  'ArgoCD',
  'LangGraph',
  'CrewAI',
  'Autogen',
  'AutoGPT',
  'NotebookLM',
  'Zapier',
  'Penpot',
  'Framer',
  'Whimsical',
  'Miro',
  'Balsamiq',
];

// Función para descargar una imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Generated: ${path.basename(filepath)}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Borrar archivo en caso de error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función principal para generar todas las imágenes faltantes
async function generateMissingImages() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  // Crear directorio si no existe
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log('🎨 Generando imágenes automáticamente...');

  for (const image of missingImages) {
    const filename = `I_H_${image}.png`;
    const filepath = path.join(imagesDir, filename);
    
    // Solo generar si no existe
    if (!fs.existsSync(filepath)) {
      try {
        // Usar DiceBear para generar avatares más atractivos
        const avatarUrl = generateAvatar(image, 'identicon');
        await downloadImage(avatarUrl, filepath);
        
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`❌ Error generating ${filename}:`, error.message);
        
        // Fallback a placeholder simple si falla
        try {
          const placeholderUrl = generatePlaceholder(image);
          await downloadImage(placeholderUrl, filepath);
        } catch (fallbackError) {
          console.log(`❌ Fallback failed for ${filename}:`, fallbackError.message);
        }
      }
    } else {
      console.log(`⏭️  Already exists: ${filename}`);
    }
  }
  
  console.log('✨ ¡Generación de imágenes completada!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateMissingImages().catch(console.error);
}

module.exports = { generateMissingImages, generateAvatar, generatePlaceholder };