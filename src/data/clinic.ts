/**
 * Everything the site knows about the clinic.
 *
 * ⚠ ALL CONTENT HERE IS PLACEHOLDER pending the client's sign-off — prices,
 * credentials, the team beyond Dr. Osama, review text and article bodies are
 * written to be plausible and to size the layout correctly, not to be true.
 * No qualification, statistic or accreditation in this file has been verified.
 * Replace before anything goes near a live domain.
 *
 * Kept as plain data rather than a CMS because the clinic has a handful of
 * services that change once a year. A CMS here would cost more than it saves.
 */

import type { LucideIcon } from "lucide-react";
import {
  Activity, Beaker, HeartPulse, Microscope, Scan, ShieldCheck, Stethoscope, Waves,
} from "lucide-react";

/* ── Services ────────────────────────────────────────────── */

export interface Service {
  id: string;
  name: string;
  nameAr: string;
  icon: LucideIcon;
  /** One line, used on cards and in the booking picker. */
  summary: string;
  /** Two or three sentences, used on the service page. */
  body: string;
  /** What actually happens, in order. Patients ask this more than anything. */
  visit: string[];
  /** Shown on the service page and in the booking summary. */
  durationMin: number;
  priceEgp: number;
  /** Anything to do before arriving. Empty array renders nothing. */
  prep: string[];
  accent: "brand" | "mint" | "coral";
}

export const SERVICES: Service[] = [
  {
    id: "consultation",
    name: "Men's Health Consultation",
    nameAr: "استشارة صحة الرجل",
    icon: Stethoscope,
    summary: "A full private consultation with Dr. Osama Ghattas.",
    body:
      "The starting point for most patients. A structured conversation about what brought you in, " +
      "a physical examination where it is needed, and a written plan before you leave. If tests are " +
      "required we arrange them the same visit rather than sending you elsewhere.",
    visit: [
      "Arrival through the private entrance, straight to a room",
      "History and symptoms, unhurried — the slot is 40 minutes, not 10",
      "Examination if clinically indicated, with a chaperone offered",
      "Any tests ordered and scheduled before you leave",
      "A written plan in your portal the same day",
    ],
    durationMin: 40,
    priceEgp: 2500,
    prep: [],
    accent: "brand",
  },
  {
    id: "andrology",
    name: "Andrology",
    nameAr: "أمراض الذكورة",
    icon: HeartPulse,
    summary: "Erectile function, performance and male sexual health.",
    body:
      "Assessment and treatment of erectile dysfunction, premature ejaculation and related concerns. " +
      "Most cases have a treatable physical cause that a basic workup finds quickly — vascular, " +
      "hormonal or medication-related. The consultation is private and the diagnosis is explained plainly.",
    visit: [
      "Confidential history, including medication and lifestyle review",
      "Physical examination",
      "Bloods for hormones, glucose and lipids where indicated",
      "Penile doppler ultrasound if a vascular cause is suspected",
      "Treatment options explained with expected results and costs",
    ],
    durationMin: 45,
    priceEgp: 3000,
    prep: ["Bring a list of any medication you take regularly, including supplements."],
    accent: "brand",
  },
  {
    id: "fertility",
    name: "Male Fertility",
    nameAr: "الخصوبة عند الرجل",
    icon: Microscope,
    summary: "Semen analysis, varicocele assessment and fertility planning.",
    body:
      "Roughly half of fertility difficulty involves a male factor, and most of it is never " +
      "investigated. A full male workup takes one visit and one lab run, and it changes the plan " +
      "for the couple more often than people expect.",
    visit: [
      "Consultation and examination",
      "Semen analysis in an on-site lab, sample given privately",
      "Scrotal ultrasound to check for varicocele",
      "Hormone panel — FSH, LH, testosterone, prolactin",
      "Results reviewed together at a follow-up, with a plan",
    ],
    durationMin: 45,
    priceEgp: 3500,
    prep: [
      "Two to five days of abstinence before a semen analysis — no more, no less.",
      "Avoid alcohol for 48 hours before the sample.",
    ],
    accent: "mint",
  },
  {
    id: "hormones",
    name: "Hormone & Testosterone",
    nameAr: "الهرمونات والتستوستيرون",
    icon: Activity,
    summary: "Low testosterone, energy, mood and metabolic health.",
    body:
      "Fatigue, low mood, lost muscle and low drive are frequently hormonal and frequently " +
      "dismissed. We measure properly — morning samples, repeated to confirm — and treat only when " +
      "the numbers and the symptoms agree.",
    visit: [
      "Symptom review and examination",
      "Morning blood draw, repeated on a second day to confirm",
      "Thyroid, prolactin and metabolic markers alongside testosterone",
      "Results explained against reference ranges, not just flagged",
      "Treatment plan with monitoring schedule if therapy starts",
    ],
    durationMin: 35,
    priceEgp: 2800,
    prep: ["Blood must be drawn before 10:00 — book a morning slot.", "Fast for 8 hours where a metabolic panel is included."],
    accent: "coral",
  },
  {
    id: "urology",
    name: "General Urology",
    nameAr: "المسالك البولية",
    icon: Waves,
    summary: "Prostate, urinary symptoms, stones and infections.",
    body:
      "Prostate assessment, urinary flow problems, kidney and bladder stones, recurrent infections " +
      "and scrotal complaints. Ultrasound and laboratory work are on site, so an investigation that " +
      "normally spans three appointments usually takes one.",
    visit: [
      "Consultation and examination",
      "Urine analysis and culture where indicated",
      "PSA and renal function bloods",
      "Ultrasound of kidneys, bladder and prostate",
      "Diagnosis and plan the same visit",
    ],
    durationMin: 40,
    priceEgp: 2500,
    prep: ["Arrive with a comfortably full bladder for a urinary tract ultrasound."],
    accent: "brand",
  },
  {
    id: "screening",
    name: "Executive Health Screening",
    nameAr: "الفحص الشامل",
    icon: ShieldCheck,
    summary: "A complete men's check-up in a single half-day.",
    body:
      "Everything a man over thirty-five should have checked, done in one morning rather than " +
      "across a year of separate appointments. Cardiovascular, metabolic, hormonal, prostate and " +
      "urological, with one consultant reading all of it together.",
    visit: [
      "Fasting bloods on arrival",
      "Vitals, BMI and blood pressure",
      "Abdominal and urinary tract ultrasound",
      "ECG",
      "Consultation reviewing every result in one sitting",
      "A written report in your portal within 48 hours",
    ],
    durationMin: 180,
    priceEgp: 9500,
    prep: ["Fast for 10–12 hours. Water is fine.", "Allow a half-day — this is not a short visit."],
    accent: "mint",
  },
];

