@AGENTS.md
# GF Portfolio — Agent Instructions

## Project
Next.js 16 + React 19 + Tailwind 4 + Supabase portfolio website for a Graphic Designer & Video Editor.

## What to build
1. Port the Stitch design from `code.html` into proper Next.js components
2. Connect portfolio page to Supabase `projects` table
3. Build protected `/admin` route for managing projects
4. Image uploads go to Supabase Storage bucket `project-images`

## Design System
Follow `DESIGN.md` strictly. Key rules:
- Dark base: #131313
- Gold accent: #f2ca50
- Fonts: Manrope (headlines) + Inter (body)
- No borders — use tonal layering
- Glassmorphism nav
- Grain texture overlay

## Supabase
- URL and keys are in `.env.local`
- Client is already set up at `src/lib/supabase.js`
- Table: `projects` (id, title, description, category, cover_url, images[], featured, created_at)
- Storage bucket: `project-images` (public)

## Tech notes
- Tailwind v4 — use @theme in globals.css, NO tailwind.config.js
- All components in `src/components/`
- App router in `src/app/`
- TypeScript (.tsx files)
- Admin route protected with Supabase Auth

## Pages
- `/` — Hero + project grid (fetched from Supabase)
- `/admin` — login + project management (add/edit/delete + image upload)
```

Save → `Ctrl+O` → `Enter` → `Ctrl+X`

---

Then open Antigravity, and in the agent prompt type:
```
Read CLAUDE.md, code.html, and DESIGN.md then build the entire portfolio website.