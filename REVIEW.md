# REVIEW.md — full-file audit, 2026-09-09 (reviewer: code-reviewer + security-review + seo-audit lenses)

Scope: all 679 HTML pages (generated from scripts/build.mjs + hand-written index.html),
assets/css/main.css, assets/js/main.js, scripts/build.mjs, sitemap.xml, robots.txt,
manifest.webmanifest, search-index.json, brand SVGs. Generated pages inherit from
sources, so sources were read in full; all 679 outputs were machine-checked
(links, ids, alt, JSON-LD parse, headings, titles, descriptions, clip ids, images).

## Findings FIXED in this pass

| # | Severity | File(s) | Defect | Fix |
|---|----------|---------|--------|-----|
| 1 | Critical | main.css:74 | Stray `}` ended `.hero` rule early — lost navy bg, overflow clip, rounded corners | Removed brace, added overflow fallbacks |
| 2 | Critical | main.css:329 | Missing `@media(prefers-reduced-motion:reduce){` opener — animation-kill rules applied GLOBALLY (dead reveals/sliders/marquee) | Restored media wrapper |
| 3 | High | build.mjs:485 | Tour posts linked `/guides/best-time-to-visit-X-from-dubai.html` (404, 11+ refs) | Corrected to existing slug |
| 4 | High | build.mjs:265 | `.slice(0,100)` dropped 18 guides incl. all 6 UAE guides while pages linked them | Removed slice (118 guides) |
| 5 | High | build.mjs (cost posts) | 18 refs to `/tours/` (no index) | Pointed to `/holidays.html` |
| 6 | High | schema | WebSite SearchAction advertised `/search/?q=` with no such page | Built real `/search/` + search-index.json (648 docs) |
| 7 | Medium | all pages | h1→h3 skips (hubs/blog had no h2); footer h4 after h2s | Added section h2s; footer h4→h2.fhead |
| 8 | Medium | main.css | muted 4.43:1 + sea 4.4:1 fail AA; stars 2.03:1 | muted #5D6884 (5.2), sea #0B6E95 (5.34), stars #B87A0E (~3.3 non-text) |
| 9 | Medium | main.js/nav | Mobile menu unclosable (no close control; burger under overlay; off-canvas links keyboard-focusable) | nav-close button, visibility toggle, ESC handling |
| 10 | Medium | modals | No focus trap (Tab escapes behind dialog) | Trap added for both modals |
| 11 | Medium | main.js:150 | `$(location.hash)` throws on malformed hash | try/catch guard |
| 12 | Medium | no-JS | `.rv` content invisible forever without JS | noscript fallback site-wide |
| 13 | Medium | flags | Duplicate clipPath ids where countries share flags | Unique ids per slug |
| 14 | Low | SEO | No og:image on generated pages; no twitter:site; no sitemap lastmod; no FAQ LD on home; BlogPosting lacked dateModified | All added |
| 15 | Low | PWA | Manifest SVG-only; no apple-touch icon | PNG 192/512 generated; solid-bg apple icon |
| 16 | Low | main.js | Duplicate "canada" in chatbot list | Removed |
| 17 | Low | CSS | Dead `.code-badge`, `.post-meta`; `align-items:end` compat | Removed/standardised |
| 18 | Low | index/build | Footer licence line + Search link inconsistent/missing | Aligned everywhere |
| 19 | Low | CSS | Gradient-text invisible if background-clip unsupported | @supports fallback |
| 20 | Low | index desc | 177 chars (truncates) | Trimmed to 139 |

## Verified CLEAN (with evidence)
- 0 broken internal refs (24k+ checked) · 0 duplicate ids · 0 missing alt · 0 invalid JSON-LD ·
  0 heading skips · 660+ unique titles/descriptions · all 54 Unsplash IDs HTTP-200 ·
  49 flags visually inspected via rendered contact sheet (3 redrawn) · all tap targets ≥44px ·
  no secrets/keys · no inline handlers · no eval · all _blank have noopener · chatbot XSS-safe.

## Accepted limitations (not defects)
- Testimonials are labeled samples, not verified reviews (no fabrication).
- Blog/guides use template-assisted prose with per-page unique facts (~600-770 words/page).
- No real booking engine or payments — WhatsApp-first is stated honestly.
- Still needed from client: DTCM/trade-licence numbers, Google rating, licensed photography.
