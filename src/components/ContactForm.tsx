"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill all fields.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try emailing directly.");
        setSending(false);
        return;
      }

      setSending(false);
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try emailing directly.");
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full gold-gradient flex items-center justify-center">
          <svg className="w-8 h-8 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-headline font-bold text-2xl text-on-surface mb-2">
          Message Sent!
        </h3>
        <p className="font-body font-light text-on-surface-variant mb-6">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-primary font-label text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2 block">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary outline-none transition-colors font-body font-light"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary outline-none transition-colors font-body font-light"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>
      <div>
        <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 mb-2 block">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          rows={4}
          maxLength={500}
          className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg border border-outline-variant/20 focus:border-primary outline-none transition-colors font-body font-light resize-none"
          placeholder="Tell me about your project..."
          required
        />
        <div className="flex justify-end mt-1">
          <span className={`font-label text-[10px] tracking-wider ${
            message.length > 450 ? 'text-error' : 'text-on-surface-variant/30'
          }`}>
            {message.length} / 500
          </span>
        </div>
      </div>

      {error && (
        <p className="text-error text-sm font-light text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="gold-gradient text-on-primary px-8 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/10"
      >
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>

      <p className="text-center text-on-surface-variant/30 text-xs font-light">
        Or email directly at{" "}
        <a href="mailto:anshika.sharma.vfx28@gmail.com" className="text-primary hover:underline">
          anshika.sharma.vfx28@gmail.com
        </a>
      </p>
    </form>
  );
}
