"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function AuthPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function authenticate(
    email: string,
    password: string,
    opts?: { registerName?: string },
  ) {
    setError("");
    setLoading(true);
    try {
      const res = opts?.registerName
        ? await api.register(opts.registerName, email, password)
        : await api.login(email, password);
      setAuth(res.accessToken, { ...res.user, email });
      const dest =
        res.user.role === "CUSTOMER"
          ? `/${locale}/account`
          : `/${locale}/admin`;
      window.location.assign(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "");
    await authenticate(
      email,
      password,
      mode === "register" ? { registerName: name } : undefined,
    );
  }

  async function demoLogin(kind: "admin" | "customer") {
    setMode("login");
    if (kind === "admin") {
      await authenticate("admin@mgjewelry.uz", "Admin123!");
    } else {
      await authenticate("customer@example.com", "Customer123!");
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-20 pt-28 md:px-8">
      <h1 className="font-display text-5xl">
        {mode === "login" ? t("login") : t("register")}
      </h1>
      <div className="mt-4 flex gap-4 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={mode === "login" ? "text-gold" : "text-ink/50"}
        >
          {t("login")}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={mode === "register" ? "text-gold" : "text-ink/50"}
        >
          {t("register")}
        </button>
      </div>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "register" ? (
          <label className="block text-sm">
            <span className="text-ink/55">{t("name")}</span>
            <input
              name="name"
              required
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
            />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="text-ink/55">{t("email")}</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("password")}</span>
          <input
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading
            ? "…"
            : mode === "login"
              ? t("submitLogin")
              : t("submitRegister")}
        </button>
      </form>

      {mode === "login" &&
      process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "1" ? (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-ghost px-4 py-2 text-sm"
              disabled={loading}
              onClick={() => demoLogin("admin")}
            >
              Demo Admin
            </button>
            <button
              type="button"
              className="btn-ghost px-4 py-2 text-sm"
              disabled={loading}
              onClick={() => demoLogin("customer")}
            >
              Demo Customer
            </button>
          </div>
          <p className="mt-6 text-xs text-ink/45">
            Demo admin: admin@mgjewelry.uz / Admin123!
            <br />
            Demo customer: customer@example.com / Customer123!
          </p>
        </>
      ) : null}
    </div>
  );
}
