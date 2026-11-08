import { access, readFile, stat } from "node:fs/promises";

const required = [
  "public/index.html",
  "public/assets/app.js",
  "public/assets/site.css",
  "public/assets/pill-nav.css",
  "public/assets/pill-nav.js",
  "public/assets/flythebg-home.css",
  "public/assets/flythebg-home-fixes.css",
  "public/assets/flythebg-logo.png",
  "public/favicon.png",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/security.txt",
  "public/.well-known/security.txt",
  "public/llms.txt",
  "public/ads.txt",
  "public/site.webmanifest"
];

for (const file of required) {
  await access(file);
  if ((await stat(file)).size === 0) throw new Error("Empty deployment artifact: " + file);
}

const [worker, app, html, sitemap, source, api, css, robots, security, ads, llms] = await Promise.all([
  readFile("worker.js", "utf8"),
  readFile("public/assets/app.js", "utf8"),
  readFile("public/index.html", "utf8"),
  readFile("public/sitemap.xml", "utf8"),
  readFile("src/app.ts", "utf8"),
  readFile("functions/api/remove-bg.js", "utf8"),
  readFile("public/assets/site.css", "utf8"),
  readFile("public/robots.txt", "utf8"),
  readFile("public/.well-known/security.txt", "utf8"),
  readFile("public/ads.txt", "utf8"),
  readFile("public/llms.txt", "utf8")
]);

if (!worker.includes("/api/remove-bg")) throw new Error("Worker API route missing");
if (!app.includes("FlyThe BG")) throw new Error("Compiled app branding missing");
if (!html.includes("assets/app.js")) throw new Error("HTML shell app entry missing");
if (!worker.includes('output = output.replace("</head>"')) throw new Error("Server-side canonical injection missing");
if (!app.includes("application/ld+json") || !app.includes("BreadcrumbList")) throw new Error("Client structured-data generation missing");
if (!worker.includes("ROUTE_META") || !worker.includes("applyRouteMeta")) throw new Error("Server-side route SEO metadata missing");
if (!worker.includes("SoftwareApplication") || !worker.includes("Organization")) throw new Error("Server Schema.org graph missing");
if (!worker.includes("return { body: output, status: 200, nonce }")) throw new Error("SPA fallback response contract missing");

const legalRoutes = [
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookie-policy",
  "/refund-policy",
  "/data-requests",
  "/affiliates"
];
for (const route of legalRoutes) {
  if (!worker.includes('"' + route + '"')) throw new Error("Server route metadata missing: " + route);
  if (!source.includes('case "' + route + '"')) throw new Error("Client route missing: " + route);
  if (!sitemap.includes("https://www.flythebg.com" + route)) throw new Error("Sitemap route missing: " + route);
  if (!llms.includes("https://www.flythebg.com" + route)) throw new Error("llms.txt route missing: " + route);
}
for (const [oldRoute, newRoute] of [
  ["/privacy", "/privacy-policy"],
  ["/terms", "/terms-and-conditions"],
  ["/cookies", "/cookie-policy"],
  ["/refunds", "/refund-policy"]
]) {
  if (!worker.includes('"' + oldRoute + '": "' + newRoute + '"')) throw new Error("Legacy legal redirect missing: " + oldRoute);
}

if (!source.includes("function wirePrivacyConsent")) throw new Error("Privacy consent controller missing");
if (!source.includes("flythebg_privacy_preferences_v1")) throw new Error("Consent preference storage missing");
if (!source.includes("G-S50DRFD37X")) throw new Error("Analytics property disclosure missing");
if (!source.includes('script.src="https://www.googletagmanager.com/gtag/js?id=G-S50DRFD37X"')) throw new Error("Consent-gated analytics loader missing");
if (html.includes("googletagmanager.com") || html.includes("google-analytics.com")) throw new Error("Analytics must not load from the static HTML shell");
if (!source.includes('data-choice="reject"') || !source.includes('data-choice="accept"')) throw new Error("Accept/reject controls missing");
if (!source.includes('analytics_storage:"denied"')) throw new Error("Analytics denied state missing");
if (source.includes("fonts.googleapis.com") || css.includes("fonts.googleapis.com") || html.includes("fonts.googleapis.com")) throw new Error("Remote Google Fonts request found");
if (worker.includes("https://*.hf.space")) throw new Error("Browser CSP still permits direct Hugging Face connections");
if (!source.includes("does not ask you to submit your phone number")) throw new Error("Contact-number disclosure missing");
if (/<input[^>]*(?:type=["']tel|name=["']phone)/i.test(source)) throw new Error("Unexpected visitor phone-number input found");

const imageTags = [...source.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
if (!imageTags.length) throw new Error("No image markup was found to validate");
if (imageTags.some(tag => !/\balt\s*=/.test(tag))) throw new Error("An image element is missing an alt attribute");

if (!api.includes("originAllowed") || !api.includes("RATE_LIMIT_SALT")) throw new Error("Background API origin or privacy-preserving rate limit control missing");
if (!api.includes("new URL(SPACE_URL).hostname")) throw new Error("Background API must restrict processor result URLs to the configured Space");
if (!api.includes("MAX_OUTPUT_BYTES")) throw new Error("Background API output-size validation missing");
if (!robots.includes("Disallow: /api/") || !robots.includes("Sitemap: https://www.flythebg.com/sitemap.xml")) throw new Error("Robots policy missing API exclusion or sitemap");
if (!security.includes("Expires:") || !security.includes("Contact: mailto:") || !security.includes("Canonical: https://www.flythebg.com/.well-known/security.txt")) throw new Error("RFC 9116 security.txt fields missing");
if (!ads.includes("google.com, pub-7486274445029717, DIRECT, f08c47fec0942fa0")) throw new Error("ads.txt seller declaration missing");
if (!html.includes("20261108-legal-2")) throw new Error("HTML asset cache key was not refreshed");
if (!css.includes(".skip-link:focus")) throw new Error("Keyboard skip-link styling missing");

console.log("FlyThe BG legal, privacy, security, accessibility and deployment artifact smoke checks passed.");
