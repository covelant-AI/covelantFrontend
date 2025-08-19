// lib/portalLink.ts
const DEV_PORTAL = "https://billing.stripe.com/p/login/test_7sY7sK0QvgZ60tVdpu0ZW00";
const PROD_PORTAL = "https://billing.stripe.com/p/login/28EeVd4Jg1K0cPHgMqao800";

// Prefer an explicit flag you control, with sane fallbacks.
const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV;

export const PORTAL_LINK =
  appEnv === "dev" || appEnv === "development" ? DEV_PORTAL : PROD_PORTAL;
