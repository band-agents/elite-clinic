/**
 * Demo data for the patient portal.
 *
 * Entirely fabricated. There is no backend, no account and no real record —
 * this exists so the clinic can see and price the portal before anyone builds
 * the part that holds actual medical data. Every screen that reads from here
 * should keep working unchanged when a real API replaces it.
 */

export interface PortalAppointment {
  id: string;
  service: string;
  doctor: string;
  dateISO: string;
  time: string;
  status: "confirmed" | "completed" | "cancelled";
  location: string;
  prep?: string[];
  summary?: string;
}

export interface Analyte {
  name: string;
  value: number;
  unit: string;
  low: number;
  high: number;
  /** Earlier readings, oldest first, for the trend line. */
  history?: Array<{ dateISO: string; value: number }>;
}

export interface PortalDocument {
  id: string;
  title: string;
  kind: "lab" | "imaging" | "report" | "prescription" | "invoice" | "consent";
  service: string;
  doctor: string;
  dateISO: string;
  status: "ready" | "pending" | "reviewed";
  sizeKb: number;
  /** Present on lab documents — drives the results table. */
  analytes?: Analyte[];
  /** The consultant's plain-language note, shown beside the numbers. */
  note?: string;
}

export interface HistoryEntry {
  id: string;
  dateISO: string;
  kind: "visit" | "diagnosis" | "procedure" | "prescription" | "result";
  title: string;
  detail: string;
  doctor?: string;
}

export interface Prescription {
  id: string;
  drug: string;
  dose: string;
  schedule: string;
  startedISO: string;
  active: boolean;
  doctor: string;
}

export interface Invoice {
  id: string;
  ref: string;
  description: string;
  dateISO: string;
  amountEgp: number;
  status: "paid" | "unpaid";
  method?: string;
}

export const PATIENT = {
  firstName: "Karim",
  lastName: "Hassan",
  initials: "KH",
  fileNo: "EC-10482",
  phone: "0100 123 4567",
  email: "k.hassan@example.com",
  dob: "1986-04-17",
  since: "2025-11-02",
} as const;

export const APPOINTMENTS: PortalAppointment[] = [
  {
    id: "a1",
    service: "Hormone & Testosterone — follow-up",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-29",
    time: "18:30",
    status: "confirmed",
    location: "Beverly Hills, Sheikh Zayed — private entrance",
    prep: [
      "Blood must be drawn before 10:00 — this slot is for review only, bloods were taken on 14 Sep.",
      "Bring the medication list we sent you.",
    ],
  },
  {
    id: "a2",
    service: "Hormone panel — blood draw",
    doctor: "Clinic laboratory",
    dateISO: "2026-09-14",
    time: "09:00",
    status: "completed",
    location: "Beverly Hills, Sheikh Zayed",
    summary:
      "Fasting sample taken at 09:05. Repeat morning testosterone requested to confirm the low reading from 2 Sep.",
  },
  {
    id: "a3",
    service: "Men's Health Consultation",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-02",
    time: "19:00",
    status: "completed",
    location: "Beverly Hills, Sheikh Zayed",
    summary:
      "Six months of fatigue, reduced drive, lost gym progress. No red flags on examination. Hormone panel and metabolic screen ordered. Reviewed sleep and alcohol; advised on both.",
  },
];

