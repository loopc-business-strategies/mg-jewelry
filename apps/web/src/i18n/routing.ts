import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "uz", "ru", "tr"],
  defaultLocale: "en",
  localePrefix: "always",
});
