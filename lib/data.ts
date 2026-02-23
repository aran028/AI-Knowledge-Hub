export type YouTubeContent = {
  id?: string;
  video_id: string;
  title: string;
  description?: string;
  channel_name: string; // NOT NULL
  channel_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: string;
  published_at?: string;
  view_count?: number;
  like_count?: number;
  ai_classification?: any;
  confidence_score?: number;
  related_tools?: string[];
  tags?: string[];
  ai_key_points?: string[];
  ai_summary?: string;
  playlist_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

// Valores por defecto para campos requeridos
export const getYouTubeContentDefaults = (data: any): YouTubeContent => ({
  video_id: data.video_id || '',
  title: data.title || 'Sin título',
  channel_name: data.channel_name || 'Canal desconocido', // Valor por defecto para NOT NULL
  description: data.description || null,
  channel_url: data.channel_url || null,
  video_url: data.video_url || `https://www.youtube.com/watch?v=${data.video_id}`, // Generate URL from video_id
  thumbnail_url: data.thumbnail_url || null,
  duration: data.duration || null,
  published_at: data.published_at || null,
  view_count: data.view_count || 0,
  like_count: data.like_count || 0,
  ai_classification: data.ai_classification || {},
  confidence_score: data.confidence_score || null,
  related_tools: data.related_tools || [],
  tags: data.tags || [],
  ai_key_points: data.ai_key_points || [],
  ai_summary: data.ai_summary || null,
  playlist_id: data.playlist_id || null,
  user_id: data.user_id || null,
});