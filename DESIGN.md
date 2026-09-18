# DESIGN.md v2 — "Sky over the Gulf" (brand-true, extracted from the logo)

## Correction log (v1 → v2)
V1 invented "Dusk over the Emirates" (emerald/brass/clay). Client correctly rejected it:
the real logo is a navy→sky orbit-e mark with a navy geometric wordmark built for LIGHT
backgrounds. V2 tokens are sampled from the logo raster itself (PIL, 2026-09-09):
navy `#283B90` (27k px), sky `#53C9E0` (3.5k px), mid-blues `#49A3C8/#4FB5D3`.
No gold, no emerald, no clay anywhere. Header AND footer are light so the navy logo
reads at full contrast (verified by compositing both SVG variants).

## Art direction (one sentence)
A bright Gulf-morning editorial: icy paper, deep navy ink, the logo's own navy→sky
gradient as the single signature gesture, Montserrat headlines echoing the wordmark,
one cinematic moment per viewport.

## Anti-references
No dark header/footer (kills the logo), no purple/blue-tech gradients outside the brand
gradient, no Inter-only stack, no repeated photo within any listing page, no fake
ratings, no emoji icons.

## Tokens
--paper:#F3F8FC; --card:#FFFFFF; --ink:#1B2451; --body:#44506C; --muted:#68738F;
--navy:#283B90; --navy-deep:#1A245F; --sky:#53C9E0; --sky-soft:#DFF2FA; --sea:#0E7CA8;
--grad:linear-gradient(120deg,#283B90,#2F6FD0 58%,#45B4DC);
--font-display:"Montserrat"; --font-sans:"Figtree";
--dur-1:180ms; --dur-2:450ms; --dur-3:950ms; --ease:cubic-bezier(.22,1,.36,1);
--radius:20px; shadows navy-tinted.
Contrast: navy/white ≈9:1, body/paper ≈7:1, sea/white ≈4.9:1 (eyebrows min 12px bold).

## Type roles
Display Montserrat 700/800 (matches wordmark geometry — brand-justified, not default).
Body Figtree 400–800. Gradient headline accent (`.hl`) uses ONLY the brand gradient.

## Imagery rule (enforced in build)
74 Unsplash IDs, each HTTP-200 verified. No two photos repeat within any rendered page
(verified by script). Detail-page hero reuses its own hub card (consistency, not
duplication). 3 attractions without honest photography use gradient monogram tiles —
deliberate, disclosed. Every content img has truthful alt + dimensions + lazy
(hero eager).

## Motion (tokenized, reduced-motion safe)
Ken Burns restart per hero slide (6.5s autoplay, pause on hover/focus, swipe, dots,
arrows) · staggered reveals + left-variant · animated counters · testimonial slider
· veil page transition · magnetic buttons + shine · marquee (pause on hover).
Page-to-page navigation is intentionally instant/native (no transition overlay) per client feedback.
All collapse under prefers-reduced-motion.

## Components
Light-glass header (logo on white chip) · hero slider · trust grid · stats band ·
trip cards · dest mosaic · visa flag tiles (inline SVG, zero requests) · navy CTA band ·
desert chapter · testimonial slider (initial avatars, disclosed sample) ·
native-details FAQ · light footer with gradient CTA card · offer popup (25s +
exit-intent, 7-day suppression, ESC) · Sara chatbot (rule-based, WhatsApp handoff) ·
sticky mobile Call/WhatsApp bar · floating WhatsApp.
