-- Crear tabla de playlists/categorías
CREATE TABLE public.playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name, user_id)
);

-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de herramientas
CREATE TABLE public.tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    playlist_id UUID NOT NULL,
    image TEXT NOT NULL,
    url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_tools_playlist FOREIGN KEY (playlist_id) REFERENCES public.playlists(id) ON DELETE CASCADE
);

-- Añadir índices para mejorar el rendimiento
CREATE INDEX idx_tools_playlist_id ON public.tools(playlist_id);
CREATE INDEX idx_tools_user_id ON public.tools(user_id);
CREATE INDEX idx_tools_created_at ON public.tools(created_at DESC);
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlists_name ON public.playlists(name);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas para playlists (solo acceso a las propias)
CREATE POLICY "Users can view own playlists" ON public.playlists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playlists" ON public.playlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists" ON public.playlists
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists" ON public.playlists
    FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas para tools (solo acceso a las propias)
CREATE POLICY "Users can view own tools" ON public.tools
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tools" ON public.tools
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tools" ON public.tools
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tools" ON public.tools
    FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para configurar datos iniciales para nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    playlist_nlp_id UUID;
    playlist_cv_id UUID;
    playlist_sewing_id UUID;
    playlist_dl_id UUID;
    playlist_robotics_id UUID;
    playlist_ds_id UUID;
    playlist_genai_id UUID;
    playlist_rl_id UUID;
BEGIN
    -- Crear perfil del usuario
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );

    -- Crear playlists iniciales para el usuario
    INSERT INTO public.playlists (id, name, icon, user_id) VALUES
        (gen_random_uuid(), 'NLP', 'brain', NEW.id),
        (gen_random_uuid(), 'Computer Vision', 'eye', NEW.id),
        (gen_random_uuid(), 'Sewing', 'scissors', NEW.id),
        (gen_random_uuid(), 'Deep Learning', 'layers', NEW.id),
        (gen_random_uuid(), 'Robotics', 'bot', NEW.id),
        (gen_random_uuid(), 'Data Science', 'bar-chart', NEW.id),
        (gen_random_uuid(), 'Generative AI', 'sparkles', NEW.id),
        (gen_random_uuid(), 'Reinforcement Learning', 'gamepad', NEW.id);

    -- Obtener los IDs de las playlists creadas
    SELECT id INTO playlist_nlp_id FROM public.playlists WHERE name = 'NLP' AND user_id = NEW.id;
    SELECT id INTO playlist_cv_id FROM public.playlists WHERE name = 'Computer Vision' AND user_id = NEW.id;
    SELECT id INTO playlist_dl_id FROM public.playlists WHERE name = 'Deep Learning' AND user_id = NEW.id;
    SELECT id INTO playlist_genai_id FROM public.playlists WHERE name = 'Generative AI' AND user_id = NEW.id;

    -- Insertar algunas herramientas de ejemplo
    INSERT INTO public.tools (title, summary, playlist_id, image, url, tags, user_id) VALUES
        ('GPT-4 Turbo', 'OpenAI''s most capable model with 128k context window and improved instruction following.', playlist_nlp_id, '/images/nlp.jpg', 'https://openai.com', ARRAY['Language Model', 'Text Generation'], NEW.id),
        ('Claude 3 Opus', 'Anthropic''s frontier model excelling at complex reasoning and nuanced analysis.', playlist_nlp_id, '/images/deep-learning.jpg', 'https://anthropic.com', ARRAY['Reasoning', 'Analysis'], NEW.id),
        ('Stable Diffusion 3', 'Next-gen image generation with unprecedented quality and prompt adherence.', playlist_genai_id, '/images/generative-ai.jpg', 'https://stability.ai', ARRAY['Image Generation', 'Diffusion'], NEW.id),
        ('YOLOv9', 'Real-time object detection achieving state-of-the-art on MS COCO benchmarks.', playlist_cv_id, '/images/computer-vision.jpg', 'https://github.com/WongKinYiu/yolov9', ARRAY['Object Detection', 'Real-time'], NEW.id),
        ('Hugging Face Transformers', 'State-of-the-art ML library for NLP, vision, and audio tasks.', playlist_dl_id, '/images/deep-learning.jpg', 'https://huggingface.co', ARRAY['Framework', 'Open Source'], NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para configurar datos iniciales
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar datos de ejemplo (solo para testing, se puede eliminar)
-- Nota: Estos datos no estarán asociados a ningún usuario específico, 
-- por lo que no serán visibles debido a las políticas RLS
INSERT INTO public.playlists (id, name, icon, user_id) VALUES
    ('11111111-1111-1111-1111-111111111111', 'NLP', 'brain', NULL),
    ('22222222-2222-2222-2222-222222222222', 'Computer Vision', 'eye', NULL),
    ('33333333-3333-3333-3333-333333333333', 'Sewing', 'scissors', NULL),
    ('44444444-4444-4444-4444-444444444444', 'Deep Learning', 'layers', NULL),
    ('55555555-5555-5555-5555-555555555555', 'Robotics', 'bot', NULL),
    ('66666666-6666-6666-6666-666666666666', 'Data Science', 'bar-chart', NULL),
    ('77777777-7777-7777-7777-777777777777', 'Generative AI', 'sparkles', NULL),
    ('88888888-8888-8888-8888-888888888888', 'Reinforcement Learning', 'gamepad', NULL);

-- Insertar datos de ejemplo (herramientas)
INSERT INTO public.tools (title, summary, playlist_id, image, url, tags, user_id) VALUES
    ('GPT-4 Turbo', 'OpenAI''s most capable model with 128k context window and improved instruction following.', '11111111-1111-1111-1111-111111111111', '/images/nlp.jpg', 'https://openai.com', ARRAY['Language Model', 'Text Generation'], NULL),
    ('Stable Diffusion 3', 'Next-gen image generation with unprecedented quality and prompt adherence.', '77777777-7777-7777-7777-777777777777', '/images/generative-ai.jpg', 'https://stability.ai', ARRAY['Image Generation', 'Diffusion'], NULL),
    ('YOLOv9', 'Real-time object detection achieving state-of-the-art on MS COCO benchmarks.', '22222222-2222-2222-2222-222222222222', '/images/computer-vision.jpg', 'https://github.com/WongKinYiu/yolov9', ARRAY['Object Detection', 'Real-time'], NULL);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON public.playlists
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON public.tools
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();