export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);

/* ── Visit types ─────────────────────────────────────────── */

/**
 * The first question in the booking flow. Deliberately not the same list as
 * services: a follow-up or a lab visit does not need a service chosen, and
 * asking for one is how booking forms get abandoned.
 */
export interface VisitType {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  /** Whether step 2 (choose a service) applies. */
  needsService: boolean;
}

export const VISIT_TYPES: VisitType[] = [
  { id: "consultation", label: "New consultation", hint: "First visit, or a new concern", icon: Stethoscope, needsService: true },
  { id: "follow-up", label: "Follow-up", hint: "Reviewing results or ongoing treatment", icon: Activity, needsService: false },
  { id: "imaging", label: "Scan or ultrasound", hint: "Doppler, scrotal, urinary tract", icon: Scan, needsService: false },
  { id: "labs", label: "Blood & lab tests", hint: "Hormone panels, semen analysis, PSA", icon: Beaker, needsService: false },
];

export const visitTypeById = (id: string) => VISIT_TYPES.find((v) => v.id === id);

/* ── The team ────────────────────────────────────────────── */

export interface Doctor {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  focus: string;
  initials: string;
  accent: "brand" | "mint" | "coral";
  /** Weekdays as short labels, matching the booking calendar. */
  days: string[];
  serviceIds: string[];
  lead?: boolean;
  bio?: string[];
  credentials?: string[];
}

export const DOCTORS: Doctor[] = [
  {
    id: "osama-ghattas",
    name: "Dr. Osama Ghattas",
    nameAr: "د. أسامة غطاس",
    title: "Consultant Andrologist & Urologist",
    focus: "Andrology, male fertility and men's hormonal health",
    initials: "OG",
    accent: "brand",
    days: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"],
    serviceIds: ["consultation", "andrology", "fertility", "hormones", "urology", "screening"],
    lead: true,
    bio: [
      "[PLACEHOLDER — to be replaced with Dr. Osama's own words.] Dr. Osama Ghattas founded Elite " +
      "Clinic around a single observation: men delay care not because they cannot afford it, but " +
      "because of how the visit feels. Waiting rooms, shared corridors, receptionists asking loudly " +
      "what the appointment is for.",
      "[PLACEHOLDER] The clinic is built to remove every one of those. Private entrance, one patient " +
      "at a time, appointment-only scheduling, and a file no one reads but the treating physician.",
    ],
    credentials: [
      "[PLACEHOLDER] MBBCh, Faculty of Medicine",
      "[PLACEHOLDER] Fellowship in Andrology",
      "[PLACEHOLDER] Member, Egyptian Society of Urology",
      "[PLACEHOLDER] 15+ years in men's health",
    ],
  },
  {
    id: "team-urology",
    name: "Dr. [Name]",
    nameAr: "د. [الاسم]",
    title: "Consultant Urologist",
    focus: "General urology, stones and prostate health",
    initials: "—",
    accent: "mint",
    days: ["Sun", "Tue", "Thu"],
    serviceIds: ["urology", "screening", "consultation"],
  },
  {
    id: "team-endocrine",
    name: "Dr. [Name]",
    nameAr: "د. [الاسم]",
    title: "Consultant Endocrinologist",
    focus: "Hormonal and metabolic health",
    initials: "—",
    accent: "coral",
    days: ["Sat", "Mon", "Wed"],
    serviceIds: ["hormones", "screening"],
  },
];

