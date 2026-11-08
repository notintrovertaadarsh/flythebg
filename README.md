# FlyThe BG

## Deployment status and repository access

**GitHub repository:** `notintrovertaadarsh/flythebg` (public; production branch: `main`). **Hosting:** Cloudflare Workers with static Workers Assets; this is not a Netlify deployment. GitHub Actions typechecking/build success does **not** prove that Cloudflare's Git-connected builder can clone the repository or deploy the domain.

If Cloudflare stays at **Initializing** and never reaches cloning, installing or building, the failure is upstream of this project's build scripts. In Cloudflare, check the Workers Builds GitHub connection and verify the Cloudflare GitHub app is connected to the current repository and production branch. Also check Cloudflare's status and build logs. A source-code commit cannot force Cloudflare's initialization queue to advance.

**Independent fallback:** GitHub Actions > **Deploy Cloudflare (GitHub fallback)** > Run workflow on `main`. This route builds in GitHub and deploys via Cloudflare's API, avoiding Cloudflare's Git clone/build pipeline. Configure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets; the token needs the account's Workers Scripts Edit permission. Set `HF_ACCESS_TOKEN` **only** as a Cloudflare production Worker runtime secret, not a GitHub build secret. This fallback is manual so it does not race Cloudflare auto-deployments. See [deployment recovery runbook](docs/DEPLOYMENT_RUNBOOK.md).

### Public repository and secret-safety policy

This repository is public. Review **the entire Git history**, not just current files, and rotate any credential that may ever have been exposed. Never commit or paste actual Hugging Face, GitHub, Cloudflare or other API tokens, private keys, `.dev.vars`, `.env` files or credentials into source, docs, screenshots, workflow YAML or build logs. `.env.example` must contain placeholders only. Production credentials belong in Cloudflare Worker runtime secrets; GitHub deployment credentials belong in GitHub Actions encrypted secrets.

Both CI and manual deployment run `node scripts/check-secrets.mjs`, which checks the **current working tree** for several recognizable token/key patterns without printing detected values. This is a preventive check, **not proof that no credentials have ever been leaked**. It cannot detect every token format, previous commits, deleted files, forks, external logs or screenshots. Enable GitHub secret scanning and push protection where available. Before switching visibility to public, inspect full history with a dedicated scanner such as Gitleaks, review Actions logs and rotate/revoke any credential ever committed or exposed. Removing a token from the latest commit or making the repository private does not revoke it.

The deploy script never embeds `HF_ACCESS_TOKEN` into build artifacts or writes it to a temporary file. It uses Wrangler; configure runtime secrets separately. Do not print environment variables in CI. If any secret may have been exposed, **revoke and rotate it before publishing**.

FlyThe BG is an independent media-tools project operated by Aadarsh Maurya as an individual; it is not a registered company or business entity.

## Major architecture

The public website is intentionally HTML-light:

- index.html is only the secure document shell and mount point.
- src/app.ts owns routing, UI rendering, tool state and browser behavior.
- assets/site.css owns presentation.
- A Cloudflare Worker provides the server-side boundary; its background-removal handler lives in `functions/api/remove-bg.js`.
- tools/*.py provides real local Python utilities for rembg, image compression and FFmpeg video compression.
- The hosted background-removal processor is the only workflow that requires a server request.
- Background removal runs through the FlyThe BG Cloudflare Worker and a Hugging Face Spaces-hosted rembg processor; FlyThe BG does not provide persistent image storage, a storage bucket or an image gallery.
- Image/video compression is browser-local and does not upload the source file.

## Offline mode / local fallback

FlyThe BG is designed to keep the compression tools usable without an internet connection. **Image Compressor** and **Video Compressor** can run locally in the browser when their browser APIs are available, and the repository also includes Python command-line fallbacks for desktop/offline use.

If hosted background removal is unavailable, users who need fully offline background removal can run the bundled local `rembg` utility. This requires installing Python dependencies once on the offline machine; the model is then downloaded/available locally and inference happens on that machine without the Hugging Face token or Cloudflare Worker.

### Install the offline rembg fallback

From the repository root:

    python -m venv .venv
    # Windows
    .venv\\Scripts\\activate
    # macOS/Linux
    source .venv/bin/activate
    pip install -r tools/requirements.txt

Run local background removal:

    python tools/rembg_local.py photo.jpg

For a completely offline machine, prepare the Python environment and required rembg model files **before disconnecting from the internet**. The first model download normally requires internet access; after the model is present locally, rembg can process supported images without contacting Hugging Face or FlyThe BG.

### Offline image and video compression

Image compression:

    python tools/compress_image.py photo.jpg --quality 72

Video compression requires FFmpeg:

    python tools/compress_video.py video.mp4

Install FFmpeg on the machine before going offline if video compression will be used. These local workflows do not need the hosted Hugging Face token.

## Background-removal recovery rule

If hosted background removal stops working, the first recovery path is to inspect and repair the GitHub repository implementation and Cloudflare Worker integration before changing the browser architecture. The Hugging Face fine-grained token remains server-side and is never exposed to the browser. The browser should **not** reconnect directly to Gradio or require a Hugging Face token for background removal.

If the hosted service remains unavailable after the server-side integration is repaired, use the local `rembg` fallback described above for offline processing.

## DPDP Act 2023 / Rules 2025 design review

The site has been redesigned around the main operational principles relevant to a small service processing digital personal data in India:

1. Clear notice: the privacy page explains categories of data, purposes, the background-removal processor boundary, rights and contact route.
2. Purpose-specific action: background removal shows a processing notice and requires an affirmative checkbox before upload.
3. Data minimisation: no account is required; compression stays in the browser; background removal accepts only the required image types and has a 15 MB limit.
4. No intentional image library: the application does not expose an account or persistent image gallery.
5. Rights/grievance route: the privacy page publishes the project email for access, correction, erasure, consent and grievance requests.
6. Children: the privacy notice acknowledges the Act's under-18 definition and avoids intentionally designing the service to solicit children's data.
7. Security: same-origin API routing, HTTPS deployment, CSP, HSTS, nosniff, restrictive permissions, no client-side AI credential, no-store API responses, type/size validation and robots exclusion for /api/.
8. Processor boundary: the Hugging Face credential is read only by the Cloudflare Function. The rembg model runs on Hugging Face Spaces. FlyThe BG does not intentionally retain uploaded background-removal images after the processing flow, but the external Gradio runtime can create transient processing files while a request is running. Space-level cleanup/retention must be configured and verified separately.
9. Consent-gated analytics: Google Analytics (G-S50DRFD37X) is loaded only after affirmative opt-in. Reject optional and Accept all are both offered; analytics can be withdrawn through the footer Privacy choices control. No advertising SDK or marketing email programme is currently bundled.
10. Request isolation: each background-removal request is expected to receive only its own result. The Space application must not use shared global image state or shared filenames that could cross requests.
11. Retention transparency: FlyThe BG does not claim that an external processor has zero transient storage unless that behavior has been technically verified. The privacy notice describes this boundary explicitly.

### Important legal status

The DPDP Act 2023 and Digital Personal Data Protection Rules 2025 are the governing sources, and the Rules have staged commencement. This repository therefore uses a future-ready implementation rather than claiming that the website is legally certified compliant. Legal applicability and obligations depend on the actual operation, users, processing, exemptions and applicable commencement dates.

## Hugging Face Spaces / rembg processing

FlyThe BG uses Hugging Face Spaces as the hosted AI processing boundary for background removal. The source image is sent only after the user explicitly selects it, accepts the processing notice and starts the operation. The website does not expose the Hugging Face credential to the browser.

A public Space is not automatically the same thing as a storage service: Hugging Face documents that Spaces can be public, protected or private, and Gradio may create temporary files for uploaded inputs and outputs while processing. For a privacy-first deployment, keep the Space private when the account/plan and integration permit it; use protected visibility if available and you need the app reachable without publishing source code.

User 1 and User 2 should receive results associated with their own request/event. This isolation must be enforced by the Space application itself: do not use shared global variables, fixed shared filenames, persistent image queues, or a shared output file for concurrent requests. Temporary uploaded/processed files should be cleaned up after the request where the Space implementation permits it.

The FlyThe BG privacy notice therefore says **no intentional persistent FlyThe BG image storage**, rather than making the stronger and unverifiable claim that no transient bytes can ever exist inside the external processor.

Production runs on Cloudflare Workers + Workers Assets. Keep the repository on the `main` branch; production changes are committed directly there.

Build:
- `npm install`
- `npm run build`
- `npx wrangler deploy`

Required Cloudflare secret:
- `HF_ACCESS_TOKEN` — Secret only.
- `CONTACT_PHONE` — optional Worker runtime secret for the operator contact number. Set it only in Cloudflare Worker secrets; do not put the value in source, client code, `.env.example`, GitHub Actions logs or the repository.

The Hugging Face Space and API endpoint are fixed in the server-side Worker. The rembg model can take around 20–25 seconds to start after a cold start; the Worker provides startup grace time before reporting that the processor did not become ready. Never put the Hugging Face token in GitHub, HTML, TypeScript, public build output, localStorage, sessionStorage or `wrangler.toml`.

The browser may read the public GitHub repository API only to show the current star count. It does not use a GitHub token.

## Support payments

The `/support` page links to Buy Me a Coffee. Payment is completed on Buy Me a Coffee's own page. FlyThe BG does not process cards, verify payment status, or mark a user as having paid after a redirect.

## Brand / trademark notice

FlyThe BG is independent. OpenAI, GPT, ChatGPT, Anthropic, Claude, Google, Gemini, xAI, Grok, Hugging Face, GitHub, Buy Me a Coffee and other names or marks referenced in the site belong to their respective owners. References are descriptive and do not imply sponsorship, endorsement, partnership or ownership by FlyThe BG.

## Local Python

Create a local environment:

    python -m venv .venv
    pip install -r tools/requirements.txt

Background removal:

    python tools/rembg_local.py photo.jpg

Image compression:

    python tools/compress_image.py photo.jpg --quality 72

Video compression requires FFmpeg:

    python tools/compress_video.py video.mp4

These local workflows do not need the hosted Hugging Face token.

## Routes

Core:
- /
- /features
- /remove-bg
- /image-compressor
- /video-compressor
- /about
- /faq
- /contact
- /support

Guides:
- /blog
- /blog/remove-background-online-privacy
- /blog/compress-images-in-browser
- /blog/webm-video-compression-guide

Trust and project:
- /privacy-policy
- /terms-and-conditions
- /cookie-policy
- /refund-policy
- /affiliates
- /data-requests
- /security
- /accessibility
- /code-of-conduct
- /changelog

The application uses one UI shell with responsive navigation. Clean routes are routed through the app shell and listed in sitemap.xml. Unknown client routes show a dedicated 404 page.

## Licensing

AGPL-3.0.

## Contact

support@flythebg.com

This is the official FlyThe BG support address for product questions, privacy requests, security reports and project communication.


### Account-free DPDP note (reviewed 2026-11-08)

FlyThe BG does not offer accounts or authentication. That means there is no account profile or account deletion/export dashboard; it does **not** mean that personal data is never processed. Images submitted to Remove Background, support correspondence, and technical/security request metadata can still involve personal data. The public Privacy Policy and Contact page explain the browser-local versus external-processing boundary; `/data-requests` prepares a mailto draft in the visitor's own email application. Verify that the inbox is live/monitored, the operator identity is correctly disclosed, external processor retention is understood, and the child-data/guardian-consent issue is resolved before claiming full DPDP compliance. The website is not legally certified by this engineering checklist.


### Contact-number reveal

The Contact page shows the operator's phone number only after an explicit safety acknowledgement. A separate, unchecked option can save the reveal preference in a first-party cookie for 30 days; the cookie stores only a flag, not the phone number. The number is supplied by Cloudflare Worker secret CONTACT_PHONE and is not embedded in the public JavaScript bundle. To configure it from the repository environment, run `npx wrangler secret put CONTACT_PHONE` and enter the number at the secure prompt. The UI gate is a privacy/friction measure, not authentication or access control; anyone technically capable of calling the public endpoint may request the number.


## Privacy, consumer clarity and accessibility implementation (8 November 2026)

- Added a first-visit privacy choices banner with equally visible **Accept all**, **Reject optional** and **Customize** actions. Essential storage is limited to the saved choice; analytics is off until explicit opt-in and can be withdrawn from the footer. The choice is stored locally in the visitor's browser; there is no server-side consent ledger.
- Removed the unconditional Google Analytics script from the document head. Google Analytics is injected only after the visitor opts in. Removed the external Google Fonts stylesheet; the site uses system/local font stacks.
- Added a Refund Policy and a Privacy & Data Deletion Requests page. The latter prepares an email in the visitor's own mail application and does not submit or store form values on the website.
- Added policy links to the footer, sitemap and llms.txt. The current core tools do not charge a usage fee; optional support is processed by the external support provider. There is no on-site checkout or advertising SDK in the current source.
- Existing file-processing confirmations remain required before a selected file is processed. The Privacy Policy, Terms and all file-tool notices prohibit photos or videos depicting identifiable children until a lawful verifiable parental-consent process exists. The checkbox is a user declaration, not age or guardian verification.
- All authored image elements include an explicit alt attribute; build smoke checks fail if an image tag is missing one. Visible focus styling, a skip link, dialog focus management, keyboard-adjustable passport cropping and reduced-motion video loading are implemented. The build also checks selected core palette text/accent pairs against 4.5:1 contrast; this is not a complete contrast audit. This is an engineering baseline, not a completed independent WCAG audit.
- No marketing email list or newsletter sender is currently implemented, so an unsubscribe link is not applicable to current product behavior. If marketing email is introduced, opt-in, sender identification and a working unsubscribe mechanism must be implemented before sending.
- Third-party integration inventory: Cloudflare Workers/Assets for hosting and API boundary; Hugging Face/Gradio only for a user-requested background-removal job; CloudFront for hosted visual assets; public GitHub API for repository star count; Google Analytics only after opt-in; Buy Me a Coffee only after a user follows the external support link; Instagram/GitHub are outbound links. No iframe embed or advertising SDK was found in the current application source.

### Font and image licensing status

The external Google Fonts stylesheet has been removed; no remotely hosted font is requested by the page. The CSS uses local/system font fallbacks. Existing logo, hero poster, video and other visual assets are retained as project assets, but their original authorship and license evidence must be checked against the source files/asset provider before redistribution. Do not add stock imagery, icon packs, fonts or other third-party assets without recording the source, license, attribution and any redistribution conditions. This repository change does not certify rights to legacy assets whose provenance has not been independently verified.

### Important compliance limitation

These changes are engineering controls and clearer notices, not a legal opinion, regulator approval or guarantee of compliance. In particular, the privacy choices are stored locally rather than in a server-side consent ledger; the current project does not independently verify a parent/guardian's identity or consent for child data; external processor retention and mailbox handling remain subject to those providers' configurations; and the operator should confirm the support inbox is monitored and response timelines are workable. Obtain jurisdiction-specific legal review before making a compliance claim.


## Current privacy, legal and accessibility audit (8 November 2026)

The source-level data inventory, legal applicability notes and visual-asset provenance register are maintained here:

- [Privacy and data-flow map](docs/PRIVACY_DATA_MAP.md)
- [India-focused legal and jurisdiction review](docs/LEGAL_COMPLIANCE_REVIEW.md)
- [Visual asset and licence register](docs/ASSET_LICENSE_REGISTER.md)

The application is a free browser-based media toolkit, not an airline, travel agency or booking service. The current code has no visitor phone-number field, account system, booking API, on-site checkout, advertising SDK or affiliate network integration. The operator phone reveal returns the operator's own configured contact number and does not collect a visitor number. The privacy request form prepares an email in the visitor's own email application; it does not submit data to a site backend.

Provider retention settings (Cloudflare, Hugging Face/Gradio, CloudFront, Google Analytics and the support mailbox) are not all visible in repository source. The legal review records owner actions and does not claim that those provider settings or a formal accessibility audit have been completed. The deployment workflow now fails if required validation steps fail; a successful build does not by itself prove that the production site has deployed.


The source-level asset review also removed a CSS reference to a missing `GeistPixel-Circle.woff2` file and removed Font Awesome markup that had no corresponding stylesheet/font in the deployed assets. Social links remain text-labelled; no remote icon/font service is requested.
