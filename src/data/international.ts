/**
 * Elite Passage — the international patients programme.
 *
 * For men travelling to Cairo for treatment: the clinic handles the flights,
 * the visa letter, the airport, the hotel, the car and the interpreter, and
 * compresses the clinical work into days rather than weeks so the trip is as
 * short as the medicine allows.
 *
 * ⚠ PLACEHOLDER, like the rest of the content layer. Prices, partner hotels,
 * transfer arrangements and visa support must all be confirmed by the clinic
 * — and the visa claims in particular need checking against what the clinic
 * can actually issue, because an invitation letter it cannot produce is a
 * promise that strands someone at an embassy.
 */

import type { LucideIcon } from "lucide-react";
import {
  BedDouble, CarFront, FileCheck2, HeartPulse, Languages, MessageSquareMore,
  PlaneLanding, PlaneTakeoff, Stethoscope, Video,
} from "lucide-react";

export const PASSAGE = {
  name: "Elite Passage",
  nameAr: "إيليت باساج",
  line: "Care, travel, and everything in between.",
  lead:
    "Men fly to Cairo for this clinic from across the Gulf, Africa and Europe. " +
    "Elite Passage is the part that is not medicine: the ticket, the visa letter, " +
    "the car at arrivals, the hotel five minutes from the door, and one coordinator " +
    "on one number for the whole trip.",
} as const;

/* ── The journey ─────────────────────────────────────────── */

export interface PassageStep {
  n: string;
  title: string;
  body: string;
  icon: LucideIcon;
  /** Roughly when this happens, shown on the timeline rail. */
  when: string;
}

export const PASSAGE_STEPS: PassageStep[] = [
  {
    n: "01",
    when: "Before you fly",
    title: "A plan and a price, before you book a ticket",
    body:
      "Send your scans, reports and a description of the problem on WhatsApp. Dr. Osama reviews " +
      "them himself and comes back with what he thinks is going on, what the visit would involve, " +
      "how many days it needs and what it costs. You decide whether to travel knowing all four.",
    icon: MessageSquareMore,
  },
  {
    n: "02",
    when: "Two to three weeks out",
    title: "Visa letter and paperwork",
    body:
      "We issue the medical invitation letter your embassy asks for, with the appointment dates and " +
      "the treating consultant named on it, plus whatever supporting documentation the consulate " +
      "wants. Our coordinator deals with the back and forth.",
    icon: FileCheck2,
  },
  {
    n: "03",
    when: "Once the visa lands",
    title: "Flights, booked around the treatment",
    body:
      "Our travel desk books the flights and builds the dates around the clinical calendar rather " +
      "than the other way round — bloods on the morning after you land, results before you fly home. " +
      "Companion tickets on the same itinerary.",
    icon: PlaneTakeoff,
  },
  {
    n: "04",
    when: "Day of arrival",
    title: "Met at the airport",
    body:
      "Someone from the clinic meets you inside arrivals at Cairo International, handles the car, and " +
      "gets you to the hotel. A local SIM and a printed schedule for the week are in the car.",
    icon: PlaneLanding,
  },
  {
    n: "05",
    when: "Your stay",
    title: "A hotel five minutes from the clinic",
    body:
      "Partner hotels and serviced apartments in Sheikh Zayed, chosen for being quiet and close — not " +
      "for being in a brochure. Rooms for a companion at the same rate. Extended stays priced by the week.",
    icon: BedDouble,
  },
  {
    n: "06",
    when: "Every clinic day",
    title: "A car and a driver, on your schedule",
    body:
      "Door to door for every appointment, waiting when you come out. No taxi apps, no explaining an " +
      "address in a language you do not speak, no arriving somewhere you did not mean to go.",
    icon: CarFront,
  },
  {
    n: "07",
    when: "In the room",
    title: "An interpreter if you want one",
    body:
      "Arabic, English and French. A consultation about something private is not the moment to be " +
      "working out vocabulary — and the interpreter is bound by the same confidentiality as the clinician.",
    icon: Languages,
  },
  {
    n: "08",
    when: "Days two to five",
    title: "Treatment, compressed",
    body:
      "Consultations, imaging and laboratory work scheduled back to back across a few days instead of " +
      "spread over a month, because you are on a plane at the end of the week. Everything is on one floor.",
    icon: Stethoscope,
  },
  {
    n: "09",
    when: "Before you leave",
    title: "Recovery and a final review",
    body:
      "Where a procedure needs recovery time, the stay is planned around it and the clinic checks on " +
      "you at the hotel. A final consultation confirms you are fit to fly, with a written plan to take home.",
    icon: HeartPulse,
  },
  {
    n: "10",
    when: "Home",
    title: "Follow-up from wherever you are",
    body:
      "Your full record — scans, results, reports, prescriptions — is in your portal before you land. " +
      "Follow-up consultations with Dr. Osama happen by video, and a repeat panel can be done by any " +
      "lab near you and read here.",
    icon: Video,
  },
];

/* ── What is included ────────────────────────────────────── */

