/**
 * Field validation shared by the contact form and the booking flow.
 */

/**
 * Egyptian mobile numbers.
 *
 * Accepts all three forms people actually type:
 *   01012345678     national, with the trunk 0 — the form the field asks for
 *   +201012345678   international
 *   201012345678    international without the plus
 *
 * The trunk 0 is dropped in the international form, which is why it is
 * optional rather than simply required. An earlier version of this regex on
 * the Al-Madinah build required the number to begin with 1, which rejected
 * every number written the way the placeholder asks for it — the field and
 * its validator disagreed, and only the validator was tested.
 */
export function isEgyptianMobile(value: string): boolean {
  const cleaned = value.replace(/[\s()-]/g, "");
  return /^(\+?20)?0?1[0125]\d{8}$/.test(cleaned);
}

export function isEmail(value: string): boolean {
  /* Deliberately loose. Strict email regexes reject valid addresses far more
     often than they catch typos, and the confirmation message is the real
     check. */
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * Egyptian national ID: 14 digits. Optional on the booking form — asking for
 * it before someone has decided to come is a good way to lose them.
 */
export function isNationalId(value: string): boolean {
  return /^\d{14}$/.test(value.replace(/\s/g, ""));
}

/**
 * A calendar day as YYYY-MM-DD in the *visitor's* timezone.
 *
 * Deliberately not `toISOString().slice(0, 10)`: that converts to UTC first,
 * so local midnight in Cairo (UTC+3) becomes 21:00 the previous day and the
 * booking is stored one day earlier than the one the patient tapped. The chip
 * said "Tue 1 Sep" and the confirmation said "Monday 31 August".
 */
export function localISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Parse a localISO string back to a Date at local midnight. */
export function fromLocalISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDayLong(iso: string): string {
  return fromLocalISO(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });
}
