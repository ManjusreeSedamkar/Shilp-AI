/**
 * Shilp-AI to Sarvam AI Language Code Mapping
 *
 * Maps Shilp-AI 2-3 letter language IDs to Sarvam BCP-47 codes:
 * en-IN, hi-IN, te-IN, ta-IN, bn-IN, mr-IN, gu-IN, kn-IN, ml-IN,
 * pa-IN, od-IN, as-IN, ur-IN, sa-IN, mai-IN, kok-IN, ne-IN, sd-IN,
 * doi-IN, brx-IN, sat-IN.
 */

export const SHILP_TO_SARVAM_LANG_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "od-IN", // Shilp-AI Odia ID maps to Sarvam od-IN
  od: "od-IN",
  as: "as-IN",
  ur: "ur-IN",
  sa: "sa-IN",
  mai: "mai-IN",
  kok: "kok-IN",
  ne: "ne-IN",
  sd: "sd-IN",
  doi: "doi-IN",
  brx: "brx-IN",
  sat: "sat-IN"
};

export const SUPPORTED_SARVAM_CODES = new Set<string>([
  "en-IN",
  "hi-IN",
  "te-IN",
  "ta-IN",
  "bn-IN",
  "mr-IN",
  "gu-IN",
  "kn-IN",
  "ml-IN",
  "pa-IN",
  "od-IN",
  "as-IN",
  "ur-IN",
  "sa-IN",
  "mai-IN",
  "kok-IN",
  "ne-IN",
  "sd-IN",
  "doi-IN",
  "brx-IN",
  "sat-IN"
]);

/**
 * Resolves a language string (Shilp-AI ID, BCP-47 code, or "auto") to a valid Sarvam language code.
 *
 * @param lang - Input language identifier (e.g. 'hi', 'or', 'od-IN', 'auto')
 * @param allowAuto - Whether 'auto' is permissible (for sourceLanguage)
 * @returns Sarvam language code (e.g. 'hi-IN') or null if invalid
 */
export function resolveSarvamLanguageCode(
  lang: string | undefined | null,
  allowAuto = false
): string | null {
  if (!lang || typeof lang !== "string") {
    return null;
  }

  const normalized = lang.trim().toLowerCase();

  if (allowAuto && (normalized === "auto" || normalized === "detect")) {
    return "auto";
  }

  // 1. Direct match in Shilp ID map
  if (SHILP_TO_SARVAM_LANG_MAP[normalized]) {
    return SHILP_TO_SARVAM_LANG_MAP[normalized];
  }

  // 2. Check if already formatted as BCP-47 like 'hi-in' -> 'hi-IN'
  const matchedSarvam = Array.from(SUPPORTED_SARVAM_CODES).find(
    (code) => code.toLowerCase() === normalized
  );
  if (matchedSarvam) {
    return matchedSarvam;
  }

  return null;
}
