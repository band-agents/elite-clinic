/**
 * Single source of truth for anything that carries the clinic's name.
 *
 * The Al-Madinah build learned this the hard way: the client renamed three
 * times and bare name literals were scattered across components. Nothing else
 * in this codebase should contain the clinic's name, phone number or address
 * as a string — import from here.
 */

export const BRAND = {
  name: "Elite Clinic",
  nameAr: "إيليت كلينك",
  line: "Men's Health",
  lineAr: "صحة الرجل",
  doctor: "Dr. Osama Ghattas",
  doctorAr: "د. أسامة غطاس",
  tagline: "More than treatment. A higher standard of care.",
  promise: "Expert care. Complete privacy.",

  /* Contact — every one of these is a placeholder until the clinic confirms. */
  phone: "+20 2 3850 1200",
  whatsapp: "+20 100 000 0000",
  whatsappHref: "https://wa.me/201000000000",
  email: "hello@eliteclinic.eg",
  address: "Beverly Hills, Sheikh Zayed City, Giza",
  addressAr: "بيفرلي هيلز، مدينة الشيخ زايد، الجيزة",
  hours: "Saturday – Thursday, 11:00 – 21:00",
  hoursNote: "By appointment only. Friday closed.",

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
} as const;

/**
 * The portal is a separate concern from the marketing site. Today it is a
 * demo running on local state; when a real backend exists this is the one
 * place that changes.
 */
export const PORTAL = {
  /** Set to an external URL to hand off instead of using the built-in demo. */
  externalUrl: import.meta.env.VITE_PORTAL_URL as string | undefined,
  isDemo: !import.meta.env.VITE_PORTAL_URL,
} as const;

export function portalUrl(path = "/portal"): string {
  return PORTAL.externalUrl ?? path;
}
