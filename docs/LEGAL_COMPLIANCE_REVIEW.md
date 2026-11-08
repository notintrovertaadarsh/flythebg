# FlyThe BG — legal and jurisdiction review

**Review date:** 8 November 2026  
**Status:** engineering/legal issue-spotting only; not a legal opinion or certification.

## Actual model reviewed

FlyThe BG is a free browser-based image/video utility project with optional external developer support. The source does not show flight search, travel booking, ticket sales, marketplace listings, paid tool access, on-site checkout, or a direct payment processor. The optional Buy Me a Coffee link sends the visitor to an independent payment provider. No affiliate tracking or advertising tag was found in the client source; an `ads.txt` seller declaration exists and needs owner verification.

## India

### Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025

The final DPDP Rules were notified on 13 November 2025 and have phased commencement. Under Rule 1, Rules 1, 2 and 17–21 commenced on publication; Rule 4 is scheduled one year after publication (13 November 2026); Rules 3, 5–16, 22 and 23 are scheduled 18 months after publication (13 May 2027). The principal operational duties are therefore not all in force on this audit date. The website should nevertheless prepare now and must not describe a checkbox as verifiable parental consent.

The DPDP (Removal of Difficulties) Order, 2026 was published on 5 October 2026. It clarifies the wording in section 9 concerning a child or a person with disability who has a lawful guardian. The current public Privacy Policy, Terms and all file-tool notices prohibit submitting identifiable children's images. The required checkbox is only a user declaration; it does not independently verify age, a parent/guardian or consent. No technical age/guardian verification system was found. Keep the prohibition in place until a lawful, verifiable parental-consent workflow is designed, implemented and independently reviewed; do not claim that the checkbox satisfies the DPDP verifiability requirement.

The site processes identifiable photos when a visitor deliberately submits them for background removal. The browser-local compression/photo layout flows may also handle personal data on the device. The operator should document the lawful purpose, notice, retention, provider roles, security controls and rights workflow as the phased obligations commence.

Official references:
- DPDP Rules 2025: https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf
- DPDP (Removal of Difficulties) Order 2026: https://www.meity.gov.in/static/uploads/2026/10/daf495a7b5798a3dfa72a944b51fc176.pdf

### Information Technology Act, 2000 and CERT-In Directions

The CERT-In Directions dated 28 April 2022 require specified categories of entities (including service providers, intermediaries, data centres, body corporates and government organisations) to report listed Annexure-I cyber incidents within six hours, designate a point of contact, and maintain ICT-system logs securely for a rolling 180 days within Indian jurisdiction. CERT-In's May 2022 FAQ says ordinary individual citizens are not covered, while the Directions apply to service providers/intermediaries and other listed categories as applicable. Whether this publicly operated tool makes its individual operator a service provider or intermediary, and which systems/logs the operator must control, requires Indian counsel's assessment. Cloudflare and other providers may have their own independent obligations; that does not automatically prove that the operator's own obligations are met.

The source currently has a short-lived in-memory rate-limit bucket; it is not a 180-day audit log. Cloudflare log retention/location and an incident-response process were not verified. The operator should confirm applicability, appoint/register a CERT-In point of contact if required, configure legally compliant log retention/location and document a six-hour escalation process for reportable incidents.

Official references: https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf and https://www.cert-in.org.in/PDF/FAQs_on_CyberSecurityDirections_May2022.pdf

### Consumer Protection Act, 2019 and E-Commerce Rules, 2020

The core tools are free, with no on-site sale, booking or checkout. The Consumer Protection (E-Commerce) Rules apply to goods/services bought or sold over digital networks and contain an exception for a natural person's personal-capacity activity that is not part of professional/commercial activity carried out regularly or systematically. The project is publicly operated and includes optional external support links; whether its activity is professional/commercial and whether any part of the Rules applies should be confirmed by Indian counsel. The Rules' natural-person exception is narrow: personal-capacity activity that is not part of professional or commercial activity carried out regularly or systematically. The website must not imply that FlyThe BG sells tickets, bookings or travel services.

Official Rules: https://consumeraffairs.gov.in/public/upload/files/E%20commerce%20rules_1732703966.pdf

### IT Rules / sensitive personal data

The tools handle photographs that may identify people. The current source does not provide biometric identification, face recognition, identity verification or a database of biometric templates. A photograph is not automatically the same as a regulated biometric identifier in every legal context. If the processor or a future feature creates or uses biometric identifiers or other sensitive personal data, review the IT Act/SPDI framework and any applicable successor law with Indian counsel.

## Copyright and trademarks

The Copyright Act, 1957 is relevant to original code, photographs, illustrations, films, video, music and other creative works. The Trade Marks Act, 1999 is relevant to brand names, logos and third-party marks. The repository's AGPL-3.0 source-code licence does not prove rights to separately hosted visual assets or third-party marks; the asset register records unresolved provenance. No trademark registry search or asset-by-asset licence-document verification has been completed.

## Other jurisdictions

- GDPR / UK GDPR: a public website being reachable from Europe is not by itself enough. Territorial scope can arise from an EU/UK establishment, intentionally offering goods/services to people there, or monitoring their behaviour. No EU-specific checkout, pricing, localisation or targeted marketing feature was found in the inspected source. The operator should reassess if the site deliberately targets or monitors EU/UK users.
- Cookie/ePrivacy rules: the analytics tag is held back until opt-in. The optional contact preference cookie and the analytics-choice localStorage entry have distinct purposes; whether a specific storage technology requires consent depends on the jurisdiction and its purpose. Do not claim every cookie requires consent everywhere.
- Other countries: no specific country targeting or country-specific service was identified in source. Review if advertising, localisation, paid sales or targeted marketing is added.

## Business and contact details requiring owner confirmation

- The public site currently identifies Aadarsh Maurya as the individual operator in About, Contact and Privacy copy. Confirm that this is the correct legal name and is intended for public display.
- No registered company status is claimed in current copy. No postal business address or GSTIN is published or verified; do not invent one.
- `support@flythebg.com` is present in source, but mailbox ownership, provider, monitoring and retention were not verified.
- `CONTACT_PHONE` is an optional Cloudflare runtime secret; the value is not in source. Confirm it is accurate and intended to be revealed publicly before setting it.
- No formal Data Protection Officer or statutory grievance officer appointment is claimed. Confirm whether a designated role is legally required for the actual operator/business status and jurisdiction.

## Open compliance risks

1. External processor temporary file/log retention and Cloudflare data/log settings are unknown.
2. No verifiable parental-consent/age-verification mechanism exists. The UI warning is not verification.
3. The operator has not confirmed mailbox retention, access controls or response procedures.
4. CERT-In scope, 180-day log retention, point-of-contact designation and incident reporting need counsel/provider confirmation.
5. Google Analytics retention and account settings need confirmation.
6. Existing logo, hero/portal/404 media and third-party attribution rights are not evidenced by licence documents in the repository.
7. WCAG 2.2 AA is an engineering target; no independent accessibility audit is stored.
