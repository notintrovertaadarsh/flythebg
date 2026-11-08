# FlyThe BG — privacy and data-flow map

**Audit date:** 8 November 2026  
**Scope:** public repository `notintrovertaadarsh/flythebg`, default branch `main`  
**Status:** source-level inventory; provider-console settings and live browser traffic still require operator verification.

## 1. Actual service and architecture

FlyThe BG is a free browser-based media toolkit. The inspected application contains:

- AI-assisted image background removal.
- Browser-local image compression.
- Browser-local video compression.
- Passport, visa and ID-style photo cropping, background preparation and printable sheet layout.

It is not an airline, travel agency, flight-search engine, ticket seller, booking marketplace or payment processor. No flight/travel API, map embed, booking form, visitor search/enquiry form, user account, authentication system, database-backed user profile or persistent media gallery was found in the inspected source.

The public site is served through Cloudflare Workers/Workers Assets. The background-removal route is a server-side Cloudflare Worker that calls a Hugging Face/Gradio Space using a server-side secret. Browser-local tools use browser file APIs, canvas/media APIs and object URLs.

## 2. Data inventory

| Data / event | Source and purpose | Recipient / storage boundary | Retention visible from source |
|---|---|---|---|
| IP address and request metadata | Ordinary page, asset and API requests; delivery, abuse prevention and security | Cloudflare receives requests to the site. The background-removal Worker reads Cloudflare's `CF-Connecting-IP` header for a rate-limit bucket. | The application now stores only a salted per-isolate SHA-256 identifier in an in-memory bucket for a 10-minute window. Buckets are expired and the map is bounded. Cloudflare edge/security log retention is not visible in this repository. |
| Uploaded image for Remove Background | User selects a PNG/JPG/WEBP (maximum 15 MB), accepts the processing notice and starts the operation | Browser → same-origin `/api/remove-bg` → Cloudflare Worker → configured Hugging Face/Gradio Space. Hugging Face credential remains server-side. | No FlyThe BG persistent image library or database write was found. Worker handles request bytes in memory. Hugging Face/Gradio may use temporary files or operational logs; exact Space cleanup/retention configuration is not verified. |
| Image/video compression source files | User selects a file for local compression | Browser memory, browser media/canvas APIs and object URLs. Original file is not uploaded for the compression operation. | Temporary browser session state. Download object URLs are revoked after the app's five-minute recovery window. Browser/device caches and user downloads are outside the app's deletion control. |
| Passport/ID photo and sheet | User selects and crops a photo; layout is generated locally. If background removal is chosen, the image uses the remote processor above. | Browser memory/canvas for layout; Cloudflare and Hugging Face/Gradio only for optional remote background removal. | No persistent FlyThe BG media storage found. Third-party processor retention is not verified. |
| Visitor phone number | No visitor phone field or phone-number collection workflow found. | Not collected by the current application. | Not applicable. |
| Operator phone display | Contact page requests the operator's configured `CONTACT_PHONE` secret after a display acknowledgement. | Cloudflare Worker secret → browser response. The visitor sends only an acknowledgement flag and, optionally, a preference cookie. | The optional `flythebg_contact_reveal=1` first-party cookie lasts 30 days. It stores a display preference, not a phone number. The actual secret value is not in source and was not inspected. |
| Support/privacy request email | Visitor chooses to send an email from the privacy-request form or mail link. The form prepares a `mailto:` draft; it does not POST to FlyThe BG. | Visitor's email application → `support@flythebg.com` mailbox. The mailbox provider is not identified by source code. | The website does not store the draft. Mailbox retention, deletion and access controls are operator/provider settings not verified here. |
| Analytics preference | Consent banner stores analytics yes/no, version and timestamp | Browser `localStorage` key `flythebg_privacy_preferences_v1`; not sent with ordinary HTTP requests | Up to 180 days; then the banner is shown again. |
| Analytics event data | Only after affirmative opt-in, the app loads Google Analytics 4, measurement ID `G-S50DRFD37X` | Google tag / Google Analytics. No analytics tag is present in the static HTML head. | GA property retention settings are in the Google Analytics account and were not visible to this audit. |
| Contact display preference | Visitor separately checks “Remember my choice” and reveals the operator's number | First-party cookie `flythebg_contact_reveal=1`; sent to same-origin requests so the Worker can remember the choice | 30 days; cleared by “Hide number and clear saved choice”. |
| Public GitHub repository star count | Client-side request to GitHub public repository API | Browser → `api.github.com`; GitHub receives normal request metadata such as IP and user agent | No visitor identifier or search query is intentionally sent by the app. GitHub controls its own logs. |
| Remote visual assets | Browser loads some CloudFront-hosted portal and 404 media; homepage hero media is proxied through the same-origin Worker | Direct CloudFront requests for some media; Cloudflare Worker fetches the proxied homepage hero assets from CloudFront | CDN request logs/cache retention are provider settings not visible to this repository. |
| External links | User follows links to GitHub, Instagram, Buy Me a Coffee or MotionSites | Browser navigates to the external provider; no embedded widgets were found in the application source | The destination provider controls its own processing and retention. |
| Advertising / affiliate tracking | No ad SDK, ad pixel, affiliate network script or affiliate tracking parameter system found in current client source | `ads.txt` contains a Google seller declaration, but the file itself does not load ads or track visitors | Owner must confirm that the seller declaration remains valid and intended. |