export const PASSAGE_INCLUDED = [
  "Case review by Dr. Osama before you travel, from your own scans and reports",
  "A written plan and a fixed quote, in writing, before a ticket is bought",
  "Medical invitation letter for the visa, and embassy paperwork support",
  "Flights for you and one companion, booked around the treatment dates",
  "Meet and greet inside arrivals at Cairo International",
  "Private transfers, airport and every clinic visit",
  "Hotel or serviced apartment in Sheikh Zayed, minutes from the clinic",
  "Local SIM and a printed week schedule on arrival",
  "Arabic / English / French interpreting in every consultation",
  "One coordinator, one number, for the whole trip",
  "All consultations, imaging and laboratory work compressed into consecutive days",
  "Full medical records in your portal before you fly home",
  "Video follow-ups with Dr. Osama after you are back",
] as const;

/* ── Tiers ───────────────────────────────────────────────── */

export interface PassageTier {
  id: string;
  name: string;
  tagline: string;
  /** Excludes flights and the medical fees themselves. */
  fromUsd: number;
  nights: string;
  features: string[];
  accent: "brand" | "mint" | "coral";
  featured?: boolean;
}

export const PASSAGE_TIERS: PassageTier[] = [
  {
    id: "essential",
    name: "Essential",
    tagline: "For a consultation and a workup, in and out in three days.",
    fromUsd: 900,
    nights: "3 nights",
    accent: "mint",
    features: [
      "Pre-travel case review and written quote",
      "Visa invitation letter",
      "Airport meet and private transfers",
      "4-star hotel in Sheikh Zayed, room only",
      "Transfers to every clinic visit",
      "Coordinator on WhatsApp, clinic hours",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    tagline: "The full workup with recovery time and a companion.",
    fromUsd: 2400,
    nights: "7 nights",
    accent: "brand",
    featured: true,
    features: [
      "Everything in Essential",
      "Flights for you and one companion",
      "5-star hotel, two guests, breakfast",
      "Interpreter in every consultation",
      "Car and driver on call all week",
      "Coordinator on WhatsApp, 24 hours",
      "Two video follow-ups after you fly home",
    ],
  },
  {
    id: "private",
    name: "Private",
    tagline: "Procedure, recovery, and nothing left for you to arrange.",
    fromUsd: 5800,
    nights: "14 nights",
    accent: "coral",
    features: [
      "Everything in Complete",
      "Serviced apartment or suite, two guests",
      "Dedicated driver for the whole stay",
      "Nurse check-ins at the hotel during recovery",
      "Fit-to-fly review before departure",
      "Six months of video follow-up",
      "Repeat labs read here, wherever they are taken",
    ],
  },
];

/* ── Where patients come from ────────────────────────────── */

/** Used in the marquee strip. Flags are text, so there is no image to load. */
export const PASSAGE_COUNTRIES = [
  "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Bahrain", "Oman",
  "Libya", "Sudan", "Nigeria", "Kenya", "Jordan", "Iraq",
  "United Kingdom", "France", "Germany", "Italy",
] as const;

/* ── FAQ ─────────────────────────────────────────────────── */

export const PASSAGE_FAQS = [
  {
    q: "How long do I actually need to be in Cairo?",
    a:
      "For a consultation and a full workup, three days is usually enough — you land, bloods and " +
      "imaging happen the next morning, and you sit with Dr. Osama with every result in front of him " +
      "the day after. Anything involving a procedure is planned individually, and you are told the " +
      "number of nights before you book.",
  },
  {
    q: "Can my wife or a family member come with me?",
    a:
      "Yes, and on the Complete and Private programmes their flight and room are included. The " +
      "invitation letter covers a companion.",
  },
  {
    q: "Do you help with the visa?",
    a:
      "We issue the medical invitation letter with your appointment dates and the treating consultant " +
      "named, plus the supporting documents most consulates ask for. We cannot issue the visa itself " +
      "and we do not promise an outcome — that decision is the embassy's. [PLACEHOLDER — the clinic " +
      "must confirm exactly what documentation it can issue before this goes live.]",
  },
  {
    q: "What is not included in the programme price?",
    a:
      "The medical fees themselves — consultations, imaging, laboratory work and any procedure are " +
      "quoted separately and in writing before you travel. Meals beyond breakfast, and anything you " +
      "add to the itinerary yourself, are also outside it.",
  },
  {
    q: "What if the plan changes once I am here?",
    a:
      "Nothing is added to your bill without you agreeing to it first, and that does not change " +
      "because you are far from home. If the workup finds something that needs more time, you are " +
      "told what it costs and what it means before anything is booked or billed.",
  },
  {
    q: "Is it as private as the clinic says?",
    a:
      "More so, if anything. Transfers are unmarked, the hotel booking is in your name and nothing " +
      "else, and no message we send names a service or a diagnosis. Your coordinator is clinic staff, " +
      "not an agency.",
  },
  {
    q: "What happens after I go home?",
    a:
      "Your full record is in the patient portal before you land. Follow-ups with Dr. Osama are by " +
      "video, and repeat blood work can be done at any lab near you and read here.",
  },
] as const;
