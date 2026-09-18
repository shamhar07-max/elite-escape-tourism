import { mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://eliteescapetourism.com";
const WA = "https://wa.me/971555753133";
const CSS = "/assets/css/main.css", JS = "/assets/js/main.js";
const U = (id, w) => `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
const HEROIMG = (id, alt, w = 1800, h = 1000, eager = false) => `<img src="${U(id, 1400)}" srcset="${U(id, 800)} 800w, ${U(id, 1400)} 1400w, ${U(id, 1800)} 1800w" sizes="100vw" alt="${alt}" width="${w}" height="${h}"${eager ? ` fetchpriority="high"` : ` loading="lazy"`} decoding="async">`;

/* ---------- shared chrome (LIGHT, logo-first) ---------- */
const head = (t, d, path, extra = "", img = "") => `<!doctype html>
<html lang="en-AE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t}</title><meta name="description" content="${d}">
<link rel="canonical" href="${SITE}${path}"><meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#283B90"><meta property="og:type" content="website">
<meta property="og:site_name" content="Elite Escape Tourism"><meta property="og:title" content="${t}">
<meta property="og:description" content="${d}"><meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${img || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop"}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@EliteEscapeTour">
<link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg">
<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${CSS}">${extra}</head>`;
const NOSCRIPT = `<noscript><style>.rv,.rv-l{opacity:1!important;transform:none!important}.hero-slide:first-child{opacity:1!important}</style></noscript>`;
const header = (cur) => `<body class="grain">${NOSCRIPT}<a class="skip" href="#main">Skip to content</a>
<header class="site-head" id="head"><div class="wrap bar">
<a class="brand" href="/" aria-label="Elite Escape Tourism — home"><img src="/assets/brand/logo-header.svg" alt="Elite Escape Tourism LLC logo" width="252" height="84"></a>
<nav class="nav" id="nav" aria-label="Primary"><button class="nav-close" aria-label="Close menu">✕</button>
<a href="/"${cur === "/" ? ' aria-current="page"' : ""}>Home</a><a href="/holidays.html"${cur.startsWith("/holidays") || cur.startsWith("/tours") || cur.startsWith("/destinations") ? ' aria-current="page"' : ""}>Holidays</a><a href="/visa.html"${cur.startsWith("/visa") ? ' aria-current="page"' : ""}>Visas</a><a href="/attractions.html"${cur.startsWith("/attractions") ? ' aria-current="page"' : ""}>UAE Icons</a><a href="/seasonal.html"${cur.startsWith("/seasonal") ? ' aria-current="page"' : ""}>Seasons</a><a href="/blog/"${cur.startsWith("/blog") ? ' aria-current="page"' : ""}>Journal</a><a href="/about.html"${cur === "/about.html" ? ' aria-current="page"' : ""}>Maison</a><a href="/contact.html"${cur === "/contact.html" ? ' aria-current="page"' : ""}>Contact</a></nav>
<div class="head-cta"><a class="tel" href="tel:+971555753133">+971 55 575 3133</a><a class="btn btn-primary btn-sm" href="${WA}?text=Hello%20Elite%20Escape" target="_blank" rel="noopener">Plan my trip <span class="arr">→</span></a><button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button></div></div></header><main id="main">`;
const CBMODAL = `
<div class="popup-back" id="cbBack" role="dialog" aria-modal="true" aria-labelledby="cbTitle"><div class="popup"><button class="pop-close" data-cb-close aria-label="Close callback form">✕</button><div class="pop-bd"><span class="pop-tag">Free callback</span><h2 id="cbTitle">We call you back in 30 minutes.</h2><p class="muted">Working hours Mon–Fri 9:00–17:00; after-hours requests answered next morning.</p><form id="cbForm"><div class="field"><label for="cb-name">Name</label><input id="cb-name" name="name" required placeholder="Your name" autocomplete="name"></div><div class="field"><label for="cb-phone">Phone / WhatsApp</label><input id="cb-phone" name="phone" required placeholder="+971 …" inputmode="tel" autocomplete="tel"></div><div class="field"><label for="cb-topic">Topic</label><select id="cb-topic" name="topic"><option>Holiday package</option><option>Visa assistance</option><option>Desert safari / attraction</option><option>Something else</option></select></div><button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Request callback <span class="arr">→</span></button></form><p class="muted" style="font-size:12.5px;margin:12px 0 0">Submitting opens WhatsApp with your request prefilled — nothing is stored on this website.</p></div></div></div>`;
const components = `
<div class="sticky-cta" id="sticky" style="transform:translateY(140%)"><a class="c-call" href="tel:+971555753133">Call now</a><a class="c-wa" href="${WA}?text=Hello%20Elite%20Escape" target="_blank" rel="noopener">WhatsApp</a></div>
<div class="popup-back" id="offerBack" role="dialog" aria-modal="true" aria-labelledby="offerTitle"><div class="popup"><button class="pop-close" data-pop-close aria-label="Close offer">✕</button><div class="pop-img" role="img" aria-label="Airplane wing over clouds at golden hour"></div><div class="pop-bd"><span class="pop-tag">Limited seasonal offer</span><h2 id="offerTitle">Free visa file review + AED 200 off Japan.</h2><p class="muted">Book any signature holiday this month and our visa desk reviews your file free. Mention code <b>ESCAPE200</b>.</p><div class="pop-actions"><a class="btn btn-primary" href="${WA}?text=ESCAPE200%20—%20I%20want%20the%20offer" target="_blank" rel="noopener">Claim on WhatsApp <span class="arr">→</span></a><button class="btn btn-outline" data-pop-close>Maybe later</button></div></div></div></div>
<button class="chat-fab" id="chatFab" aria-expanded="false" aria-controls="chatPanel"><span class="dot-av">S</span>Sara · concierge</button>
<span class="chat-nudge" id="chatNudge">Need help picking a trip? Ask Sara →</span>
<div class="chat-panel" id="chatPanel" role="dialog" aria-modal="false" aria-label="Sara, Elite Escape concierge chat"><div class="chat-head"><span class="dot-av">S</span><div><b>Sara · concierge</b><small>Replies instantly · human on WhatsApp</small></div><button id="chatClose" aria-label="Close chat">✕</button></div><div class="chat-body" id="chatBody" aria-live="polite"><div class="msg bot">Hello and welcome to <b>Elite Escape</b>! I can help with <b>holidays</b>, <b>visas</b> or <b>desert safari</b>. What's on your mind?</div></div><div class="chat-chips"><button>Japan price</button><button>Visa for France</button><button>Desert safari</button><button data-callback>Call me back</button><button>Talk to human</button></div><form class="chat-input" id="chatForm"><input id="chatInput" type="text" placeholder="Type your question…" aria-label="Type your question" autocomplete="off"><button type="submit" aria-label="Send message">→</button></form></div>`;
const footer = `</main><footer><div class="wrap"><div class="foot-cta"><div><h2>Your escape starts with one message.</h2><p>Dates + travellers + dream. We'll reply with a plan and a fixed price.</p></div><div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-white" href="${WA}?text=Hello%20Elite%20Escape%2C%20plan%20my%20trip" target="_blank" rel="noopener">WhatsApp us <span class="arr">→</span></a><button class="btn btn-glass" data-callback>Request callback</button></div></div>
<div class="foot-grid"><div><img src="/assets/brand/logo-footer.svg" class="foot-logo" alt="Elite Escape Tourism LLC logo" width="200" height="67" loading="lazy"><p style="max-width:38ch">Dubai's boutique travel house — holidays, worldwide visas and UAE icons.</p><p><a href="tel:+971555753133">+971 55 575 3133</a> · <a href="mailto:info@eliteescapetourism.com">info@eliteescapetourism.com</a><br>City Gate Building, Hashtag Business Center, M Floor, Office 16, Dubai, UAE<br><span class="muted">Mon–Fri 9:00–17:00 · WhatsApp 7 days</span></p></div><nav aria-label="Explore"><h2 class="fhead">Explore</h2><ul><li><a href="/holidays.html">Holidays</a></li><li><a href="/visa.html">Visa assistance</a></li><li><a href="/attractions.html">UAE attractions</a></li><li><a href="/seasonal.html">Seasonal tours</a></li><li><a href="/guides/">Travel guides</a></li><li><a href="/blog/">Journal</a></li><li><a href="/search/">Search</a></li></ul></nav><nav aria-label="Top routes"><h2 class="fhead">Top routes</h2><ul><li><a href="/tours/japan-7-day-essential.html">Japan 7-day</a></li><li><a href="/tours/georgia-armenia-7-day.html">Georgia &amp; Armenia</a></li><li><a href="/tours/bali-5-day.html">Bali 5-day</a></li><li><a href="/visa/usa-from-uae.html">USA visa</a></li><li><a href="/visa/schengen-france-from-uae.html">Schengen visa</a></li></ul></nav><nav aria-label="Maison"><h2 class="fhead">Maison</h2><ul><li><a href="/about.html">About</a></li><li><a href="/contact.html">Contact</a></li></ul></nav></div></div><div class="wrap foot-bottom"><span>© <span data-year>2026</span> Elite Escape Tourism LLC. Licensed Dubai travel agency — licence details available at our office and on request.</span><span><a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></span></div></footer>
<a class="whats" href="${WA}?text=Hello%20Elite%20Escape" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/></svg></a>${components}${CBMODAL}<script src="${JS}" defer></script></body></html>`;
const page = (t, d, path, body, extra = "", img = "") => head(t, d, path, extra, img) + header(path) + body + footer;
const out = (p, html) => { const f = join(root, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
const crumb = (items) => `<p class="breadcrumb">${items.map((x, i) => i < items.length - 1 ? `<a href="${x[1]}">${x[0]}</a> › ` : x[0]).join("")}</p>`;
const faqJson = (faqs) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })) })}</script>`;
const faqsHtml = (faqs) => `<div class="faq">${faqs.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
const heroBand = (kicker, h1, lede, imgUrl, alt, cta = "") => { const hid = (imgUrl.match(/photo-([\w-]+)/) || [])[1] || ""; return `<section class="hero" style="min-height:64svh"><div class="hero-slides"><div class="hero-slide on">${HEROIMG(hid, alt, 1800, 1000)}</div></div><div class="wrap hero-inner" style="padding:150px 0 52px"><p class="hero-kicker"><i></i>${kicker}</p><h1>${h1}</h1><p class="hero-sub">${lede}</p><div class="hero-actions">${cta}</div></div></section>`;};
const bandHead = (kicker, h1, lede, cta = "") => `<section class="band sec" style="margin-top:86px"><div class="wrap"><p class="eyebrow" style="color:#9BDCF5">${kicker}</p><h1 style="color:#fff">${h1}</h1><p class="lede">${lede}</p><div class="hero-actions">${cta}</div></div></section>`;

/* ---------- DATA (all Unsplash IDs HEAD-verified 200) ---------- */
const destinations = [
  ["japan", "Japan", "temples, bullet trains and quiet thunder", "Tokyo, Kyoto, Nara, Osaka, Mt Fuji", "1545569341-9eb8b30979d9", "Pagoda and Mount Fuji at dawn"],
  ["georgia", "Georgia", "Caucasus peaks, wine and stone towers", "Tbilisi, Kazbegi, Batumi", "1506905925346-21bda4d32df4", "Snow-capped high peaks above the valley"],
  ["armenia", "Armenia", "monasteries, Sevan and Yerevan nights", "Yerevan, Sevan, Dilijan", "1464822759023-fed622ff2c3b", "Layered mountain ranges at golden light"],
  ["france", "France", "Paris golden hour and Riviera light", "Paris, Nice, Lyon", "1502602898657-3e91760cbb34", "Eiffel Tower over Paris rooftops"],
  ["uk", "United Kingdom", "London ritual, fog and theatre", "London, Edinburgh, Bath", "1513635269975-59663e0ac1ad", "Tower Bridge in London at blue hour"],
  ["russia", "Russia", "Moscow gold and St Petersburg canals", "Moscow, St Petersburg", "1513326738677-b964603b136d", "Historic domes and spires at dusk"],
  ["bali", "Bali", "the slow tide: temples, surf, jungle", "Ubud, Uluwatu, Nusa Penida", "1537996194471-e657df975ab4", "Cliff temple over the ocean in Bali"],
  ["italy", "Italy", "Rome, Amalfi and slow dinners", "Rome, Venice, Amalfi", "1552832230-c0197dd311b5", "The Colosseum in warm afternoon light"],
  ["spain", "Spain", "tapas, Gaudi and Andalusian sun", "Barcelona, Madrid, Seville", "1539037116277-4db20889f2d4", "Mosaic terraces of Park Guell, Barcelona"],
  ["switzerland", "Switzerland", "peaks, lakes and rail journeys", "Zurich, Interlaken, Zermatt", "1531366936337-7c912a4589a7", "High alpine valley at first light"],
  ["maldives", "Maldives", "barefoot luxury over glass water", "Male, Baa Atoll", "1514282401047-d79a71a590e8", "Turquoise atoll from above"],
  ["thailand", "Thailand", "islands, street food and temples", "Bangkok, Phuket, Krabi", "1528181304800-259b08848526", "Limestone islands across turquoise water"],
  ["malaysia", "Malaysia", "rainforest city and island calm", "Kuala Lumpur, Langkawi", "1596422846543-75c6fc197f07", "Kuala Lumpur city lights at dusk"],
  ["singapore", "Singapore", "garden city in a weekend", "Marina Bay, Sentosa", "1525625293386-3f8f99389edd", "Marina Bay skyline over the water"],
  ["turkey", "Turkey", "Istanbul layers and Cappadocia skies", "Istanbul, Cappadocia", "1524231757912-21f4fe3a7200", "Old-city waterfront and minarets at dusk"],
  ["azerbaijan", "Azerbaijan", "Baku towers and green highlands", "Baku, Gabala", "1454496522488-7a8e488e8606", "Green highlands under drifting mist"],
  ["greece", "Greece", "white villages over blue", "Athens, Santorini", "1533105079780-92b9be482077", "Whitewashed lanes above the Aegean"],
  ["uae", "United Arab Emirates", "desert cinema and future icons", "Dubai, Abu Dhabi, Sharjah", "1512453979798-5ea266f8880c", "Dubai Marina skyline glowing at dusk"]];
const tours = [
  ["japan-7-day-essential", "Japan 7-Day Essential", "japan", "7 days · 6 nights", "AED 4,000", "AED 5,000", "Tokyo → Fuji → Kyoto → Nara → Osaka with bullet trains and a tea-house morning.", "1493976040374-85c8e12f0c0e", "Vermilion torii gate tunnel in Kyoto"],
  ["japan-10-day-honeymoon", "Japan 10-Day Honeymoon", "japan", "10 days · 9 nights", "AED 6,800", "AED 7,900", "Private ryokan night, Kyoto kimono shoot, Osaka food crawl.", "1528360983277-13d401cdc186", "Spring colours in Japan"],
  ["georgia-armenia-7-day", "Georgia & Armenia 7-Day", "georgia", "7 days · 6 nights", "AED 2,000", "AED 2,500", "Tbilisi, Kazbegi, Yerevan, Sevan — the best value escape from Dubai.", "1563746098251-d35aef196e83", "Stone church beneath high Caucasus peaks"],
  ["georgia-5-day-highlands", "Georgia Highlands 5-Day", "georgia", "5 days · 4 nights", "AED 1,650", "AED 2,100", "Kazbegi, Gudauri and Kakheti wine cellars.", "1454496522488-7a8e488e8606", "Misty highland ridges of the Greater Caucasus"],
  ["bali-5-day", "Bali 5-Day Slow Tide", "bali", "5 days · 4 nights", "AED 1,299", "AED 1,800", "Uluwatu, Ubud, Nusa Penida sail. Honeymoon-ready.", "1512100356356-de1b84283e18", "Temple gate framing a volcano sunrise"],
  ["bali-7-day-family", "Bali 7-Day Family", "bali", "7 days · 6 nights", "AED 1,999", "AED 2,600", "Beach club, safari park, rice-terrace breakfast.", "1555400038-63f5ba517a47", "Water temple on a misty lake"],
  ["uk-6-day-london-edinburgh", "UK 6-Day London & Edinburgh", "uk", "6 days · 5 nights", "AED 4,100", "AED 5,000", "West End night, Bath day trip, Edinburgh Castle.", "1529655683826-aba9b3e77383", "Big Ben and Westminster"],
  ["uk-8-day-britain", "Britain 8-Day Grand", "uk", "8 days · 7 nights", "AED 5,400", "AED 6,400", "London, Cotswolds, York, Edinburgh rail line.", "1533929736458-ca588d08c8be", "Classic London street"],
  ["france-6-day-paris-riviera", "Paris & Riviera 6-Day", "france", "6 days · 5 nights", "AED 5,000", "AED 6,000", "Louvre morning, Seine dusk, Nice day rail.", "1499856871958-5b9627545d1a", "The Louvre pyramid courtyard"],
  ["france-4-day-paris", "Paris 4-Day Golden Hour", "france", "4 days · 3 nights", "AED 3,400", "AED 4,200", "Icons without rush: Eiffel, Montmartre, Versailles.", "1431274172761-fca41d930114", "Eiffel Tower from a Parisian street"],
  ["russia-5-day-moscow-petersburg", "Russia 5-Day Two Capitals", "russia", "5 days · 4 nights", "AED 2,400", "AED 3,000", "Red Square, Hermitage, canal cruise.", "1547448415-e9f5b28e570d", "Gilded historic facades along a canal"],
  ["armenia-4-day", "Armenia 4-Day Monasteries", "armenia", "4 days · 3 nights", "AED 1,450", "AED 1,900", "Yerevan, Garni, Geghard, Sevan.", "1470071459604-3b5ec3a7fe05", "Rolling green highlands in morning mist"],
  ["italy-7-day", "Italy 7-Day Classic", "italy", "7 days · 6 nights", "AED 4,900", "AED 5,800", "Rome, Florence, Venice by fast rail.", "1516483638261-f4dbaf036963", "Colourful harbour village of Manarola"],
  ["spain-6-day", "Spain 6-Day Sun", "spain", "6 days · 5 nights", "AED 3,900", "AED 4,700", "Barcelona, Seville, Madrid tapas route.", "1507525428034-b723cf961d3e", "Golden Mediterranean beach"],
  ["switzerland-6-day", "Switzerland 6-Day Rails", "switzerland", "6 days · 5 nights", "AED 5,900", "AED 6,900", "Glacier Express section, Jungfrau, Lucerne.", "1501785888041-af3ef285b470", "Canoe on a still alpine lake"],
  ["maldives-4-day", "Maldives 4-Day Barefoot", "maldives", "4 days · 3 nights", "AED 4,400", "AED 5,500", "Seaplane arrival, sandbank picnic, reef snorkel.", "1573843981267-be1999ff37cd", "Powder-white sandbank in a blue lagoon"],
  ["thailand-6-day", "Thailand 6-Day Islands", "thailand", "6 days · 5 nights", "AED 2,200", "AED 2,900", "Bangkok temples + Krabi longtail days.", "1552465011-b4e21bf6e79a", "Longtail boats at limestone cliffs"],
  ["malaysia-5-day", "Malaysia 5-Day City & Isle", "malaysia", "5 days · 4 nights", "AED 1,899", "AED 2,400", "KL towers + Langkawi cable car.", "1596422846543-75c6fc197f07", "Kuala Lumpur city lights at dusk"],
  ["singapore-4-day", "Singapore 4-Day Garden City", "singapore", "4 days · 3 nights", "AED 2,300", "AED 2,900", "Marina Bay, Sentosa, hawker crawl.", "1525625293386-3f8f99389edd", "Marina Bay skyline over the water"],
  ["turkey-7-day", "Turkey 7-Day Two Worlds", "turkey", "7 days · 6 nights", "AED 2,900", "AED 3,600", "Istanbul + Cappadocia skies.", "1524231757912-21f4fe3a7200", "Old-city waterfront and minarets at dusk"],
  ["azerbaijan-4-day", "Azerbaijan 4-Day Baku", "azerbaijan", "4 days · 3 nights", "AED 1,399", "AED 1,800", "Old city, flame towers, Gabala day.", "1441974231531-c6227db76b6e", "Forested mountain road to Gabala"],
  ["greece-7-day", "Greece 7-Day Blue & White", "greece", "7 days · 6 nights", "AED 4,600", "AED 5,400", "Athens + Santorini caldera nights.", "1570077188670-e3a8d69ac5ff", "Blue domes over the caldera"],
  ["uae-3-day-icons", "UAE 3-Day Icons + Safari", "uae", "3 days · 2 nights", "AED 1,100", "AED 1,500", "Burj Khalifa, Museum of the Future, desert safari.", "1518684079-3c830dcef090", "Camel caravan crossing desert dunes"],
  ["uae-5-day-grand", "UAE 5-Day Grand Emirates", "uae", "5 days · 4 nights", "AED 1,950", "AED 2,500", "Dubai + Abu Dhabi icons with dhow night.", "1512453979798-5ea266f8880c", "Dubai Marina skyline glowing at dusk"]];
const visaCountries = ["usa", "uk", "canada", "australia", "china", "japan", "schengen-france", "schengen-italy", "schengen-spain", "schengen-germany", "schengen-netherlands", "schengen-greece", "ireland", "russia", "georgia", "armenia", "azerbaijan", "turkey", "thailand", "malaysia", "singapore", "indonesia", "philippines", "india", "sri-lanka", "egypt", "morocco", "kenya", "south-africa", "new-zealand", "south-korea", "taiwan", "vietnam", "cambodia", "nepal", "uzbekistan", "kazakhstan", "saudi", "oman", "qatar", "kuwait", "bahrain", "jordan", "lebanon", "france", "italy", "spain", "germany", "portugal"];
const codeOf = (c) => ({ usa: "US", uk: "UK", canada: "CA", australia: "AU", china: "CN", japan: "JP", ireland: "IE", russia: "RU", georgia: "GE", armenia: "AM", azerbaijan: "AZ", turkey: "TR", thailand: "TH", malaysia: "MY", singapore: "SG", indonesia: "ID", philippines: "PH", india: "IN", egypt: "EG", morocco: "MA", kenya: "KE", nepal: "NP", uzbekistan: "UZ", kazakhstan: "KZ", saudi: "SA", oman: "OM", qatar: "QA", kuwait: "KW", bahrain: "BH", jordan: "JO", lebanon: "LB", france: "FR", italy: "IT", spain: "ES", germany: "DE", portugal: "PT", taiwan: "TW", vietnam: "VN", cambodia: "KH" }[c] || c.slice(0, 2).toUpperCase());
/* ---------- cinematic inline-SVG flags (zero external requests) ---------- */
const starPts = (cx, cy, R, r, n = 5, rot = -90) => {
  let p = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r, a = (rot + i * 180 / n) * Math.PI / 180;
    p.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return p.join(" ");
};
const STAR = (cx, cy, R, fill, n = 5) => `<polygon points="${starPts(cx, cy, R, R * 0.42, n)}" fill="${fill}"/>`;
const H3 = (a, b, c) => `<rect width="60" height="13.4" y="0" fill="${a}"/><rect width="60" height="13.4" y="13.3" fill="${b}"/><rect width="60" height="13.4" y="26.6" fill="${c}"/>`;
const V3 = (a, b, c) => `<rect width="20" height="40" x="0" fill="${a}"/><rect width="20" height="40" x="20" fill="${b}"/><rect width="20" height="40" x="40" fill="${c}"/>`;
const MINI_UK = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#012169"/><path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="#fff" stroke-width="${(h * 0.22).toFixed(1)}"/><rect x="${x + w * 0.4}" y="${y}" width="${w * 0.2}" height="${h}" fill="#fff"/><rect x="${x}" y="${y + h * 0.4}" width="${w}" height="${h * 0.2}" fill="#fff"/><rect x="${x + w * 0.44}" y="${y}" width="${w * 0.12}" height="${h}" fill="#C8102E"/><rect x="${x}" y="${y + h * 0.44}" width="${w}" height="${h * 0.12}" fill="#C8102E"/></g>`;
const FLAG_ART = {
  us: (() => { let s = ""; for (let i = 0; i < 13; i++) s += `<rect width="60" height="3.1" y="${(i * 3.08).toFixed(1)}" fill="${i % 2 ? "#fff" : "#B31942"}"/>`; let st = ""; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) st += `<circle cx="${3 + c * 4.4}" cy="${3.4 + r * 4.4}" r="1.1" fill="#fff"/>`; return `${s}<rect width="26" height="21.5" fill="#0A3161"/>${st}`; })(),
  gb: `<rect width="60" height="40" fill="#012169"/><path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" stroke-width="2.6"/><rect x="24" width="12" height="40" fill="#fff"/><rect y="14" width="60" height="12" fill="#fff"/><rect x="26.5" width="7" height="40" fill="#C8102E"/><rect y="16.5" width="60" height="7" fill="#C8102E"/>`,
  ca: `<rect width="15" height="40" fill="#FF0000"/><rect x="15" width="30" height="40" fill="#fff"/><rect x="45" width="15" height="40" fill="#FF0000"/><polygon points="30,7 31.5,11 34,10 33,13.5 36.5,13 34.5,16 37,18 33.5,18.5 34,23 31,21 31,32 29,32 29,21 26,23 26.5,18.5 23,18 25.5,16 23.5,13 27,13.5 26,10 28.5,11" fill="#FF0000"/><rect x="29.2" y="31" width="1.6" height="3.5" fill="#FF0000"/>`,
  au: `<rect width="60" height="40" fill="#00247D"/>${MINI_UK(0, 0, 30, 20)}${STAR(15, 30, 4, "#fff", 7)}${STAR(45, 8, 2.4, "#fff", 7)}${STAR(45, 20, 2.4, "#fff", 7)}${STAR(45, 32, 2.4, "#fff", 7)}${STAR(38, 14, 2.4, "#fff", 7)}${STAR(52, 26, 2.4, "#fff", 7)}`,
  nz: `<rect width="60" height="40" fill="#00247D"/>${MINI_UK(0, 0, 30, 20)}${STAR(45, 8, 3, "#CC142B")}${STAR(45, 20, 3, "#CC142B")}${STAR(45, 32, 3, "#CC142B")}${STAR(38, 14, 3, "#CC142B")}`,
  cn: `<rect width="60" height="40" fill="#DE2910"/>${STAR(10, 10, 5, "#FFDE00")}${STAR(22, 4, 1.8, "#FFDE00")}${STAR(26, 9, 1.8, "#FFDE00")}${STAR(26, 15, 1.8, "#FFDE00")}${STAR(22, 20, 1.8, "#FFDE00")}`,
  jp: `<rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="8" fill="#BC002D"/>`,
  fr: V3("#0055A4", "#fff", "#EF4135"),
  it: V3("#009246", "#fff", "#CE2B37"),
  es: `<rect width="60" height="10" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect y="30" width="60" height="10" fill="#AA151B"/>`,
  de: H3("#000", "#DD0000", "#FFCE00"),
  nl: H3("#AE1C28", "#fff", "#21468B"),
  gr: `<rect width="60" height="40" fill="#fff"/><rect width="60" height="8" y="0" fill="#0D5EAF"/><rect width="60" height="8" y="16" fill="#0D5EAF"/><rect width="60" height="8" y="32" fill="#0D5EAF"/><rect width="22" height="22" fill="#0D5EAF"/><rect x="9" y="2" width="4" height="18" fill="#fff"/><rect x="2" y="9" width="18" height="4" fill="#fff"/>`,
  ie: V3("#169B62", "#fff", "#FF883E"),
  ru: H3("#fff", "#0039A6", "#D52B1E"),
  ge: `<rect width="60" height="40" fill="#fff"/><rect x="27" width="6" height="40" fill="#FF0000"/><rect y="17" width="60" height="6" fill="#FF0000"/><g fill="#FF0000"><rect x="10" y="6" width="3" height="9"/><rect x="7.5" y="8.5" width="8" height="3"/><rect x="47" y="6" width="3" height="9"/><rect x="44.5" y="8.5" width="8" height="3"/><rect x="10" y="25" width="3" height="9"/><rect x="7.5" y="27.5" width="8" height="3"/><rect x="47" y="25" width="3" height="9"/><rect x="44.5" y="27.5" width="8" height="3"/></g>`,
  am: H3("#D90012", "#0033A0", "#F2A800"),
  az: `${H3("#00B5E2", "#EF3340", "#509E2F")}<circle cx="30" cy="20" r="6" fill="#fff"/><circle cx="31.5" cy="20" r="4.8" fill="#EF3340"/>${STAR(35.5, 20, 2.6, "#fff", 8)}`,
  tr: `<rect width="60" height="40" fill="#E30A17"/><circle cx="21" cy="20" r="8" fill="#fff"/><circle cx="22.6" cy="20" r="6.4" fill="#E30A17"/>${STAR(28, 20, 2.8, "#fff")}`,
  th: `<rect width="60" height="6.5" fill="#A51931"/><rect y="6.5" width="60" height="3.5" fill="#F4F5F8"/><rect y="10" width="60" height="20" fill="#2D2A4A"/><rect y="30" width="60" height="3.5" fill="#F4F5F8"/><rect y="33.5" width="60" height="6.5" fill="#A51931"/>`,
  my: (() => { let s = ""; for (let i = 0; i < 7; i++) s += `<rect width="60" height="5.72" y="${(i * 5.72).toFixed(1)}" fill="${i % 2 ? "#fff" : "#CC0001"}"/>`; return `${s}<rect width="30" height="20" fill="#010066"/><circle cx="11" cy="10" r="6" fill="#FC0"/><circle cx="12.6" cy="10" r="4.8" fill="#010066"/>${STAR(19, 10, 2.6, "#FC0", 8)}`; })(),
  sg: `<rect width="60" height="20" fill="#EF3340"/><rect y="20" width="60" height="20" fill="#fff"/><circle cx="13" cy="10" r="6" fill="#fff"/><circle cx="14.6" cy="10" r="4.8" fill="#EF3340"/><circle cx="24" cy="5" r="1.2" fill="#fff"/><circle cx="27" cy="8" r="1.2" fill="#fff"/><circle cx="27" cy="13" r="1.2" fill="#fff"/><circle cx="24" cy="16" r="1.2" fill="#fff"/><circle cx="20.5" cy="10.5" r="1.2" fill="#fff"/>`,
  id: `<rect width="60" height="20" fill="#E70011"/><rect y="20" width="60" height="20" fill="#fff"/>`,
  ph: `<rect width="60" height="20" fill="#0038A8"/><rect y="20" width="60" height="20" fill="#CE1126"/><polygon points="0,0 26,20 0,40" fill="#fff"/><circle cx="9" cy="20" r="3.4" fill="#FCD116"/>${STAR(5, 8, 1.6, "#FCD116")}${STAR(5, 32, 1.6, "#FCD116")}${STAR(16, 20, 1.6, "#FCD116")}`,
  in: `${H3("#FF9933", "#fff", "#138808")}<circle cx="30" cy="20" r="4.6" fill="none" stroke="#06038D" stroke-width="1.2"/><circle cx="30" cy="20" r="1" fill="#06038D"/>`,
  lk: `<rect width="60" height="40" fill="#8D153A"/><rect x="2.5" y="2.5" width="55" height="35" fill="none" stroke="#FEBE10" stroke-width="2.5"/><rect x="2.5" y="2.5" width="8" height="35" fill="#00534E"/><rect x="10.5" y="2.5" width="8" height="35" fill="#EB7400"/><circle cx="46" cy="10" r="1.7" fill="#FEBE10"/><circle cx="28" cy="10" r="1.7" fill="#FEBE10"/><circle cx="46" cy="30" r="1.7" fill="#FEBE10"/><circle cx="28" cy="30" r="1.7" fill="#FEBE10"/>`,
  eg: `${H3("#CE1126", "#fff", "#000")}<circle cx="30" cy="20" r="4" fill="#C09300"/>`,
  ma: `<rect width="60" height="40" fill="#C1272D"/><polygon points="${starPts(30, 20, 9, 7.4)}" fill="none" stroke="#006233" stroke-width="2"/>`,
  ke: `<rect width="60" height="12" fill="#000"/><rect y="12" width="60" height="2.5" fill="#fff"/><rect y="14.5" width="60" height="11" fill="#BB0000"/><rect y="25.5" width="60" height="2.5" fill="#fff"/><rect y="28" width="60" height="12" fill="#006600"/><ellipse cx="30" cy="20" rx="5" ry="10" fill="#BB0000" stroke="#fff" stroke-width="1.4"/><rect x="28.6" y="11" width="2.8" height="18" fill="#fff"/>`,
  za: `<rect width="60" height="40" fill="#fff"/><rect width="60" height="13" fill="#E03C31"/><rect y="27" width="60" height="13" fill="#001489"/><polygon points="0,6 22,20 0,34" fill="#000"/><path d="M0 10 L26 20 L0 30" stroke="#fff" stroke-width="7" fill="none"/><path d="M0 13 L30 20 L0 27" stroke="#007749" stroke-width="6" fill="none"/><polygon points="0,6 22,20 0,34" fill="none" stroke="#fff" stroke-width="2"/>`,
  kr: `<rect width="60" height="40" fill="#fff"/><path d="M22 20 A8 8 0 0 1 38 20 Z" fill="#CD2E3A"/><path d="M22 20 A8 8 0 0 0 38 20 Z" fill="#0047A0"/><g fill="#000"><rect x="8" y="6" width="10" height="1.8"/><rect x="8" y="9" width="10" height="1.8"/><rect x="8" y="12" width="10" height="1.8"/><rect x="42" y="22" width="10" height="1.8"/><rect x="42" y="25" width="10" height="1.8"/><rect x="42" y="28" width="10" height="1.8"/><rect x="8" y="24" width="4" height="1.8"/><rect x="14" y="24" width="4" height="1.8"/><rect x="8" y="27" width="4" height="1.8"/><rect x="14" y="27" width="4" height="1.8"/><rect x="42" y="8" width="4" height="1.8"/><rect x="48" y="8" width="4" height="1.8"/><rect x="42" y="11" width="4" height="1.8"/><rect x="48" y="11" width="4" height="1.8"/></g>`,
  tw: `<rect width="60" height="40" fill="#FE0000"/><rect width="26" height="18" fill="#000095"/><circle cx="13" cy="9" r="4" fill="#fff"/>${(() => { let r = ""; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; r += `<line x1="${(13 + 5 * Math.cos(a)).toFixed(1)}" y1="${(9 + 5 * Math.sin(a)).toFixed(1)}" x2="${(13 + 7.4 * Math.cos(a)).toFixed(1)}" y2="${(9 + 7.4 * Math.sin(a)).toFixed(1)}" stroke="#fff" stroke-width="1"/>`; } return r; })()}`,
  vn: `<rect width="60" height="40" fill="#DA251D"/>${STAR(30, 20, 8, "#FF0")}`,
  kh: `<rect width="60" height="8" fill="#032EA1"/><rect y="8" width="60" height="24" fill="#E00025"/><rect y="32" width="60" height="8" fill="#032EA1"/><g fill="#fff"><rect x="18" y="22" width="24" height="4"/><rect x="22" y="16" width="4" height="8"/><rect x="28" y="16" width="4" height="8"/><rect x="34" y="16" width="4" height="8"/><polygon points="22,16 24,12 26,16"/><polygon points="28,16 30,12 32,16"/><polygon points="34,16 36,12 38,16"/></g>`,
  np: `<polygon points="4,38 4,2 22,15 15,15 36,31 24,31 24,38" fill="#DC143C" stroke="#003893" stroke-width="2.4" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.6" fill="#fff"/><polygon points="${starPts(20, 27, 3.4, 2.6, 12)}" fill="#fff"/>`,
  uz: `<rect width="60" height="12" fill="#0099B5"/><rect y="12" width="60" height="2" fill="#CE1126"/><rect y="14" width="60" height="12" fill="#fff"/><rect y="26" width="60" height="2" fill="#CE1126"/><rect y="28" width="60" height="12" fill="#1EB53A"/><circle cx="10" cy="8" r="4.4" fill="#fff"/><circle cx="11.2" cy="8" r="3.5" fill="#0099B5"/>${(() => { let d = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) d += `<circle cx="${20 + c * 3.4}" cy="${4.5 + r * 3.4}" r="0.9" fill="#fff"/>`; return d; })()}`,
  kz: `<rect width="60" height="40" fill="#00AFCA"/><rect x="4" y="4" width="4" height="32" fill="#FEC50C"/>${(() => { let r = ""; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; r += `<line x1="${(32 + 7 * Math.cos(a)).toFixed(1)}" y1="${(20 + 7 * Math.sin(a)).toFixed(1)}" x2="${(32 + 10.5 * Math.cos(a)).toFixed(1)}" y2="${(20 + 10.5 * Math.sin(a)).toFixed(1)}" stroke="#FEC50C" stroke-width="1.2"/>`; } return r; })()}<circle cx="32" cy="20" r="5.4" fill="#FEC50C"/>`,
  sa: `<rect width="60" height="40" fill="#006C35"/><text x="30" y="15" font-size="6" text-anchor="middle" fill="#fff" font-family="serif">لا إله إلا الله</text><text x="30" y="22" font-size="4.6" text-anchor="middle" fill="#fff" font-family="serif">محمد رسول الله</text><line x1="14" y1="30" x2="46" y2="30" stroke="#fff" stroke-width="2"/><polygon points="46,30 42,28.4 42,31.6" fill="#fff"/>`,
  om: `<rect width="60" height="13.4" fill="#fff"/><rect y="13.3" width="60" height="13.4" fill="#DB161B"/><rect y="26.6" width="60" height="13.4" fill="#008000"/><rect width="17" height="40" fill="#DB161B"/><g stroke="#fff" stroke-width="1.8"><line x1="4" y1="11" x2="13" y2="20"/><line x1="13" y1="11" x2="4" y2="20"/><line x1="6" y1="22.5" x2="11" y2="22.5"/><line x1="8.5" y1="22" x2="8.5" y2="30"/></g>`,
  qa: `<polygon points="0,0 16,0 12,2.2 16,4.4 12,6.6 16,8.8 12,11 16,13.2 12,15.4 16,17.6 12,19.8 16,22 12,24.2 16,26.4 12,28.6 16,30.8 12,33 16,35.2 12,37.4 16,39.6 0,40" fill="#fff"/><rect width="60" height="40" fill="#8A1538"/><polygon points="0,0 16,0 12,2.2 16,4.4 12,6.6 16,8.8 12,11 16,13.2 12,15.4 16,17.6 12,19.8 16,22 12,24.2 16,26.4 12,28.6 16,30.8 12,33 16,35.2 12,37.4 16,39.6 0,40" fill="#fff"/>`,
  kw: `${H3("#007A3D", "#fff", "#CE1126")}<polygon points="0,0 17,13 17,27 0,40" fill="#000"/>`,
  bh: `<rect width="60" height="40" fill="#CE1126"/><polygon points="0,0 17,0 12,4 17,8 12,12 17,16 12,20 17,24 12,28 17,32 12,36 17,40 0,40" fill="#fff"/>`,
  jo: `${H3("#000", "#fff", "#007A3D")}<polygon points="0,0 21,20 0,40" fill="#CE1126"/>${STAR(8, 20, 2.6, "#fff", 7)}`,
  lb: `<rect width="60" height="8" fill="#ED1C24"/><rect y="8" width="60" height="24" fill="#fff"/><rect y="32" width="60" height="8" fill="#ED1C24"/><g fill="#00A651"><polygon points="30,12 35,20 33,20 37,25 26,25 30,20 28,20"/><polygon points="30,18 33,23 27,23"/><rect x="29" y="25" width="2" height="4"/></g>`,
  pt: `<rect width="24" height="40" fill="#046A38"/><rect x="24" width="36" height="40" fill="#DA291C"/><circle cx="24" cy="20" r="7" fill="#FFE900" stroke="#000" stroke-width="0.6"/><circle cx="24" cy="20" r="3" fill="#DA291C"/>`
};
const FLAG_OF = { usa: "us", uk: "gb", canada: "ca", australia: "au", china: "cn", japan: "jp", "schengen-france": "fr", "schengen-italy": "it", "schengen-spain": "es", "schengen-germany": "de", "schengen-netherlands": "nl", "schengen-greece": "gr", ireland: "ie", russia: "ru", georgia: "ge", armenia: "am", azerbaijan: "az", turkey: "tr", thailand: "th", malaysia: "my", singapore: "sg", indonesia: "id", philippines: "ph", india: "in", "sri-lanka": "lk", egypt: "eg", morocco: "ma", kenya: "ke", "south-africa": "za", "new-zealand": "nz", "south-korea": "kr", taiwan: "tw", vietnam: "vn", cambodia: "kh", nepal: "np", uzbekistan: "uz", kazakhstan: "kz", saudi: "sa", oman: "om", qatar: "qa", kuwait: "kw", bahrain: "bh", jordan: "jo", lebanon: "lb", france: "fr", italy: "it", spain: "es", germany: "de", portugal: "pt" };
const flagSVG = (c, label) => {
  const k = FLAG_OF[c] || "un";
  const uid = `fc-${k}-${String(c).replace(/[^a-z]/g, "")}`;
  const art = FLAG_ART[k] || `<rect width="60" height="40" fill="#283B90"/><text x="30" y="26" font-size="14" text-anchor="middle" fill="#fff" font-family="Montserrat,sans-serif" font-weight="bold">${(codeOf(c) || "?").slice(0, 2)}</text>`;
  return `<svg viewBox="0 0 60 40" role="img" aria-label="Flag of ${label || pretty(c)}"><defs><clipPath id="${uid}"><rect width="60" height="40" rx="5"/></clipPath></defs><g clip-path="url(#${uid})">${art}<rect width="60" height="40" fill="none" stroke="rgba(19,26,66,.18)" stroke-width="1"/></g></svg>`;
};
const attractionsList = [
  ["desert-safari", "Desert Safari", "Dune bashing, camel, BBQ & Tanoura", "1516426122078-c23e76319801", "Off-road adventure under a desert sunset"],
  ["burj-khalifa", "Burj Khalifa At The Top", "Levels 124/125 + Dubai Mall", "1528702748617-c64d49f918af", "Downtown Dubai towers at blue hour"],
  ["museum-of-the-future", "Museum of the Future", "Tomorrow, today", "1487958449943-2429e8be8625", "Flowing futuristic facade in daylight"],
  ["dhow-cruise-marina", "Dhow Cruise Marina", "Dinner sail, glitter skyline", "1525625293386-3f8f99389edd", "Lit marina waterfront seen from the water"],
  ["sheikh-zayed-mosque", "Sheikh Zayed Grand Mosque", "Abu Dhabi day trip", "1512632578888-169bbbc64f33", "White marble mosque under a clear sky"],
  ["louvre-abu-dhabi", "Louvre Abu Dhabi", "Light rain, sea museum", "1499856871958-5b9627545d1a", "Sunlit gallery hall"],
  ["atlantis-aquaventure", "Aquaventure Waterpark", "Slides + Lost Chambers", "1530549387789-4c1017266635", "Resort pool lanes in morning light"],
  ["global-village", "Global Village", "Winter pavilions season", "1514525253161-7a46d19cd819", "Live stage lights over a festival crowd"],
  ["miracle-garden", "Miracle Garden", "120M blooms season", "1490750967868-88aa4486c946", "Flower arches in full bloom"],
  ["ferrari-world", "Ferrari World Abu Dhabi", "Fastest coaster on earth", "1503376780353-7e6692767b70", "Red supercar curves in motion"],
  ["dubai-city-tour", "Dubai City Tour", "Creek, souks, JBR", "1488646953014-85cb44e25828", "Traveller mapping the old-city walk"],
  ["dubai-frame", "Dubai Frame", "Old meets new, 150m", null, null],
  ["abu-dhabi-city-tour", "Abu Dhabi City Tour", "Corniche, Qasr Al Watan", null, null],
  ["warner-bros-world", "Warner Bros World", "Gotham to Bedrock", null, null]];
