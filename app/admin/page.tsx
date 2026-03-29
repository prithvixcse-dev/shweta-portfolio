"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/src/lib/supabase";
import type { Project } from "@/src/lib/types";

// Only these emails can access admin
const ALLOWED_ADMIN_EMAILS = [
  "shweta.sharma.vfx@gmail.com",
  "prithvixchiky@gmail.com",
];

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "messages">("projects");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const readIdsRef = useRef<Set<string>>(new Set());

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoInputMode, setVideoInputMode] = useState<"url" | "upload">("url");
  const [featured, setFeatured] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const fetchProjects = useCallback(async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    const fetched = data ?? [];
    // Apply local sort order if saved
    try {
      const raw = localStorage.getItem("admin_project_order");
      if (raw) {
        const order: string[] = JSON.parse(raw);
        const ordered: typeof fetched = [];
        for (const id of order) {
          const p = fetched.find((x) => x.id === id);
          if (p) ordered.push(p);
        }
        // Add any new projects not in saved order
        for (const p of fetched) {
          if (!ordered.find((x) => x.id === p.id)) ordered.push(p);
        }
        setProjects(ordered);
        return;
      }
    } catch { /* ignore */ }
    setProjects(fetched);
  }, []);

  const fetchContacts = useCallback(async () => {
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts(data ?? []);
  }, []);

  // Load read IDs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_read_contact_ids");
      const ids = raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
      readIdsRef.current = ids;
      setReadIds(new Set(ids));
    } catch { /* ignore */ }
  }, []);

  const markAsRead = useCallback((id: string) => {
    if (readIdsRef.current.has(id)) return;
    readIdsRef.current.add(id);
    setReadIds(new Set(readIdsRef.current));
    try {
      localStorage.setItem("admin_read_contact_ids", JSON.stringify([...readIdsRef.current]));
    } catch { /* ignore */ }
  }, []);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setLoading(false);
      if (session) {
        fetchProjects();
        fetchContacts();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchProjects();
        fetchContacts();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProjects, fetchContacts]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const tick = () => {
      const left = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (left <= 0) {
        setLockoutUntil(null);
        setLockoutRemaining(0);
        setLoginAttempts(0);
        setAuthError("");
      } else {
        setLockoutRemaining(left);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockoutUntil]);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setAuthError(`Too many attempts. Try again in ${lockoutRemaining}s.`);
      return;
    }

    // Email allowlist check (before hitting Supabase)
    const normalizedEmail = email.trim().toLowerCase();
    if (!ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
      setLoginAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setLockoutUntil(Date.now() + 5 * 60 * 1000);
          setAuthError("Account locked for 5 minutes.");
        }
        return next;
      });
      setAuthError("Access denied.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error) {
      setLoginAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setLockoutUntil(Date.now() + 5 * 60 * 1000);
          setAuthError("Too many failed attempts. Account locked for 5 minutes.");
        } else {
          setAuthError(`Invalid credentials. ${5 - next} attempts remaining.`);
        }
        return next;
      });
    } else {
      setLoginAttempts(0);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setPasswordMsg("");
    if (newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 1500);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  // Upload with progress tracking via XMLHttpRequest
  const uploadWithProgress = (bucket: string, path: string, file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        setUploadProgress(100);
        if (xhr.status >= 200 && xhr.status < 300) {
          const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
          resolve(publicUrl);
        } else {
          console.error("Upload error:", xhr.statusText);
          resolve(null);
        }
      };
      xhr.onerror = () => { resolve(null); };
      xhr.open("POST", `${supabaseUrl}/storage/v1/object/${bucket}/${path}`);
      xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
      xhr.setRequestHeader("apikey", anonKey);
      xhr.setRequestHeader("x-upsert", "true");
      xhr.send(file);
    });
  };

  // Upload image
  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    setUploadProgress(0);
    return uploadWithProgress("project-images", fileName, file);
  };

  // Upload video file
  const uploadVideo = async (file: File): Promise<string | null> => {
    // 50 MB limit (Supabase free tier)
    if (file.size > 50 * 1024 * 1024) {
      alert("Video must be under 50 MB. Consider using a YouTube/Vimeo link instead.");
      return null;
    }

    const ext = file.name.split(".").pop();
    const fileName = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    setUploadProgress(0);
    return uploadWithProgress("project-images", fileName, file);
  };

  // Drag-and-drop reorder handlers
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    setProjects(reordered);
    // Persist order to localStorage
    try {
      localStorage.setItem("admin_project_order", JSON.stringify(reordered.map((p) => p.id)));
    } catch { /* ignore */ }
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // Open form for new project
  const openNewForm = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setVideoUrl("");
    setVideoFile(null);
    setVideoInputMode("url");
    setFeatured(false);
    setCoverFile(null);
    setCoverPreview("");
    setShowForm(true);
  };

  // Open form for editing
  const openEditForm = (project: Project) => {
    setEditing(project);
    setTitle(project.title);
    setDescription(project.description ?? "");
    setCategory(project.category ?? "");
    setVideoUrl(project.video_url ?? "");
    setVideoFile(null);
    setVideoInputMode("url");
    setFeatured(project.featured);
    setCoverFile(null);
    setCoverPreview(project.cover_url ?? "");
    setShowForm(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Save project
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let coverUrl = editing?.cover_url ?? null;

    // Upload new cover if selected
    if (coverFile) {
      setUploading(true);
      const url = await uploadImage(coverFile);
      if (url) coverUrl = url;
      setUploading(false);
    }

    // Determine final video URL
    let finalVideoUrl = videoUrl || null;
    if (videoInputMode === "upload" && videoFile) {
      setUploading(true);
      const url = await uploadVideo(videoFile);
      if (url) finalVideoUrl = url;
      setUploading(false);
    }

    const projectData = {
      title,
      description: description || null,
      category: category || null,
      cover_url: coverUrl,
      video_url: finalVideoUrl,
      featured,
    };

    if (editing) {
      await supabase.from("projects").update(projectData).eq("id", editing.id);
    } else {
      await supabase.from("projects").insert(projectData);
    }

    setSaving(false);
    setShowForm(false);
    fetchProjects();
  };

  // Delete project
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  // ───── Loading ─────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ───── Login Screen ─────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-headline font-bold text-3xl text-on-surface mb-2 text-center">
            Admin
          </h1>
          <p className="text-on-surface-variant font-light text-center mb-10">
            Sign in to manage your portfolio
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6" autoComplete="off">
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                name="admin-email-login"
                className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded border-b-2 border-outline-variant focus:border-primary outline-none transition-colors font-body font-light"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                name="admin-password-login"
                className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded border-b-2 border-outline-variant focus:border-primary outline-none transition-colors font-body font-light"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <p className="text-error text-sm font-light">{authError}</p>
            )}

            <button
              type="submit"
              className="gold-gradient text-on-primary py-3 rounded font-headline font-semibold text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>

          <a
            href="/"
            className="block text-center mt-8 text-on-surface-variant/50 text-sm hover:text-primary transition-colors"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    );
  }

  // ───── Admin Dashboard ─────
  return (
    <div className="min-h-screen bg-surface">
      {/* Admin Nav */}
      <nav className="bg-surface-container-low px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xl font-bold tracking-tighter text-primary font-headline"
          >
            SHWETA
          </a>
          <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant/50 bg-surface-container px-3 py-1 rounded-full">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-on-surface-variant/40 text-xs font-label uppercase tracking-widest hover:text-primary transition-colors"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="text-on-surface-variant/60 text-sm font-light hover:text-error transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-outline-variant/10">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-6">Change Password</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary outline-none transition-colors font-body font-light"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary outline-none transition-colors font-body font-light"
                  placeholder="Repeat password"
                />
              </div>
              {passwordMsg && (
                <p className={`text-sm font-light text-center ${
                  passwordMsg.includes("success") ? "text-green-400" : "text-error"
                }`}>
                  {passwordMsg}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); setPasswordMsg(""); setNewPassword(""); setConfirmPassword(""); }}
                  className="flex-1 py-3 rounded border border-outline-variant/30 text-on-surface font-headline font-semibold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 gold-gradient text-on-primary py-3 rounded font-headline font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {changingPassword ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 bg-surface-container-low rounded-xl p-1.5 max-w-xs">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "projects"
                ? "bg-surface-container-high text-on-surface shadow-sm"
                : "text-on-surface-variant/50 hover:text-on-surface-variant"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            Projects
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "messages"
                ? "bg-surface-container-high text-on-surface shadow-sm"
                : "text-on-surface-variant/50 hover:text-on-surface-variant"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Messages
            {contacts.filter(c => !readIds.has(c.id)).length > 0 && (
              <span className="bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {contacts.filter(c => !readIds.has(c.id)).length}
              </span>
            )}
          </button>
        </div>

        {/* ───── PROJECTS TAB ───── */}
        {activeTab === "projects" && (
          <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="font-headline font-bold text-3xl text-on-surface">
              Projects
            </h1>
            <p className="text-on-surface-variant font-light mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openNewForm}
            className="gold-gradient text-on-primary px-6 py-2.5 rounded font-headline font-semibold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </button>
        </div>

        {/* ───── Project Form Modal ───── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
            <div className="bg-surface-container w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline font-bold text-2xl text-on-surface">
                  {editing ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-on-surface-variant/60 hover:text-on-surface transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-6">
                {/* Title */}
                <div>
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded border-b-2 border-outline-variant focus:border-primary outline-none transition-colors font-body font-light"
                    placeholder="Project name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded border-b-2 border-outline-variant focus:border-primary outline-none transition-colors font-body font-light resize-none"
                    placeholder="Brief project description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded border-b-2 border-outline-variant focus:border-primary outline-none transition-colors font-body font-light"
                    placeholder="Branding, Motion, UI Design, etc."
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-4">
                    {coverPreview && (
                      <img
                        src={coverPreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded bg-surface-container-high"
                      />
                    )}
                    <label className="cursor-pointer flex-1">
                      <div className="bg-surface-container-lowest text-on-surface-variant px-4 py-3 rounded border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-colors text-center text-sm font-light">
                        {coverPreview ? "Change image" : "Choose an image"}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Video */}
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3 block">
                    Video
                  </p>
                  {/* Mode tabs */}
                  <div className="flex gap-1 mb-4 bg-surface-container-lowest rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => { setVideoInputMode("url"); setVideoFile(null); }}
                      className={`flex-1 py-2 rounded-md text-xs font-label uppercase tracking-widest transition-all ${
                        videoInputMode === "url"
                          ? "bg-surface-container-high text-on-surface"
                          : "text-on-surface-variant/50 hover:text-on-surface-variant"
                      }`}
                    >
                      Paste URL
                    </button>
                    <button
                      type="button"
                      onClick={() => { setVideoInputMode("upload"); }}
                      className={`flex-1 py-2 rounded-md text-xs font-label uppercase tracking-widest transition-all ${
                        videoInputMode === "upload"
                          ? "bg-surface-container-high text-on-surface"
                          : "text-on-surface-variant/50 hover:text-on-surface-variant"
                      }`}
                    >
                      Upload from Device
                    </button>
                  </div>

                  {videoInputMode === "url" ? (
                    <div>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 rounded border-b-2 border-outline-variant focus:border-primary outline-none transition-colors font-body font-light"
                        placeholder="https://youtube.com/watch?v=... or vimeo.com/..."
                      />
                      <p className="text-on-surface-variant/40 text-xs mt-1.5 font-light">
                        Supports YouTube and Vimeo links.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="cursor-pointer block">
                        <div className="bg-surface-container-lowest text-on-surface-variant px-4 py-4 rounded border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-colors text-center">
                          {videoFile ? (
                            <div className="flex items-center justify-center gap-3">
                              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              <span className="text-sm text-on-surface truncate max-w-[200px]">{videoFile.name}</span>
                              <span className="text-xs text-on-surface-variant/50">
                                {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <svg className="w-8 h-8 text-on-surface-variant/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                              </svg>
                              <span className="text-sm font-light text-on-surface-variant">Choose a video file</span>
                              <span className="text-xs text-on-surface-variant/40">MP4, WebM, MOV supported</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/ogg"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setVideoFile(f);
                          }}
                          className="hidden"
                        />
                      </label>
                      {videoFile && (
                        <button
                          type="button"
                          onClick={() => setVideoFile(null)}
                          className="mt-2 text-xs text-on-surface-variant/50 hover:text-error transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Featured */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="font-label text-sm text-on-surface-variant">
                    Featured project
                  </span>
                </label>

                {/* Upload progress bar */}
                {uploading && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50">
                        Uploading...
                      </span>
                      <span className="font-label text-xs text-primary font-bold">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full gold-gradient rounded-full transition-[width] duration-200 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded border border-outline-variant/30 text-on-surface font-headline font-semibold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 gold-gradient text-on-primary py-3 rounded font-headline font-semibold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {uploading
                      ? "Uploading..."
                      : saving
                        ? "Saving..."
                        : editing
                          ? "Update"
                          : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ───── Project List ───── */}
        {projects.length === 0 ? (
          <div className="text-center py-24 bg-surface-container-low rounded-xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
              <svg
                className="w-8 h-8 text-on-surface-variant/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-on-surface-variant font-light text-lg mb-4">
              No projects yet
            </p>
            <button
              onClick={openNewForm}
              className="text-primary font-headline font-semibold text-sm uppercase tracking-wider hover:underline"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={`bg-surface-container-low rounded-lg p-5 flex items-center gap-5 group hover:bg-surface-container transition-all duration-300 cursor-grab active:cursor-grabbing ${
                  dragOverIdx === idx ? "border-2 border-primary/40 border-dashed" : "border-2 border-transparent"
                } ${dragIdx === idx ? "opacity-40" : "opacity-100"}`}
              >
                {/* Drag handle */}
                <div className="flex-shrink-0 text-on-surface-variant/20 group-hover:text-on-surface-variant/50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm8-16a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
                {/* Thumbnail */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                  {project.cover_url ? (
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full gold-gradient opacity-30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-headline font-bold text-lg text-on-surface truncate">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="text-[10px] font-label uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                        Featured
                      </span>
                    )}
                    {project.video_url && (
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 bg-surface-container-high px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Video
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.category && (
                      <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant/60">
                        {project.category}
                      </span>
                    )}
                    <span className="text-xs text-on-surface-variant/40">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEditForm(project)}
                    className="p-2 rounded hover:bg-surface-container-high transition-colors text-on-surface-variant/60 hover:text-primary"
                    title="Edit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded hover:bg-error-container/20 transition-colors text-on-surface-variant/60 hover:text-error"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* ───── MESSAGES TAB ───── */}
        {activeTab === "messages" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <h1 className="font-headline font-bold text-3xl text-on-surface">
                  Messages
                </h1>
                <p className="text-on-surface-variant font-light mt-1">
                  {contacts.length} message{contacts.length !== 1 ? "s" : ""} from the contact form
                </p>
              </div>
              <button
                onClick={fetchContacts}
                className="text-on-surface-variant/60 text-sm font-light hover:text-primary transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Refresh
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-container-high flex items-center justify-center">
                  <svg className="w-8 h-8 text-on-surface-variant/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="text-on-surface-variant font-light text-lg">
                  No messages yet
                </p>
                <p className="text-on-surface-variant/40 font-light text-sm mt-2">
                  When visitors fill the contact form, their messages will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => markAsRead(contact.id)}
                    className={`rounded-lg p-6 group hover:bg-surface-container transition-colors duration-300 cursor-default ${
                      !readIds.has(contact.id)
                        ? "bg-surface-container border-l-2 border-primary"
                        : "bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-on-primary font-headline font-bold text-sm flex-shrink-0">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className={`font-headline font-bold text-on-surface flex items-center gap-2`}>
                            {contact.name}
                            {!readIds.has(contact.id) && (
                              <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </h3>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-primary hover:underline font-light"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-on-surface-variant/40 font-light">
                          {timeAgo(contact.created_at)}
                        </span>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this message?")) return;
                            await supabase.from("contacts").delete().eq("id", contact.id);
                            fetchContacts();
                          }}
                          className="p-1.5 rounded hover:bg-error-container/20 transition-colors text-on-surface-variant/30 hover:text-error opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="font-body font-light text-on-surface-variant leading-relaxed pl-[52px] mb-3">
                      {contact.message}
                    </p>
                    {/* Reply button */}
                    <div className="pl-[52px]">
                      <a
                        href={`mailto:${contact.email}?subject=Re: Your message to Shweta Sharma&body=%0A%0A---%0AOn ${new Date(contact.created_at).toLocaleDateString()}, ${contact.name} wrote:%0A${encodeURIComponent(contact.message)}`}
                        className="inline-flex items-center gap-1.5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
