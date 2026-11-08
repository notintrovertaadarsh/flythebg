# FlyThe BG — visual asset and licence register

**Audit date:** 8 November 2026  
**Status:** source inventory only. No licence certificate or source invoice for the listed visual media was found in the inspected repository.

| Asset | Current source / delivery | Licence status |
|---|---|---|
| FlyThe BG logo | `assets/flythebg-logo.png`, copied to favicon | Local project asset. Copyright owner and source file history should be confirmed by the operator. |
| Homepage hero video | CloudFront object ending `4b73c700-3112-4c07-bd48-0af2893dff7c.mp4`, proxied as `/assets/flythebg-hero.mp4` | Origin/creator and licence not verified. |
| Homepage hero poster | CloudFront object ending `0bf7409c-9fa2-4bef-a49d-34903dcc91ad.png`, proxied as `/assets/flythebg-hero-poster.png` | Origin/creator and licence not verified. |
| Planet transition videos and Mercury image | CloudFront distribution `d2ol7oe51mr4n9d.cloudfront.net`; object IDs are declared in the legacy `wireSpaceExperience()` function in `src/app.ts` | The current rendered routes do not contain an `.experience` root, so this legacy function returns without loading these assets. They are dormant source references, not verified active network requests. Origin/creator and licence remain unverified if the experience is re-enabled. |
| Planet image | CloudFront object ending `d6fb8b6b-c15e-4aaa-9cf7-45bbb5e33372.jpg` | Origin/creator and licence not verified. |
| 404 background video | CloudFront distribution `d8j0ntlcm91z4.cloudfront.net`; object name begins `hf_20260713_` | Origin/creator and licence not verified. |
| MotionSites attribution | Footer links to https://motionsites.ai/ with “UI by” attribution | Confirm whether this attribution reflects a licence, template, commissioned design or other agreement and retain the relevant permission/terms. |
| Fonts | CSS uses local system-font declarations and a system monospace display fallback; no Google Fonts stylesheet or remote font request remains | A broken CSS reference to `/fonts/GeistPixel-Circle.woff2` was removed because that file was not present in the repository. System fonts are supplied by the visitor's operating system. No font binary is currently bundled by the deployment script. |
| Icons | Text-labelled social links and inline/CSS visual elements | Unloaded Font Awesome class markup was removed; no icon CDN or remote icon font import remains in the current page shell. |
| Maps / external embeds | No map embed or third-party iframe found in the inspected application source | Not applicable in current source. |

## Code licence versus visual assets

The repository includes the GNU Affero General Public License v3.0. That licence applies to the covered source code; it does not automatically prove that the logo, brand marks, CloudFront media, third-party trademarks or other visual assets are licensed under AGPL-3.0.

## Required owner evidence

For each visual asset, retain one of: original creation/source project, purchase receipt, licence text/version, permission email, or public-domain/CC licence evidence with attribution requirements. Confirm that the licence allows web publication, modification, caching/CDN delivery and redistribution. If permission cannot be established, replace the asset with original or properly licensed material before asserting that the site is fully rights-cleared.