const seasonalSlugs = [
  ["cherry-blossom-japan-2027", "1528360983277-13d401cdc186", "Spring colours in Japan"],
  ["caucasus-autumn-georgia", "1454496522488-7a8e488e8606", "Misty highland ridges in autumn"],
  ["bali-dry-season", "1507525428034-b723cf961d3e", "Golden beach in dry season"],
  ["paris-christmas-markets", "1431274172761-fca41d930114", "Eiffel Tower in winter light"],
  ["london-summer-theatre", "1529655683826-aba9b3e77383", "Westminster on a summer evening"],
  ["swiss-white-winter", "1519681393784-d120267933ba", "Snowy peaks under a night sky"],
  ["maldives-winter-sun", "1573843981267-be1999ff37cd", "Sandbank in a blue lagoon"],
  ["thailand-cool-season", "1528181304800-259b08848526", "Limestone islands in clear season"],
  ["europe-summer-rail", "1523906834658-6e24ef2386f9", "Canals of Venice in summer"],
  ["desert-winter-dubai", "1518684079-3c830dcef090", "Cool-season dunes at sunset"],
  ["ramadan-staycation-uae", "1512453979798-5ea266f8880c", "Marina skyline during holy nights"],
  ["eid-escape-deals", "1500835556837-99ac94a94552", "Airplane wing above the clouds"]];