export const DOCUMENTS: PortalDocument[] = [
  {
    id: "d1",
    title: "Hormone panel — repeat",
    kind: "lab",
    service: "Hormone & Testosterone",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-15",
    status: "ready",
    sizeKb: 184,
    note:
      "Total testosterone remains below range on a second morning sample, and LH is low-normal — " +
      "that combination points to a secondary cause rather than testicular failure. Prolactin is " +
      "normal, which rules out the most common one. We will review the pituitary picture at your " +
      "follow-up before deciding on treatment. Thyroid and metabolic markers are unremarkable.",
    analytes: [
      {
        name: "Total testosterone", value: 8.1, unit: "nmol/L", low: 10.4, high: 34.6,
        history: [
          { dateISO: "2026-09-02", value: 8.9 },
          { dateISO: "2026-09-15", value: 8.1 },
        ],
      },
      { name: "Free testosterone", value: 168, unit: "pmol/L", low: 196, high: 636 },
      { name: "LH", value: 3.1, unit: "IU/L", low: 1.7, high: 8.6 },
      { name: "FSH", value: 2.8, unit: "IU/L", low: 1.5, high: 12.4 },
      { name: "Prolactin", value: 244, unit: "mIU/L", low: 86, high: 324 },
      { name: "SHBG", value: 28, unit: "nmol/L", low: 18, high: 54 },
      { name: "TSH", value: 2.1, unit: "mIU/L", low: 0.4, high: 4.0 },
      {
        name: "HbA1c", value: 5.9, unit: "%", low: 4.0, high: 5.6,
        history: [
          { dateISO: "2026-03-10", value: 5.5 },
          { dateISO: "2026-09-02", value: 5.8 },
          { dateISO: "2026-09-15", value: 5.9 },
        ],
      },
      { name: "Vitamin D", value: 41, unit: "nmol/L", low: 50, high: 125 },
    ],
  },
  {
    id: "d2",
    title: "Scrotal ultrasound",
    kind: "imaging",
    service: "General Urology",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-14",
    status: "reviewed",
    sizeKb: 3420,
    note:
      "Both testes normal in size and echotexture. No varicocele. No focal lesion. Small left " +
      "epididymal cyst, 4 mm — incidental and of no significance.",
  },
  {
    id: "d3",
    title: "Consultation report — 2 September",
    kind: "report",
    service: "Men's Health Consultation",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-02",
    status: "reviewed",
    sizeKb: 96,
    note: "Full written summary of the first consultation, with the plan and the tests ordered.",
  },
  {
    id: "d4",
    title: "Metabolic screen",
    kind: "lab",
    service: "Executive Health Screening",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-02",
    status: "reviewed",
    sizeKb: 152,
    note:
      "Lipids borderline, HbA1c at the top of normal and climbing. Not diabetes, but the direction " +
      "matters more than the number. Diet and training discussed.",
    analytes: [
      { name: "Total cholesterol", value: 5.4, unit: "mmol/L", low: 0, high: 5.2 },
      { name: "LDL", value: 3.5, unit: "mmol/L", low: 0, high: 3.0 },
      { name: "HDL", value: 1.1, unit: "mmol/L", low: 1.0, high: 2.5 },
      { name: "Triglycerides", value: 2.0, unit: "mmol/L", low: 0, high: 1.7 },
      { name: "Fasting glucose", value: 5.6, unit: "mmol/L", low: 3.9, high: 5.5 },
      { name: "Creatinine", value: 84, unit: "µmol/L", low: 62, high: 106 },
      { name: "ALT", value: 34, unit: "U/L", low: 0, high: 41 },
    ],
  },
  {
    id: "d5",
    title: "Prescription — 15 September",
    kind: "prescription",
    service: "Hormone & Testosterone",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-15",
    status: "ready",
    sizeKb: 48,
  },
  {
    id: "d6",
    title: "Pituitary MRI — referral",
    kind: "imaging",
    service: "Hormone & Testosterone",
    doctor: "Dr. Osama Ghattas",
    dateISO: "2026-09-21",
    status: "pending",
    sizeKb: 0,
    note: "Report expected within 48 hours of the scan.",
  },
  {
    id: "d7",
    title: "Invoice — consultation & panel",
    kind: "invoice",
    service: "Hormone & Testosterone",
    doctor: "—",
    dateISO: "2026-09-15",
    status: "ready",
    sizeKb: 38,
  },
];

export const HISTORY: HistoryEntry[] = [
  {
    id: "h1", dateISO: "2026-09-15", kind: "result",
    title: "Hormone panel repeated",
    detail: "Total testosterone 8.1 nmol/L — below range on a second morning sample. LH low-normal.",
    doctor: "Dr. Osama Ghattas",
  },
  {
    id: "h2", dateISO: "2026-09-15", kind: "prescription",
    title: "Vitamin D3 started",
    detail: "4000 IU daily for 12 weeks, then re-check. Deficiency on the 15 Sep panel.",
    doctor: "Dr. Osama Ghattas",
  },
  {
    id: "h3", dateISO: "2026-09-14", kind: "procedure",
    title: "Scrotal ultrasound",
    detail: "Normal study. Incidental 4 mm left epididymal cyst.",
    doctor: "Dr. Osama Ghattas",
  },
  {
    id: "h4", dateISO: "2026-09-02", kind: "diagnosis",
    title: "Suspected secondary hypogonadism",
    detail: "Working diagnosis pending confirmation on repeat bloods and pituitary imaging.",
    doctor: "Dr. Osama Ghattas",
  },
  {
    id: "h5", dateISO: "2026-09-02", kind: "visit",
    title: "First consultation",
    detail: "Fatigue, low drive and loss of training progress over six months. Examination normal.",
    doctor: "Dr. Osama Ghattas",
  },
];

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "p1", drug: "Vitamin D3 (cholecalciferol)", dose: "4000 IU",
    schedule: "Once daily with food", startedISO: "2026-09-15",
    active: true, doctor: "Dr. Osama Ghattas",
  },
  {
    id: "p2", drug: "Atorvastatin", dose: "10 mg",
    schedule: "Once daily, evening", startedISO: "2026-09-02",
    active: true, doctor: "Dr. Osama Ghattas",
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "i1", ref: "EC-INV-2291", description: "Hormone panel — repeat",
    dateISO: "2026-09-15", amountEgp: 2800, status: "paid", method: "Visa ·· 4417",
  },
  {
    id: "i2", ref: "EC-INV-2264", description: "Scrotal ultrasound",
    dateISO: "2026-09-14", amountEgp: 1600, status: "paid", method: "Cash",
  },
  {
    id: "i3", ref: "EC-INV-2210", description: "Men's Health Consultation",
    dateISO: "2026-09-02", amountEgp: 2500, status: "paid", method: "Visa ·· 4417",
  },
  {
    id: "i4", ref: "EC-INV-2310", description: "Follow-up consultation — 29 September",
    dateISO: "2026-09-29", amountEgp: 1500, status: "unpaid",
  },
];

/** Whether an analyte reading sits outside its reference range. */
export function isFlagged(a: Analyte): "low" | "high" | null {
  if (a.value < a.low) return "low";
  if (a.value > a.high) return "high";
  return null;
}
