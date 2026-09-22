import { Language } from '../types';
import { translateBatchWithGemini, hasGeminiApiKey } from './geminiService';

/**
 * SARAL-AI-inspired Hybrid Multilingual Translation Engine for SHILP-AI.
 * 
 * Features:
 * 1. Priority to existing static dictionaries (en, hi, te, ta, bn, mr, gu).
 * 2. On-demand dynamic Gemini translation fallback for remaining languages (kn, ml, pa, or, as, ur, sa, etc.).
 * 3. Two-tiered cache (fast In-Memory Map + persistent LocalStorage).
 * 4. Request deduplication & batched translation to prevent per-DOM-node Gemini calls.
 * 5. Strict safety filter to never translate proper names, numbers, prices, URLs, emails, or IDs.
 * 6. Canonical English fallback preserved at all times.
 */

// Normalizes text by collapsing extra whitespace
export function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

// In-Memory cache: Map<Language, Map<normalizedEnglishText, translatedText>>
const memoryCache: Map<Language, Map<string, string>> = new Map();

// LocalStorage cache key prefix
const STORAGE_PREFIX = 'shilp_hybrid_rt_v1_';

// Load stored translations from localStorage safely
function loadLocalStorageForLang(lang: Language): Map<string, string> {
  const map = new Map<string, string>();
  if (typeof window === 'undefined' || !window.localStorage) return map;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${lang}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'string' && v.trim()) {
            map.set(normalize(k), v);
          }
        }
      }
    }
  } catch (e) {
    console.warn(`Failed to read translation cache for ${lang}:`, e);
  }
  return map;
}

// Save stored translations to localStorage safely
function persistLocalStorageForLang(lang: Language, map: Map<string, string>): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const obj: Record<string, string> = {};
    map.forEach((val, key) => {
      obj[key] = val;
    });
    localStorage.setItem(`${STORAGE_PREFIX}${lang}`, JSON.stringify(obj));
  } catch (e) {
    console.warn(`Failed to persist translation cache for ${lang}:`, e);
  }
}

// Get the cache map for a language (lazy-initialized from localStorage)
function getLangMap(lang: Language): Map<string, string> {
  let langMap = memoryCache.get(lang);
  if (!langMap) {
    langMap = loadLocalStorageForLang(lang);
    memoryCache.set(lang, langMap);
  }
  return langMap;
}

/**
 * Check whether a text string is a valid UI label suitable for translation.
 * Filters out numbers, prices, URLs, emails, IDs, proper names, and user data.
 */
