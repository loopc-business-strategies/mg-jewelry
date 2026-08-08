import { cache } from "react";
import { api } from "@/lib/api";

/** Dedupes public settings within a single RSC request. */
export const getPublicSettings = cache(async () => {
  try {
    return await api.publicSettings();
  } catch {
    return {} as Record<string, unknown>;
  }
});
