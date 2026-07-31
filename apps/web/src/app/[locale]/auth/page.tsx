"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function AuthPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "");
    try {
      const res =
        mode === "login"
          ? await api.login(email, password)
          : await api.register(name, email, password);
      setAuth(res.accessToken, { ...res.user, email });
      router.push(
        res.user.role === "CUSTOMER" ? `/${locale}/account` : `/${locale}/admin`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">
        {mode === "login" ? t("login") : t("register")}
      </h1>
      <div className="mt-4 flex gap-4 text-sm">
        <button type="button" onClick={() => setMode("login")} className={mode === "login" ? "text-gold" : "text-ink/50"}>
          {t("login")}
        </button>
        <button type="button" onClick={() => setMode("register")} className={mode === "register" ? "text-gold" : "text-ink/50"}>
          {t("register")}
        </button>
      </div>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "register" ? (
          <label className="block text-sm">
            <span className="text-ink/55">{t("name")}</span>
            <input name="name" required className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold" />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="text-ink/55">{t("email")}</span>
          <input name="email" type="email" required className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold" />
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("password")}</span>
          <input name="password" type="password" minLength={8} required className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold" />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="btn-primary w-full">
          {mode === "login" ? t("submitLogin") : t("submitRegister")}
        </button>
      </form>
      <p className="mt-6 text-xs text-ink/45">
        Demo admin: admin@mgjewelry.uz / Admin123!
      </p>
    </div>
  );
}
