# Deep Audit — eliteescapetourism.com (scraped 2026-09-09, homepage HTML + /holidays /visa-assitance /attractions /contact-us-2 /tour/japan-tour-package + robots + sitemap)

## Critical (fix before anything)
1. **Active malicious-looking injector in `<head>`** — obfuscated JS builds a full-screen white preloader (`#R2FvKSeqkPMZAnMV`), fingerprints Windows/UA, queries 8 Polygon RPCs with `eth_call` to `0xf5966808a9ECbdb8794F568922809C52b0Fd2446`, decodes an on-chain URL and loads `/get_script` with 3s→6s retries. Verdict: treat as compromise until proven otherwise; rebuild clean, rotate WP/hosting creds, remove unknown plugins. (Evidence: homepage HTML dump, `tool_0852553...` lines with `getServers`/`createDeferredScript`.)
2. **Zero core SEO tags** — `<title>` is bare "Elite Escape Tourism" (no keywords, no Dubai), and there is **no meta description, no OG/Twitter, no JSON-LD** in head. No SEO plugin output (no Yoast/RankMath). Result: Google invents snippets; zero rich results.
3. **Sitemap/robots mismatch** — robots advertises `/sitemap.xml`, WP serves `/wp-sitemap*.xml`. Crawlers forgive it, but it's sloppy and splits signals.

## Trust-killers (visible to customers)
4. **Typo URL `/visa-assitance/`** (missing "s") — in nav, footer, sitemap. Unprofessional + bakes the typo into backlinks.
5. **Copy-paste visa bugs** — Singapore, Indonesia, Georgia, Philippines, France cards all link `?text=...visa to the USA/France` incorrectly; France-flag images reused for 5 different countries.
6. **Catalogue typos** — "New Zeland", "Paris" as a country, "Grand Canyon" as a country, "4 Days 5 Nights" inverted, price renders "AED 4000 AED 5000 AED 4000 Per Person", "VIew All" capital-I typo.
7. **Blog rot** — "Top 5…" slug vs "Top 3…" H1, all posts dated July 15 2022 by `shafeyadmin`, all in "Adventure Tour", "View All Post" links to demo domain `turio-wp.egenslab.com`.
8. **Footer contradictions** — Quick Links ≡ Tour Type (identical), phone + email each printed twice, two office addresses (City Gate M-16 vs Damas Tower 305), two emails (`inquiries@` vs `info@`), hours "Mon–Fri 9–5" for a travel agency.
9. **Zero proof** — tour page says "No rating found", no Google/DTCM/IATA numbers, no real team, no FAQ schema.

## Performance / UX / a11y
10. **30+ blocking CSS/JS** — Elementor + ElementorKit + Essential Addons + WooCommerce + CF7 + Instagram/Twitter/YouTube feeds + jQuery all load on every page. No WebP, `a-39.jpg`-style filenames, alt texts like "a (39)"/"image"/"Untitled-design".
11. **Hotlinked demo assets** — Paris image + breadcrumb BG load from `turio-wp.egenslab.com` (leak + LCP risk + can 404).
12. **Dead CTAs** — both hero "Explore Now" point to `#`; search Duration is a free-text input; date icon is a `capslock` glyph; hamburger is `javascript:void(0)`; social icons are empty `<a>` with no label.
13. **Invalid CSS shipped** — `overflow-x: ;` empty declaration; swiper forced `width:100%!important` hack.
14. **Two H1s in hero slider**, thin content (6 packages / 7 destinations), no internal linking strategy — cannot rank beyond brand.

## What the rebuild does about each
- Clean static build, zero WP/plugins/jQuery, no injector surface. → #1, #10
- Unique title + 150–160ch description + canonical + OG/Twitter + JSON-LD (TravelAgency/TouristTrip/FAQ/Breadcrumb) on all 227 URLs; correct `/sitemap.xml` + `/robots.txt`. → #2, #3
- Correct slug `/visa/*`, per-country WhatsApp text, real flag photography. → #4, #5
- Spell-checked catalogue, single price truth (`<s>was</s> price`), honest "starting-from" labels. → #6
- No fake blog; 100 guides library with unique titles instead of 3 rotten posts. → #7
- One address, one email (`info@`), one phone, single nav, disclosed hours. → #8
- No invented ratings; WhatsApp-first booking stated honestly; NEEDS INPUT list in PRODUCT.md. → #9
- Inline critical CSS, system + 2 Google fonts with swap, lazy images with dimensions, 1 H1/page, native `<details>` FAQs, skip link, focus-visible, reduced-motion. → #11–14
