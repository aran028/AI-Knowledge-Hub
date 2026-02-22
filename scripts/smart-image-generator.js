/**
 * Sistema inteligente de generación automática de imágenes
 * Este middleware detecta automáticamente imágenes faltantes y las genera
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Cache para evitar regenerar imágenes constantemente
const imageCache = new Set();

// Función optimizada para generar avatares
function generateSmartAvatar(toolName) {
  // Limpiar el nombre para mejor resultado
  const cleanName = toolName.replace(/[^a-zA-Z0-9]/g, '');
  
  // Diferentes estilos dependiendo del tipo de herramienta
  const aiTools = ['gpt', 'claude', 'gemini', 'chatgpt', 'openai', 'ai', 'ml', 'autogen'];
  const devTools = ['git', 'docker', 'jenkins', 'terraform', 'vscode', 'eslint'];
  const designTools = ['figma', 'miro', 'excalidraw', 'balsamiq', 'penpot', 'framer'];
  
  let style = 'identicon'; // Default
  let backgroundColor = '6366f1'; // Default blue
  
  if (aiTools.some(term => toolName.toLowerCase().includes(term))) {
    style = 'bottts';
    backgroundColor = '8b5cf6'; // Purple for AI
  } else if (devTools.some(term => toolName.toLowerCase().includes(term))) {
    style = 'shapes';
    backgroundColor = 'F875AA'; // Pink for dev tools
  } else if (designTools.some(term => toolName.toLowerCase().includes(term))) {
    style = 'beam';
    backgroundColor = 'f59e0b'; // Orange for design
  }
  
  return `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(cleanName)}&backgroundColor=${backgroundColor}&size=400&radius=10`;
}

// Función para generar imagen con fallback robusto
async function generateImageWithFallback(toolName, filepath) {
  const methods = [
    () => generateSmartAvatar(toolName),
    () => `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(toolName)}`,
    () => `https://ui-avatars.com/api/?name=${encodeURIComponent(toolName)}&size=400&background=6366f1&color=fff`,
  ];
  
  for (const method of methods) {
    try {
      const url = method();
      await downloadImage(url, filepath);
      console.log(`✅ Generated with ${method.name}: ${path.basename(filepath)}`);
      return true;
    } catch (error) {
      console.log(`⚠️  Method failed for ${toolName}, trying next...`);
    }
  }
  
  console.log(`❌ All methods failed for ${toolName}`);
  return false;
}

// Función mejorada de descarga con timeout
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const timeout = setTimeout(() => {
      reject(new Error('Download timeout'));
    }, 10000); // 10 second timeout
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        clearTimeout(timeout);
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        clearTimeout(timeout);
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Función para generar imagen bajo demanda
async function generateOnDemand(toolName) {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const filename = `I_H_${toolName}.png`;
  const filepath = path.join(imagesDir, filename);
  
  // Verificar si ya está en cache o existe
  if (imageCache.has(filename) || fs.existsSync(filepath)) {
    return `/images/${filename}`;
  }
  
  // Crear directorio si no existe
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  console.log(`🎨 Generando imagen para: ${toolName}`);
  
  try {
    await generateImageWithFallback(toolName, filepath);
    imageCache.add(filename);
    return `/images/${filename}`;
  } catch (error) {
    console.log(`❌ Error generating ${filename}:`, error.message);
    return null;
  }
}

// Función para pre-generar imágenes comunes
async function preGenerateCommonImages() {
  const commonTools = [
    'React', 'Vue', 'Angular', 'Svelte',
    'Node', 'Deno', 'Bun',
    'MongoDB', 'PostgreSQL', 'Redis',
    'Kubernetes', 'Helm', 'Istio',
    'AWS', 'Azure', 'GCP',
    'Stripe', 'PayPal', 'Shopify',
  ];
  
  console.log('🚀 Pre-generando imágenes comunes...');
  
  for (const tool of commonTools) {
    await generateOnDemand(tool);
    await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
  }
  
  console.log('✅ Pre-generación completada');
}

// Función para limpiar caché y regenerar
function clearImageCache() {
  imageCache.clear();
  console.log('🧹 Cache de imágenes limpiado');
}

module.exports = {
  generateOnDemand,
  preGenerateCommonImages,
  clearImageCache,
  generateImageWithFallback,
  generateSmartAvatar
};