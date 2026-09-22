# DESIGN PROMPT — ELITE CLINIC (Men's Health, by Dr. Osama Ghattas)

> Paste this into a new Claude session and attach the brand-board image.
> Ask for the brand system first, then the screens in batches.

---

## 0. WHAT I WANT FROM YOU

Design a complete, production-ready digital product for a premium men's health clinic:
a **public marketing website** + a **patient portal** (logged-in area) + a **new brand identity**.

Work in this order, and stop after each stage so I can react:

1. **Brand identity** — logo concepts, color system, typography, iconography, motion rules
2. **Design system** — tokens + every component, light and dark
3. **Public site** — all pages, desktop + mobile
4. **Patient portal** — all screens, desktop + mobile
5. **Prototype** — the two critical flows clickable: *book an appointment* and *download my scan report*

Deliver as high-fidelity HTML/CSS artifacts (real, interactive, responsive) — not static images,
not wireframes. Every screen must be real enough that a developer can build straight from it.

---

## 1. THE BUSINESS

**Elite Clinic — Men's Health, by Dr. Osama Ghattas.** A premium, appointment-only men's health
clinic in Sheikh Zayed, Egypt.

- **Audience:** men 30–55, affluent / upper-middle class, Zayed and nearby Cairo districts.
  Health, fitness and performance conscious. They are paying for *discretion* as much as medicine.
- **Core promise:** "More than treatment — a higher standard of care."
- **Four pillars:** Expertise · Privacy · Discretion · Results
- **Four operational promises:** Total Privacy (discreet entrance, private spaces) ·
  Luxury Experience · Dedicated patient-relations team · No Waiting Time (appointment-based)
- **Patient flow:** Book → discreet arrival & check-in → consultation → follow-up & continuous care
- **Services:** Andrology · Men's Health · Sexual Health · Fertility · Hormone Balance ·
  General Urology · Diagnostic imaging (ultrasound/doppler) · Lab & blood panels
- **Taglines already approved:** "Your Health. Our Priority." · "Expert Care. Complete Privacy." ·
  "No Waiting Time." · "Men's Health. Redefined." · "Invest in your health, it's your greatest asset."

**The emotional job of this product:** a man with a private, possibly embarrassing health concern
should feel like he walked into a members' club, not a hospital. Calm, controlled, expensive, safe.
Nothing about the interface should feel clinical, cheap, sales-y, or exposed.

---

## 2. BRAND IDENTITY (new — build this first)

### Keep the palette, rebuild everything else

| Role | Hex | Use |
|---|---|---|
| Navy | #0E2A47 | primary brand surface, headers, dark sections |
| Gold | #C7A86E | accent only — CTAs, rules, monogram, active states |
| Cream | #F7F7F5 | light background, cards |
| Gray | #6B7890 | secondary text, borders, muted UI |

Extend it yourself into a full system (do not just use 4 colors):

