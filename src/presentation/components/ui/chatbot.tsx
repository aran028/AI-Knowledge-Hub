"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatBotProps {
  pageContent?: {
    activePlaylist?: string
    playlists: any[]
    tools: any[]
    searchQuery?: string
  }
}

export function ChatBot({ pageContent }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente para esta plataforma de herramientas AI. Puedo ayudarte con información específica sobre las herramientas disponibles, explicarte las categorías como NLP o Computer Vision, guiarte en la búsqueda, o enseñarte a añadir contenido. ¿Qué te gustaría saber?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase()
    const toolCount = pageContent?.tools?.length || 0
    const playlistCount = pageContent?.playlists?.length || 0
    const activePlaylist = pageContent?.activePlaylist ? pageContent.playlists?.find(p => p.id === pageContent.activePlaylist) : null
    
    // Respuestas sobre tecnologías específicas
    if (lowercaseMessage.includes('aws lambda') || lowercaseMessage.includes('lambda')) {
      return '🔧 AWS Lambda es un servicio de computación serverless que ejecuta código sin gestionar servidores. Pagas solo por el tiempo de ejecución. Ideal para APIs, procesamiento de eventos, automatización y microservicios. Soporta múltiples lenguajes como Python, Node.js, Java.'
    }
    
    if (lowercaseMessage.includes('docker')) {
      return '📦 Docker es una plataforma de contenedores que empaqueta aplicaciones con todas sus dependencias. Facilita el desarrollo, distribución y ejecución de software en cualquier entorno. Los contenedores son más ligeros que las máquinas virtuales.'
    }
    
    if (lowercaseMessage.includes('kubernetes') || lowercaseMessage.includes('k8s')) {
      return '⚙️ Kubernetes (K8s) es un sistema de orquestación de contenedores que automatiza el despliegue, escalado y gestión de aplicaciones containerizadas. Maneja múltiples contenedores Docker en clusters de servidores.'
    }
    
    if (lowercaseMessage.includes('tensorflow')) {
      return '🧠 TensorFlow es una biblioteca de machine learning de Google para crear y entrenar modelos de IA. Ideal para deep learning, redes neuronales, procesamiento de imágenes y NLP. Compatible con Python, JavaScript y móviles.'
    }
    
    if (lowercaseMessage.includes('pytorch')) {
      return '🔥 PyTorch es un framework de deep learning de Facebook/Meta muy popular en investigación. Ofrece computación dinámica, fácil debugging y excelente para prototipado rápido de modelos de IA.'
    }
    
    if (lowercaseMessage.includes('react') && !lowercaseMessage.includes('native')) {
      return '⚛️ React es una biblioteca JavaScript para crear interfaces de usuario interactivas. Desarrollada por Facebook, usa componentes reutilizables y virtual DOM para apps web rápidas y escalables.'
    }
    
    if (lowercaseMessage.includes('next.js') || lowercaseMessage.includes('nextjs')) {
      return '🚀 Next.js es un framework React que añade funcionalidades como servidor de renderizado, generación estática, API routes y optimizaciones automáticas. Ideal para apps web modernas y SEO.'
    }
    
    if (lowercaseMessage.includes('mongodb') || lowercaseMessage.includes('mongo')) {
      return '🍃 MongoDB es una base de datos NoSQL que almacena datos en documentos JSON flexibles en lugar de tablas. Ideal para apps modernas con datos semi-estructurados y escalabilidad horizontal.'
    }
    
    if (lowercaseMessage.includes('postgresql') || lowercaseMessage.includes('postgres')) {
      return '🐘 PostgreSQL es una base de datos relacional avanzada y open source. Soporta SQL completo, JSON, funciones personalizadas y extensiones. Muy confiable para aplicaciones empresariales.'
    }
    
    if (lowercaseMessage.includes('api rest') || lowercaseMessage.includes('rest api') || (lowercaseMessage.includes('api') && lowercaseMessage.includes('rest'))) {
      return '🌐 REST API es un estilo arquitectónico para servicios web que usa HTTP para comunicación. Utiliza métodos como GET, POST, PUT, DELETE para operaciones CRUD. Simple, escalable y ampliamente adoptado.'
    }
    
    if (lowercaseMessage.includes('graphql')) {
      return '📊 GraphQL es un lenguaje de consulta para APIs desarrollado por Facebook. Permite solicitar exactamente los datos necesarios, reduce over-fetching y ofrece un único endpoint para múltiples recursos.'
    }
    
    if (lowercaseMessage.includes('git') && !lowercaseMessage.includes('github') && !lowercaseMessage.includes('gitlab')) {
      return '📋 Git es un sistema de control de versiones distribuido para rastrear cambios en código. Permite colaboración, branching, merging y historial completo. Fundamental para desarrollo moderno.'
    }
    
    if (lowercaseMessage.includes('microservicios') || lowercaseMessage.includes('microservices')) {
      return '🔧 Microservicios es una arquitectura que divide aplicaciones en servicios pequeños e independientes. Cada servicio maneja una función específica, facilitando escalabilidad, desarrollo y mantenimiento.'
    }
    
    if (lowercaseMessage.includes('node.js') || lowercaseMessage.includes('nodejs')) {
      return '🟢 Node.js es un entorno de ejecución JavaScript del lado del servidor. Permite crear apps web, APIs y herramientas usando JavaScript. Muy popular para aplicaciones en tiempo real y APIs REST.'
    }
    
    if (lowercaseMessage.includes('python')) {
      return '🐍 Python es un lenguaje de programación versátil y fácil de aprender. Muy popular en ciencia de datos, IA, desarrollo web, automatización y scripting. Tiene una sintaxis clara y miles de librerías.'
    }
    
    if (lowercaseMessage.includes('machine learning') || lowercaseMessage.includes('ml')) {
      return '🤖 Machine Learning es una rama de la IA que permite a los sistemas aprender patrones de datos sin programación explícita. Incluye algoritmos supervisados, no supervisados y de refuerzo para predicciones y clasificaciones.'
    }
    
    if (lowercaseMessage.includes('devops')) {
      return '⚙️ DevOps combina desarrollo (Dev) y operaciones (Ops) para automatizar y acelerar el ciclo de vida del software. Incluye CI/CD, infraestructura como código, monitoreo y colaboración entre equipos.'
    }
    
    if (lowercaseMessage.includes('firebase')) {
      return '🔥 Firebase es una plataforma de Google para desarrollo de apps móviles y web. Ofrece base de datos en tiempo real, autenticación, hosting, analytics y notificaciones push sin gestionar servidores.'
    }
    
    if (lowercaseMessage.includes('supabase')) {
      return '⚡ Supabase es una alternativa open source a Firebase. Ofrece base de datos PostgreSQL, autenticación, APIs automáticas, storage y funciones edge. Ideal para apps modernas con SQL.'
    }
    
    if (lowercaseMessage.includes('tailwind') || lowercaseMessage.includes('css')) {
      return '🎨 Tailwind CSS es un framework de CSS utility-first que permite crear diseños personalizados directamente en HTML. Más flexible que Bootstrap, optimiza automáticamente y es muy popular.'
    }
    
    if (lowercaseMessage.includes('typescript') || lowercaseMessage.includes('ts')) {
      return '📝 TypeScript es JavaScript con tipado estático desarrollado por Microsoft. Detecta errores en tiempo de compilación, mejora la experiencia de desarrollo y facilita el mantenimiento de código complejo.'
    }
    
    if (lowercaseMessage.includes('serverless')) {
      return '☁️ Serverless es un modelo de computación donde no gestionas servidores. Los proveedores cloud ejecutan el código automáticamente. Incluye funciones como AWS Lambda, Vercel Functions, Netlify Functions.'
    }
    
    // Comparaciones y precios
    if (lowercaseMessage.includes('comparar') || lowercaseMessage.includes('mejor') || lowercaseMessage.includes('diferencia')) {
      return '📊 Para comparaciones específicas, necesito saber qué tecnologías quieres comparar. Por ejemplo: "diferencia entre React y Vue", "MongoDB vs PostgreSQL", "AWS vs Google Cloud". ¿Qué tecnologías específicas te interesan?'
    }
    
    if (lowercaseMessage.includes('precio') || lowercaseMessage.includes('cost') || lowercaseMessage.includes('gratis')) {
      return '💰 Los precios varían según el servicio. Muchas tecnologías son gratuitas (React, Python, PostgreSQL), mientras que servicios cloud cobran por uso (AWS, GCP, Azure). ¿Sobre qué tecnología específica quieres saber precios?'
    }
    
    // Metodologías y conceptos de desarrollo
    if (lowercaseMessage.includes('agile') || lowercaseMessage.includes('scrum') || lowercaseMessage.includes('kanban')) {
      return '🔄 Agile es una metodología de desarrollo iterativa. Scrum usa sprints de 1-4 semanas con roles definidos (Scrum Master, Product Owner). Kanban visualiza el flujo de trabajo en tableros. Ambos priorizan la colaboración y adaptación.'
    }
    
    if (lowercaseMessage.includes('ci/cd') || lowercaseMessage.includes('pipeline') || lowercaseMessage.includes('deployment')) {
      return '🚀 CI/CD (Continuous Integration/Deployment) automatiza testing y desplegue de código. CI ejecuta tests automáticamente al hacer commits. CD despliega automáticamente a producción. Herramientas: GitHub Actions, GitLab CI, Jenkins.'
    }
    
    // Preguntas sobre URLs, enlaces, descargas - DEBE IR ANTES que las definiciones específicas
    if (lowercaseMessage.includes('url') || lowercaseMessage.includes('web') || lowercaseMessage.includes('página') || 
        lowercaseMessage.includes('enlace') || lowercaseMessage.includes('link') || lowercaseMessage.includes('descargar') ||
        lowercaseMessage.includes('download') || lowercaseMessage.includes('sitio') || lowercaseMessage.includes('website') ||
        lowercaseMessage.includes('donde puedo') || lowercaseMessage.includes('dónde puedo') || lowercaseMessage.includes('me puedes pasar')) {
      
      // Enlaces directos a sitios oficiales
      if (lowercaseMessage.includes('visual studio code') || lowercaseMessage.includes('vscode')) {
        return `🔗 **Visual Studio Code - Enlaces Oficiales:**

📥 **Descarga:** https://code.visualstudio.com/
📚 **Documentación:** https://code.visualstudio.com/docs
🔧 **Extensiones:** https://marketplace.visualstudio.com/

💡 **Características principales:**
• Editor gratuito y open source
• Soporte para cientos de lenguajes
• Terminal integrado y control de Git
• Debugging avanzado y IntelliSense`
      }
      
      if (lowercaseMessage.includes('docker')) {
        return `🐳 **Docker - Enlaces Oficiales:**

📥 **Descarga:** https://www.docker.com/products/docker-desktop
📚 **Documentación:** https://docs.docker.com/
🎓 **Tutoriales:** https://www.docker.com/get-started

⚡ **Para comenzar:**
• Docker Desktop (Windows/Mac)
• Docker Engine (Linux)
• Docker Hub para imágenes públicas`
      }
      
      if (lowercaseMessage.includes('kubernetes') || lowercaseMessage.includes('k8s')) {
        return `⚙️ **Kubernetes - Enlaces Oficiales:**

📥 **Instalación:** https://kubernetes.io/docs/setup/
📚 **Documentación:** https://kubernetes.io/docs/
🎓 **Tutoriales:** https://kubernetes.io/docs/tutorials/

🚀 **Herramientas recomendadas:**
• kubectl (CLI oficial)
• Minikube (desarrollo local)
• Kind (Kubernetes in Docker)`
      }
      
      if (lowercaseMessage.includes('nodejs') || lowercaseMessage.includes('node.js') || lowercaseMessage.includes('node')) {
        return `💚 **Node.js - Enlaces Oficiales:**

📥 **Descarga:** https://nodejs.org/
📚 **Documentación:** https://nodejs.org/docs/
📦 **NPM Registry:** https://www.npmjs.com/

✅ **Versiones recomendadas:**
• LTS (Long Term Support) para producción
• Current para últimas características`
      }
      
      if (lowercaseMessage.includes('react')) {
        return `⚛️ **React - Enlaces Oficiales:**

📚 **Documentación:** https://react.dev/
🎓 **Tutorial:** https://react.dev/learn
🔧 **Create React App:** https://create-react-app.dev/

🚀 **Para empezar:**
• npx create-react-app mi-app
• Vite React (más rápido): npm create vite@latest
• Next.js para apps full-stack`
      }
      
      if (lowercaseMessage.includes('python')) {
        return `🐍 **Python - Enlaces Oficiales:**

📥 **Descarga:** https://www.python.org/downloads/
📚 **Documentación:** https://docs.python.org/
📦 **PyPI (Packages):** https://pypi.org/

🎓 **Recursos de aprendizaje:**
• Tutorial oficial de Python
• Real Python para cursos avanzados
• Python Package Index para librerías`
      }
      
      if (lowercaseMessage.includes('git')) {
        return `📝 **Git - Enlaces Oficiales:**

📥 **Descarga:** https://git-scm.com/downloads
📚 **Documentación:** https://git-scm.com/docs
🎓 **Tutorial:** https://learngitbranching.js.org/

🔧 **Interfaces gráficas populares:**
• GitHub Desktop
• GitKraken
• SourceTree`
      }
      
      if (lowercaseMessage.includes('mongodb')) {
        return `🍃 **MongoDB - Enlaces Oficiales:**

📥 **Community:** https://www.mongodb.com/try/download/community
☁️ **Atlas (Cloud):** https://www.mongodb.com/atlas
📚 **Documentación:** https://docs.mongodb.com/

🎓 **Recursos:**
• MongoDB University (cursos gratuitos)
• Compass (GUI oficial)
• Studio 3T (herramienta popular)`
      }
      
      if (lowercaseMessage.includes('postgresql') || lowercaseMessage.includes('postgres')) {
        return `🐘 **PostgreSQL - Enlaces Oficiales:**

📥 **Descarga:** https://www.postgresql.org/download/
📚 **Documentación:** https://www.postgresql.org/docs/
🔧 **pgAdmin:** https://www.pgadmin.org/

☁️ **Opciones cloud:**
• AWS RDS PostgreSQL
• Google Cloud SQL
• Supabase (con APIs automáticas)`
      }
      
      // Si no es una tecnología específica conocida
      return `🔗 **Enlaces útiles por categoría:**

**🛠️ Desarrollo:**
• Visual Studio Code: https://code.visualstudio.com/
• Git: https://git-scm.com/
• Node.js: https://nodejs.org/

**☁️ Cloud & DevOps:**
• Docker: https://www.docker.com/
• Kubernetes: https://kubernetes.io/
• AWS: https://aws.amazon.com/

**🗄️ Bases de Datos:**
• PostgreSQL: https://www.postgresql.org/
• MongoDB: https://www.mongodb.com/

¿Sobre qué tecnología específica necesitas el enlace?`
    }
    
    // Definiciones de tecnologías específicas (solo cuando NO se pregunta por URLs)
    if (lowercaseMessage.includes('adr') || lowercaseMessage.includes('architecture decision')) {
      return '📋 ADR (Architecture Decision Records) documenta decisiones arquitectónicas importantes en proyectos. Registra el contexto, opciones consideradas, decisión tomada y consecuencias. Herramientas como ADR Tools ayudan a crear y gestionar estos records.'
    }
    
    if (lowercaseMessage.includes('vim') || lowercaseMessage.includes('neovim')) {
      return '⌨️ Vim es un editor de texto modal altamente configurable y eficiente. Neovim es una versión moderna de Vim. Ambos son populares entre desarrolladores por su velocidad y capacidad de personalización una vez que aprendes sus comandos.'
    }
    
    if (lowercaseMessage.includes('vscode') || lowercaseMessage.includes('visual studio code')) {
      return '📝 Visual Studio Code es un editor de código gratuito de Microsoft. Muy popular por sus extensiones, debugging integrado, Git integration, terminal incorporado y soporte para múltiples lenguajes.'
    }
    
    if (lowercaseMessage.includes('jwt') || lowercaseMessage.includes('json web token')) {
      return '🔐 JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre partes. Se usa mucho para autenticación en APIs. Consta de header, payload y signature codificados en base64.'
    }
    
    if (lowercaseMessage.includes('oauth') || lowercaseMessage.includes('oauth2')) {
      return '🔑 OAuth 2.0 es un protocolo de autorización que permite a aplicaciones acceder a recursos de usuario sin exponer contraseñas. Permite login con Google, GitHub, Facebook, etc. Usa tokens de acceso temporales.'
    }
    
    if (lowercaseMessage.includes('websocket') || lowercaseMessage.includes('ws')) {
      return '🔄 WebSocket es un protocolo de comunicación bidireccional en tiempo real entre cliente y servidor. Ideal para chat en vivo, notificaciones push, juegos online y aplicaciones colaborativas. Mantiene conexión persistente.'
    }
    
    if (lowercaseMessage.includes('grpc') || lowercaseMessage.includes('protocol buffer')) {
      return '⚡ gRPC es un framework RPC moderno y de alto rendimiento desarrollado por Google. Usa Protocol Buffers para serialización. Más rápido que REST, soporta streaming y es ideal para microservicios.'
    }
    
    if (lowercaseMessage.includes('redis') || lowercaseMessage.includes('cache')) {
      return '🔴 Redis es una base de datos en memoria muy rápida usada como cache, broker de mensajes y almacén de sesiones. Soporta estructuras como strings, hashes, listas, sets. Excelente para performance.'
    }
    
    if (lowercaseMessage.includes('nginx') || lowercaseMessage.includes('apache')) {
      return '🌐 Nginx es un servidor web y proxy reverso de alto rendimiento. Apache HTTP Server es más tradicional. Nginx es mejor para sitios de alto tráfico y load balancing. Apache tiene más módulos disponibles.'
    }
    

    
    // Búsqueda inteligente en herramientas de la plataforma
    const searchInTools = (query: string) => {
      if (!pageContent?.tools) return null
      const foundTool = pageContent.tools.find(tool => 
        tool.title.toLowerCase().includes(query.toLowerCase()) || 
        tool.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        tool.summary.toLowerCase().includes(query.toLowerCase())
      )
      return foundTool
    }
    
    // Preguntas sobre qué es algo (definiciones) - versión mejorada
    if (lowercaseMessage.includes('qué es') || lowercaseMessage.includes('que es') || lowercaseMessage.includes('what is')) {
      // Extraer el término que están preguntando
      const questionPatterns = [
        /(?:qué es|que es|what is)\s+(.+?)(?:\?|$)/i,
        /(?:qué es|que es|what is)\s+(.+)/i
      ]
      
      let extractedTerm = ''
      for (const pattern of questionPatterns) {
        const match = userMessage.match(pattern)
        if (match && match[1]) {
          extractedTerm = match[1].trim().toLowerCase()
          break
        }
      }
      
      if (extractedTerm) {
        // Buscar en las herramientas de la plataforma
        const foundTool = searchInTools(extractedTerm)
        if (foundTool) {
          return `🔍 Encontré "${foundTool.title}" en la plataforma: ${foundTool.summary}. Puedes acceder haciendo clic en su tarjeta para más información.`
        }
        
        // Si no está en las herramientas, dar respuesta específica
        return `🤔 No tengo información específica sobre "${extractedTerm}" en mi base de conocimientos. 

Te puedo ayudar con tecnologías como:
💻 **Desarrollo**: React, Next.js, TypeScript, Node.js, Python
☁️ **Cloud**: AWS Lambda, Docker, Kubernetes, Firebase, Supabase  
🗄️ **Bases de Datos**: PostgreSQL, MongoDB, Redis
🔧 **Herramientas**: Git, CI/CD, JWT, OAuth, WebSocket
📋 **Metodologías**: Agile, Scrum, DevOps, ADR

¿Hay alguna de estas tecnologías que te interese conocer?`
      }
      
      return 'Para obtener información específica, pregunta "¿Qué es [tecnología]?" Por ejemplo: "¿Qué es Docker?" o "¿Qué es React?"'
    }
    
    // Saludos y presentación
    if (lowercaseMessage.includes('hola') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hello')) {
      return `¡Hola! 👋 Estoy aquí para ayudarte a navegar por esta plataforma de herramientas AI. ${activePlaylist ? `Veo que estás en "${activePlaylist.name}" con ${toolCount} herramientas.` : `Tenemos ${playlistCount} categorías y ${toolCount} herramientas disponibles.`} ¿Qué te gustaría saber?`
    }

    // Preguntas sobre herramientas específicas
    if (lowercaseMessage.includes('gpt') || lowercaseMessage.includes('openai')) {
      const gptTool = pageContent?.tools?.find(t => t.title.toLowerCase().includes('gpt'))
      return gptTool ? `Tenemos "${gptTool.title}": ${gptTool.summary}. Puedes acceder haciendo clic en su tarjeta.` : 'No veo herramientas de GPT en la vista actual. Prueba buscando "GPT" en el buscador lateral.'
    }
    
    if (lowercaseMessage.includes('stable diffusion') || lowercaseMessage.includes('imagen') || lowercaseMessage.includes('generación')) {
      const imgTools = pageContent?.tools?.filter(t => t.title.toLowerCase().includes('stable') || t.tags?.some(tag => tag.toLowerCase().includes('image'))) || []
      return imgTools.length > 0 ? `Encontré ${imgTools.length} herramientas de generación de imágenes: ${imgTools.map(t => t.title).join(', ')}. ¡Son perfectas para crear contenido visual!` : 'Para herramientas de generación de imágenes, busca en la categoría "Generative AI" o usa el buscador con "imagen".'
    }

    // Información específica sobre categorías
    if (lowercaseMessage.includes('nlp') || lowercaseMessage.includes('lenguaje') || lowercaseMessage.includes('texto')) {
      return 'NLP (Natural Language Processing) incluye herramientas para análisis de texto, chatbots, traducción automática, y modelos de lenguaje como GPT. Estas herramientas procesan y generan texto humano.'
    }

    if (lowercaseMessage.includes('computer vision') || lowercaseMessage.includes('visión') || lowercaseMessage.includes('reconocimiento')) {
      return 'Computer Vision agrupa herramientas para análisis de imágenes y video: detección de objetos, reconocimiento facial, clasificación de imágenes, y modelos como YOLO para detección en tiempo real.'
    }

    if (lowercaseMessage.includes('deep learning') || lowercaseMessage.includes('neural') || lowercaseMessage.includes('redes')) {
      return 'Deep Learning incluye frameworks como TensorFlow, PyTorch, Keras, y herramientas para entrenar redes neuronales profundas. Ideal para problemas complejos de IA.'
    }

    // Respuestas sobre playlists con ejemplos concretos
    if (lowercaseMessage.includes('playlist') || lowercaseMessage.includes('categoría') || lowercaseMessage.includes('categorias')) {
      const examplePlaylists = pageContent?.playlists?.slice(0, 3).map(p => `"${p.name}" (${p.count} herramientas)${p.description ? ': ' + p.description : ''}`).join(', ') || ''
      return `Tenemos ${playlistCount} categorías especializadas. Por ejemplo: ${examplePlaylists}. Haz clic en cualquiera en la barra lateral para explorar sus herramientas.`
    }
    
    // Respuestas sobre herramientas con ejemplos
    if (lowercaseMessage.includes('herramienta') || lowercaseMessage.includes('tool') || lowercaseMessage.includes('herramientas')) {
      if (activePlaylist && toolCount > 0) {
        const exampleTools = pageContent?.tools?.slice(0, 3).map(t => `"${t.title}"`).join(', ') || ''
        return `En "${activePlaylist.name}" hay ${toolCount} herramientas como: ${exampleTools}. Cada una tiene su própósito específico en ${activePlaylist.description?.toLowerCase() || 'esta área'}.`
      }
      
      return `Hay ${toolCount} herramientas organizadas en ${playlistCount} categorías. Desde generadores de texto hasta analizadores de imágenes. ¿Buscas algo específico como "generación de código", "análisis de datos" o "creación de imágenes"?`
    }
    
    // Búsqueda específica y ejemplos
    if (lowercaseMessage.includes('buscar') || lowercaseMessage.includes('encontrar') || lowercaseMessage.includes('busco')) {
      return 'El buscador lateral filtra herramientas y categorías en tiempo real. Prueba términos como: "texto" para herramientas de NLP, "imagen" para Computer Vision, "código" para herramientas de desarrollo, o "análisis" para Data Science.'
    }

    // Instrucciones específicas
    if (lowercaseMessage.includes('añadir') || lowercaseMessage.includes('crear') || lowercaseMessage.includes('nuevo')) {
      return '➕ Para añadir herramientas: usa el botón "+" en la barra superior → completa título, URL, descripción y tags. Para nuevas categorías: "+" junto a "Your Library" → elige nombre, descripción e icono. ¡Todo se guarda automáticamente!'
    }

    // Navegación específica
    if (lowercaseMessage.includes('cómo') || lowercaseMessage.includes('como') || lowercaseMessage.includes('navegar')) {
      return `🧭 Navegación: 1) Barra lateral → cambiar entre ${playlistCount} categorías 2) Buscador → filtrar por palabras clave 3) Clic en herramientas → abrir en nueva pestaña 4) Menú ⚙️ → editar/eliminar contenido. ${activePlaylist ? `Ahora estás en "${activePlaylist.name}".` : ''}`
    }

    // Información contextual sobre la página actual
    if (lowercaseMessage.includes('esta pagina') || lowercaseMessage.includes('aqui') || lowercaseMessage.includes('página') || lowercaseMessage.includes('donde estoy')) {
      if (activePlaylist) {
        return `📍 Estás en la categoría "${activePlaylist.name}" con ${toolCount} herramientas especializadas en ${activePlaylist.description?.toLowerCase() || 'este tema'}. Puedes explorar las herramientas, añadir nuevas, o cambiar a otra categoría desde la barra lateral.`
      }
      return `🏠 Estás en la página principal con acceso completo a ${playlistCount} categorías y ${toolCount} herramientas. Aquí ves las herramientas más populares y recientes de todas las categorías.`
    }

    // Respuestas específicas por contexto
    if (pageContent?.searchQuery) {
      return `🔍 Veo que buscaste "${pageContent.searchQuery}". Los resultados destacados muestran herramientas y categorías que coinciden. Si no encuentras lo que buscas, prueba sinónimos o términos más generales.`
    }

    // Respuesta por defecto inteligente
    return `🤔 No tengo información específica sobre eso. Te puedo ayudar con:
📋 Información sobre esta plataforma: "¿qué herramientas hay aquí?", "explícame las categorías"
🔍 Búsqueda y navegación: "¿cómo busco algo?", "¿cómo añado herramientas?"
💻 Conceptos técnicos: "¿qué es Docker?", "¿qué es AWS Lambda?", "¿qué es React?"
🏠 Ubicación actual: "¿dónde estoy?", "¿qué puedo hacer aquí?"

¿Sobre qué específico te gustaría saber?`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simular tiempo de respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        sender: "bot",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2 segundos
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 sm:bottom-6 sm:right-6"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Abrir chat asistente</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] shadow-xl z-50 flex flex-col h-[min(32rem,calc(100vh-2rem))] sm:bottom-6 sm:right-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Asistente AI</h3>
            <p className="text-xs text-muted-foreground">Siempre disponible</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[85%] space-x-2 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                  }`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    message.sender === "user" 
                      ? "bg-primary" 
                      : "bg-secondary"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="h-3 w-3 text-primary-foreground" />
                    ) : (
                      <Bot className="h-3 w-3 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 text-xs leading-relaxed break-words whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Bot className="h-3 w-3 text-secondary-foreground" />
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t bg-card">
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Pregúntame algo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-xs"
          />
          <Button 
            onClick={handleSendMessage}
            size="icon" 
            className="h-9 w-9 shrink-0"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}