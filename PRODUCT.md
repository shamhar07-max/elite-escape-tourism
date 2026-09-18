# PRODUCT.md — Elite Escape Tourism (redesign)

## Offer
Dubai-based boutique travel house: holiday packages from UAE, worldwide visa assistance, UAE attractions (desert safari, dhow cruise, theme parks), flights/hotels/transfers/insurance.

## Users & jobs
- UAE residents (expats + Emiratis) planning outbound holidays (Japan, Georgia/Armenia, Bali, UK, France, Russia).
- Tourists in Dubai seeking desert safari / city icons.
- Visa-anxious travellers needing document checklists + WhatsApp concierge.
- Primary tasks: find a package → check price/duration → WhatsApp/call to book; find visa country → see requirements → start inquiry; find attraction → see timings/pickup → book.

## Facts (from live-site scrape 2026-09-09)
- Phone/WhatsApp: +971 55 575 3133. Emails seen: inquiries@ and info@eliteescapetourism.com (inconsistent — normalize to info@).
- Address conflict: "City Gate Building Hashtag Business Center, M Floor, Office 16" (footer) vs "Office 305, Damas Dubai Tower, Rigga Buteen (by appointment)" (contact). Flag as NEEDS INPUT; use footer address as canonical until confirmed.
- 6 live packages: Japan 7D/6N AED4000; Georgia&Armenia 7D/6N AED2000; Bali 5D/4N AED1299; Russia 4D/5N (order suspect) AED2400; UK 6D/5N AED4100; Paris 6D/5N AED5000.
- Visa list: USA, UK, Canada, Australia, China, Singapore, Indonesia, Georgia, Philippines, France + UAE tourist/business/transit.
- Hours listed Mon–Fri 9–5 (suspect for travel; mark as stated, recommend 7-day concierge line).

## Non-goals
- No online checkout/payments in v1 (WhatsApp + form inquiry only — honest, no fake booking engine).
- No invented reviews/prices/testimonials. All stats labelled or omitted.

## Content gaps (NEEDS INPUT)
- DTCM / trade licence number, IATA accreditation, Google review score + link, real photography licences, exact visa fees/timelines per country, final office address + hours.
