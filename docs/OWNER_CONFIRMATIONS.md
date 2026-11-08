# FlyThe BG — owner confirmations required before compliance sign-off

This file is an internal implementation checklist, not a public contact page. Do not copy any placeholder or unverified value into the website.

## Identity and contact

- [ ] Confirm the legal operator's full name and whether it is intended for public display. A name supplied in earlier project discussions must not be published until the owner confirms it is correct for FlyThe BG.
- [ ] Confirm a monitored email address for privacy requests, grievances, customer support, security reports and accessibility feedback. Confirm mailbox ownership, provider, who can access it, backup/retention settings and response monitoring.
- [ ] Confirm whether a postal business address must be published for the actual operator and jurisdictions served.
- [ ] Confirm whether the operator is an individual, sole proprietor, partnership, company or other registered entity. Publish GSTIN or other registration details only if applicable and verified.
- [ ] Determine whether a statutory grievance officer, Data Protection Officer or other designated representative is required for the actual business status and processing.
- [ ] No public telephone number is intended in the current implementation. Remove the obsolete `CONTACT_PHONE` Cloudflare secret if it remains configured; the current code does not read it.

## Privacy request and security reporting

- [ ] Provide a monitored recipient address before treating `/data-requests` as an operational privacy-rights channel. The current page prepares a local copyable draft only; it does not deliver or store a request.
- [ ] Provide a monitored security-reporting channel before publishing an RFC 9116 `security.txt`. The file is intentionally not published while no verified Contact value exists.
- [ ] Confirm a response workflow and target handling times for access, correction, erasure, consent withdrawal, grievances, security reports and accessibility issues.
- [ ] Decide whether to add a backend request-delivery system. If so, select a provider, keep credentials in runtime secrets, implement access controls and retention/deletion rules, and update the privacy notice before launch.

## Business model and external services

- [ ] Confirm the Buy Me a Coffee destination is the intended public optional-support provider and that its account identity is appropriate for public display. FlyThe BG itself does not process those contributions.
- [ ] Confirm the Google publisher declaration in `ads.txt` remains authorised and intended. No on-site advertising SDK was found in source.
- [ ] Confirm there are no undisclosed affiliate, sponsorship, advertising or paid referral arrangements outside the repository.
- [ ] Verify Hugging Face/Gradio temporary file cleanup, operational logs, retention, data location and processor terms.
- [ ] Verify Cloudflare Workers/edge/security logs, data location, access controls, bot-management settings and any security cookies such as `__cf_bm` or `cf_clearance`.
- [ ] Verify Google Analytics property retention, data-sharing settings, region configuration and consent implementation.
- [ ] Verify CloudFront cache/access-log settings and asset distribution ownership.

## Intellectual property and accessibility

- [ ] Provide licence/ownership evidence for every CloudFront-hosted video, poster, image, logo and third-party visual asset. The current asset register records unresolved provenance.
- [ ] Confirm all brand marks, logos, fonts and icons are owned or licensed for the site's actual use.
- [ ] Arrange manual WCAG 2.2 AA testing at 200% zoom, on mobile layouts, keyboard-only and with at least one screen reader. Current build checks are limited smoke tests, not an audit.
- [ ] Confirm whether the project operator/service falls within applicable Indian RPwD Act/Rules obligations and any other jurisdiction-specific accessibility requirements.

## Legal and regulatory scope

- [ ] Have Indian counsel confirm DPDP Act/Rules applicability and the staged commencement dates against the actual operator and processing activities.
- [ ] Have counsel assess CERT-In Directions scope, incident reporting and log-retention obligations for the actual operator category.
- [ ] Confirm whether the Consumer Protection Act and E-Commerce Rules apply to the project's free tools and external optional-support links.
- [ ] Review other jurisdictions only where the site targets or serves users or the business has a relevant legal connection.
- [ ] Review the privacy, terms, cookie and security notices after every material provider, analytics, advertising, payment or data-flow change.

## Current implementation decisions

- No user accounts, authentication, login or persistent media gallery.
- No visitor phone-number collection and no public operator phone display.
- No verified public operator name, support/grievance email or postal address is currently asserted in the public legal pages.
- No direct checkout, paid tool access or FlyThe BG refund-policy page. Optional contributions are processed by an external provider.
- No security.txt is published until a verified security reporting contact exists.
- The privacy request page is explicitly a local draft only until a verified recipient is configured.