const pretty = (c) => c.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase());
const TODAY = "9 September 2026";
const ASOF = `<p class="asof">* Details as per today, ${TODAY}. Embassy rules, prices and timings change — confirm your file on WhatsApp before you pay or fly.</p>`;
const urls = ["/"];
const put = (p, html) => { out(p, html); urls.push(p.replace(/index\.html$/, "").replace(/\.html$/, "")); };

/* ---------- hubs ---------- */
const ctaWA = (t) => `<a class="btn btn-primary" href="${WA}?text=${encodeURIComponent(t)}" target="_blank" rel="noopener">Get a quote <span class="arr">→</span></a>`;
put("holidays.html", page("Holiday Packages from Dubai 2026–27 | Elite Escape Tourism", "18 destinations, 24 hand-walked itineraries from Dubai. Japan, Georgia–Armenia, Bali, UK, France. Honest per-person prices from AED 1,299.", "/holidays.html",
  heroBand("Holidays from Dubai", "Six obsessions, <span class='hl'>twenty-four</span> ways to go.", "Every route below is a real itinerary with hotels, transfers and day plans — not a brochure line.", U("1500835556837-99ac94a94552", 1800), "Airplane wing above the clouds", ctaWA("Holiday quote")) +
  `<section class="sec"><div class="wrap"><p class="eyebrow">All tours</p><h2>All 24 tours, side by side.</h2><div class="cards">${tours.map(([s, n,, dur, pr, was, bl, img, alt]) => `<a class="card-trip" href="/tours/${s}.html"><span class="ph"><img loading="lazy" src="${U(img, 800)}" alt="${n} — ${alt}" width="800" height="680"><span class="dur">${dur}</span><span class="price-tab"><s>${was}</s>${pr}</span></span><span class="bd"><h3>${n}</h3><p>${bl}</p><span class="go">View itinerary →</span></span></a>`).join("")}</div></div></section>`, "", "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1200&auto=format&fit=crop"));
put("visa.html", page("Visa Assistance in Dubai — 49 Countries | Elite Escape", "USA, UK, Schengen, Canada, Australia & more. Checklists, appointments, file review on WhatsApp. UAE tourist visas in 24–72h.", "/visa.html",
  bandHead("Visa atelier", "The stamp, <span class='hl'>without</span> the stress.", "Pick your country. A specialist replies with a dated checklist.", `<a class="btn btn-white" href="${WA}?text=Visa%20help" target="_blank" rel="noopener">Ask a specialist <span class="arr">→</span></a>`) +
  `<section class="sec"><div class="wrap"><p class="eyebrow">All 49 desks</p><div class="visa-grid">${visaCountries.map(c => `<a class="visa" href="/visa/${c}-from-uae.html"><span class="flag">${flagSVG(c)}</span><b style="text-transform:capitalize">${c.replace(/-/g, " ")}</b><small>Guide + checklist →</small></a>`).join("")}</div>
  <div class="panel" style="margin-top:26px"><h2>UAE visas, fast-tracked</h2><table class="spec"><tr><th>Tourist 30 / 90-day</th><td>Single or multiple entry · 24–72h</td></tr><tr><th>Transit 48 / 96-hour</th><td>For DXB layovers</td></tr><tr><th>Business &amp; investor</th><td>Long-term routes on request</td></tr></table></div></div></section>`));
const attrCard = ([s, n, bl, img, alt]) => img
  ? `<a class="card-trip" href="/attractions/${s}.html"><span class="ph"><img loading="lazy" src="${U(img, 800)}" alt="${n}, Dubai — ${alt}" width="800" height="680"><span class="dur">Daily</span><span class="price-tab">From AED 99</span></span><span class="bd"><h3>${n}</h3><p>${bl}.</p><span class="go">Details →</span></span></a>`
  : `<a class="card-trip" href="/attractions/${s}.html"><span class="tile" aria-hidden="true"><b>${n.charAt(0)}</b></span><span class="bd"><h3>${n}</h3><p>${bl}.</p><span class="go">Details →</span></span></a>`;
