export interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  cover_url: string | null;
  images: string[] | null;
  video_url: string | null;
  featured: boolean;
  created_at: string;
}
