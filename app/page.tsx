import { supabaseServer } from "@/src/lib/supabase-server";
import type { Project } from "@/src/lib/types";
import Navbar from "@/src/components/Navbar";
import Hero from "@/src/components/Hero";
import ProjectGrid from "@/src/components/ProjectGrid";
import AboutSection from "@/src/components/AboutSection";
import TestimonialsSection from "@/src/components/TestimonialsSection";
import CTASection from "@/src/components/CTASection";
import Footer from "@/src/components/Footer";

export const revalidate = 10; // ISR: revalidate every 10 seconds for faster admin updates

async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data ?? [];
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectGrid projects={projects} />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