- Navy ramp: a deeper ink for dark-mode surfaces (~#071B2F) through to a soft navy tint
- Gold ramp: a muted gold for borders/hover, a pale gold wash for highlight blocks
- Neutrals: 8–10 steps from cream to near-black, tuned warm (never cold blue-gray)
- Semantic: success / warning / error / info — desaturated so they never fight the gold.
  Error must never be a screaming red; use a deep oxblood.
- **Gold rule:** gold is a jewel, not a paint. It appears as fills on primary buttons, thin rules,
  the monogram, and small active indicators. Never gold body text on cream (fails contrast),
  never large gold backgrounds, never gold gradients.

### Logo — the letter **G** only

Design **5–6 distinct G monogram concepts**. Not the old interlocking "EG". A single G.
Explore directions such as:

- geometric G built from one constant-weight stroke with a precise gap
- G whose counter reads as a shield or an enclosed private space (privacy metaphor)
- high-contrast didone-style G, very luxury / editorial
- G cut from a navy square or circle, negative space
- G with a subtle horizontal bar that doubles as a rule/underline in layouts

For the **chosen direction**, deliver:

- primary lockup (G + "ELITE CLINIC" + "MEN'S HEALTH" + "by Dr. Osama Ghattas")
- horizontal lockup, stacked lockup, icon-only
- light-on-navy and navy-on-cream versions, plus a single-color version
- favicon 32px, app icon, social avatar — must stay legible at 24px
- clear-space and minimum-size rules, and 4 misuse examples

### Typography

Pair a **high-contrast display face** (editorial, quietly luxurious) with a **clean modern grotesque**
for UI and body. Use web fonts that are actually available. Suggested starting pairs — pick one and
justify it in a sentence:

- *Instrument Serif* or *Fraunces* (display) + *Geist* or *Inter Tight* (UI)
- *Cormorant Garamond* (display) + *Satoshi* (UI)

**Arabic:** the site must support Arabic. Pair with *IBM Plex Sans Arabic* or *Almarai*, matched on
x-height and weight so a bilingual page never looks patched together.

Define a full type ramp: display 1–3, H1–H6, body L/M/S, caption, label, numeric (tabular figures
for results, prices, dates). Letter-spacing rules for the all-caps small labels the brand uses.

### Look and feel — what "sexy and sleek" means here

DO:

- generous negative space; let the page breathe like a luxury hotel site
- large editorial imagery, deep navy sections alternating with cream sections
- thin 1px gold or gray rules as structure instead of heavy boxes
- soft, low, wide shadows — or no shadow at all, just tonal separation
- subtle grain/noise texture on dark sections so navy never looks flat
- radius: small and consistent (6–10px). Pills only for chips/tags.
- motion: slow and confident — 300–500ms, custom ease, fade + 8–16px rise on scroll.
  Micro-interactions on hover: a gold underline drawing in, a card lifting 2px.
- numbers and data presented with editorial precision (tabular figures, aligned decimals)

DON'T:

- no generic SaaS look: no purple/blue gradients, no blobs, no floating 3D shapes
- no stock photos of smiling doctors with folded arms or thumbs-up
- no emoji as icons — use one consistent line-icon set, 1.5px stroke, 24px grid
- no bouncy/springy animation, no parallax carnival, no autoplaying sound
- no drop shadows on everything, no glassmorphism everywhere
- no exclamation marks in copy, no urgency banners, no "LIMITED OFFER"
- nothing that shouts a sexual-health service on a screen a stranger could glance at

### Privacy as a design feature (this is the differentiator — design it, don't just say it)

- **Discreet Mode toggle** in the portal: blurs/abbreviates service names, diagnoses and doctor
  names on screen until tapped. Persisted per device.
- Notifications and emails described as "Elite Clinic — appointment reminder", never the service name.
- A visible "Who can see this?" affordance on any medical record.
- Auto-lock the portal after inactivity, with a soft lock screen (blur + monogram), not a logout.
- A dedicated **Privacy & Confidentiality** page written like a promise, not a legal document.

---

## 3. DESIGN SYSTEM

Deliver a documented system page showing tokens and every component in all states
(default / hover / focus-visible / active / disabled / loading / error), in **light and dark**.

**Tokens:** color, typography, spacing (4px base, 4→128), radius, border, shadow, z-index,
duration & easing, breakpoints (390 / 768 / 1024 / 1440 / 1920).

**Components needed:**

- buttons (primary gold, secondary navy outline, ghost, destructive, icon, split)
- input, textarea, select, combobox, phone input with Egypt country code, OTP input,
  date picker, time-slot picker, file upload / dropzone, search with suggestions
- checkbox, radio, switch, slider, segmented control
- card (content, service, doctor, article, video, package, result)
- tabs, accordion, breadcrumb, pagination, stepper/wizard, sidebar nav, bottom nav (mobile)
- table (sortable, sticky header, responsive → card collapse), data row, document row
- badge / status chip (Pending · Ready · Completed · Cancelled · Paid · Unpaid · Action needed)
- avatar, rating stars, quote/testimonial, timeline item, stat tile
- modal, bottom sheet, drawer, popover, tooltip, toast, inline alert, confirmation dialog
- skeleton loaders, empty states (illustrated, on-brand, never a sad face), error states, 404
- video player card, reel card, PDF/scan preview card, map embed, WhatsApp float button
- cookie consent (minimal, privacy-first, decline is equally easy)

---

## 4. PUBLIC WEBSITE — screens

Design each at **1440** and **390**. Every page needs a real content draft (see §6 on placeholders).

1. **Home** — scroll-told story:
   hero (monogram, "Your Health. Our Priority.", "Expert Care. Complete Privacy.", Book CTA,
   discreet secondary CTA "Ask privately on WhatsApp") ·
   trust strip (Expert Doctors · Modern Facilities · Discreet & Private · Online Payment) ·
   short about Dr. Osama with portrait and credentials ·
   services grid (6–8 cards, icon + one line) ·
   the Elite Clinic experience (privacy, luxury, no waiting — with interior photography) ·
   how it works (the 4-step flow, animated on scroll) ·
   featured video from the doctor ·
   reviews summary (aggregate rating + 3 cards + link to all) ·
   latest articles (3) ·
   packages/prices teaser ·
   location with map + hours ·
   booking CTA band ·
   footer (nav, services, legal, socials, WhatsApp, newsletter, clinic license/registration line)

2. **About the clinic** — story, philosophy, facility tour gallery, technology, accreditations, team grid

3. **Dr. Osama Ghattas** — full profile: portrait, credentials timeline, specialisations,
   publications/talks, media appearances, his videos, a personal statement, book-with-him CTA

4. **Team member profile** (template for other doctors / nurses / patient-relations staff)

5. **Services index** — grouped by category, filterable

6. **Service detail** (one reusable template, shown for 2 examples):
   what it is · who it's for · what happens in the visit (step by step) · duration ·
   preparation instructions · what it costs · what technology is used · which doctor ·
   FAQs specific to the service · related services · related articles · related videos ·
   discreet "Not sure? Ask privately" block · book CTA

7. **Prices & packages** — transparent price table, comparison of packages
   (e.g. Consultation / Full Men's Health Screening / Hormone Panel / Fertility Workup),
   what's included, instalment or package pricing, insurance note. All prices in **EGP**.

8. **Booking flow** — the most important flow. Multi-step, ≤4 minutes, works logged-out:
   - Step 1: What do you need? — *Consultation · Diagnostic scan · Blood/lab test ·
     Follow-up visit · Telehealth consultation · Home sample collection*
   - Step 2: Choose service / package (with price shown live)
   - Step 3: Choose doctor (or "first available")
   - Step 4: Date + time slot (calendar, real availability, timezone-safe, "next available" shortcut)
   - Step 5: Your details (name, phone + OTP, email, first visit or returning, optional note,
     "How did you hear about us?")
   - Step 6: Payment — pay now (card / wallet / Fawry-style reference) or pay at clinic; deposit option
   - Step 7: Confirmation — reference number, add to calendar, directions, what to bring,
     preparation instructions, reschedule/cancel policy, WhatsApp confirmation
   - Design the **summary rail** that persists across steps, the mobile version of it,
     the error / timeout / slot-just-taken states, and the "save my progress" behaviour.

9. **Reviews** — aggregate score, distribution bars, verified-patient badge, filter by service,
   sort, individual review cards with clinic reply, and a **leave a review** flow
   (only reachable after a completed visit, from the portal — show the gate)

10. **Videos / Media** — grid of Dr. Osama's videos: educational talks, procedure explainers,
    clinic tour, short reels. Category filter, search, duration badges, and a video detail page with
    transcript, chapters, related videos, and a book CTA under the player.

11. **Articles / Knowledge** — index with categories and search; **article page** with
    reading time, author box (doctor-reviewed badge + review date), table of contents,
    pull quotes, references, share, related articles, discreet CTA. Design the typography
    of a long read properly — this page is how the clinic earns Google traffic.

12. **FAQ** — grouped, searchable, accordion

13. **Contact & Location** — map, exact address, discreet-entrance guidance, parking,
    phone, WhatsApp, email, working hours, contact form, emergency note

14. **Privacy & Confidentiality** — the promise page described in §2

15. **Legal** — Terms, Privacy Policy, Refund & Cancellation, Cookie Policy (plain, readable)

16. **Careers** (light), **Search results**, **404**, **Maintenance**, **Coming-soon holding page**

---

## 5. PATIENT PORTAL — screens

Logged-in area at `/my`. Same brand, denser, calmer, no marketing.

1. **Auth** — sign in with phone + OTP (primary) or email + password; sign up; forgot password;
   OTP screen; device-trust prompt; auto-lock screen; session expired

2. **Dashboard** — next appointment card (countdown, directions, join-telehealth button) ·
   results awaiting review · action-needed items (unpaid invoice, unsigned consent, prep instructions) ·
   quick actions (book, message clinic, download a report, refill prescription) ·
   care plan progress · recent documents

3. **Appointments** — upcoming / past tabs; appointment detail with status timeline
   (Requested → Confirmed → Checked in → Completed), reschedule, cancel (with policy),
   add to calendar, prep instructions, doctor, location, invoice link, post-visit summary

4. **Book** — the same booking flow, pre-filled from the profile (show the shortened version)

5. **Medical history** — a chronological **timeline**: visits, diagnoses, procedures, prescriptions,
   vitals, allergies, conditions, family history, lifestyle. Filter by type and date range.
   Each entry expands to full detail with the doctor's notes. Export whole history as PDF.

6. **Results & documents** — design this properly, it is a headline feature:
   - list/grid of documents: **imaging scans, blood panels, lab reports, prescriptions,
     medical reports, invoices, consent forms, referral letters, sick notes**
   - each row: title, type icon, service, doctor, date, status chip (Pending / Ready / Reviewed),
     size, and actions (view, download, share securely, print)
   - **document viewer**: in-browser preview of PDFs and scan images, zoom/pan, page nav,
     side-by-side doctor's interpretation note, "explain this result" link to a related article
   - **blood test results view**: table of analytes with value, unit, reference range, and a
     visual in/out-of-range indicator; trend chart when a test repeats over time; flagged values
     summarised at the top in plain language
   - **compare over time**: select two dates and see what changed
   - download single file, download all as ZIP, secure share link with expiry
   - empty state, pending state ("your results will appear here, usually within 24–48h"),
     and the notification that fires when a result is ready

7. **Prescriptions & treatment plan** — current medications, dosage, schedule, refill request,
   reminders toggle, past prescriptions, downloadable prescription PDF

8. **Messages** — secure thread with the clinic / patient-relations team; attachments;
   read receipts; response-time expectation; a clearly marked "not for emergencies" notice

9. **Payments & invoices** — invoice list, invoice detail, download receipt PDF, saved cards,
   package balance remaining, instalments

10. **Consents & forms** — pending forms to complete before a visit, e-signature, signed archive

11. **Profile & settings** — personal & contact info, emergency contact, insurance details,
    language (AR/EN), notification preferences per channel (SMS / WhatsApp / email / push),
    **Discreet Mode**, password & 2FA, trusted devices, download my data, delete my account

12. **Notifications centre** — grouped by type, read/unread, deep links

13. **Refer a friend** — discreet, tasteful; no gamification

Design the **empty state for every single one of these** — a brand-new patient logs in and
must still feel the product is alive and expensive.

---

## 6. RULES

- **Responsive:** design mobile (390) and desktop (1440) for every screen; state what happens at
  768 and 1024. Mobile gets a bottom nav in the portal and a sticky Book button on the public site.
- **Bilingual:** full English and Arabic. Show at least Home, Booking step 3, and the Results
  screen in **Arabic RTL** — properly mirrored (nav, icons, progress, charts), Arabic typography
  sized up slightly, and Western digits kept for medical values and prices.
- **Accessibility:** WCAG 2.2 AA. Every text/background pair must pass — check gold on navy and
  gold on cream and fix rather than excuse. Visible focus rings (gold, 2px, offset).
  Hit targets ≥44px. Motion respects `prefers-reduced-motion`. Full keyboard path through booking.
- **Dark mode:** a real one, not inverted. Navy-ink surfaces, warm neutrals, gold dimmed slightly.
- **Performance-aware:** no design that needs 12 web fonts or a 40MB hero video.
- **Placeholders:** there are no real photos, prices, or CV details yet.
  Use clearly labelled placeholder copy and describe each image slot in one line
  (subject, crop, mood) so a photographer can shoot to it. **Do not invent medical claims,
  credentials, statistics, patient testimonials or certifications** — mark them `[PLACEHOLDER]`.
- **Ad compliance:** landing copy should read as men's health / urology / hormone health so that
  Meta and Google ads stay approvable. Keep explicit sexual-health wording on deeper pages.
- **Currency:** EGP, formatted Egyptian-style. Phone: Egyptian format. Times: 12-hour, Africa/Cairo.

---

## 7. DELIVERABLES

1. Brand identity artifact — logo concepts, chosen direction, full color system with contrast
   checks, type specimen, icon set, motion spec
2. Design system artifact — tokens + all components, light & dark, all states
3. Public site artifact — every page in §4, desktop + mobile, real scrolling and interaction
4. Portal artifact — every screen in §5, desktop + mobile
5. Two clickable prototypes: **book an appointment** end-to-end, and
   **log in → open results → view a blood panel → download the PDF**
6. A one-page handoff note: the decisions you made, what still needs client input,
   and the content list the clinic must supply

Start with **stage 1 (brand identity)** only. Show me the logo concepts and the color/type system,
then wait for my feedback before moving on.
