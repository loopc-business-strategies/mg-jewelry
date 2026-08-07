export function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  const isProd = process.env.NODE_ENV === "production";
  if (!secret) {
    if (isProd) {
      throw new Error(
        "JWT_SECRET must be set in production (no default fallback)",
      );
    }
    return "dev-secret-change-me";
  }
  if (isProd && secret === "dev-secret-change-me") {
    throw new Error("JWT_SECRET must not use the development default in production");
  }
  return secret;
}