export const doctorById = (id: string) => DOCTORS.find((d) => d.id === id);

export function doctorsForService(serviceId: string): Doctor[] {
  if (!serviceId) return DOCTORS;
  return DOCTORS.filter((d) => d.serviceIds.includes(serviceId));
}

/* ── The four promises ───────────────────────────────────── */

export const PROMISES = [
  {
    title: "Total privacy",
    body: "A private entrance, a private waiting lounge, and one patient in the clinic at a time.",
    icon: ShieldCheck,
  },
  {
    title: "No waiting",
    body: "Appointment-only. If your slot is 6:00, you are seen at 6:00 — we measure it.",
    icon: Activity,
  },
  {
    title: "Everything on site",
    body: "Ultrasound, laboratory and consultation share one floor. One visit, not three.",
    icon: Scan,
  },
  {
    title: "The same consultant",
    body: "Follow-ups stay with the doctor who saw you first, unless you ask otherwise.",
    icon: Stethoscope,
  },
] as const;

/* ── What to expect ──────────────────────────────────────── */

export const JOURNEY = [
  {
    n: "01",
    title: "Book in a minute",
    body: "Pick what you need, a day and a time. No phone queue, no callback, no explaining yourself to a receptionist.",
  },
  {
    n: "02",
    title: "Arrive to a room, not a corridor",
    body: "A separate entrance leads to a private lounge. You will not sit with other patients.",
  },
  {
    n: "03",
    title: "See Dr. Osama, unhurried",
    body: "Forty minutes, not ten. Tests are arranged the same visit where they are needed.",
  },
  {
    n: "04",
    title: "Results in your portal",
    body: "Scans, bloods and your written plan land in one place — usually before you get home.",
  },
] as const;

/* ── Numbers ─────────────────────────────────────────────── */

/** `value` is animated from zero; `suffix` and `prefix` are printed verbatim. */
export const STATS = [
  { value: 15, suffix: "+", label: "Years in men's health", note: "[PLACEHOLDER]" },
  { value: 40, suffix: " min", label: "Standard consultation", note: "Not ten." },
  { value: 1, suffix: "", label: "Patient in clinic at a time", note: "By design, not by luck." },
  { value: 48, suffix: "h", label: "Results in your portal", note: "Most land the same day." },
] as const;

/* ── Reviews ─────────────────────────────────────────────── */

export interface Review {
  id: string;
  initials: string;
  name: string;
  context: string;
  rating: number;
  body: string;
  accent: "brand" | "mint" | "coral";
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    initials: "A.M.",
    name: "A. M.",
    context: "Andrology",
    rating: 5,
    body:
      "[PLACEHOLDER] I put this off for two years. What changed it was that I could book at midnight " +
      "without saying a word to anyone, and walk in through a door no one else was using.",
    accent: "brand",
  },
  {
    id: "r2",
    initials: "K.S.",
    name: "K. S.",
    context: "Executive screening",
    rating: 5,
    body:
      "[PLACEHOLDER] Everything in one morning — bloods, ultrasound, ECG — and one doctor who read " +
      "all of it together instead of handing me three envelopes.",
    accent: "mint",
  },
  {
    id: "r3",
    initials: "H.F.",
    name: "H. F.",
    context: "Male fertility",
    rating: 5,
    body:
      "[PLACEHOLDER] He explained the results to my wife and to me differently, because we needed to " +
      "hear different things. That is not a small skill.",
    accent: "coral",
  },
];

/* ── Journal ─────────────────────────────────────────────── */

export interface Article {
  slug: string;
  title: string;
  category: string;
  readMin: number;
  date: string;
  excerpt: string;
  /** Body paragraphs. A heading is any paragraph prefixed with "## ". */
  body: string[];
  accent: "brand" | "mint" | "coral";
}

