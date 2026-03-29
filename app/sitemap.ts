import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anshikasharma.in"; // update to real domain when deployed

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/process`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic project pages
  try {
    const { data: projects } = await supabase
      .from("projects")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
      url: `${baseUrl}/project/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
