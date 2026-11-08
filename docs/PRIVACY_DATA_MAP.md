# FlyThe BG — privacy and data-flow map

**Audit date:** 8 November 2026  
**Scope:** public repository `notintrovertaadarsh/flythebg`, default branch `main`  
**Status:** source-level inventory. Provider-console settings and live browser traffic still require operator verification.

## 1. Actual service and architecture

FlyThe BG is a free browser-based media toolkit. The inspected application contains:

- AI-assisted image background removal.
- Browser-local image compression.
- Browser-local video compression.
- Passport, visa and ID-style photo cropping, background preparation and printable sheet layout.

It is not an airline, travel agency, flight-search engine, ticket seller, booking marketplace or payment processor. No flight/travel API, map embed, booking form, visitor search/enquiry form, user account, authentication system, database-backed user profile or persistent media gallery was found in the inspected source.

The public site is served through Cloudflare Workers/Workers Assets. The background-removal route is a server-side Cloudflare Worker that calls a Hugging Face/Gradio Space using the server-side secret `HF_ACCESS_TOKEN`. Browser-local tools use browser file APIs, canvas/media APIs and object URLs.

## 2. Data inventory

| Data / event | Source and purpose | Recipient / storage boundary | Retention visible from source |
|---|---|---|---|
| IP address and request metadata | Ordinary page, asset and API requests; delivery, abuse prevention and security | Cloudflare receives requests to the site. The background-removal Worker reads Cloudflare's `CF-Connecting-IP` header for a rate-limit bucket. Cloudflare account-level bot-management/challenge products may set security cookies such as `__cf_bm` or `cf_clearance` if enabled; source code cannot establish whether they are active in production. | The application stores only a salted per-isolate SHA-256 identifier in an in-memory bucket for a 10-minute window. Buckets expire and the map is bounded. Cloudflare edge/security log retention is not visible in this repository. |
| Uploaded image for Remove Background | User selects a PNG/JPG/WEBP (maximum 15 MB), accepts the processing notice and starts the operation | Browser → same-origin `/api/remove-bg` → Cloudflare Worker → configured Hugging Face/Gradio Space. The Hugging Face credential remains server-side. | No FlyThe BG persistent image library or database write was found. The Worker handles request bytes in memory. Hugging Face/Gradio may use temporary files or operational logs; exact Space cleanup/retention configuration is not verified. |
| Image/video compression source files | User selects a file for local compression | Browser memory, browser media/canvas APIs and object URLs. The original file is not uploaded for the compression operation. | Temporary browser session state. Download object URLs are revoked after the app's five-minute recovery window. Browser/device caches and user downloads are outside the app's deletion control. |
| Passport/ID photo and sheet | User selects and crops a photo; layout is generated locally. If background removal is chosen, the image uses the remote processor above. | Browser memory/canvas for layout; Cloudflare and Hugging Face/Gradio only for optional remote background removal. | No persistent FlyThe BG media storage found. Third-party processor retention is not verified. |
| Visitor phone number | No visitor phone field or phone-number collection workflow found. | Not collected by the current application. | Not applicable. |
| Operator phone display | The former phone-reveal UI and Worker endpoint have been removed. | No operator phone number is returned by the current application. | No contact-display cookie is set. Remove the obsolete `CONTACT_PHONE` Cloudflare secret if it remains configured; current code does not read it. |
| Privacy request draft | Visitor optionally enters a reply email, request type and short details in the privacy-request draft form. | Browser form state only. The page prepares text and offers a copy action; it does not POST, email or otherwise deliver the request. | Not stored by FlyThe BG. The draft remains in the current page until the visitor leaves or clears it. No verified recipient address is currently configured. |
| External project messages | Visitor chooses to message the public FlyThe BG Instagram profile. | Instagram/Meta receives the account identifier and message; the platform controls its own processing. The profile is not a designated privacy/grievance channel. | Provider-controlled; not visible in repository source. |
| Analytics preference | Consent banner stores analytics yes/no, version and timestamp | Browser `localStorage` key `flythebg_privacy_preferences_v2`; not sent with ordinary HTTP requests | Up to 180 days; then the banner is shown again. The obsolete v1 key is removed when the app loads. |
| Analytics event data | Only after affirmative opt-in, the app loads Google Analytics 4, measurement ID `G-S50DRFD37X` | Google tag / Google Analytics. No analytics tag is present in the static HTML head. | GA property retention settings are in the Google Analytics account and were not visible to this audit. |
| Public GitHub repository star count | Client-side request to GitHub's public repository API | Browser → `api.github.com`; GitHub receives normal request metadata such as IP and user agent | No visitor identifier or search query is intentionally sent by the app. GitHub controls its own logs. |
| Remote visual assets | The 404 page can request a CloudFront-hosted background video unless reduced motion is enabled. Homepage hero media is proxied through the same-origin Worker. | Direct CloudFront request for the 404 video; Cloudflare Worker fetches proxied homepage hero assets from CloudFront. | CDN request logs/cache retention are provider settings not visible to this repository. |
| External links | User follows links to GitHub, Instagram, Buy Me a Coffee or MotionSites | Browser navigates to the external provider; no embedded widgets were found in the application source. Optional contributions, if made, are processed by the external provider, not by FlyThe BG. | The destination provider controls its own processing and retention. |
| Advertising / affiliate tracking | No ad SDK, ad pixel, affiliate network script or affiliate tracking parameter system found in current client source | `ads.txt` contains a Google seller declaration, but the file itself does not load ads or track visitors. | Owner must confirm that the seller declaration remains valid and intended. |

