"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/api";

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function AppointmentsPage() {
  const t = useTranslations("appointments");
  const locale = useLocale();
  const [date, setDate] = useState(tomorrowIso());
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const [type, setType] = useState<"STORE_VISIT" | "VIDEO_CONSULTATION">(
    "STORE_VISIT",
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .appointmentSlots(date)
      .then((s) => {
        setSlots(s);
        setSlot(s[0] || "");
      })
      .catch(() => {
        setSlots([]);
        setSlot("");
      });
  }, [date]);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    try {
      await api.createAppointment({
        name: String(fd.get("name") || ""),
        phone: String(fd.get("phone") || ""),
        email: String(fd.get("email") || "") || undefined,
        notes: String(fd.get("notes") || "") || undefined,
        type,
        date,
        slot,
        locale,
      });
      setMessage(t("success"));
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 md:px-8">
      <h1 className="font-display text-5xl md:text-6xl">{t("title")}</h1>
      <p className="mt-4 text-ink/70">{t("subtitle")}</p>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <fieldset>
          <legend className="mb-3 text-sm uppercase tracking-[0.2em] text-ink/50">
            {t("type")}
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["STORE_VISIT", t("storeVisit")],
                ["VIDEO_CONSULTATION", t("video")],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`border px-4 py-3 text-left ${
                  type === value ? "border-gold" : "border-black/15"
                }`}
                onClick={() => setType(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm">
          <span className="text-ink/55">{t("name")}</span>
          <input
            name="name"
            required
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("phone")}</span>
          <input
            name="phone"
            required
            placeholder="+998..."
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/55">{t("email")}</span>
          <input
            name="email"
            type="email"
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink/55">{t("date")}</span>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/55">{t("slot")}</span>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              required
              className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
            >
              {!slots.length ? (
                <option value="">{t("noSlots")}</option>
              ) : (
                slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-ink/55">{t("notes")}</span>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full border border-black/15 bg-white/50 px-3 py-3 outline-none focus:border-gold"
          />
        </label>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-ink/70">{message}</p> : null}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !slot}
        >
          {loading ? "..." : t("submit")}
        </button>
      </form>
    </div>
  );
}
