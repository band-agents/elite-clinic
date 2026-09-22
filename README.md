# Elite Clinic — Men's Health, by Dr. Osama Ghattas

Public website, online booking, a patient portal, and a clinic-side mobile app
prototype for a private men's health clinic in Sheikh Zayed, Egypt.

Built for a pitch: everything runs, nothing is connected to a real system, and
every name, price, credential and medical result in the repo is invented.

---

## What is in here

| | |
|---|---|
| **Website** | 9 pages — home, services, service detail, the doctor, journal, article, contact, privacy, 404 |
| **Booking** | 4-step flow with deep links, deterministic slot generation, Egyptian phone validation |
| **Patient portal** | Sign-in, dashboard, appointments, results & documents, lab tables with reference ranges, medical history, medication, invoices, settings |
| **Clinic app** | 19-screen interactive HTML prototype of the clinic-side mobile app — `prototype/elite-clinic-app.html` |

---

## Running it

```bash
npm install
npm run dev
```

Dev server on **http://localhost:5195**.

- Website — `/`
- Booking — `/book` (or `/book?service=andrology` to deep-link a service)
- Patient portal — `/portal` (any phone number and any six digits sign you in)
- Clinic app prototype — `/prototype/elite-clinic-app.html`

The prototype is a single self-contained HTML file. It also opens directly from
disk with no server — that is the copy to send a client.

```bash
npm run build       # typecheck, then production build
npm run typecheck   # types only
```

---

## Design system

The palette, spacing, utilities and motion are carried over intact from the
Al-Madinah Hospital site, with one substitution: the clinical blue
`hsl(208 84% 32%)` is replaced by the clinic's navy, **`#0E2A47` =
`hsl(211 67% 17%)`**. Mint, coral, sand, surface, line and the ink ramp are
unchanged, so the two sites read as work from the same studio.

Navy is considerably darker than the blue it replaces. `--color-brand-lift`
therefore carries the jobs that need a lighter tone — focus rings, links on
dark panels — rather than being a simple tint of `--color-brand`.

**Type** is the one deliberate departure. Fraunces gives way to **Instrument
Serif** for display: higher contrast, tighter, more editorial. Body and UI stay
on **IBM Plex Sans Arabic**, which is comfortable at 15px and keeps an Arabic
build a font swap rather than a redesign. Swapping the display face is a
one-line change in `src/index.css`.

All tokens live in `src/index.css` under `@theme`.

---

## Things worth knowing before you change something

Three bugs from the Al-Madinah build are fixed here by construction. Each one
is commented at the site of the fix:

- **Nothing load-bearing is gated on an animation.** The header has no entry
  animation at all — it once slid in from `y: -70` and stranded off-screen when
  the tween was interrupted, leaving a page with no navigation. The booking
  form has no `AnimatePresence mode="wait"`, which used to freeze the form when
  an exit tween was cut short. Every reveal variant animates opacity on an
  element that is already in the DOM and laid out.

- **Day keys are built from local date parts**, never
  `toISOString().slice(0,10)`. Cairo is UTC+3, so the UTC form stores the
  booking a day earlier than the one the patient tapped.

- **Egyptian phone validation accepts the trunk `0`** (`01012345678`) as well
  as `+20` and `20`. An earlier regex required the number to start with `1`,
  which rejected every number written the way the field's own placeholder asks
  for it.

Also: `wouter` v3 renders its own `<a>`, so a link wrapping one needs
`<Link asChild>` or you get nested anchors.

---

## The privacy features are real features

This is the part that distinguishes the clinic, and it is built rather than
claimed:

- **Discreet mode**, on by default in the portal — service names, diagnoses and
  doctor names blur until tapped, so a glance over a shoulder shows nothing.
  `.u-discreet` in `index.css`, the `Veil` component in `Portal.tsx`.
- Every message the clinic sends is described in the copy as naming only
  "Elite Clinic" and a time — never a service or a test.
- Lab results carry reference ranges, in-range indicators and a plain-language
  consultant's note. A PDF of numbers a patient cannot read is homework, not a
  result.

---

## What is placeholder

Everything marked `[PLACEHOLDER]`, plus all of `src/data/clinic.ts` and all of
`src/data/portal.ts`. Specifically, before this goes near a live domain the
clinic must supply:

1. Dr. Osama's real CV, credentials and biography
2. Real prices for every service
3. Real address, phone, WhatsApp number and working hours
4. Photography — every `<Shot>` states the subject and crop it needs
5. Clinical review of the three journal articles
6. A legal privacy policy, and a decision on where patient data is hosted

No credential, statistic, accreditation or patient testimonial in this repo has
been verified. They are sized to the layout, not researched.

---

## Still to decide

- **Booking backend.** The flow posts nowhere. A real deployment replaces one
  `setTimeout` in `Book.tsx` and nothing above it changes.
- **Payments.** Paymob or Fawry, and whether a deposit is taken at booking.
- **The portal is a demo.** Real accounts, real medical records and real file
  storage are a separate build with a serious conversation about hosting
  jurisdiction attached to it.
- **Arabic.** The type pairing and the RTL utilities are in place; the content
  layer is not.

---

## Stack

React 19 · Vite 7 · Tailwind 4 · wouter · Framer Motion · lucide-react ·
TypeScript. No component library — the site has about ten primitives and a
dependency would cost more than it saves.