## 3. Cookies and browser storage

| Name | Type | Purpose | Duration / control |
|---|---|---|---|
| `flythebg_privacy_preferences_v2` | localStorage, not a cookie | Saves analytics choice, consent version and timestamp | Expires after 180 days; visitor can reopen Privacy choices or clear browser storage. |
| Google Analytics cookies (commonly `_ga`, `_ga_*`, and related identifiers) | Third-party analytics cookies | Measurement only after explicit opt-in | Google-controlled; exact names/lifetimes depend on property configuration. On rejection/withdrawal, the app denies analytics storage and attempts to clear common accessible GA cookies. |
| Cloudflare security cookies (for example `__cf_bm`, `cf_clearance`) | Provider-controlled security cookies, if enabled | Bot management or security challenges | Whether they are active and their lifetimes must be verified in the Cloudflare dashboard and production response headers. |
| Contact-display cookie | None | The former contact-number preference cookie was removed with the phone-reveal feature. | Not used. |

No `sessionStorage` use was found in the inspected application source. No iframe embed, map widget, newsletter SDK or marketing email system was found. Production response headers and Cloudflare dashboard settings must be inspected to confirm whether any Cloudflare security cookies are set and their lifetimes.

## 4. Retention decisions and gaps

Known application-side durations:

- Analytics preference: 180 days in localStorage.
- Background-removal rate-limit bucket: 10 minutes in isolate memory; key is a salted hash of Cloudflare client IP, not raw IP.
- Download recovery object URL: five minutes, then revoked.
- Uploaded media: no persistent FlyThe BG media storage found; image bytes are handled during the requested job.
- Privacy request draft: browser page state only; no backend submission or persistent storage.

Not verifiable from source and requiring owner/provider confirmation:

1. Hugging Face Space temporary file cleanup, runtime logs, backups and retention.
2. Cloudflare Workers/edge/security log retention and data-location controls, including any account-level bot-management cookies.
3. Google Analytics property retention, region settings and data-sharing settings.
4. CloudFront access-log and cache configuration.
5. Whether the applicable CERT-In Directions require the operator to retain particular ICT logs for a rolling 180 days in India. The application's 10-minute abuse limiter is not a substitute for any required log-retention system.
6. Instagram/Meta message retention if visitors voluntarily contact the project profile.

The `/data-requests` page prepares a copyable local draft. It is not an automatic server-side deletion endpoint, email sender or ticketing system. No verified recipient address is currently configured, so the request cannot yet be delivered through the website. This is a launch-readiness gap.

## 5. Security controls observed/implemented

- Hugging Face token remains in Cloudflare Worker runtime secret `HF_ACCESS_TOKEN`; no secret is added to source.
- The former `CONTACT_PHONE` secret is no longer read by the application. Remove it from Cloudflare settings if it remains configured.
- Background-removal requests check allowed browser origins, method, MIME type, file signature and a 15 MB input limit.
- Background-removal output is restricted to the configured Hugging Face Space host and validated for image MIME type, signature and maximum output size.
- Background-removal rate limiting uses a salted per-isolate hash of the Cloudflare client IP, three requests per 10-minute bucket, expired-bucket cleanup and a bounded map. This is an isolate-level burst guard, not a global WAF rate limit.
- Cache-control and security headers are set for API responses.
- The privacy request draft does not submit data to the site backend.
- No `security.txt` is published until a verified security-reporting contact is confirmed.

## 6. Owner actions

- Confirm the legal operator name and whether it is intended for public display.
- Confirm a monitored public email or postal contact for privacy, grievance, support, security and accessibility requests. Do not publish an unverified address.
- Confirm whether any registered entity, postal address or GSTIN should be published; do not invent these details.
- Remove the obsolete `CONTACT_PHONE` Cloudflare secret if present; no public telephone number is intended in the current implementation.
- Confirm that the Buy Me a Coffee destination is the intended public optional-support provider and that its external payment relationship is accurately described.
- Verify Hugging Face Space visibility, processor access, temporary file cleanup and retention.
- Verify Cloudflare logs, data location, access controls, security settings and applicable CERT-In obligations.
- Verify Google Analytics property settings and retention.
- Confirm the Google publisher declaration in `ads.txt` is still authorised and intended.
- Confirm that the project has no undisclosed affiliate/sponsorship agreements outside the source code.
- Verify authorship and licence evidence for all existing CloudFront-hosted videos and images; the current asset register records unresolved provenance.
