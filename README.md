# Elite Clinic — Men's Health, by Dr. Osama Ghattas

Public website, online booking, a patient portal, and a clinic-side mobile app
prototype for a private men's health clinic in Sheikh Zayed, Egypt.

Built for a pitch: everything runs, nothing is connected to a real system, and
every name, price, credential and medical result in the repo is invented.

---

## What is in here

| | |
|---|---|
| **Website** | 10 pages — home, services, service detail, the doctor, international, journal, article, contact, privacy, 404 |
| **Elite Passage** | The international patients programme: a ten-step journey, three tiers, and an enquiry form that accepts a foreign number |
| **Booking** | 4-step flow with deep links, deterministic slot generation, Egyptian phone validation |
| **Patient portal** | Sign-in, dashboard, appointments, results & documents, lab tables with reference ranges, medical history, medication, invoices, settings |
| **Clinic app** | The clinic-side mobile app as one working iPhone — 20 screens, real back stack, booking wizard — `public/prototype/elite-clinic-app.html` |
| **Patient app** | The same app from the patient's side — 27 screens: visits, records, results with reference ranges, history, medications, care plan, payments — `public/prototype/elite-clinic-patient-app.html` |

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
- International programme — `/international`
- Clinic app prototype — `/prototype/elite-clinic-app.html`
- Patient app prototype — `/prototype/elite-clinic-patient-app.html`

Both prototypes live in `public/`, so Vite copies them into `dist` and they
ship with the site at those URLs. Each is a single self-contained HTML file
that also opens directly from disk with no server — those are the copies to
send a client.

They share one chassis: the same stylesheet, the same navigation engine, the
same device frame. On a screen narrower than 760px the frame is dropped
entirely and the app becomes the page, because a phone drawn inside a real
one wastes a third of the screen.

```bash
npm run build       # typecheck, then production build
npm run typecheck   # types only
```

### Deploying

**Live on GitHub Pages — two versions of the site, one source:**

- Website, no photograph — <https://band-agents.github.io/elite-clinic/>
- Website, with the portrait — <https://band-agents.github.io/elite-clinic/with-photo/>
- Patient app — <https://band-agents.github.io/elite-clinic/prototype/elite-clinic-patient-app.html>
- Clinic app — <https://band-agents.github.io/elite-clinic/prototype/elite-clinic-app.html>

```bash
npm run deploy:pages
```

That builds twice — once plain and once with `VITE_HERO_PHOTO=1` — writes a
`404.html` copy of the shell so client-side routes survive a direct hit, and
force-pushes both into `gh-pages`. Each needs its own Vite base, which is why
they are separate builds rather than one copied twice: asset URLs are baked in.

Only the hero differs between them. Everything else is the same components.

**Do not set `VITE_BASE` on a Git Bash command line.** MSYS rewrites anything
shaped like a Unix path, so `/elite-clinic/` becomes
`/Program Files/Git/elite-clinic/` and every asset URL points into nowhere —
the page loads blank with no error. The deploy script sets it in-process
instead. If a change does not appear, Pages may not have rebuilt:
`gh api -X POST repos/band-agents/elite-clinic/pages/builds`.

---

### Vercel

`vercel.json` rewrites everything to `index.html` so client-side routes survive
a direct hit or a refresh, with `/prototype/*` excluded so the static file is
served as itself rather than as the SPA shell.

It also sets `X-Robots-Tag: noindex, nofollow` on every response, mirrored by a
meta tag in `index.html`. That stays until the clinic signs off the content:
the site names a real doctor and every credential, price and review in it is
invented.

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

**Type is the hospital's too** — **Fraunces** for display, **IBM Plex Sans
Arabic** for body and UI. Plex is comfortable at 15px and keeps an Arabic build
a font swap rather than a redesign.

All tokens live in `src/index.css` under `@theme`.

### The identity is editorial, not clinical

What the two sites do **not** share is the decoration. A general hospital earns
trust by looking like a hospital — heart traces, pulse rings, the medical
cross. A private men's clinic does not: the men this place is for are avoiding
anything that looks like a hospital.

So there is no ECG, no vitals, no floating stethoscopes. The vocabulary in
`src/components/editorial.tsx` is magazine furniture instead — `SplitText`
(masked words that rise), `RuleDraw` (hairlines that draw themselves in),
`IndexNum` (oversized numerals in the margin), `Kicker` (wide-tracked small
caps on a rule), `Drift` (slow scroll parallax) and `WordMarquee`. Plus a
contents strip under the hero and an offset, framed portrait.

The hero's atmosphere is `.u-hero-field` — three drifting radial washes plus
grain, in CSS. The hospital rendered an mp4 with Remotion; that is a 6MB
asset, a render step, and a path that 404s the moment the site is not served
from `/`.

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

Two more, paid for in this build:

- **`SplitText` triggers on the heading, never on the word.** A masked word
  starts translated 118% down inside an `overflow: hidden` wrapper, so it has
  no visible area at all — put `whileInView` on the word and
  IntersectionObserver reports it permanently out of view, the reveal never
  fires, and the headline stays blank forever. It ate the hero once.

- **The words are separated by a real space, not by padding.** Spacing them
  with `pr` alone renders correctly but leaves the heading's textContent as
  `Men'shealth,handledprivately.` — which is what a screen reader announces,
  what a copy-paste produces, and what a crawler indexes.

Also: `wouter` v3 renders its own `<a>`, so a link wrapping one needs
`<Link asChild>` or you get nested anchors. And the header's two skins are
driven by `DARK_HERO` in `Nav.tsx`, shared with `App.tsx` — a route listed
there gets white nav type and no top padding, so getting it wrong costs either
the navigation or the layout.

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