export const ARTICLES: Article[] = [
  {
    slug: "low-testosterone-signs",
    title: "Low testosterone: what actually counts as a symptom",
    category: "Hormones",
    readMin: 6,
    date: "2026-09-02",
    excerpt:
      "Tiredness alone proves nothing. Here is what the combination of symptoms and numbers has to look like before treatment is the right answer.",
    accent: "coral",
    body: [
      "[PLACEHOLDER ARTICLE — clinical content must be written or approved by Dr. Osama before publication.]",
      "## The symptom list is less useful than it looks",
      "Fatigue, low mood, reduced drive and lost muscle mass all appear on every list of low-testosterone symptoms, and all four are also caused by poor sleep, stress, thyroid disease, depression and simply being busy. A symptom list cannot diagnose anything on its own.",
      "## What a proper measurement looks like",
      "Testosterone follows a daily rhythm, peaking in the early morning and falling through the day. A sample taken at four in the afternoon can read low in a man whose levels are entirely normal. Blood must be drawn before ten in the morning, and a low result must be repeated on a second day before it means anything.",
      "## Treating numbers instead of people",
      "Where the symptoms and two morning measurements agree, treatment is usually straightforward and works quickly. Where they disagree, the answer is to look further rather than to start therapy — because testosterone replacement is not easily reversed, and it suppresses fertility while it is running.",
    ],
  },
  {
    slug: "male-factor-fertility",
    title: "Half of fertility difficulty is male. Most of it is never checked.",
    category: "Fertility",
    readMin: 5,
    date: "2026-08-21",
    excerpt:
      "A full male workup is one visit and one lab run. It changes the plan for the couple more often than anyone expects.",
    accent: "mint",
    body: [
      "[PLACEHOLDER ARTICLE — clinical content must be written or approved by Dr. Osama before publication.]",
      "## The asymmetry",
      "When a couple has difficulty conceiving, investigation almost always begins with the woman, and is frequently extensive before anyone asks the man for a sample. Male factor is involved in roughly half of cases.",
      "## What the workup involves",
      "A semen analysis, a scrotal ultrasound to look for a varicocele, and a hormone panel. One visit, and results within a few days.",
      "## Why it matters early",
      "Several male causes are correctable — a varicocele, a hormonal imbalance, a medication, a lifestyle factor. Correcting one can change the treatment the couple needs from IVF to something considerably simpler.",
    ],
  },
  {
    slug: "what-a-private-visit-means",
    title: "What we mean when we say the visit is private",
    category: "The clinic",
    readMin: 4,
    date: "2026-08-04",
    excerpt:
      "Privacy is a set of specific operational decisions, not a promise on a website. These are ours.",
    accent: "brand",
    body: [
      "[PLACEHOLDER — to be reviewed by the clinic before publication.]",
      "## One patient at a time",
      "The schedule is built so that you do not pass another patient on the way in or out. This costs us slots. It is the point of the clinic.",
      "## Nothing we send you names the service",
      "Appointment reminders, confirmations and result notifications say Elite Clinic and nothing else. No message we send will name a service or a diagnosis.",
      "## Your file has one reader",
      "Your record is visible to your treating physician. Reception can see that you have an appointment and nothing about what it is for.",
    ],
  },
];

export const articleBySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);

/* ── FAQ ─────────────────────────────────────────────────── */

export const FAQS = [
  {
    q: "Will I see anyone else in the clinic?",
    a: "No. Appointments are spaced so that one patient is in the clinic at a time, and there is a separate entrance and exit.",
  },
  {
    q: "What does the first visit cost?",
    a: "A men's health consultation is 2,500 EGP and runs 40 minutes. Any tests are quoted before they are done — nothing is added to your bill without you agreeing to it first. [PLACEHOLDER pricing.]",
  },
  {
    q: "Do you take insurance?",
    a: "[PLACEHOLDER — the clinic must confirm which insurers, if any, are accepted.]",
  },
  {
    q: "Can I be seen without giving my real name?",
    a: "We need your legal name on a medical record and on any prescription. It is visible only to your treating physician; nothing else in the clinic is filed under it.",
  },
  {
    q: "How quickly do results come back?",
    a: "Most bloods and scans are in your portal within 24 hours, and everything within 48. You get a notification that results are ready — it does not name the test.",
  },
  {
    q: "Is there parking?",
    a: "Yes, with direct access to the private entrance. Directions are sent with your confirmation. [PLACEHOLDER — confirm with the clinic.]",
  },
] as const;