export function shouldTranslate(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 2 || t.length > 300) return false;

  // Skip pure numbers, punctuation, mathematical symbols, dividers
  if (/^[\d\s.,:;!?'"()#%&*+=\-_/\\|~`^$<>{}[\]₹$€£•→←✓★\n\r]+$/.test(t)) return false;

  // Skip currency amounts and price expressions (e.g. ₹2,500, Rs. 1200, 750/day)
  if (/^(?:₹|rs\.?|inr|\$)\s*[\d,]+(?:\.\d+)?(?:\s*\/\s*(?:day|piece|unit|kg|m))?$/i.test(t)) return false;
  if (/^[\d,]+(?:\.\d+)?\s*(?:₹|rs\.?|inr|\$)$/i.test(t)) return false;

  // Skip web URLs, domains, emails
  if (/https?:\/\/|[a-z0-9.-]+\.[a-z]{2,}/i.test(t)) return false;
  if (/@/.test(t)) return false;

  // Skip phone numbers
  if (/^\+?[\d\s\-()]{8,}$/.test(t)) return false;

  // Skip technical identifiers, timestamps, beneficiary IDs, codes
  if (/^(?:MoSJE|GI|DBT|QR|API|UID|ID|GST|GSTIN|PAN|Aadhaar|Vite|React|XGBoost|NLP)[A-Z0-9\-_.]*$/i.test(t)) return false;
  if (/^[A-Z0-9]{2,}(?:-[A-Z0-9]+)+$/.test(t)) return false;
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return false; // Dates (2025-04-15)

  // Skip known proper artisan/buyer names from data presets
  const properNames = ['Rameshwaram', 'FabIndia', 'Vikram Mehta', 'TRIFED', 'Bastar', 'Pochampally', 'Bankura', 'Mithila'];
  if (properNames.some(name => t === name || t === `${name} ji` || t === `${name} Ltd`)) return false;

  // Skip percentages or aspect ratios
  if (/^\d+(\.\d+)?%$/.test(t)) return false;
  if (/^\d+:\d+$/.test(t)) return false;

  return true;
}

/**
 * Retrieve a stored translation for an English phrase in a target language
 */
export function getStoredTranslation(lang: Language, englishText: string): string | null {
  if (lang === 'en' || !englishText) return null;
  const langMap = getLangMap(lang);
  return langMap.get(normalize(englishText)) || null;
}

/**
 * Return all cached runtime translations for a language
 */
export function getAllStoredTranslations(lang: Language): Record<string, string> {
  const result: Record<string, string> = {};
  if (lang === 'en') return result;

  const langMap = getLangMap(lang);
  langMap.forEach((val, key) => {
    result[key] = val;
  });
  return result;
}

/**
 * Save a single translation into the hybrid cache
 */
export function saveStoredTranslation(lang: Language, englishText: string, translatedText: string): void {
  if (lang === 'en' || !englishText || !translatedText) return;
  const langMap = getLangMap(lang);
  const normKey = normalize(englishText);
  langMap.set(normKey, translatedText);
  persistLocalStorageForLang(lang, langMap);
  notifyListeners(lang);
}

/**
 * Save a batch of translations into the hybrid cache
 */
export function saveStoredTranslationsBatch(lang: Language, translations: Record<string, string>): void {
  if (lang === 'en' || !translations) return;
  const langMap = getLangMap(lang);
  let hasNew = false;

  for (const [eng, tr] of Object.entries(translations)) {
    if (typeof tr === 'string' && tr.trim()) {
      langMap.set(normalize(eng), tr.trim());
      hasNew = true;
    }
  }

  if (hasNew) {
    persistLocalStorageForLang(lang, langMap);
    notifyListeners(lang);
  }
}

// Active listeners for cache updates
type TranslationListener = (lang: Language) => void;
const listeners = new Set<TranslationListener>();

export function subscribeToTranslations(listener: TranslationListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(lang: Language): void {
  listeners.forEach((fn) => {
    try {
      fn(lang);
    } catch (e) {
      console.warn('Error in translation listener:', e);
    }
  });
}

// In-flight tracking to deduplicate concurrent requests for the same phrase
const inFlightKeys = new Set<string>();

// Queue of phrases waiting to be sent to Gemini in a debounced batch
const pendingBatches: Map<Language, Set<string>> = new Map();
let batchDebounceTimers: Map<Language, any> = new Map();

/**
 * Queue phrases for batched, deduplicated runtime translation via Gemini.
 * Groups phrases into batches of up to 20, debounced by 150ms.
 */
export function queuePhrasesForTranslation(phrases: string[], targetLang: Language): void {
  if (targetLang === 'en' || !phrases.length) return;
  if (!hasGeminiApiKey()) return; // Skip if no API key configured to avoid unnecessary errors

  const langMap = getLangMap(targetLang);
  let pendingSet = pendingBatches.get(targetLang);
  if (!pendingSet) {
    pendingSet = new Set<string>();
    pendingBatches.set(targetLang, pendingSet);
  }

  let addedCount = 0;
  for (const phrase of phrases) {
    if (!shouldTranslate(phrase)) continue;
    const norm = normalize(phrase);
    if (langMap.has(norm)) continue; // Already cached
    const flightKey = `${targetLang}:${norm}`;
    if (inFlightKeys.has(flightKey)) continue; // Already in-flight
    if (pendingSet.has(norm)) continue; // Already queued

    pendingSet.add(norm);
    addedCount++;
  }

  if (addedCount === 0) return;

  // Clear previous timer for this language
  const existingTimer = batchDebounceTimers.get(targetLang);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Set new debounced timer
  const timer = setTimeout(() => {
    flushPendingBatch(targetLang);
  }, 150);
  batchDebounceTimers.set(targetLang, timer);
}

// Process and send the queued phrases in batches of up to 20
async function flushPendingBatch(targetLang: Language): Promise<void> {
  const pendingSet = pendingBatches.get(targetLang);
  if (!pendingSet || pendingSet.size === 0) return;

  const allPhrases = Array.from(pendingSet);
  pendingSet.clear();

  // Process in chunks of max 20 phrases to keep prompt concise and reliable
  const CHUNK_SIZE = 20;
  for (let i = 0; i < allPhrases.length; i += CHUNK_SIZE) {
    const chunk = allPhrases.slice(i, i + CHUNK_SIZE);
    
    // Mark as in-flight
    chunk.forEach((p) => inFlightKeys.add(`${targetLang}:${p}`));

    try {
      const results = await translateBatchWithGemini(chunk, targetLang);
      saveStoredTranslationsBatch(targetLang, results);
    } catch (err) {
      console.warn(`Failed to translate batch for ${targetLang}:`, err);
    } finally {
      // Remove from in-flight
      chunk.forEach((p) => inFlightKeys.delete(`${targetLang}:${p}`));
    }
  }
}
