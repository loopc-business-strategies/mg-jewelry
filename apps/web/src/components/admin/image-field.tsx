"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function ImageField({
  name,
  label,
  defaultValue = "",
  value,
  onChange,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
}) {
  const [url, setUrl] = useState(value ?? defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const res = await api.adminUpload(file);
      setUrl(res.url);
      onChange?.(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 text-sm">
      <span className="text-ink/55">{label}</span>
      <input
        name={name}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder="https://… or upload below"
        className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-2 outline-none focus:border-gold"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-ghost cursor-pointer px-3 py-1.5 text-xs">
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-14 w-14 object-cover border border-black/10"
          />
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
