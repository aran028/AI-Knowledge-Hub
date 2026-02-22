export interface Tool {
  id: string
  title: string
  summary: string
  category: string
  image: string
  url: string
  tags: string[]
}

export interface Playlist {
  id: string
  name: string
  description?: string
  icon: string
  count: number
}

export const playlists: Playlist[] = [
  { id: "nlp", name: "NLP", description: "Herramientas de procesamiento de lenguaje natural", icon: "brain", count: 12 },
  { id: "computer-vision", name: "Computer Vision", description: "Modelos y APIs para análisis visual", icon: "eye", count: 8 },
  { id: "sewing", name: "Sewing", description: "Herramientas para patrones y diseño textil", icon: "scissors", count: 5 },
  { id: "deep-learning", name: "Deep Learning", description: "Frameworks y herramientas de aprendizaje profundo", icon: "layers", count: 15 },
  { id: "robotics", name: "Robotics", description: "Simuladores y controladores robóticos", icon: "bot", count: 7 },
  { id: "data-science", name: "Data Science", description: "Análisis de datos y herramientas estadísticas", icon: "bar-chart", count: 10 },
  { id: "generative-ai", name: "Generative AI", description: "Modelos generativos para texto, imagen y audio", icon: "sparkles", count: 9 },
  { id: "reinforcement-learning", name: "Reinforcement Learning", description: "Algoritmos y entornos de aprendizaje por refuerzo", icon: "gamepad", count: 6 },
]

export const recentlyAdded: Tool[] = [
  {
    id: "1",
    title: "GPT-4 Turbo",
    summary: "OpenAI's most capable model with 128k context window and improved instruction following.",
    category: "NLP",
    image: "/images/nlp.jpg",
    url: "https://openai.com",
    tags: ["Language Model", "Text Generation"],
  },
  {
    id: "2",
    title: "Stable Diffusion 3",
    summary: "Next-gen image generation with unprecedented quality and prompt adherence.",
    category: "Generative AI",
    image: "/images/generative-ai.jpg",
    url: "https://stability.ai",
    tags: ["Image Generation", "Diffusion"],
  },
  {
    id: "3",
    title: "YOLOv9",
    summary: "Real-time object detection achieving state-of-the-art on MS COCO benchmarks.",
    category: "Computer Vision",
    image: "/images/computer-vision.jpg",
    url: "https://github.com/WongKinYiu/yolov9",
    tags: ["Object Detection", "Real-time"],
  },
  {
    id: "4",
    title: "Claude 3 Opus",
    summary: "Anthropic's frontier model excelling at complex reasoning and nuanced analysis.",
    category: "NLP",
    image: "/images/deep-learning.jpg",
    url: "https://anthropic.com",
    tags: ["Reasoning", "Analysis"],
  },
]

export const popularTools: Tool[] = [
  {
    id: "5",
    title: "Hugging Face Transformers",
    summary: "State-of-the-art ML library for NLP, vision, and audio tasks.",
    category: "Deep Learning",
    image: "/images/deep-learning.jpg",
    url: "https://huggingface.co",
    tags: ["Framework", "Open Source"],
  },
  {
    id: "6",
    title: "LangChain",
    summary: "Build context-aware reasoning applications powered by language models.",
    category: "NLP",
    image: "/images/nlp.jpg",
    url: "https://langchain.com",
    tags: ["Chains", "Agents"],
  },
  {
    id: "7",
    title: "Roboflow",
    summary: "End-to-end computer vision platform for training and deploying models.",
    category: "Computer Vision",
    image: "/images/computer-vision.jpg",
    url: "https://roboflow.com",
    tags: ["Annotation", "Deployment"],
  },
  {
    id: "8",
    title: "Weights & Biases",
    summary: "ML experiment tracking, dataset versioning, and model management platform.",
    category: "Data Science",
    image: "/images/data-science.jpg",
    url: "https://wandb.ai",
    tags: ["Tracking", "MLOps"],
  },
  {
    id: "9",
    title: "Ollama",
    summary: "Run large language models locally with a simple CLI interface.",
    category: "NLP",
    image: "/images/nlp.jpg",
    url: "https://ollama.ai",
    tags: ["Local AI", "CLI"],
  },
  {
    id: "10",
    title: "ROS 2",
    summary: "Open-source robotics middleware for building robot applications.",
    category: "Robotics",
    image: "/images/robotics.jpg",
    url: "https://ros.org",
    tags: ["Middleware", "Robotics"],
  },
]