## 3. Cookies and browser storage

| Name | Type | Purpose | Duration / control |
|---|---|---|---|
| `flythebg_privacy_preferences_v1` | localStorage, not a cookie | Saves analytics choice, version and timestamp | Expires after 180 days; visitor can reopen Privacy choices or clear browser storage. |
| `flythebg_contact_reveal` | First-party cookie | Remembers the visitor's preference to display the operator's phone number | 30 days; optional, only set after the separate checkbox and reveal action; clear control on Contact page. |
| Google Analytics cookies (commonly `_ga`, `_gid`, `_ga_*`, `_gat*`) | Third-party analytics cookies | Measurement after explicit opt-in | Google-controlled; exact cookie names/lifetimes depend on property configuration. On rejection/withdrawal, app denies analytics storage and attempts to clear common accessible GA cookies. |

No `sessionStorage` use was found in the inspected application source. No iframe embed, map widget, newsletter SDK or marketing email system was found.

## 4. Retention decisions and gaps

Known application-side durations:

- Analytics preference: 180 days in localStorage.
- Contact display preference: 30 days in a first-party cookie.
- Background-removal rate-limit bucket: 10 minutes in isolate memory; key is a salted hash of Cloudflare client IP, not raw IP.
- Download recovery object URL: five minutes, then revoked.
- Uploaded media: no persistent FlyThe BG media storage found; image bytes are handled during the requested job.

Not verifiable from source and requiring owner/provider confirmation:

1. Hugging Face Space temporary file cleanup, runtime logs, backups and retention.
2. Cloudflare Workers/edge/security log retention and data-location controls.
3. Google Analytics property retention, region settings and data-sharing settings.
4. Support mailbox provider, mailbox access, retention, deletion and backup settings.
5. CloudFront access-log and cache configuration.
6. Whether the applicable CERT-In Directions require the operator to retain particular ICT logs for a rolling 180 days in India. The application’s 10-minute abuse limiter is not a substitute for any required log-retention system.

The `/data-requests` page prepares an email in the visitor's own mail application. It is not an automatic server-side deletion endpoint or a ticketing system. The operator must review and respond to the email, delete or correct records within the operator's control where appropriate, and explain when an independent provider controls the relevant copy.

## 5. Security controls observed/implemented

- Hugging Face token remains in Cloudflare Worker runtime secret `HF_ACCESS_TOKEN`; no secret is added to source.
- Contact phone is read from optional Worker runtime secret `CONTACT_PHONE`; its value is not in source.
- Background-removal request checks allowed browser origins, method, MIME type, file signature and 15 MB input limit.
- Background-removal output is restricted to the configured Hugging Face Space host and validated for image MIME type, signature and maximum output size.
- Rate limiting uses a salted per-isolate hash of the Cloudflare client IP, 3 requests per 10-minute bucket, expired-bucket cleanup and a bounded map. This is an isolate-level burst guard, not a global WAF rate limit.
- Cache-control and security headers are set for API responses.
- The privacy request form does not submit data to the site backend.

## 6. Owner actions

- Confirm the legal operator name currently displayed in the public About, Contact and Privacy pages.
- Confirm whether the optional `CONTACT_PHONE` secret is intended to be publicly revealable and ensure it is the correct number.
- Confirm that `support@flythebg.com` is monitored and identify the mailbox provider and retention policy.
- Verify Hugging Face Space visibility, processor access, temporary file cleanup and retention.
- Verify Cloudflare logs, data location, access controls, security settings and applicable CERT-In obligations.
- Verify Google Analytics property settings and retention.
- Confirm the Google publisher declaration in `ads.txt` is still authorised and intended.
- Confirm that the project has no undisclosed affiliate/sponsorship agreements outside the source code.