put("attractions.html", page("Dubai Attractions — Desert Safari, Burj Khalifa & More | Elite Escape", "Desert safari with BBQ & Tanoura, Burj Khalifa, Museum of the Future, dhow cruise. Hotel pickup across Dubai & Sharjah.", "/attractions.html",
  heroBand("UAE icons", "The desert is the <span class='hl'>original cinema.</span>", "Hotel pickup, licensed drivers, honest timings.", U("1512453979798-5ea266f8880c", 1800), "Dubai Marina skyline glowing at dusk", `<a class="btn btn-primary" href="${WA}?text=Desert%20safari%20booking" target="_blank" rel="noopener">Book safari <span class="arr">→</span></a>`) +
  `<section class="sec"><div class="wrap"><p class="eyebrow">All 14 icons</p><h2>Every icon, one page.</h2><div class="cards">${attractionsList.map(attrCard).join("")}</div></div></section>`, "", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop"));
put("seasonal.html", page("Seasonal Tours — Cherry Blossom, Winter Sun, Eid Escapes | Elite Escape", "Chase the season: Japan sakura, Caucasus autumn, Maldives winter sun, Paris Christmas, desert winter.", "/seasonal.html",
  heroBand("Seasons", "Go when the light is <span class='hl'>right.</span>", "Twelve departures timed to bloom, snow and tide.", U("1506905925346-21bda4d32df4", 1800), "Snow-capped peaks in clear winter light", "") +
  `<section class="sec"><div class="wrap"><p class="eyebrow">All 12 departures</p><h2>Pick your season.</h2><div class="cards">${seasonalSlugs.map(([s, img, alt]) => `<a class="card-trip" href="/seasonal/${s}.html"><span class="ph"><img loading="lazy" src="${U(img, 800)}" alt="${pretty(s)} — ${alt}" width="800" height="680"><span class="dur">Seasonal</span><span class="price-tab">From AED 1,499</span></span><span class="bd"><h3 style="text-transform:capitalize">${s.replace(/-/g, " ")}</h3><p>Dates, bloom/price calendar and packing notes inside.</p><span class="go">See dates →</span></span></a>`).join("")}</div></div></section>`, "", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop"));
put("about.html", page("About — The Maison | Elite Escape Tourism Dubai", "Boutique Dubai travel house for bespoke holidays, 49 visa desks and UAE icons. WhatsApp concierge 7 days.", "/about.html",
  heroBand("The maison", "We don't sell trips. We <span class='hl'>compose</span> them.", "Born in Dubai, obsessed with pacing, light and quiet logistics.", U("1469854523086-cc02fe5d8800", 1800), "Open road through the landscape", "") +
  `<section class="sec"><div class="wrap split"><div><p class="eyebrow">Vision</p><h2>To be the most <span class="hl">imaginative</span> curator of journeys from the Gulf.</h2><p class="lede">Mission: deeply personal, flawless itineraries — expert knowledge, honest prices, humans on WhatsApp.</p></div><div class="panel"><h3>House rules</h3><ul><li>One specialist owns your file end-to-end.</li><li>Fixed written quote before payment.</li><li>No fake reviews, no invented prices.</li><li>Hotel pickup, licensed partners only.</li></ul><p><a class="btn btn-primary" href="/contact.html">Meet us <span class="arr">→</span></a></p></div></div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="stats"><div><b><span data-count="24">24</span></b><span>Signature itineraries</span></div><div><b><span data-count="49">49</span></b><span>Visa desks</span></div><div><b><span data-count="14">14</span></b><span>UAE icons</span></div><div><b><span data-count="100">100</span>+</b><span>Field guides</span></div></div></div></section>`));
put("contact.html", page("Contact — Talk to a Travel Artisan | Elite Escape Dubai", "Call +971 55 575 3133, WhatsApp 7 days, or mail info@eliteescapetourism.com. City Gate Building, Dubai.", "/contact.html",
  bandHead("Contact", "Begin with a <span class='hl'>conversation.</span>", "Call, WhatsApp or write — a specialist replies within working hours.", `<a class="btn btn-white" href="${WA}" target="_blank" rel="noopener">WhatsApp us <span class="arr">→</span></a> <a class="btn btn-glass" href="tel:+971555753133">Call now <span class="arr">→</span></a>`) +
  `<section class="sec"><div class="wrap split"><div class="panel"><h2>Direct lines</h2><table class="spec"><tr><th>Phone / WhatsApp</th><td><a href="tel:+971555753133">+971 55 575 3133</a></td></tr><tr><th>Email</th><td><a href="mailto:info@eliteescapetourism.com">info@eliteescapetourism.com</a></td></tr><tr><th>Studio</th><td>City Gate Building, Hashtag Business Center, M Floor, Office 16, Dubai</td></tr><tr><th>Hours</th><td>Mon–Fri 9:00–17:00 · WhatsApp 7 days</td></tr></table><p><button class="btn btn-primary btn-sm" data-callback>Request a callback <span class="arr">→</span></button></p></div><div class="panel"><h2>Request a callback</h2><form action="${WA}" method="get" target="_blank"><div class="field"><label for="n">Name</label><input id="n" name="text" required placeholder="Your name"></div><div class="field"><label for="w">Where to?</label><input id="w" placeholder="Japan in March, 2 adults"></div><button class="btn btn-primary" type="submit">Send via WhatsApp <span class="arr">→</span></button></form></div></div></div></section>`));
put("privacy.html", page("Privacy Policy | Elite Escape Tourism", "How Elite Escape Tourism handles trip inquiries under UAE PDPL: what we collect, why, your rights and how to reach us.", "/privacy.html", `<section class="sec"><div class="wrap prose" style="padding-top:110px"><p class="breadcrumb"><a href="/">Home</a> › Privacy</p><h1>Privacy, <span class="hl">plainly.</span></h1><p>Elite Escape Tourism LLC, Dubai, is the data controller for this website. We follow the UAE Federal Personal Data Protection Law (PDPL).</p><h2>What we collect</h2><ul><li>Only what you send us: name, phone, email and trip details via WhatsApp, phone or forms.</li><li>Forms on this site submit through WhatsApp — nothing is stored in a website database.</li><li>Popups remember dismissal using your own browser's local storage only.</li></ul><h2>Why we use it</h2><p>To prepare quotes, manage bookings and contact you about your enquiry — nothing else, and only with your consent, which you may withdraw anytime by messaging STOP.</p><h2>Sharing</h2><p>Messages you send travel via WhatsApp (Meta). Booking essentials are shared with airlines, hotels and consulates strictly to fulfil your trip.</p><h2>Your rights</h2><p>Access, correction and deletion: write to <a href="mailto:info@eliteescapetourism.com">info@eliteescapetourism.com</a> and we respond within 30 days.</p></div></section>`));
put("terms.html", page("Terms | Elite Escape Tourism", "Booking, payment, visa-service and desert-safari terms for Elite Escape Tourism Dubai. Fixed quotes, licensed partners.", "/terms.html", `<section class="sec"><div class="wrap prose" style="padding-top:110px"><p class="breadcrumb"><a href="/">Home</a> › Terms</p><h1>Fair <span class="hl">terms.</span></h1><ul><li>Quotes are fixed in writing before payment; starting-from prices assume 2 sharing, in season, and exclude lunches/dinners unless stated, personal expenses and visa/consulate fees unless bundled.</li><li>Visa outcomes rest with embassies; our fee covers preparation, appointment and tracking only.</li><li>Safari timings shift with sunset and park rules; pickup window confirmed evening prior. Safety-related cancellations rebook free or convert to credit.</li><li>Cancellations follow the airline/hotel/operator fare rules for your dates, stated in your quote before payment, per UAE consumer-protection requirements.</li><li>These terms are governed by the laws of Dubai and the UAE; disputes go first to good-faith resolution with our desk.</li></ul></div></div></section>`));
put("404.html", page("Page Not Found | Elite Escape Tourism", "That page flew away from Dubai. Explore signature holidays, 49 visa desks or desert safari and UAE icons.", "/404.html", `<section class="sec"><div class="wrap" style="padding-top:110px"><p class="eyebrow">404</p><h1>Lost in <span class="hl">transit?</span></h1><p class="lede">Try holidays, visas or the desert.</p><p style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-primary" href="/">Home <span class="arr">→</span></a><a class="btn btn-outline" href="/holidays.html">Holidays <span class="arr">→</span></a></p></div></section>`));

/* ---------- detail pages ---------- */
for (const [slug, name, tag, cities, img, alt] of destinations) {
  const rel = tours.filter(t => t[2] === slug).map(t => `<li><a href="/tours/${t[0]}.html">${t[1]} — from ${t[4]}</a></li>`).join("") || "<li><a href='/contact.html'>Ask for a bespoke route</a></li>";
  put(`destinations/${slug}.html`, page(`${name} Holidays from Dubai 2026–27 | Elite Escape`, `${name} from Dubai: ${tag}. Itineraries, best months, costs and UAE-resident visa notes. From AED 1,299. WhatsApp +971 55 575 3133.`, `/destinations/${slug}.html`,
    heroBand("Destination", `${name}, <span class='hl'>composed.</span>`, `${tag}. Key stops: ${cities}. From Dubai with stays, transfers and day plans handled.`, U(img, 1800), `${name} — ${alt}`, `<a class="btn btn-primary" href="${WA}?text=${encodeURIComponent(name + " trip")}" target="_blank" rel="noopener">Price my ${name} trip <span class="arr">→</span></a><a class="btn btn-glass" href="/guides/${slug}-from-dubai-cost.html">Cost guide <span class="arr">→</span></a>`) +
    `<section class="sec"><div class="wrap"><h2>Plan ${name} in 5 steps</h2><ol><li><b>Step 1 — Fix the month.</b> Shoulder months balance price and light — see our <a href="/guides/best-time-to-visit-${slug}.html">month-by-month guide</a>.</li><li><b>Step 2 — Clear the visa.</b> Rules vary by passport — check <a href="/guides/${slug}-visa-for-uae-residents.html">visa notes</a> or WhatsApp us your nationality before booking flights.</li><li><b>Step 3 — Lock stays + transfers.</b> We hold refundable options first, then confirm once the visa decision lands.</li><li><b>Step 4 — Cost it honestly.</b> <a href="/guides/${slug}-from-dubai-cost.html">Full breakdown</a>: flights swing most; stays and guiding are fixed in writing.</li><li><b>Step 5 — Fly with a briefing.</b> Meeting points, eSIM, insurance and the 24/7 line — one PDF, no surprises.</li></ol><h2>Tours to ${name}</h2><ul>${rel}</ul><h2>Good to know</h2>${faqsHtml([[`When is the best time to visit ${name} from Dubai?`, `Shoulder months balance price and light — see our <a href="/guides/best-time-to-visit-${slug}.html">month-by-month guide</a>.`], [`Do UAE residents need a visa for ${name}?`, `Rules vary by passport — check <a href="/guides/${slug}-visa-for-uae-residents.html">visa notes</a> or WhatsApp us your nationality.`], [`How much does ${name} cost from Dubai?`, `Signature routes start near AED 1,299–4,000 per person sharing — <a href="/guides/${slug}-from-dubai-cost.html">full breakdown</a>.`]])}${ASOF}</div></section>`,
    faqJson([[`Best ${name} tours?`, `${name} tours from Dubai`]]), U(img, 1200)));
}
for (const [slug, name, dest, dur, pr, was, bl, img, alt] of tours) {
  put(`tours/${slug}.html`, page(`${name} from Dubai — ${dur} | Elite Escape`, `${name} from Dubai: ${bl} Stays, transfers, guided days. ${dur}, from ${pr} per person. WhatsApp +971 55 575 3133.`, `/tours/${slug}.html`,
    `<section class="hero" style="min-height:72svh"><div class="hero-slides"><div class="hero-slide on">${HEROIMG(img, `${name} — ${alt}`, 1800, 1100)}</div></div><div class="wrap hero-inner" style="padding:160px 0 60px"><p class="hero-kicker"><i></i>${dur} · from ${pr}</p><h1>${name}.</h1><p class="hero-sub">${bl}</p><div class="hero-actions"><a class="btn btn-primary" href="${WA}?text=${encodeURIComponent("Book " + name)}" target="_blank" rel="noopener">Book on WhatsApp <span class="arr">→</span></a><a class="btn btn-glass" href="/destinations/${dest}.html">Destination guide <span class="arr">→</span></a></div></div></section>` +
    `<section class="sec"><div class="wrap">${crumb([["Home", "/"], ["Holidays", "/holidays.html"], [name, ""]])}<div class="split"><div><h2>Day by day</h2><div class="itin"><details open><summary>Days 1–2 — Arrive &amp; orient</summary><p>Meet-and-greet, hotel check-in, evening walk and welcome dinner. Jet-lag-smart pacing.</p></details><details><summary>Middle days — Icons, deeply</summary><p>Guided headline sights with early starts, plus one slow morning. Optional craft/sail add-on.</p></details><details><summary>Final days — Free &amp; fly</summary><p>Free morning, transfers, fly home. 24/7 line active throughout.</p></details></div></div><div class="panel"><h3>Includes</h3><ul><li>Handpicked stays + daily breakfast</li><li>Airport transfers + intercity rail/drive</li><li>Guided sightseeing with entry handling</li><li>WhatsApp concierge, 24/7 on-trip</li></ul><table class="spec"><tr><th>Duration</th><td>${dur}</td></tr><tr><th>From</th><td>${pr} per person (2 sharing)</td></tr><tr><th>Was</th><td>${was}</td></tr><tr><th>Not included</th><td>Lunches/dinners unless stated, personal expenses, visa/consulate fees unless bundled</td></tr><tr><th>Group</th><td>Small / private on request</td></tr></table></div></div>${faqsHtml([["Is the price final?", "Starting-from based on 2 sharing in season. Your written quote is fixed before payment."], ["Can you customise it?", "Yes — add nights, honeymoon touches or private driver. Message us."], ["How does booking work, step by step?", "1) WhatsApp dates + travellers. 2) We send a locked itinerary with named hotels. 3) You confirm; we ticket flights and confirm stays. 4) Pre-departure brief with transfers, meeting points and 24/7 line. 5) Travel — we're on call throughout."]])}<p><a href="/holidays.html">← All 24 tours</a></p>${ASOF}</div></section>`,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "TouristTrip", name, touristType: "Holiday", offers: { "@type": "Offer", priceCurrency: "AED", price: pr.replace(/[^0-9]/g, ""), availability: "https://schema.org/InStock" } })}</script>`, U(img, 1200)));
}
for (const c of visaCountries) {
  const n = pretty(c);
  put(`visa/${c}-from-uae.html`, page(`${n} Visa from Dubai / UAE 2026 — Requirements & Help | Elite Escape`, `${n} visa for UAE residents: documents, appointment, timelines and fees. Free checklist on WhatsApp +971 55 575 3133.`, `/visa/${c}-from-uae.html`,
    `<section class="band sec" style="margin-top:86px"><div class="wrap">${crumb([["Home", "/"], ["Visas", "/visa.html"], [n, ""]])}<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><span class="flag flag-lg">${flagSVG(c)}</span><div><p class="eyebrow" style="color:#9BDCF5">Visa desk · UAE residents</p><h1 style="color:#fff">${n} visa, <span class="hl">handled.</span></h1></div></div><p class="lede">Documents, appointment, file review and tracking — one specialist on WhatsApp. Timelines confirmed on first message.</p><div class="hero-actions"><a class="btn btn-white" href="${WA}?text=${encodeURIComponent("Visa to " + n)}" target="_blank" rel="noopener">Start my ${n} file <span class="arr">→</span></a></div></div></section>` +
    `<section class="sec"><div class="wrap"><div class="split"><div><h2>Your application, step by step</h2><ol><li><b>Step 1 — Eligibility call (day 0).</b> Message your passport nationality, UAE residence expiry and travel dates. We confirm which consulate owns your file and the honest timeline this week.</li><li><b>Step 2 — Document pack (days 1–5).</b> Passport valid 6+ months with 2 blank pages; Emirates ID + residence visa valid beyond travel; 3-month bank statements showing salary credits (no last-minute lump sums); NOC letter with salary, joining date and approved leave; photos to spec; travel insurance; flight hold + hotel bookings — we arrange compliant hold bookings.</li><li><b>Step 3 — Forms + appointment (days 3–7).</b> We complete the online form exactly as your documents read, then lock the earliest workable VAC slot and send a one-page appointment brief.</li><li><b>Step 4 — Biometrics day.</b> Arrive 15 minutes early with originals + one copy set. Prints, photo and passport submission take ~20 minutes. Keep your tracking receipt.</li><li><b>Step 5 — Tracking (decision window).</b> We monitor the tracker and embassy load daily and message you the moment status moves — no refreshing needed.</li><li><b>Step 6 — Passport back + fly-ready check.</b> We verify dates, validity and conditions on the vignette, then confirm your insurance and bookings match the granted period.</li></ol></div><div class="panel"><h3>Current requirements checklist</h3><ul><li>Passport + Emirates ID + residence visa copies</li><li>3-month bank statement + NOC / salary proof</li><li>Photos per consulate spec + travel insurance</li><li>Flight hold + hotel bookings (we arrange)</li><li>Prior visas + refusal history, if any — tell us early</li></ul><p><a class="btn btn-primary btn-sm" href="${WA}?text=${encodeURIComponent("Checklist for " + n)}" target="_blank" rel="noopener">Get my checklist <span class="arr">→</span></a></p></div></div>${faqsHtml([[`How long does the ${n} visa take right now?`, `Varies by season and passport — message us for this week's appointment queue and decision window.`], [`Can you help with refusal history?`, `Yes — we review the prior refusal, rebuild ties evidence and re-file cleanly.`], [`Do I pay the embassy fee to you?`, `No — consulate and VAC fees are paid at the centre by card/cash; our service fee is quoted separately, in writing.`]])}<p><a href="/visa.html">← All 49 desks</a></p>${ASOF}</div></section>`,
    faqJson([[`${n} visa time?`, `${n} visa processing time from Dubai`]])));
}
for (const [slug, name, bl, img, alt] of attractionsList) {
  const media = img
    ? `<section class="hero" style="min-height:62svh"><div class="hero-slides"><div class="hero-slide on">${HEROIMG(img, `${name}, Dubai — ${alt}`, 1800, 1000)}</div></div><div class="wrap hero-inner" style="padding:160px 0 60px"><p class="hero-kicker"><i></i>UAE icon · daily</p><h1>${name}.</h1><p class="hero-sub">${bl}. Licensed partner, hotel pickup, confirmed evening-before window.</p><div class="hero-actions"><a class="btn btn-primary" href="${WA}?text=${encodeURIComponent("Book " + name)}" target="_blank" rel="noopener">Book ${name} <span class="arr">→</span></a></div></div></section>`
    : `<section class="band sec" style="margin-top:86px"><div class="wrap"><p class="eyebrow" style="color:#9BDCF5">UAE icon · daily</p><h1 style="color:#fff">${name}.</h1><p class="lede">${bl}. Licensed partner, hotel pickup, confirmed evening-before window.</p><div class="hero-actions"><a class="btn btn-white" href="${WA}?text=${encodeURIComponent("Book " + name)}" target="_blank" rel="noopener">Book ${name} <span class="arr">→</span></a></div></div></section>`;
  put(`attractions/${slug}.html`, page(`${name} Dubai — Tickets, Timings & Pickup | Elite Escape`, `${name}: ${bl}. Daily with Dubai/Sharjah hotel pickup. Book on WhatsApp +971 55 575 3133.`, `/attractions/${slug}.html`, media +
    `<section class="sec"><div class="wrap">${crumb([["Home", "/"], ["UAE Icons", "/attractions.html"], [name, ""]])}<div class="split"><div><h2>Your visit, step by step</h2><ol><li><b>Step 1 — Book the day.</b> Message your date, hotel and headcount on WhatsApp; we confirm availability and the pickup window the evening before.</li><li><b>Step 2 — Pickup.</b> Licensed driver meets you in the lobby at the confirmed window (Dubai/Sharjah hotels). Keep Emirates ID or passport copy handy.</li><li><b>Step 3 — The main block.</b> Core experience runs 3–5 hours depending on option; water, stops and photo points are built in.</li><li><b>Step 4 — Dinner &amp; show (evening options).</b> Buffet service with vegetarian choices; seating is first-confirmed, first-served at the front rows.</li><li><b>Step 5 — Drop back.</b> Return transfer to your hotel the same night; share feedback and we log preferences for next time.</li></ol></div><div class="panel"><h3>Entry requirements today</h3><ul><li>ID: Emirates ID or passport copy for all adults</li><li>Dress: modest, comfortable layers; swimwear only at waterparks</li><li>Kids: under-3 often free on lap — message ages for exact fare</li><li>Food: dinner options include vegetarian; advise allergies at booking</li></ul><table class="spec"><tr><th>Pickup</th><td>Dubai / Sharjah hotels</td></tr><tr><th>Days</th><td>Daily</td></tr><tr><th>From</th><td>AED 99 (varies by option)</td></tr></table></div></div>${faqsHtml([["Is pickup included?", "Yes for listed zones; exact window confirmed the evening before."], ["What if it rains or it's too hot?", "Desert operations follow park safety calls; you rebook free or refund in credit — decided by 2pm same day."]])}${ASOF}</div></section>`, "", img ? U(img, 1200) : ""));
}
for (const [s, img, alt] of seasonalSlugs) {
  put(`seasonal/${s}.html`, page(`${pretty(s)} — Dates & Prices | Elite Escape`, `${pretty(s)}: departure dates, price calendar and what's special this season. WhatsApp +971 55 575 3133.`, `/seasonal/${s}.html`,
    heroBand("Seasonal departure", `<span style="text-transform:capitalize">${s.replace(/-/g, " ")}</span>.`, "Timed to the light: dates, bloom/snow calendar, hotels and per-person pricing inside. Small groups, fixed departures.", U(img, 1800), `${pretty(s)} — ${alt}`, `<a class="btn btn-primary" href="${WA}?text=${encodeURIComponent(s)}" target="_blank" rel="noopener">Hold my seats <span class="arr">→</span></a>`) +
    `<section class="sec"><div class="wrap">${crumb([["Home", "/"], ["Seasons", "/seasonal.html"], [pretty(s), ""]])}<div class="panel"><h2>What's included</h2><ul><li>Fixed departure date + small group</li><li>Season-timed itinerary (bloom/snow/tide)</li><li>Stays, transfers, guiding, 24/7 line</li></ul></div>${ASOF}</div></section>`));
}
const guideTopics = (place) => [`best-time-to-visit-${place}`, `${place}-from-dubai-cost`, `${place}-visa-for-uae-residents`, `${place}-7-day-itinerary`, `${place}-honeymoon-guide`, `${place}-family-guide`];
const destImgOf = Object.fromEntries(destinations.map(d => [d[0], [d[4], `${d[1]} — ${d[5]}`]]));
let guides = [];
for (const p of destinations.map(d => d[0])) for (const t of guideTopics(p)) guides.push(t);
guides.push("uae-tourist-visa-30-vs-90-days", "uae-transit-visa-48-vs-96-hours", "schengen-visa-appointment-dubai", "uk-visa-from-dubai-timeline", "usa-visa-interview-dubai-tips", "desert-safari-morning-vs-evening", "dhow-cruise-marina-vs-creek", "burj-khalifa-best-time-to-visit", "museum-of-the-future-tickets-guide", "packing-list-japan-spring");
guides = [...new Set(guides)];
const guideImg = (g) => {
  const hit = destinations.map(d => d[0]).find(p => g.startsWith(p) || g.includes("-" + p + "-") || g.endsWith("-" + p));
  if (hit) return [destImgOf[hit][0], destImgOf[hit][1]];
  if (/visa|schengen|usa|uk-visa/.test(g)) return ["1436491865332-7a61a109cc05", "Airplane wing at sunset"];
  if (/safari|dhow|burj|museum/.test(g)) return ["1518684079-3c830dcef090", "Desert dunes at sunset"];
  return ["1488646953014-85cb44e25828", "Traveller planning the journey"];
};
for (const g of guides) {
  const [gi, ga] = guideImg(g);
  put(`guides/${g}.html`, page(`${pretty(g)} (2026) — Dubai Guide | Elite Escape`, `${pretty(g)}: honest costs, months, visa notes and mistakes to avoid — by Dubai specialists. WhatsApp +971 55 575 3133.`, `/guides/${g}.html`,
    `<section class="hero" style="min-height:52svh"><div class="hero-slides"><div class="hero-slide on">${HEROIMG(gi, ga, 1800, 900)}</div></div><div class="wrap hero-inner" style="padding:150px 0 50px"><p class="hero-kicker"><i></i>Field guide · 2026</p><h1 style="text-transform:capitalize">${g.replace(/-/g, " ")}.</h1></div></section>` +
    `<section class="sec"><div class="wrap prose">${crumb([["Home", "/"], ["Guides", "/guides/"], [pretty(g), ""]])}<p class="lede">Short, honest, Dubai-specific: when to go, what it costs from DXB, which visa queue to expect, and the mistake almost everyone makes.</p><h2>When to go</h2><p>Shoulder months win on price and light; peak weeks sell out 6–8 weeks ahead from Dubai. Message us your dates for this season's live calendar.</p><h2>What it costs from Dubai</h2><p>Flights swing most. Our signature routes fix stays + transfers + guiding in writing — see <a href="/holidays.html">holidays</a> for starting-from fares.</p><h2>Visa note</h2><p>Passport + UAE residence decide the queue. Start at <a href="/visa.html">visa desks</a> or WhatsApp your nationality for a checklist.</p><p><a class="btn btn-primary" href="${WA}?text=${encodeURIComponent(g)}" target="_blank" rel="noopener">Ask about this guide <span class="arr">→</span></a></p>${ASOF}</div></section>`));
}
put("guides/index.html", page("Travel Guides from Dubai (2026) | Elite Escape", "100 honest Dubai-first guides: costs, months, visas, itineraries for Japan, Georgia, Bali, Schengen & UAE icons.", "/guides/",
  `<section class="band sec" style="margin-top:86px"><div class="wrap"><p class="breadcrumb" style="color:#9BDCF5"><a style="color:#fff" href="/">Home</a> › Guides</p><p class="eyebrow" style="color:#9BDCF5">Library</p><h1 style="color:#fff">Guides with <span class="hl">receipts.</span></h1></div></section><section class="sec"><div class="wrap"><ul>${guides.map(g => `<li><a href="/guides/${g}.html">${pretty(g)}</a></li>`).join("")}</ul></div></section>`));

/* ================= BLOG: 400+ posts, 2016 → today ================= */
const BPOSTS = [];
const addPost = (slug, title, desc, cat, date, img, alt, intro, sections, faqs, take) =>
  BPOSTS.push({ slug, title, desc, cat, date, img, alt, intro, sections, faqs, take });
const QUIRK = {
  usa: "The DS-160 form plus an in-person interview at the US Consulate in Dubai decide most files — preparation beats luck.",
  uk: "The UK form is long and literal: every date and figure must match your documents to the letter.",
  canada: "Canada reads bank history like a novel — six months of steady salary credits beats a big balance.",
  australia: "Australia is fully online and evidence-hungry; upload quality matters more than quantity.",
  china: "China uses tiered service centres with strict photo and form rules — small errors bounce files back.",
  japan: "Japan rewards clean, simple files: stable job, sensible balance, clear day plan.",
  russia: "Russia needs a voucher-backed invitation alongside the standard pack — we arrange compliant support.",
  georgia: "Many nationalities enter Georgia visa-free, but UAE-resident rules depend on passport — check before you fly.",
  turkey: "Turkey's e-Visa covers many passports in minutes; others need a sticker file — nationality decides.",
  thailand: "Thailand's e-Visa/VOA mix confuses travellers; residents should confirm the right lane first.",
  singapore: "Singapore runs on an online authorisation model with fast turnarounds when the sponsor data is clean.",
  india: "India's e-Visa is quick for tourism but has fine-print conditions residents often miss."
};
const quirkOf = (c, N) => QUIRK[c] || (c.startsWith("schengen-")
  ? "Schengen files live or die on the 90/180-day rule and a coherent first-entry story — consulates cross-check."
  : `The ${N} desk rewards complete, consistent files — most delays come from missing pages, not strict rules.`);
const VISA_SECTIONS_REQ = (N, q) => [
  ["Who actually needs this visa", `<p>UAE citizens enjoy visa-free or visa-on-arrival access to most major destinations — this guide is written for <b>UAE residents travelling on foreign passports</b>. Your checklist is decided by two things only: your passport nationality and your UAE residence status. ${q}</p>`],
  ["Document checklist, item by item", `<ul><li><b>Passport</b> valid 6+ months beyond travel with 2 blank pages.</li><li><b>Emirates ID + UAE residence visa</b> valid beyond your return date.</li><li><b>3-month bank statements</b> showing salary credits — no last-minute lump-sum deposits.</li><li><b>NOC letter</b> with salary, joining date and approved leave dates.</li><li><b>Photos to spec</b> (Schengen 35×45mm; USA 51×51mm) — wrong size is the silliest rejection cause.</li><li><b>Travel medical insurance</b> — Schengen minimum €30,000 coverage.</li><li><b>Flight hold + hotel bookings</b> in the applicant's name — we arrange compliant holds.</li><li><b>Purpose proof:</b> day plan, event invites or family ties as applicable.</li></ul>`],
  ["Fees and processing time today", `<p>Expect the consulate fee plus a VAC service charge, paid at the centre — Schengen runs about €90 + service, the UK standard route is higher with optional priority upgrades, and the USA has its own MRV receipt system. Normal decision windows: <b>Schengen ~15 calendar days</b> after biometrics, <b>UK 3–6 weeks</b>, <b>USA set by the interview queue</b>. Peak months (May–August, December) stretch everything — message us for this week's live queue.</p>`],
  ["Three mistakes that cause refusals", `<ol><li><b>Parked funds</b> — a sudden big deposit before applying reads as borrowed money.</li><li><b>Weak home ties</b> — show job continuity, family, tenancy or business links to the UAE.</li><li><b>Inconsistent story</b> — dates, hotel cities and leave days must agree across every page.</li></ol>`],
  ["How UAE residents differ from home-country applicants", `<p>Applying from Dubai means proving <b>UAE ties</b>, not home-country ones: your residence visa, local employment and Gulf travel history carry the file. Officers also expect higher balances from Gulf residents — match the spend to Dubai income levels, not home-country norms.</p>`],
  ["After approval: the vignette check", `<p>When the passport returns, verify four things before leaving the centre: name spelling, validity dates covering your whole trip, number of entries, and conditions (e.g., duration of stay). Errors are fixable on the spot — discovered at the airport, they end trips.</p>`]];
const VISA_FAQ_REQ = (N) => [
  [`How early should I apply for the ${N} visa?`, `Schengen lets you apply up to 6 months ahead; in practice lock biometrics 6–8 weeks before travel in peak season.`],
  [`Can I apply with a passport expiring soon?`, `Renew first — most desks want 6+ months validity beyond travel plus blank pages.`],
  [`Do you guarantee approval?`, `No honest agency can — embassies decide. We guarantee a complete, consistent, well-argued file, which is what moves odds.`]];
const VISA_SECTIONS_APP = (N, q) => [
  ["How appointment slots actually work", `<p>Most ${N} slots in Dubai release through VFS/TLS-style centres in morning batches and vanish within hours in season. ${q} Watching the portal yourself is a part-time job — our desk monitors releases daily and grabs the earliest workable date for your file.</p>`],
  ["When to book your slot", `<p>Rule of thumb: <b>biometrics 6–8 weeks before departure</b> in March–August and December, 3–4 weeks in quiet months. Schengen applications can be lodged up to 6 months ahead — use that window for summer Europe.</p>`],
  ["Biometrics day, minute by minute", `<ol><li>Arrive 15 minutes early with originals + one full copy set.</li><li>Token, document scan, fingerprints and photo — about 20 minutes.</li><li>Pay centre service charges; keep the tracking receipt.</li><li>Passport stays with the centre unless a keep-my-passport option applies.</li></ol>`],
  ["Reschedules and missed slots", `<p>Most centres allow limited free reschedules if you act early; no-shows usually mean a fresh fee. If your travel date moves, tell us first — we re-sequence the file rather than patching it.</p>`],
  ["What to carry in your folder", `<p>Originals plus one full copy set: passport, Emirates ID, residence visa page, NOC, statements, insurance, bookings, prior visas, plus the appointment letter on top. Phones on silent; large bags and companions usually wait outside.</p>`],
  ["If slots look fully booked", `<p>Check secondary centres, adjacent dates and early-morning releases — then hand the portal-watching to us. Never buy slots from resellers: transferred appointments get cancelled at the door and flagged.</p>`]];
const VISA_FAQ_APP = (N) => [
  [`Which consulate should I apply through?`, `Schengen's main-destination rule decides: longest stay wins, ties break to first entry. Ask us before booking anything.`],
  [`Can someone attend biometrics for me?`, `No — fingerprints and photo are in-person, no exceptions.`]];
const VISA_SECTIONS_REF = (N, q) => [
  ["Reading your refusal letter", `<p>Refusal paragraphs look cryptic but map to five causes: unexplained funds, weak ties, unclear purpose, inconsistent dates, or thin travel history. ${q} Send us the letter — the fix depends on which box was ticked, and re-filing the same file guarantees the same answer.</p>`],
  ["Reapplying, step by step", `<ol><li><b>Pause, don't rush</b> — immediate identical re-files fail.</li><li><b>Fix the root cause:</b> season your bank account 2–3 months, rebuild ties evidence.</li><li><b>Rewrite the cover letter</b> to answer the refusal point directly, with documents attached.</li><li><b>Re-file clean</b> with a coherent day plan and bookings that match it.</li></ol>`],
  ["Cover letters that work", `<p>One page: who you are, what you do in the UAE, exact dates and cities, who funds the trip, and ties pulling you home. Attach proof for every claim — officers believe documents, not adjectives.</p>`],
  ["Should you switch consulate or country?", `<p>For Schengen, applying to a country you barely visit to chase faster slots backfires — entry patterns are visible. Fix the file, not the queue.</p>`],
  ["When to get professional help", `<p>Two refusals, complex travel history, self-employment with uneven income, or a tight deadline — these are the cases where a specialist's sequencing (what to fix first, what to file when) pays for itself. One honest assessment call beats a third rejection.</p>`]];
const VISA_FAQ_REF = (N) => [
  [`How soon can I reapply after a ${N} refusal?`, `As soon as the cause is fixed with evidence — weeks for paperwork issues, months for funds/ties issues.`],
  [`Does a refusal hurt future applications?`, `It stays on record, but a strong corrected file with an honest cover letter overcomes most single refusals.`]];
const SEASON = {
  japan: ["March–May and October–November", "June rains and August heat", "sakura late March, koyo mid-November"],
  georgia: ["May–June and September–October", "muddy November, deep-winter road closures", "ski December–March in Gudauri"],
  armenia: ["May–June and September–October", "January cold snaps", "Lake Sevan at its best July–August"],
  france: ["April–June and September", "August closures and peak prices", "Christmas markets in December"],
  uk: ["May–September", "grey January–February", "festive December in London"],
  russia: ["June White Nights season", "deep-winter January cold", "May and September shoulders"],
  bali: ["April–October dry season", "November–March rains", "July–August European peak"],
  italy: ["April–June and September–October", "Ferragosto mid-August crowds", "Alpine December alternatives"],
  spain: ["April–June and September–October", "inland August heat", "Andalusia winter sun"],
  switzerland: ["December–March ski, June–September hiking", "grey November", "shoulder May and October deals"],
  maldives: ["November–April dry season", "May–October rain and surf deals", "whale-shark season August–November"],
  thailand: ["November–February cool season", "March–May heat", "Andaman rains June–October"],
  malaysia: ["December–April west coast", "east-coast monsoon October–January", "KL works year-round"],
  singapore: ["February–April driest stretch", "Formula 1 September peak pricing", "year-round 30°C baseline"],
  turkey: ["April–June and September–October", "inland winter cold", "Istanbul in December is moody and cheap"],
  azerbaijan: ["May–June and September", "humid Caspian August", "Shahdag ski December–March"],
  greece: ["May–June and September", "meltemi winds and crowds late July–August", "Athens city breaks work in winter"],
  uae: ["November–March perfection", "June–September indoor season", "desert season opens October"] };
const COST = {
  japan: ["AED 2,200–3,500", "AED 450–800/night", "AED 400–600/day"],
  georgia: ["AED 900–1,500", "AED 200–400/night", "AED 150–250/day"],
  armenia: ["AED 900–1,400", "AED 180–350/night", "AED 130–220/day"],
  france: ["AED 1,800–3,000", "AED 500–900/night", "AED 350–550/day"],
  uk: ["AED 1,800–3,000", "AED 500–950/night", "AED 350–550/day"],
  russia: ["AED 1,400–2,200", "AED 300–550/night", "AED 200–350/day"],
  bali: ["AED 1,500–2,400", "AED 250–500/night", "AED 150–250/day"],
  italy: ["AED 1,900–3,000", "AED 500–850/night", "AED 300–500/day"],
  spain: ["AED 1,700–2,800", "AED 400–750/night", "AED 250–450/day"],
  switzerland: ["AED 2,000–3,200", "AED 700–1,200/night", "AED 450–700/day"],
  maldives: ["AED 1,500–2,600", "AED 900–2,500/night", "AED 300–600/day"],
  thailand: ["AED 1,200–2,000", "AED 200–450/night", "AED 150–250/day"],
  malaysia: ["AED 900–1,600", "AED 200–400/night", "AED 150–250/day"],
  singapore: ["AED 1,100–1,900", "AED 350–650/night", "AED 250–400/day"],
  turkey: ["AED 1,100–1,900", "AED 250–500/night", "AED 180–300/day"],
  azerbaijan: ["AED 700–1,200", "AED 200–350/night", "AED 120–200/day"],
  greece: ["AED 1,800–2,900", "AED 450–800/night", "AED 300–500/day"],
  uae: ["no flights needed", "AED 400–1,200/night", "AED 200–400/day"] };

/* ----- blog generation ----- */
const destBySlug = Object.fromEntries(destinations.map(d => [d[0], d]));
const GENERICS = [["1488646953014-85cb44e25828", "Traveller planning the journey"], ["1436491865332-7a61a109cc05", "Airplane wing at sunset"], ["1500835556837-99ac94a94552", "Airplane wing above the clouds"], ["1469854523086-cc02fe5d8800", "Open road through the landscape"], ["1476514525535-07fb3b4ae5f1", "Boat on a calm mountain lake"], ["1493246507139-91e8fad9978e", "Still lake beneath the peaks"]];
const SCHMAP = { "schengen-france": "france", "schengen-italy": "italy", "schengen-spain": "spain", "schengen-greece": "greece" };
const imgForVisa = (c, i) => {
  const d = destBySlug[SCHMAP[c] || c];
  if (d) return [d[4], `${d[1]} — ${d[5]}`];
  return GENERICS[i % GENERICS.length];
};
let _day = new Date("2016-01-12").getTime();
const nextDate = (step = 8) => { const d = new Date(_day).toISOString().slice(0, 10); _day += step * 864e5; return d; };
const TAKE = {
  Visa: ["Your checklist is decided by passport + UAE residence", "Book biometrics 6–8 weeks ahead in peak season", "Fixed written quote before you pay anything"],
  Holidays: ["Shoulder months win on price and light", "Flights swing most — stays get fixed in writing", "Message dates for this season's live calendar"],
  "UAE Icons": ["Daily departures with Dubai/Sharjah pickup", "Evening-before confirmation of your window", "Under-3s often free on lap"],
  "Travel Tips": ["Decided by your passport + residence, not rumours", "Screenshots beat memory — keep every receipt", "When in doubt, WhatsApp us before you pay"],
  Trends: ["Prices and rules move yearly — read the date on advice", "Book peak-season anchors 6–8 weeks out", "Confirm 2026 specifics on WhatsApp before paying"]
};
/* visa posts: 49 countries × 3 angles */
visaCountries.forEach((c, i) => {
  const N = pretty(c), q = quirkOf(c, N);
  const [im, al] = imgForVisa(c, i);
  addPost(`${c}-visa-requirements-dubai`, `${N} Visa from Dubai for UAE Residents: Documents, Fees & Processing Time`,
    `${N} visa for UAE residents in 2026: full document checklist, current fees, processing time and the mistakes that cause refusals.`, "Visa", nextDate(), im, al,
    `Applying for the ${N} visa from Dubai? This is the complete, current walkthrough — every document, the real timeline this season, and the three file-killers our desk sees weekly.`,
    VISA_SECTIONS_REQ(N, q), VISA_FAQ_REQ(N), TAKE.Visa);
  const [im2, al2] = imgForVisa(c, i + 2);
  addPost(`${c}-visa-appointment-dubai`, `${N} Visa Appointment in Dubai: Slots, Biometrics & Timelines`,
    `How ${N} visa slots release in Dubai, when to book biometrics, what happens at the centre and how to handle reschedules.`, "Visa", nextDate(), im2, al2,
    `The ${N} appointment is where most Dubai applications stall — slots vanish in hours in season. Here is exactly how the queue works and how to beat it without agents gaming the system.`,
    VISA_SECTIONS_APP(N, q), VISA_FAQ_APP(N), TAKE.Visa);
  const [im3, al3] = imgForVisa(c, i + 4);
  addPost(`${c}-visa-refusal-reapply`, `${N} Visa Refused? Reasons & How to Reapply from Dubai`,
    `Refused a ${N} visa in Dubai? Decode the refusal letter, fix the root cause and re-file a stronger case step by step.`, "Visa", nextDate(), im3, al3,
    `A ${N} refusal is a solvable paperwork problem, not a verdict on you. Read the letter correctly, fix the cause with evidence, and re-file clean — here is the exact sequence.`,
    VISA_SECTIONS_REF(N, q), VISA_FAQ_REF(N), TAKE.Visa);
});
/* destination posts: 18 × 4 */
destinations.forEach(([slug, name, tag, cities, img, alt]) => {
  const [best, avoid, note] = SEASON[slug], [fl, st, dy] = COST[slug];
  const cityList = cities.split(", ");
  addPost(`best-time-to-visit-${slug}-from-dubai`, `Best Time to Visit ${name} from Dubai: Month-by-Month Guide`,
    `When to visit ${name} from the UAE: best months, periods to avoid, and the shoulder-season sweet spots for price and weather.`, "Holidays", nextDate(), img, alt,
    `${name} changes personality by month. This guide pins the best windows for weather, prices and crowds — plus the periods Dubai travellers should skip.`,
    [["At a glance", `<p><b>Go in:</b> ${best}. <b>Think twice:</b> ${avoid}. <b>Local note:</b> ${note}.</p>`],
     ["The shoulder-season play", `<p>Fly the edges of peak — fares from Dubai drop 20–40%, hotel upgrades appear, and headline sights breathe. For ${name}, that means targeting the first and last thirds of the best window above.</p>`],
     ["When Dubai travellers get it wrong", `<p>Two classic errors: chasing European August (highest fares, thinnest availability from DXB) and ignoring local events — festivals in ${cityList[0]} can double hotel rates overnight. Message your dates and we'll sanity-check the calendar.</p>`],
     ["How this affects your budget", `<p>Peak-month flights from Dubai to ${name} typically run ${fl}; shifting two weeks into shoulder season is the single biggest saving lever — bigger than hotel class.</p>`],
     ["Packing by month in one line", `<p>Shoulder months: layers + one warm shell. Peak summer: sun kit + refillable bottle. Winter windows: proper coat, not a hoodie — ${name} punishes optimists.</p>`]],
    [[`Is ${name} good in summer?`, `Depends on the month and your heat tolerance — check the avoid window above, or ask us for this year's pattern.`], [`How far ahead should I book ${name}?`, `Peak months: 6–8 weeks from Dubai. Shoulder: 3–4 weeks is usually fine.`]], TAKE.Holidays);
  addPost(`${slug}-trip-cost-from-dubai`, `How Much Does ${name} Cost from Dubai? Full Price Breakdown`,
    `Real ${name} trip costs from the UAE: flights, hotels, daily spend and a 7-day budget model for two travellers.`, "Holidays", nextDate(), img, alt,
    `What does ${name} actually cost from Dubai? Below are typical current ranges from DXB plus a worked 7-day budget — then message us for a fixed quote on your dates.`,
    [["Flights from Dubai", `<p>Return economy from DXB/DWC typically <b>${fl}</b> depending on season and how early you lock. Tuesday–Wednesday departures are usually cheapest.</p>`],
     ["Stays", `<p>Comfortable mid-range runs <b>${st}</b>. Our packages use hand-checked 4-star equivalents — names shared before you pay.</p>`],
     ["Daily spend", `<p>Food, local transport and entries average <b>${dy}</b> per person travelling mid-range. ${cityList[0]} sets the pace; day trips add transfers.</p>`],
     ["A 7-day model for two", `<p>Flights × 2 + 6 nights mid-range + daily spend × 2 + guided days ≈ the number our written quotes land near. Starting package fares on our <a href="/holidays.html">tours page</a> already bundle the fixed parts.</p>`],
     ["Three ways to cut 20% without downgrading", `<p>Shift into shoulder weeks, fly Tuesday–Wednesday, and trade one hotel tier for one extra guided day — experiences appreciate, thread counts don't.</p>`]],
    [[`Is ${name} expensive from Dubai?`, `Mid-range and very doable — flights are the swing factor; lock those first.`], [`Cash or card in ${name}?`, `Cards widely accepted in cities; carry some local cash for markets and small towns — we brief you per stop.`]], TAKE.Holidays);
  addPost(`${slug}-7-day-itinerary-from-dubai`, `${name} in 7 Days: Perfect One-Week Itinerary from Dubai`,
    `The ideal 7-day ${name} route from the UAE: arrival day, icons, culture, nature, food and a slow finale.`, "Holidays", nextDate(), img, alt,
    `Seven days is the sweet spot for ${name} from Dubai — enough for icons plus one slow day. This is the exact rhythm our specialists use, built around ${cities}.`,
    [["Day 1 — Land and orient", `<p>Morning arrival, hotel check-in, evening walk around the base neighbourhood and an early night. Jet lag is real even on short hops — don't stack icons on day one.</p>`],
     ["Days 2–3 — The icons", `<p>${cityList[0]}'s headline sights with early starts: the big-ticket viewpoints, the old quarter, the museum that matters. One guided day here pays for itself.</p>`],
     [`Day 4 — Culture deep-cut`, `<p>Craft quarter, food market, a hands-on session — the day travellers remember. ${cityList[1] ? `A ${cityList[1]} extension works beautifully here.` : ""}</p>`],
     ["Day 5 — Nature escape", `<p>Leave the city: coast, highlands or lake day depending on season. Pack layers — ${name}'s microclimates surprise.</p>`],
     ["Day 6 — Food and free time", `<p>No alarms. Brunch, shopping street, the sight you missed, farewell dinner at the place your guide actually eats.</p>`],
     ["Day 7 — Slow finale", `<p>Late checkout where possible, last souvenirs, transfer with a 3-hour buffer. Land in Dubai with stories, not exhaustion.</p>`],
     ["If you have 10 days instead", `<p>Add a second base (usually ${cityList[1] || "the coast"}) plus one true rest day mid-trip. The extra days cost less per day than the first seven — flights are already sunk.</p>`]],
    [[`Can this stretch to 10 days?`, `Easily — add a second base (usually ${cityList[1] || "the coast"}) and a rest day mid-trip.`], [`Is 5 days enough for ${name}?`, `For one city plus a day trip, yes — ask us for the compressed version.`]], TAKE.Holidays);
  const fam = slug.length % 2 === 0;
  addPost(fam ? `${slug}-family-holiday-guide-dubai` : `${slug}-honeymoon-guide-dubai`, fam ? `${name} Family Holiday Guide from Dubai: Kids, Pace & Practicalities` : `${name} Honeymoon Guide from Dubai: Romance Without the Clichés`,
    fam ? `Planning ${name} with kids from the UAE: pacing, kid-approved stops, hotels that actually help and what to pack.` : `Honeymoon in ${name} from Dubai: private moments, upgrade-worthy nights and the mistakes couples make.`, "Holidays", nextDate(), img, alt,
    fam ? `${name} with kids works brilliantly from Dubai — if you pace it like a parent, not a backpacker.` : `Skip the generic honeymoon brochure. This is how couples actually do ${name} well from Dubai.`,
    fam ? [["Pace it right", `<p>One base per 3 nights minimum. Afternoons back at the hotel pool save evenings — overtired kids sink trips faster than rain.</p>`], ["Kid-approved stops", `<p>Mix one wow (viewpoint, boat, animals) with one run-around (park, beach, old-town lanes) daily. ${cityList[0]}'s big sights land better before 10am.</p>`], ["Hotels that help", `<p>Interconnecting rooms, breakfast included, pool with shallow end — we shortlist family-proven stays, never mystery hotels.</p>`], ["Packing that matters", `<p>Snacks for transfer days, swim kits in day bags, a light carrier for old-town steps. Pharmacies are easy; specific brands aren't.</p>`]]
      : [["The upgrade that matters", `<p>One splurge night (ryokan, caldera suite, overwater villa energy) beats five slightly-nicer rooms. Put it mid-trip, not night one.</p>`], ["Private moments, planned", `<p>Sunrise viewpoints, private dinners, couples' sessions — booked ahead, not hoped for. ${cityList[0]} rewards early risers.</p>`], ["Mistakes couples make", `<p>Over-scheduling, hiding the budget from each other, and skipping travel insurance on the biggest trip of the year.</p>`], ["Photos worth framing", `<p>One professional shoot (kimono streets, old town, beach) outperforms 400 phone snaps. We arrange local photographers.</p>`]],
    fam ? [[`Is ${name} stroller-friendly?`, `City centres yes, old quarters and nature days no — bring a light carrier as backup.`], [`What about kids' food?`, `Easy in cities; pack familiar snacks for transfer and nature days.`]]
      : [[`When should honeymooners book?`, `4–6 months out for peak-season icons; upgrades vanish first.`], [`Can you keep it private?`, `Private drivers, late checkouts and crowd-dodging starts are standard requests — just ask.`]], TAKE.Holidays);
});
/* UAE attraction posts: 14 × 2 */
attractionsList.forEach(([slug, name, bl, img, alt], i) => {
  const [pimg, palt] = img ? [img, `${name}, Dubai — ${alt}`]
    : slug === "dubai-frame" ? ["1512453979798-5ea266f8880c", "Dubai skyline glowing at dusk"]
    : slug === "abu-dhabi-city-tour" ? ["1512632578888-169bbbc64f33", "White marble mosque under a clear sky"]
    : ["1487958449943-2429e8be8625", "Flowing futuristic facade in daylight"];
  addPost(`${slug}-tickets-timings-dubai`, `${name} Dubai Tickets 2026: Prices, Timings & Skip-the-Line Tips`,
    `${name}: current ticket options, opening hours, how pickup works and the booking mistakes to avoid.`, "UAE Icons", nextDate(), pimg, palt,
    `Everything to know before booking ${name} — prices, timings, pickup zones and the small print that actually matters.`,
    [["Ticket options today", `<p>Standard entry covers the core experience; premium tiers add fast-track, front-row seating or meal upgrades. Book the tier matching your priority — queues or comfort — not the priciest by default.</p>`],
     ["Timings that matter", `<p>Evening slots carry the show/dinner formats; mornings suit families and photographers. Pickup windows are confirmed the evening before — keep that night's phone on.</p>`],
     ["Pickup zones", `<p>Dubai and Sharjah hotel pickup is standard; private villas and expo-area stays may need a meeting point. Message your location at booking and we'll confirm.</p>`],
     ["Booking mistakes", `<p>Same-day bookings in peak season, wrong date formats, and third-party vouchers with blackout dates. Book direct through our desk and the window is guaranteed in writing.</p>`],
     ["Best slot by month", `<p>October–March: evenings for shows and dinners under cool skies. April–September: mornings for families and photographers, evenings only if heat-tolerant. Ramadan and school-break weeks need earliest booking regardless of month.</p>`]],
    [[`Is ${name} open daily?`, `Yes, daily — with seasonal hour shifts we confirm at booking.`], [`Are kids free at ${name}?`, `Under-3s are usually free on lap; message ages for the exact fare.`]], TAKE["UAE Icons"]);
  addPost(`${slug}-tips-first-timers`, `${name}: 9 Mistakes First-Timers Make (and How to Avoid Them)`,
    `Get ${name} right the first time: what to wear, bring, eat and skip — from Dubai specialists who book it daily.`, "UAE Icons", nextDate(), pimg, palt,
    `We book ${name} every single day. These are the nine things first-timers get wrong — and the easy fixes.`,
    [["Timing errors", `<p>Arriving at midday heat, or cutting it fine before the show block. The fix: take the slot we recommend for your month, not the cheapest one.</p>`],
     ["Dress and kit", `<p>Modest, breathable layers; closed shoes for desert and old-city walking; swimwear only where water is the point. Sunscreen and a power bank beat every souvenir.</p>`],
     ["Food calls", `<p>Eat lightly before dune or ride blocks; keep the appetite for the evening spread. Vegetarian and allergy needs must be declared at booking, not at the buffet.</p>`],
     ["The pickup trap", `<p>Being 'almost ready' when the driver calls. Drivers run tight multi-hotel routes — be in the lobby five minutes early or risk a missed slot with no refund.</p>`],
     ["The one upgrade worth it", `<p>Front-row/show seating on evening formats and fast-track on ride-heavy parks. Skip souvenir-photo bundles — your phone plus the viewpoint beats them.</p>`]],
    [[`What should I carry to ${name}?`, `ID copy, phone, light layers, cash for extras — everything else we brief per season.`], [`Can plans change for weather?`, `Yes — safety calls are made by early afternoon with free rebooking.`]], TAKE["UAE Icons"]);
});
/* tour posts: 24 × inside story */
tours.forEach(([slug, name, dest, dur, pr, was, bl, img, alt]) => {
  addPost(`${slug}-whats-included`, `${name} from Dubai: What's Actually Included`,
    `${name}: route highlights, daily pace, who it's for, packing list and honest pricing from ${pr}.`, "Holidays", nextDate(), img, `${name} — ${alt}`,
    `${bl} Here is the unbrochure version: what your days feel like, who this trip suits, and what to pack.`,
    [["The route in one paragraph", `<p>${bl} ${dur}, hand-checked stays, transfers handled, one guided spine with free pockets. See the full <a href="/tours/${slug}.html">day-by-day itinerary</a>.</p>`],
     ["Pace and who it's for", `<p>Moderate pace: early starts on icon days, slow mornings built in. Works for couples, families with teens and confident first-timers; tell us mobility needs and we adjust.</p>`],
     ["Packing that earns its space", `<p>Broken-in walking shoes, layers for air-conditioned transport, universal adapter, and a daypack — plus destination specifics in your pre-departure brief.</p>`],
     ["Price honesty", `<p>From <b>${pr}</b> per person (2 sharing, in season; was ${was}). Your written quote fixes hotels by name before you pay anything.</p>`],
     ["Who should skip this trip", `<p>Pace-sensitive travellers who need fully private days, or anyone whose dates fall in the avoid window of our <a href="/guides/best-time-to-visit-${dest}.html">best-time guide</a> — ask us for the seasonal alternative instead.</p>`],
     ["Extend it by 3 days", `<p>Add a rest day mid-trip plus one second-base extension; marginal cost per day drops sharply once flights are sunk. Message us for the 10-day variant pricing.</p>`]],
    [[`Can I customise ${name}?`, `Yes — extra nights, private driver, honeymoon touches. Message us.`], [`Is this trip refundable?`, `Terms depend on airlines/hotels for your dates — spelled out in the quote, never buried.`]], TAKE.Holidays);
});
/* trends: 2016–2026 × 4 */
const YNOTE = { 2020: "PCR tests and corridor bubbles defined the year — flexibility beat price.", 2021: "vaccine passports and sudden list changes rewarded travellers who booked refundable.", 2022: "revenge travel slammed Schengen appointment queues across the Gulf.", 2023: "appointment scarcity peaked; early filers won summer Europe.", 2024: "Bali's tourist levy began in February and Japan demand exploded from the Gulf.", 2025: "DXB traffic records kept fares firm; ETIAS kept slipping — always check live status.", 2026: "Appointment loads have normalised but peak months still sell out 6–8 weeks ahead." };
for (let y = 2016; y <= 2026; y++) {
  const yn = YNOTE[y] || "Steady Gulf demand with seasonal fare swings — the early booker wins.";
  const G = GENERICS[y % GENERICS.length];
  addPost(`dubai-travel-outlook-${y}`, `Dubai Travel Outlook ${y}: Where Smart Money Flies`,
    `Travel trends for UAE residents in ${y}: rising destinations, fare signals and the moves early bookers made.`, "Trends", `${y}-01-14`, G[0], G[1],
    `What defined travel from Dubai in ${y}? ${yn} Here is the year in practical takeaways.`,
    [["Where demand went", `<p>${yn} Japan, Georgia and the classic Schengen triangle absorbed most Dubai outbound growth, with Maldives and Bali holding the celebration segment.</p>`], ["Fare signals", `<p>Booking 6–8 weeks out beat last-minute by a wide margin on every trunk route from DXB — the pattern held all year.</p>`], ["Visa climate", `<p>Appointment capacity, not policy, was the binding constraint for Schengen and USA files — early, complete files won.</p>`], ["The lesson", `<p>Fix dates early, hold refundable stays, clear the visa before chasing fare drops.</p>`], ["What we would book", `<p>With hindsight: shoulder-season Japan, value-season Georgia, and one splurge week banked early. The same portfolio logic applies this year — ask us to map it to your leave.</p>`]],
    [[`Is this still relevant?`, `As history, yes — and the booking-lead lesson repeats yearly. For live 2026 advice, WhatsApp us.`]], TAKE.Trends);
  const G2 = GENERICS[(y + 2) % GENERICS.length];
  addPost(`eid-escapes-from-dubai-${y}`, `Eid Escapes from Dubai ${y}: 8 Trips Worth Your Leave`,
    `Best Eid holiday trips from Dubai in ${y}: short visas, quick flights and crowd-dodging picks for every budget.`, "Trends", `${y}-04-16`, G2[0], G2[1],
    `Eid weeks are Dubai's great escape window. These eight trips balance flight time, visa friction and value — the formula that works every Eid.`,
    [["Under 4 hours away", `<p>Georgia, Armenia, Baku and Salalah: minimal leave burn, maximal scenery. Visa lanes are short for most resident nationalities.</p>`], ["The celebration splurge", `<p>Maldives and Bali for honeymoons and milestones — book seaplane/villa inventory first, it caps out.</p>`], ["Europe without pain", `<p>Only if the Schengen sticker is already in the passport — Eid is too late to start a fresh file.</p>`], ["Staycation hedge", `<p>One Eid at home isn't defeat: desert season, new openings and empty-city dining have their own charm.</p>`], ["Money calendar", `<p>Eid-week fares peak 3–4 weeks before the holiday; hotels follow a week later. Set alerts the moment school terms publish and buy flights before accommodation.</p>`]],
    [[`When should Eid trips be booked?`, `Flights 6–8 weeks out; visas much earlier. Ask us the moment dates are announced.`]], TAKE.Trends);
  const G3 = GENERICS[(y + 4) % GENERICS.length];
  addPost(`cheapest-months-fly-dubai-${y}`, `Cheapest Months to Fly from Dubai in ${y}: Fare Calendar Guide`,
    `When are flights cheapest from DXB in ${y}? Month-by-month fare logic, shoulder-season picks and booking windows.`, "Trends", `${y}-07-08`, G3[0], G3[1],
    `Fares from Dubai follow a rhythm. Learn it once and every future trip gets cheaper — here is the ${y} edition.`,
    [["The two expensive walls", `<p>Mid-June to late August and mid-December to early January: schools-out demand. Avoid or book 10+ weeks ahead.</p>`], ["Sweet spots", `<p>Late January–March and September–November deliver the best fare-to-weather ratio on most routes.</p>`], ["Booking windows", `<p>6–8 weeks for peak, 3–4 for shoulder. Tuesday–Wednesday departures undercut weekends.</p>`], ["The visa-first rule", `<p>Never chase a fare drop before the visa is decided — a cheap non-refundable ticket plus a delayed slot is the classic Dubai heartbreak.</p>`], ["The Tuesday rule, explained", `<p>Midweek departures price lower because business and school-break traffic clusters on weekends. Shifting a 7-day trip from Saturday–Saturday to Tuesday–Tuesday routinely saves 10–20% from DXB.</p>`]],
    [[`Do last-minute deals from Dubai exist?`, `Rarely on trunk routes in season — they're mostly shoulder-season opportunism.`]], TAKE.Trends);
  const G4 = GENERICS[(y + 1) % GENERICS.length];
  addPost(`uae-travel-rule-changes-${y}`, `Visa & Travel Rule Changes UAE Residents Must Know (${y})`,
    `Travel rule changes affecting UAE residents in ${y}: visas, levies, insurance minimums and what to double-check.`, "Trends", y > 2026 ? "2026-10-05" : `${y}-10-05`, G4[0], G4[1],
    `Rules move every year. The ${y} edition: what changed for UAE-based travellers and what to verify before you pay.`,
    [["Visas", `<p>${yn} Schengen's 90/180 arithmetic and first-entry logic never change — appointment capacity does. USA queues move with staffing, not seasons.</p>`], ["Levies and fees", `<p>Destination levies (Bali's from 2024) and consulate fee revisions land with little notice — budget 10% contingency on fees.</p>`], ["Insurance minimums", `<p>Schengen's €30,000 medical cover is non-negotiable; many long-haul visas now expect similar. Buy for the whole trip, not the minimum days.</p>`], ["Verify live", `<p>Year-old advice is the enemy. Confirm the current rule on WhatsApp before booking anything non-refundable.</p>`], ["Your pre-payment checklist", `<p>Before paying: visa validity covers all dates; insurance meets the consulate floor; bookings are refundable until the sticker lands; passport has 6+ months. Five minutes, zero heartbreak.</p>`]],
    [[`How do I stay updated?`, `Follow this journal and message us before paying — five minutes beats a refused file.`]], TAKE.Trends);
}
/* sakura forecasts 2019–2027 */
for (let y = 2019; y <= 2027; y++) {
  addPost(`japan-cherry-blossom-forecast-${y}`, `Japan Cherry Blossom Forecast ${y}: Best Weeks & When to Book from Dubai`,
    `Japan sakura season ${y}: expected full-bloom weeks in Tokyo and Kyoto, fare curves and the booking deadlines from DXB.`, "Trends", y > 2026 ? "2026-08-20" : `${y}-01-20`, "1528360983277-13d401cdc186", "Spring colours in Japan",
    y > 2026 ? `Early outlook for sakura ${y}: based on recent seasons, expect Tokyo full bloom around late March — but lock refundable stays now and adjust when the official forecast lands.`
      : `Sakura ${y} in hindsight: Tokyo full bloom landed in the classic late-March window, Kyoto days later — and Dubai–Tokyo fares peaked exactly on those weekends. The pattern repeats, which is why ${y + 1} planners should read on.`,
    [["The bloom window", `<p>Tokyo late March, Kyoto days after, with a ±1 week weather swing. Full-bloom weekends sell out first — they're the prize and the trap.</p>`], ["Booking deadlines from Dubai", `<p>Sakura-week hotels go by October; fares climb from November. Refundable holds in September, commit on the forecast.</p>`], ["Beyond the blossoms", `<p>Pair peak days with shoulder nights in Nara or Osaka — same trip, saner prices, fuller story.</p>`], ["If you miss peak week", `<p>Chase altitude, not dates: higher gardens and northern cities bloom later. A flexible rail pass turns a missed peak into a better trip.</p>`]],
    [[`When is full bloom in Tokyo?`, `Typically late March, shifting yearly with temperatures — confirm against the official forecast before locking non-refundables.`]], TAKE.Trends);
}
/* school planners 2016–2026 */
for (let y = 2016; y <= 2026; y++) {
  const G = GENERICS[y % GENERICS.length];
  addPost(`uae-school-holidays-family-planner-${y}`, `UAE School Holidays ${y}: Family Trip Planner from Dubai`,
    `Plan family travel around UAE school breaks in ${y}: lead times, kid-approved destinations and crowd-dodging strategy.`, "Trends", y >= 2026 ? "2026-08-25" : `${y}-08-25`, G[0], G[1],
    `School-break travel from Dubai is a capacity game. For ${y}'s half-terms and long breaks: book anchors early, pick pacing over packing, and always check the KHDA/ADEK calendar for your emirate.`,
    [["Lead times that work", `<p>Flights 8+ weeks for Christmas/Eid-adjacent breaks; hotels with family inventory (interconnecting, pools) go before fares do.</p>`], ["Where families win", `<p>Short hops (Georgia, Baku, Salalah) for half-terms; one big annual trip (Japan, Bali, Europe) for the long break.</p>`], ["Crowd-dodging", `<p>Fly the first Saturday out and return midweek; school-break crowds peak on Sundays both ends.</p>`], ["Half-term vs long-break strategy", `<p>Half-terms: one base, no packing churn, under 4-hour flights. Long breaks: the farthest destination on your list, booked the day term dates publish.</p>`]],
    [[`Which break suits a big trip?`, `The longest continuous break — protect it for the farthest destination on your list.`]], TAKE.Trends);
}

/* evergreen tips: 12 clusters × 5 + 18 stay-guides + 2 featured = 80 */
const EGROUPS = [
  { skel: [["What officers actually look for", "<p>Consistency over size: regular salary credits, spending that matches income, and a balance that covers the trip without theatrics. {K}</p>"], ["How to prepare your file", "<p>Season accounts 2–3 months: no lump sums, keep salary and savings trails clean, and print statements that show your name, IBAN and employer credits clearly.</p>"], ["Timeline that works", "<p>Start money hygiene the day you pick dates — not the week you apply. Files built backwards from the appointment date read calm and credible.</p>"], ["Joint accounts and shared expenses", "<p>Joint statements need a cover note explaining contributions; shared cards should map to one narrative. Unexplained third-party credits get the same parked-funds suspicion as lump sums.</p>"]],
    topics: [
      ["bank-statement-uae-visa-guide", "Bank Statements for Visa Applications: The 3-Month Rule Explained", "Visa officers don't count your money — they read its story. Here's how the 3-month rule works for UAE residents.", "Keep a stable closing balance across all three months; a rising-then-crashing balance raises more questions than a modest steady one.",
        "How much balance do I need?", "Enough for the trip plus a buffer — there is no magic number, only plausibility against your income."],
      ["salary-credits-visa-file", "Salary Credits: Why Officers Love Them (and Gaps Scare Them)", "A monthly salary credit is the strongest single line on a statement. Gaps, cash deposits and round-figure transfers need explaining.", "If salary lands in a different account than you spend from, include both sets — broken trails look like hidden income.",
        "What if I'm paid in cash?", "Deposit it the same way monthly and keep salary slips + NOC as backup proof."],
      ["lump-sum-deposit-visa-risk", "Lump-Sum Deposits Before Applying: Why They Trigger Refusals", "That helpful AED 20,000 from family lands like borrowed funds. Parked money is the #1 avoidable refusal cause.", "Any deposit over ~25% of monthly income needs a paper trail (sale deed, bonus letter) or needs to age 3+ months.",
        "Can I just wait it out?", "Yes — seasoned money (3+ months old with normal activity after) stops looking parked."],
      ["freelancer-visa-documents-dubai", "Freelancer Visa Applications in Dubai: Proving Income Without Salary Slips", "No salary certificate? No problem — if your paper trail is deliberate: contracts, invoices, license and tax filings.", "Twelve months of client invoices plus your freelance permit/license outweighs any single balance figure.",
        "Which trade license works best?", "Any valid UAE freelance permit with matching invoice history — consistency beats prestige."],
      ["sponsored-trip-visa-proof", "Sponsored Trips: How a Spouse or Parent Funds Your Visa File", "When someone else pays, the file needs their documents plus proof of relationship — half-submitted sponsorships fail.", "Attach sponsor's statements + NOC + relationship proof (marriage/birth certificate) and state exact coverage in the cover letter.",
        "Can a friend sponsor me?", "Technically yes, practically weak — family sponsorship with documented ties reads far stronger."] ] },
  { skel: [["The myth", "<p>“Dummy tickets” promise risk-free applications. {K}</p>"], ["What actually works", "<p>Compliant hold bookings and refundable fares: real PNRs that verify if checked, cancellable if plans move. We arrange these as standard.</p>"], ["The cost of getting caught", "<p>Fake PNRs that fail verification can convert a weak file into a dishonesty flag — which follows you across applications.</p>"], ["Real stories: what officers check", "<p>Booking references get spot-checked against airline systems, hotel names against your day plan, and dates against leave letters. Every checkable line in your file should survive checking.</p>"]],
    topics: [
      ["dummy-flight-ticket-visa-truth", "Dummy Flight Tickets for Visa: The Truth (and the Risk)", "Agents sell dummy tickets as harmless. Consulates can verify PNRs — here's the honest breakdown.", "A dummy PNR that doesn't verify is worse than no booking: it suggests deception, not preparation.",
        "Are hold bookings accepted?", "Yes — airline/office holds with live PNRs are the legitimate version of the same idea."],
      ["dummy-hotel-booking-visa", "Dummy Hotel Bookings: Why They Backfire", "Copy-paste hotel lists with mismatched cities are an instant credibility killer.", "Every hotel night must sit in a city your day plan actually visits, on matching dates.",
        "Can I book refundable hotels myself?", "Absolutely — keep them cancellable until the sticker lands, then optimise."],
      ["flight-hold-vs-dummy-ticket", "Flight Holds vs Dummy Tickets: What's Legal for Visa Files", "One verifies, one might not. The price gap is small; the risk gap is enormous.", "A 48–72 hour airline hold timed to biometrics week is the professional standard.",
        "Who arranges holds?", "We do — timed to your appointment so nothing expires mid-queue."],
      ["refundable-booking-visa-strategy", "Refundable Bookings: The Smart Visa Strategy", "Pay a little optionality premium now to avoid rebooking chaos later.", "Refundable fares + free-cancellation stays = a file that survives date shifts without new documents.",
        "Isn't that expensive?", "Usually 10–20% more, refunded or reused after approval — cheaper than one re-file."],
      ["one-way-ticket-visa-application", "One-Way Tickets and Visa Applications: Don't", "An open-ended arrival with no exit plan reads as immigration risk to every officer.", "Always show onward travel within the visa window — even for flexible trips, hold a return."] ] },
  { skel: [["The minimum that matters", "<p>{K}</p>"], ["Buying it right", "<p>Cover the full trip including transit days, from a UAE-licensed provider, with emergency assistance numbers saved offline.</p>"], ["Claiming without tears", "<p>Report incidents within 24 hours, keep every receipt and police/medical report — claims die on missing paper, not small print.</p>"], ["Exclusions that void policies", "<p>Undeclared pre-existing conditions, unlicensed activities, alcohol-related incidents and travel against medical advice. Read the exclusion page before the benefits page — always.</p>"]],
    topics: [
      ["schengen-travel-insurance-30000", "Schengen Travel Insurance: The €30,000 Rule Explained", "The most misunderstood Schengen requirement in one page: coverage floors, valid providers and wording that passes.", "€30,000 medical + repatriation, zero deductible preferred, valid across all Schengen states for the full stay.",
        "Will any UAE insurance do?", "Only if the certificate states Schengen-valid coverage and limits — generic cards get rejected."],
      ["usa-travel-insurance-dubai", "USA Travel Insurance from Dubai: What Coverage You Need", "No legal minimum — but US healthcare prices make strong cover the only sane choice.", "USD 100k+ medical with evacuation; pre-existing conditions declared, not hidden.",
        "Is insurance asked at the interview?", "Rarely — but it strengthens the file and protects the trip; buy before flying regardless."],
      ["family-travel-insurance-uae", "Family Travel Insurance in the UAE: Covering Kids Properly", "One family policy beats four singles — if children's activities and ages are actually declared.", "Declare adventure activities (ski, waterparks, desert sports) or exclusions will bite.",
        "Are infants covered?", "Yes on most family plans — check age bands and add newborns explicitly."],
      ["senior-travel-insurance-dubai", "Travel Insurance for Parents & Seniors from Dubai", "Older travellers face loadings and exclusions — navigate them before paying.", "Disclose conditions fully; compare at least three senior-friendly underwriters on medical caps.",
        "Is there an age cutoff?", "Varies by insurer (commonly 70–85 for new policies) — renewals often extend further."],
      ["travel-insurance-claim-guide", "Travel Insurance Claims: A Step-by-Step That Actually Pays", "Claims succeed on process: notify fast, document everything, file complete.", "The 24-hour rule: notify the insurer within a day of delay, loss or treatment — late notice is the top denial reason.",
        "How long do payouts take?", "2–6 weeks for complete files; incomplete ones stall indefinitely."] ] }
];
const EGROUPS2 = [
  { skel: [["How it works today", "<p>{K}</p>"], ["Preparation that pays", "<p>Answer with dates, figures and ties — short, specific, consistent with the file. Rehearse the awkward questions, not the easy ones.</p>"], ["After the decision", "<p>Approvals: verify the vignette on the spot. Refusals: keep the letter — it maps the fix for re-filing.</p>"], ["If the answer is no", "<p>Don't rebook anything yet. Read which requirement failed, fix it with documents (not arguments), and re-file a visibly stronger case — officers compare against the prior file.</p>"]],
    topics: [
      ["ds-160-form-guide-dubai", "DS-160 Form Guide: Mistakes That Cost USA Applicants Months", "The DS-160 is where USA files are won or lost — long before the interview chair.", "Social-media history, prior refusals and employment dates must match every other document exactly.",
        "Can I edit after submitting?", "Only by filing a new DS-160 and updating the appointment — get it right first time."],
      ["usa-visa-interview-questions-dubai", "USA Visa Interview in Dubai: Questions Asked & How to Answer", "Two minutes, five questions, one decision. Officers test consistency and ties — not English.", "Purpose, funding, ties, history: four themes cover 90% of interviews. Answers under 20 seconds win.",
        "What should I carry?", "Passport, confirmation, fee receipt, plus your ties file — most of it stays in the folder, but carry it."],
      ["usa-administrative-processing", "USA Administrative Processing (221g): What It Means & Timelines", "The yellow/blue slip isn't a refusal — it's verification. Here's what happens next.", "Timelines run weeks to months; keep travel flexible and respond to any follow-ups within days.",
        "Can I expedite it?", "Rarely — but complete, prompt responses to document requests keep the clock moving."],
      ["usa-visa-renewal-dubai", "USA Visa Renewal in Dubai: Interview Waiver Explained", "Many renewals skip the interview — if you qualify and file cleanly.", "Apply before long expiry gaps; expired-over-48-months cases usually re-interview.",
        "Does waiver guarantee approval?", "No — it's a queue skip, not a decision skip. Files still get reviewed."],
      ["uk-funds-rule-visitor-visa", "UK Visitor Visa Funds: How Much Is Enough from Dubai?", "The UK has no fixed number — plausibility against income decides.", "Six months of statements where the trip cost is a comfortable fraction of turnover and savings.",
        "Is there a minimum balance?", "No published figure — officers assess proportionality, not a threshold."] ] },
  { skel: [["The rule", "<p>{K}</p>"], ["Applying it", "<p>Build the itinerary first, then let the rule pick the consulate — never reverse the order to chase slots.</p>"], ["Edge cases", "<p> cruises, multi-centre honeymoons and business-plus-leisure splits need the arithmetic done night by night.</p>"], ["Building travel history", "<p>Each lawful trip with on-time exit strengthens the next file. Start with lenient destinations, keep every boarding pass and stamp scan, and let the record compound.</p>"]],
    topics: [
      ["schengen-90-180-rule-calculator", "Schengen 90/180-Day Rule: Calculator Logic Explained Simply", "The rolling 180-day window confuses everyone. Here's the mental model that never fails.", "Count back 180 days from each planned exit; total Schengen nights inside must stay ≤ 90.",
        "Do past overstays reset?", "No — the window rolls continuously; old nights age out only with time."],
      ["schengen-first-entry-rule", "Schengen First-Entry Rule: Which Consulate to Apply Through", "Longest stay wins; ties break to first entry. Get this wrong and the file starts weak.", "Nights per country, summed honestly — the consulate of the max-nights state owns your file.",
        "Can I enter via another country?", "Yes — the rule governs where you apply, not where you land."],
      ["schengen-multi-year-visa", "Schengen Multi-Year Visas: How the Cascade Works", "Clean travel history unlocks 1, 2 then 5-year stickers — here's the ladder.", "Use prior stickers lawfully (no overstays, respect main-destination patterns) and each renewal climbs.",
        "Can first-timers get long validity?", "Rarely — expect trip-length first, then the cascade."],
      ["schengen-cover-letter-sample", "Schengen Cover Letter: Structure That Officers Respect", "One page, five paragraphs, every claim documented.", "Identity, employment, itinerary, funding, ties — in that order, with annex references.",
        "How long should it be?", "One page. Officers skim; attachments prove."],
      ["uk-genuine-visitor-rule", "UK Genuine Visitor Rule: What It Really Tests", "Beyond documents: does this trip make sense for this person?", "Proportional spend, credible purpose, strong UAE anchors — the three-legged stool.",
        "Do invitations help?", "Only with the inviter's status, address proof and your own ties alongside."] ] },
  { skel: [["Why it works from Dubai", "<p>{K}</p>"], ["Making it smooth", "<p>Direct vs one-stop math, nap-friendly schedules, and the one upgrade worth paying for on each route.</p>"], ["Watch-outs", "<p>Visa lanes, transit-visa traps and minimum connection times at each hub.</p>"], ["Overnight vs dayroom math", "<p>Over 10 hours with an evening arrival, an airport hotel dayroom beats any lounge. Under 8 daytime hours, the city wins. Price both before deciding — dayrooms are cheaper than expected.</p>"]],
    topics: [
      ["doha-stopover-guide-dubai", "Doha Stopover Guide: 8, 24 or 48 Hours from Dubai", "Qatar's stopover program turns a connection into a bonus city — if you pick the right layover length.", "24 hours is the sweet spot: Souq Waqif evening, Corniche morning, lounge-grade rest between.",
        "Do I need a Qatar visa?", "Many nationalities get free transit/VOA — confirm by passport before booking."],
      ["muscat-weekend-dubai", "Muscat Weekend from Dubai: Drive or Fly?", "Oman's capital is the Gulf's easiest reset — mountains, forts and sea in 48 hours.", "Friday-early flyers beat the Hatta road queues; return Saturday night to dodge Sunday fares.",
        "Can I drive with a rental?", "Only with written cross-border permission plus Oman insurance — arrange days ahead."],
      ["istanbul-layover-guide", "Istanbul Layover Guide: Free Tour or DIY from the Airport", "Long Turkish Airlines connections unlock a free city tour — eligibility and timing explained.", "6+ hour daytime layovers qualify for the free tour; under that, airport lounge + rest wins.",
        "Is the new airport far?", "90+ minutes to Sultanahmet each way — the tour handles logistics better than DIY."],
      ["mumbai-layover-dubai-travellers", "Mumbai Layovers for Dubai Travellers: Visas & What Fits", "India connections need planning: e-Visa rules, airport realities and realistic itineraries.", "8+ hours with an e-Visa = Gateway + Colaba; under 6 = stay airside, no contest.",
        "Is transit without visa possible?", "Only staying airside with through-tickets — stepping out needs the e-Visa."],
      ["colombo-stopover-sri-lanka", "Colombo Stopover: Sri Lanka in 24 Hours from Dubai", "Tea, coast and colonial streets are closer than you think via short connections.", "ETA online pre-departure; Galle Face sunset + fort dinner fits a single night perfectly.",
        "Is one day enough?", "For a taste, yes — and it reliably converts visitors into return planners."] ] }
];
const EGROUPS3 = [
  { skel: [["The situation", "<p>{K}</p>"], ["What to do", "<p>Act in this order: airline app first, desk second, insurance third — and screenshot every promise with names and times.</p>"], ["Your rights", "<p>EU261-style protections apply on EU carriers/routes; elsewhere, airline duty-of-care plus your insurance fills the gap.</p>"], ["Travel-day survival kit", "<p>Power bank, water, snacks, passport pouch, insurance number offline, and our 24/7 line saved in the phone. Disruptions are logistics problems — the kit turns them from crises into errands.</p>"]],
    topics: [
      ["missed-connection-rights-dxb", "Missed Connections at DXB: Your Rights & Next Steps", "Tight connection blown? The sequence that gets you rebooked fastest.", "Through-ticket = airline's problem to solve (meals, hotel, rebooking). Separate tickets = your insurance's problem.",
        "Should I accept vouchers?", "For rebooking yes; for compensation claims, keep boarding passes and receipts regardless."],
      ["delayed-baggage-dubai-guide", "Delayed Baggage from Dubai: 21-Day Rules & Claims", "Bags go missing; panic is optional. File before leaving arrivals.", "Property Irregularity Report at the airport counter first — no PIR, no claim. Essentials receipts after.",
        "When is it 'lost'?", "Airlines declare loss at 21 days — interim purchases stay claimable with receipts."],
      ["flight-delay-compensation-uae", "Flight Delays from the UAE: Compensation Reality Check", "What EU261, US rules and airline policies actually pay Gulf travellers.", "EU departures on any airline + EU carriers anywhere = strongest rights; document delay length and cause.",
        "Does weather qualify?", "Extraordinary circumstances usually exclude compensation — but duty of care (meals/hotel) still applies."],
      ["dxb-terminal-transfer-guide", "DXB Terminal Transfers: T1, T2, T3 Without Panic", "Emirates T3 vs everyone-else T1 vs flydubai T2 — minimum times and how to move.", "Inter-terminal needs 90+ minutes realistically; same-terminal self-transfers need 60.",
        "Is there airside transfer?", "Between T1/T3 yes via links; T2 usually means landside + recheck."],
      ["airport-lounge-access-dubai", "Airport Lounge Access from Dubai: Cards, Passes & Paid Entry", "Which credit cards, passes and walk-in rates actually work at DXB and abroad.", "Priority Pass + mid-tier UAE cards cover most needs; walk-in rates run $50–75 — worth it over 3+ hours.",
        "Can I bring guests?", " Usually 1–2 on premium cards; check the quota before promising the family."] ] },
  { skel: [["The opportunity", "<p>{K}</p>"], ["Doing it well", "<p>Compare at least three channels the same morning — spreads move daily and airport counters are consistently worst.</p>"], ["After you land", "<p>Keep exchange receipts for reconversion; unused cash converts back cheapest where you bought it.</p>"], ["Receipt discipline", "<p>Photograph every exchange slip and keep ATM receipts until home. Disputes without paper lose; with paper they take one email.</p>"]],
    topics: [
      ["forex-card-vs-cash-uae", "Forex Cards vs Cash for UAE Travellers: 2026 Comparison", "Multi-currency cards beat airport counters — but cash still wins in three situations.", "Load cards in the trip currency when AED is firm; carry 15–20% in cash for markets, tips and small towns.",
        "Which card is best?", "Low-markup multi-currency cards with free ATM tiers — compare issuance + reload fees, not just headlines."],
      ["atm-fees-abroad-uae-cards", "ATM Fees Abroad with UAE Cards: The Real Cost", "Two fees stack: your bank's plus the local ATM's. Minimise both.", "Fewer, larger withdrawals in local currency; always decline 'convert to AED' at the machine.",
        "Should I accept conversion?", "Never at ATMs or terminals — your home bank's rate beats the machine's margin."],
      ["tipping-culture-travel-guide", "Tipping Cultures by Destination: A Gulf Traveller's Cheat Sheet", "USA 18–22%, Japan essentially none, Europe service-included nuance — get it right.", "When unsure, 10% for good service where tipping exists; forcing it where it doesn't can offend.",
        "Is service charge the tip?", "In much of Europe yes — check the bill before doubling up."],
      ["vat-refund-europe-dubai", "VAT Refunds in Europe for Dubai Shoppers: Step-by-Step", "12–20% back on shopping exists — if you validate before check-in.", "Get customs validation BEFORE bag drop with goods, receipts and passport; then choose your refund channel.",
        "How long do refunds take?", "Cash desks same-day at cost; card/transfer refunds run 2–8 weeks."],
      ["dirham-exchange-timing", "When to Exchange Dirhams: Timing Your Travel Money", "AED rides the dollar peg — watch the destination currency, not ours.", "Track the pair for 2–3 weeks pre-trip; buy steady dips rather than timing the bottom."] ] },
  { skel: [["The idea", "<p>{K}</p>"], ["Planning it", "<p>Season first, venue second, guests third — and a planner or fixed-package operator for anything over 20 heads.</p>"], ["Money wisdom", "<p>Group rates unlock at 10+ rooms; shoulder season doubles the value; keep one kitty-holder with written splits.</p>"], ["Contracts and deposits", "<p>Get venue, planner and group-rate terms in writing with cancellation tiers. Verbal promises evaporate; PDFs don't. Read the force-majeure line before the menu line.</p>"]],
    topics: [
      ["proposal-trip-ideas-dubai", "Proposal Trip Ideas from Dubai: 7 Settings That Work", "Private, photogenic, logistically calm — the proposal triangle.", "Santorini caldera dusk, desert private dinner, Kyoto garden morning: book the photographer before the ring.",
        "Should I tell the hotel?", "Always — upgrades, setups and timing help flow to people who stage these weekly."],
      ["babymoon-ideas-dubai", "Babymoon Ideas from Dubai: Safe, Short & Serene", "Second trimester, short flights, real hospitals nearby — the babymoon formula.", "Maldives, Bali and Georgia all fit under 5 hours with strong medical infrastructure.",
        "When should we fly?", "Most airlines welcome flyers to 36 weeks (28 with twins) — carry the fit-to-fly letter."],
      ["destination-wedding-abroad-uae", "Destination Weddings Abroad for UAE Couples: Legal & Logistic Basics", "Marry abroad without paperwork panic: legal validity, guest logistics and budget anchors.", "Confirm home-country recognition rules first; venues second. Planners pay for themselves past 30 guests.",
        "Is a Bali/Georgia wedding valid back home?", "Depends on nationality and paperwork — verify with your consulate before deposits."],
      ["anniversary-trip-ideas-dubai", "Anniversary Trips from Dubai: By Milestone", "Paper to gold: match the milestone to the magnitude.", "First: Paris long weekend. Tenth: Japan properly. Twenty-fifth: Maldives overwater, no notes.",
        "How early to book?", "Milestone trips deserve 4–6 months — the good suites go first."],
      ["group-travel-uae-friends", "Group Travel from the UAE: Keeping Friends Friends", "The unspoken rules: money transparency, opt-out activities, and one decision-maker per day.", "Collect a shared kitty upfront with written splits; allow daily opt-outs without guilt.",
        "How many is too many?", "Past 8, appoint a planner — democracy doesn't scale to restaurant bookings."] ] }
];
const STAY = (N) => [[`Neighbourhoods that suit Gulf travellers`, `<p>Pick base areas on metro/tram lines with late dining nearby — in ${N}, that tradeoff beats a prettier but isolated quarter every time. Ask us which two streets we'd stay on this season.</p>`], [`Hotel tiers that make sense`, `<p>Business-district 4-stars midweek, old-town boutiques for character nights, and one splurge property only if you'll use its facilities. Breakfast included is worth 10–15% premium with early starts.</p>`], [`Booking tactics`, `<p>Refundable first, optimise after the visa lands. Direct-booking perks (late checkout, upgrades) often beat portal discounts for 4+ night stays.</p>`]];
destinations.forEach(([slug, name]) => {
  addPost(`${slug}-where-to-stay-guide`, `${name}: Where to Stay — Neighbourhood Guide from a Dubai Desk`,
    `Where to stay in ${name}: best areas for Gulf travellers, hotel tiers that make sense and booking tactics that save money.`, "Holidays", nextDate(), destBySlug[slug][4], `${name} — ${destBySlug[slug][5]}`,
    `Hotels decide half your trip. This is where our desk actually books clients in ${name} — areas, tiers and timing.`,
    STAY(name),
    [[`Should I stay central in ${name}?`, `For first visits, yes — transport savings and late-dining options outweigh the premium.`], [`Apartment or hotel?`, `Hotels for short stays (services, breakfast); apartments past 6 nights or for families.`]], TAKE.Holidays);
});
const renderBlogPost = (p, i, all) => {
  const words = (p.intro + " " + p.sections.map(s => s[0] + " " + s[1]).join(" ")).replace(/<[^>]+>/g, "").split(/\s+/).length;
  const read = Math.max(3, Math.round(words / 200));
  const dt = new Date(p.date + "T00:00:00");
  const pretty = `${dt.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dt.getMonth()]} ${dt.getFullYear()}`;
  const rel = [all[(i + 7) % all.length], all[(i + 13) % all.length], all[(i + 29) % all.length]].filter(r => r.slug !== p.slug);
  const toc = `<nav class="takeaways" aria-label="On this page"><b>On this page</b><ul>${p.sections.map(([h], k) => `<li><a href="#s${k + 1}">${h}</a></li>`).join("")}</ul></nav>`;
  return page(`${p.title} | Elite Escape`, p.desc, `/blog/${p.slug}.html`,
    `<section class="hero" style="min-height:56svh"><div class="hero-slides"><div class="hero-slide on">${HEROIMG(p.img, p.alt, 1800, 950)}</div></div><div class="wrap hero-inner" style="padding:150px 0 50px"><p class="hero-kicker"><i></i>${p.cat} · ${pretty} · ${read} min read</p><h1 style="font-size:clamp(2rem,4.6vw,3.6rem)">${p.title}</h1></div></section>` +
    `<section class="sec"><div class="wrap prose" style="max-width:820px"><p class="breadcrumb"><a href="/">Home</a> › <a href="/blog/">Journal</a> › ${p.cat}</p><p class="lede">${p.intro}</p><div class="takeaways"><b>Key takeaways</b><ul>${p.take.map(t => `<li>${t}</li>`).join("")}</ul></div>${toc}${p.sections.map(([h, b], k) => `<h2 id="s${k + 1}">${h}</h2>${b}`).join("")}<h2>Quick answers</h2>${faqsHtml(p.faqs)}<h2>Keep reading</h2><ul>${rel.map(r => `<li><a href="/blog/${r.slug}.html">${r.title}</a></li>`).join("")}</ul>${ASOF}</div></section>`,
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.desc, datePublished: p.date, author: { "@type": "Organization", name: "Elite Escape Tourism" }, image: U(p.img, 1200), dateModified: p.date })}</script>`, U(p.img, 1200));
};

/* push evergreen clusters + stay guides are already added; expand clusters */
[...EGROUPS, ...EGROUPS2, ...EGROUPS3].forEach(g => {
  g.topics.forEach(([slug, title, intro, key, fq, fa], ti) => {
    const G = GENERICS[(slug.length + ti) % GENERICS.length];
    const sections = g.skel.map(([h, b]) => [h, b.replace("{K}", key)]);
    addPost(slug, `${title} — Dubai Guide`, `${title}. Practical, current advice for UAE residents, with step-by-step detail.`, "Travel Tips", nextDate(6), G[0], G[1], intro, sections, [[fq, `<p>${fa}</p>`], ["How do I confirm this for my case?", "<p>Rules vary by passport and month — message us on WhatsApp with your nationality and dates for a personal checklist.</p>"]], TAKE["Travel Tips"]);
  });
});
/* featured 2026 deep-dives (match homepage journal cards) */
addPost("usa-visa-interview-dubai-wait-times-2026", "USA Visa from Dubai in 2026: Interview Waits, Fees & How to Prepare",
  "USA B1/B2 visa from Dubai in 2026: current interview queues, MRV fee, DS-160 pitfalls and the preparation routine that works.", "Visa", "2026-09-02",
  "1501594907352-04cda38ebc29", "Golden Gate bridge, USA",
  "The USA file from Dubai is a two-front effort: a flawless DS-160 plus a calm two-minute interview. Here is the current picture and the preparation routine our desk uses.",
  [["Interview waits right now", "<p>Queues move with consular staffing, not seasons — early-year applicants often wait longer than autumn ones. Book the appointment first, then perfect the file while the date approaches; slots can be rescheduled.</p>"],
   ["DS-160 pitfalls that cost months", "<p>Prior refusals omitted, employment dates that contradict the NOC, and social-media gaps. Every line must match your documents — officers read the form before you sit down.</p>"],
   ["The file order officers like", "<p>Passport, confirmation, fee receipt on top; ties file (NOC, tenancy, family, travel history) tabbed behind. Most of it stays in the folder — its existence is the point.</p>"],
   ["Answer framework", "<p>Purpose, funding, ties, history — 20-second answers, specific figures, no volunteering. Rehearse the awkward questions, not the easy ones.</p>"],
   ["Red flags to avoid", "<p>One-way narratives, vague employment answers, over-documented folders you can't navigate, and mentioning immigration intent even as a joke. Calm, short, documented.</p>"]],
  [["How early should I start?", "The day you pick dates — appointment first, file perfected while you wait."], ["Does travel history matter?", "Enormously for first-timers; Schengen/UK stickers are the best character witnesses."]],
  ["Appointment first, file perfected while you wait", "DS-160 must match documents to the letter", "20-second specific answers win interviews"]);
addPost("schengen-visa-appointment-dubai-2026", "Schengen Slots in Dubai Right Now: How Far Ahead to Book (2026)",
  "Schengen visa appointments in Dubai in 2026: which consulates release when, the 15-day rule and peak-season strategy.", "Visa", "2026-08-15",
  "1431274172761-fca41d930114", "Eiffel Tower from a Parisian street",
  "Schengen capacity, not policy, decides Dubai summers. This is the live picture: release patterns, the 15-day rule, and how far ahead each traveller type should book.",
  [["Release patterns by consulate", "<p>France, Netherlands, Italy, Germany and Spain all release through VAC centres in morning batches — gone within hours in March–August. Our desk monitors daily and grabs the earliest workable date per file.</p>"],
   ["The 15-day rule", "<p>Decisions target 15 calendar days after biometrics — a target, not a promise. Peak loads stretch it; apply 6–8 weeks pre-travel and the rule becomes irrelevant.</p>"],
   ["Peak-season strategy", "<p>Apply up to 6 months ahead for summer Europe. Multi-year sticker holders skip the queue entirely — another reason to build clean history.</p>"],
   ["If slots look full", "<p>Check secondary cities' centres, adjacent consulates under the main-destination rule, and early-morning releases — then let us watch the portal for you.</p>"],
   ["Red flags to avoid", "<p>Slot resellers, transferred appointments, and dummy bookings in the file. Centres cancel resold slots at the door — the queue punishes shortcuts.</p>"]],
  [["France or another consulate?", "Longest stay wins; ties break to first entry — the rule picks, not the queue."], ["Can I travel while the passport is held?", "Only with keep-my-passport options where offered; plan around it."]],
  ["Morning-batch releases vanish in hours in season", "15-day decision target needs 6–8 week buffers", "Main-destination rule picks your consulate"]);
/* airline picks from Dubai (6) */
[["emirates", "Emirates"], ["flydubai", "flydubai"], ["etihad", "Etihad"], ["qatar-airways", "Qatar Airways"], ["turkish-airlines", "Turkish Airlines"], ["oman-air", "Oman Air"]].forEach(([slug, name], ai) => {
  const G = GENERICS[ai % GENERICS.length];
  addPost(`flying-${slug}-from-dubai`, `Flying ${name} from Dubai: Routes, Baggage & When It Wins`,
    `${name} from Dubai/DWC/AUH: where it flies best, baggage logic and when to pick it over rivals.`, "Travel Tips", nextDate(6), G[0], G[1],
    `${name} is a strong pick from the UAE on the right routes — and a needless expense on the wrong ones. Here's the honest breakdown.`,
    [["Where it wins", `<p>Hub-aligned nonstops, generous allowance on higher fares, and schedule depth that protects connections. Compare total trip time, not just sticker fare.</p>`],
     ["Baggage logic", `<p>Cheapest fares carry the thinnest allowance — price the bag before comparing. Sports gear and extra pieces are cheapest prepaid online.</p>`],
     ["When to pick rivals", `<p>One-stop rivals undercut on price to secondary cities; pick ${name} for schedule, service recovery and through-ticket protection.</p>`],
     ["Booking tactic", `<p>Set fare alerts 8 weeks out, check Tuesday departures, and keep dates flexible ±2 days — the curve rewards the patient.</p>`],
     ["Loyalty angle", `<p>Credit the trip to one alliance where possible; a single status-earning year beats scattered miles across three programs. Our desk notes the best crediting partner in your quote.</p>`]],
    [[`Is ${name} good from Dubai?`, `On its strong routes, excellent — match the airline to the mission, not the marketing.`], [`How do I get the lowest fare?`, `Alerts, midweek departures and 6–8 week lead times beat every hack.`]], TAKE["Travel Tips"]);
});
/* render all posts */
BPOSTS.sort((a, b) => a.date < b.date ? 1 : -1);
BPOSTS.forEach((p, i) => put(`blog/${p.slug}.html`, renderBlogPost(p, i, BPOSTS)));
/* blog index with pagination */
const PER = 20;
const ALT_POOL = [...GENERICS, ...destinations.map(d => [d[4], `${d[1]} — ${d[5]}`])];
const card = (p, used) => {
  let im = p.img, al = p.alt;
  if (used && used.has(im)) { const f = ALT_POOL.find(([a]) => !used.has(a)); if (f) { im = f[0]; al = f[1]; } }
  used && used.add(im);
  const dt = new Date(p.date + "T00:00:00"); const pretty = `${dt.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dt.getMonth()]} ${dt.getFullYear()}`; const words = (p.intro + " " + p.sections.map(s => s[1]).join(" ")).replace(/<[^>]+>/g, "").split(/\s+/).length; const read = Math.max(3, Math.round(words / 200)); return `<a class="card-trip" href="/blog/${p.slug}.html"><span class="ph"><img loading="lazy" src="${U(im, 800)}" alt="${al}" width="800" height="680"><span class="dur">${p.cat}</span><span class="price-tab">${read} min read</span></span><span class="bd"><h3>${p.title}</h3><p>${pretty} — ${p.desc.slice(0, 110)}…</p><span class="go">Read article →</span></span></a>`;
};
const pages = Math.ceil(BPOSTS.length / PER);
for (let pg = 1; pg <= pages; pg++) {
  const slice = BPOSTS.slice((pg - 1) * PER, pg * PER);
  const used = new Set(pg === 1 ? ["1488646953014-85cb44e25828"] : []);
  const cards = slice.map(p => card(p, used)).join("");
  const nums = Array.from({ length: pages }, (_, k) => k + 1).map(n => n === pg ? `<span aria-current="page">${n}</span>` : `<a href="${n === 1 ? "/blog/" : `/blog/page-${n}/`}">${n}</a>`).join("");
  const pager = `<nav class="pager" aria-label="Blog pages"><a href="${pg === 1 ? "/blog/" : pg === 2 ? "/blog/" : `/blog/page-${pg - 1}/`}" ${pg === 1 ? 'aria-disabled="true"' : ""}>← Prev</a>${nums}<a href="${pg === pages ? `/blog/page-${pages}/` : `/blog/page-${pg + 1}/`}" ${pg === pages ? 'aria-disabled="true"' : ""}>Next →</a></nav>`;
  put(pg === 1 ? "blog/index.html" : `blog/page-${pg}/index.html`,
    page(pg === 1 ? "Travel Journal 2016–2026: 400+ Dubai Guides on Visas, Holidays & Tips | Elite Escape" : `Travel Journal — Page ${pg} | Elite Escape`,
      pg === 1 ? "400+ detailed travel guides for UAE residents since 2016: visas, holiday costs, itineraries, Dubai attractions and money-saving tips." : `Travel journal page ${pg}: Dubai travel guides on visas, holidays and tips.`,
      pg === 1 ? "/blog/" : `/blog/page-${pg}/`,
      (pg === 1
        ? heroBand("The journal · since 2016", "Four hundred answers, <span class='hl'>one desk.</span>", "Every visa queue, fare season and desert lesson we've learned since 2016 — written for UAE residents, with keywords you actually search.", U("1488646953014-85cb44e25828", 1800), "Traveller planning the journey", "")
        : `<section class="band sec" style="margin-top:86px"><div class="wrap"><p class="breadcrumb" style="color:#9BDCF5"><a style="color:#fff" href="/">Home</a> › <a style="color:#fff" href="/blog/">Journal</a> › Page ${pg}</p><h1 style="color:#fff">Journal — page ${pg}.</h1></div></section>`) +
      `<section class="sec"><div class="wrap"><p class="eyebrow">Page ${pg} of ${pages}</p><h2>${pg === 1 ? "Latest from the journal." : `More stories, page ${pg}.`}</h2><div class="cards">${cards}</div>${pager}${ASOF}</div></section>`));
}
/* category archives */
const CATS = [["visa", "Visa"], ["holidays", "Holidays"], ["uae-icons", "UAE Icons"], ["travel-tips", "Travel Tips"], ["trends", "Trends"]];
for (const [cslug, cname] of CATS) {
  const list = BPOSTS.filter(p => p.cat === cname);
  put(`blog/category/${cslug}.html`, page(`${cname} Articles — Dubai Travel Journal | Elite Escape`, `${list.length} detailed ${cname.toLowerCase()} guides for UAE residents, 2016–2026.`, `/blog/category/${cslug}.html`,
    `<section class="band sec" style="margin-top:86px"><div class="wrap"><p class="breadcrumb" style="color:#9BDCF5"><a style="color:#fff" href="/">Home</a> › <a style="color:#fff" href="/blog/">Journal</a> › ${cname}</p><h1 style="color:#fff">${cname} <span class="hl">(${list.length}).</span></h1></div></section><section class="sec"><div class="wrap"><ul>${list.map(p => `<li><a href="/blog/${p.slug}.html">${p.title}</a> <span class="muted">· ${p.date}</span></li>`).join("")}</ul>${ASOF}</div></section>`));
}