export const myProjects: Tool[] = [
  {
    id: "11",
    title: "Sentiment Analyzer",
    summary: "Fine-tuned BERT model for multi-language sentiment classification.",
    category: "NLP",
    image: "/images/nlp.jpg",
    url: "#",
    tags: ["BERT", "Sentiment"],
  },
  {
    id: "12",
    title: "Pattern Recognition",
    summary: "CNN-based fabric pattern classifier for sewing project categorization.",
    category: "Sewing",
    image: "/images/sewing.jpg",
    url: "#",
    tags: ["CNN", "Classification"],
  },
  {
    id: "13",
    title: "Pose Estimation Bot",
    summary: "Real-time human pose estimation for ergonomic sewing posture analysis.",
    category: "Robotics",
    image: "/images/robotics.jpg",
    url: "#",
    tags: ["Pose", "Real-time"],
  },
  {
    id: "14",
    title: "DataViz Dashboard",
    summary: "Interactive visualization toolkit for exploring high-dimensional ML datasets.",
    category: "Data Science",
    image: "/images/data-science.jpg",
    url: "#",
    tags: ["Visualization", "Interactive"],
  },
  {
    id: "15",
    title: "Style Transfer Engine",
    summary: "Neural style transfer pipeline for applying artistic styles to fabric designs.",
    category: "Generative AI",
    image: "/images/generative-ai.jpg",
    url: "#",
    tags: ["Style Transfer", "GANs"],
  },
  {
    id: "16",
    title: "RL Game Agent",
    summary: "Deep Q-Network agent trained to play Atari games with human-level performance.",
    category: "Reinforcement Learning",
    image: "/images/reinforcement-learning.jpg",
    url: "#",
    tags: ["DQN", "Gaming"],
  },
]

export const trendingNow: Tool[] = [
  {
    id: "17",
    title: "Gemini Pro",
    summary: "Google's multimodal AI model with native image, video, and text understanding.",
    category: "Deep Learning",
    image: "/images/deep-learning.jpg",
    url: "https://deepmind.google",
    tags: ["Multimodal", "Google"],
  },
  {
    id: "18",
    title: "Mistral Large",
    summary: "European frontier model with multilingual excellence and strong reasoning.",
    category: "NLP",
    image: "/images/nlp.jpg",
    url: "https://mistral.ai",
    tags: ["Multilingual", "Open Weight"],
  },
  {
    id: "19",
    title: "ComfyUI",
    summary: "Node-based visual interface for building complex image generation workflows.",
    category: "Generative AI",
    image: "/images/generative-ai.jpg",
    url: "https://github.com/comfyanonymous/ComfyUI",
    tags: ["Workflow", "Node-based"],
  },
  {
    id: "20",
    title: "OpenCV 5",
    summary: "The definitive open-source computer vision library, now with DNN improvements.",
    category: "Computer Vision",
    image: "/images/computer-vision.jpg",
    url: "https://opencv.org",
    tags: ["Library", "Open Source"],
  },
  {
    id: "21",
    title: "Isaac Sim",
    summary: "NVIDIA's robotics simulation platform for synthetic data and sim-to-real transfer.",
    category: "Robotics",
    image: "/images/robotics.jpg",
    url: "https://developer.nvidia.com/isaac-sim",
    tags: ["Simulation", "NVIDIA"],
  },
  {
    id: "22",
    title: "DVC",
    summary: "Data Version Control for ML projects, integrating Git-based experiment tracking.",
    category: "Data Science",
    image: "/images/data-science.jpg",
    url: "https://dvc.org",
    tags: ["Versioning", "Git"],
  },
]