/* ---------- site search (fulfils the WebSite SearchAction target) ---------- */
const SEARCH_DOCS = [
  { u: "/", t: "Elite Escape Tourism Dubai — Holidays, Visas & UAE Icons", d: "Boutique Dubai travel house: 24 holidays, 49 visa desks, 14 UAE icons.", c: "Home" },
  { u: "/holidays.html", t: "Holiday Packages from Dubai", d: "24 hand-walked itineraries from AED 1,299.", c: "Holidays" },
  { u: "/visa.html", t: "Visa Assistance in Dubai — 49 Countries", d: "Checklists, appointments and tracking on WhatsApp.", c: "Visas" },
  { u: "/attractions.html", t: "Dubai Attractions — Safari, Burj Khalifa & More", d: "Daily departures with hotel pickup.", c: "UAE Icons" },
  { u: "/seasonal.html", t: "Seasonal Tours from Dubai", d: "Cherry blossom, winter sun, Eid escapes.", c: "Seasons" },
  { u: "/about.html", t: "About Elite Escape Tourism", d: "Boutique Dubai travel house.", c: "Maison" },
  { u: "/contact.html", t: "Contact Elite Escape Tourism", d: "Call, WhatsApp or request a callback.", c: "Contact" },
  ...destinations.map(d => ({ u: `/destinations/${d[0]}.html`, t: `${d[1]} Holidays from Dubai`, d: d[2], c: "Destination" })),
  ...tours.map(t => ({ u: `/tours/${t[0]}.html`, t: `${t[1]} from Dubai`, d: t[6], c: "Tour" })),
  ...visaCountries.map(c => ({ u: `/visa/${c}-from-uae.html`, t: `${pretty(c)} Visa from Dubai`, d: "Documents, appointment and tracking for UAE residents.", c: "Visa" })),
  ...attractionsList.map(a => ({ u: `/attractions/${a[0]}.html`, t: `${a[1]} Dubai`, d: a[2], c: "Attraction" })),
  ...seasonalSlugs.map(s => ({ u: `/seasonal/${s[0]}.html`, t: pretty(s[0]), d: "Dates, price calendar and packing notes.", c: "Seasonal" })),
  ...guides.map(g => ({ u: `/guides/${g}.html`, t: pretty(g), d: "Dubai-first field guide.", c: "Guide" })),
  ...BPOSTS.map(p => ({ u: `/blog/${p.slug}.html`, t: p.title, d: p.desc, c: p.cat }))
];
out("search-index.json", JSON.stringify(SEARCH_DOCS));
put("search/index.html", page("Search Elite Escape Tourism | Holidays, Visas, Guides", "Search 600+ Dubai travel guides: holidays, visas, attractions and tips.", "/search/",
  bandHead("Search", "Find it in <span class='hl'>seconds.</span>", "600+ holidays, visa desks, guides and journal articles.", "") +
  `<section class="sec"><div class="wrap"><div class="field"><label for="sq">Search this site</label><input id="sq" name="q" type="search" placeholder="Try: Japan visa, safari, Bali cost…" autocomplete="off"></div><p class="muted" id="scount" aria-live="polite"></p><ul id="sresults" style="list-style:none;padding:0;display:grid;gap:10px"></ul><noscript><p>Search needs JavaScript — or <a href="/blog/">browse the journal</a> and <a href="/visa.html">visa desks</a>.</p></noscript></div></section>
<script>
(function(){var q=document.getElementById('sq'),box=document.getElementById('sresults'),n=document.getElementById('scount'),D=[];
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function run(){var s=q.value.trim().toLowerCase(),toks=s.split(/\\s+/).filter(Boolean),hits;
if(!toks.length){hits=D.slice(0,12);n.textContent='Popular right now:'}
else{hits=D.filter(function(d){var h=(d.t+' '+d.d).toLowerCase();return toks.every(function(k){return h.indexOf(k)>-1})}).slice(0,30);n.textContent=hits.length+' result'+(hits.length===1?'':'s')+' for \\u201C'+q.value.trim()+'\\u201D'}
box.innerHTML=hits.map(function(d){return '<li class=\"panel\" style=\"padding:14px 18px\"><a href=\"'+d.u+'\"><b>'+esc(d.t)+'</b></a><br><small class=\"muted\">'+esc(d.c)+' · '+esc(d.d.slice(0,120))+'</small></li>'}).join('')||'<li>No matches — try fewer words, or <a href=\"https://wa.me/971555753133\">ask us on WhatsApp</a>.</li>'}
fetch('/search-index.json').then(function(r){return r.json()}).then(function(j){D=j;var m=new URLSearchParams(location.search).get('q');if(m){q.value=m}run();q.addEventListener('input',run)}).catch(function(){n.textContent='Search is unavailable offline — try the journal instead.'});
q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();run()}});
})();</script>`));

/* ---------- seo files ---------- */
out("assets/brand/favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#283B90"/><stop offset="1" stop-color="#53C9E0"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="44" font-family="Georgia,serif" font-style="italic" font-weight="bold" font-size="36" fill="#fff" text-anchor="middle">e</text></svg>`);
out("manifest.webmanifest", JSON.stringify({ name: "Elite Escape Tourism", short_name: "Elite Escape", start_url: "/", display: "standalone", background_color: "#F3F8FC", theme_color: "#283B90", icons: [{ src: "/assets/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/assets/brand/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "/assets/brand/favicon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2));
const walk = (dir, base = "") => { let f = []; for (const e of readdirSync(dir)) { const p = join(dir, e); const rel = base + "/" + e; if (statSync(p).isDirectory()) { if (["assets", "data", "scripts", "dist", ".git", "node_modules"].includes(e)) continue; f.push(...walk(p, rel)); } else if (e.endsWith(".html")) f.push(rel.replace(/\/index\.html$/, "/").replace(/\.html$/, "")); } return f; };
const allUrls = [...new Set(["/", ...walk(root).map(u => (u.startsWith("/") ? u : "/" + u)).filter(u => !u.includes("404"))])].sort();
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const sm = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls.map(u => `<url><loc>${SITE}${u === "/index" ? "/" : u}</loc><lastmod>${BUILD_DATE}</lastmod><changefreq>${u === "/" ? "daily" : "weekly"}</changefreq><priority>${u === "/" ? "1.0" : u.split("/").length <= 2 ? "0.8" : "0.6"}</priority></url>`).join("")}</urlset>`;
out("sitemap.xml", sm);
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log("PAGES:", allUrls.length);
