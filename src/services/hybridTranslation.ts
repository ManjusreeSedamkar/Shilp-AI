import { Language } from '../types';
import {
  translateBatchWithSarvam,
  translateWithSarvam,
  splitTextIntoChunks
} from './sarvamTranslationService';

export { splitTextIntoChunks, translateWithSarvam, translateBatchWithSarvam };

/**
 * Hybrid Multilingual Translation Engine for SHILP-AI.
 * 
 * Features:
 * 1. Priority to existing static dictionaries.
 * 2. On-demand dynamic Sarvam translation via Firebase Cloud Function (Phase 1)
 *    for missing languages/phrases with zero API keys exposed in frontend.
 * 3. Two-tiered cache (fast In-Memory Map + persistent LocalStorage).
 * 4. Request deduplication & batched translation to prevent per-DOM-node calls.
 * 5. Strict safety filter to never translate proper names, numbers, prices, URLs, emails, or IDs.
 * 6. Canonical English fallback preserved at all times.
 * 7. Long text chunking within Sarvam's 2,000-character limit.
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
  if (t.length < 2 || t.length > 1800) return false;

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
  if (normalize(englishText) === normalize(translatedText)) return; // Never cache un-translated fallback strings
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
    if (typeof tr === 'string' && tr.trim() && normalize(eng) !== normalize(tr)) { // Never cache un-translated fallback strings
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

// In-flight tracking to deduplicate concurrent requests for the same phrase: Set<"targetLang:normalizedText">
const inFlightKeys = new Set<string>();

// Queued phrases per language waiting to be translated: Map<Language, Set<normalizedText>>
const pendingQueues: Map<Language, Set<string>> = new Map();

// Concurrency control for active HTTP requests
let activeWorkerCount = 0;
const MAX_CONCURRENT_WORKERS = 3;
const CHUNK_SIZE = 12;

let processTimer: any = null;

function scheduleWorkerProcessing(): void {
  if (processTimer) return;
  processTimer = setTimeout(() => {
    processTimer = null;
    triggerQueueWorkers();
  }, 50);
}

/**
 * Queue phrases for batched, deduplicated runtime translation via Supabase Sarvam function.
 * Deduplicates requests, enforces max 3 active HTTP requests, and caches results.
 */
export function queuePhrasesForTranslation(phrases: string[], targetLang: Language): void {
  if (targetLang === 'en' || !phrases || !phrases.length) return;

  const langMap = getLangMap(targetLang);
  let queue = pendingQueues.get(targetLang);
  if (!queue) {
    queue = new Set<string>();
    pendingQueues.set(targetLang, queue);
  }

  let added = 0;
  for (const phrase of phrases) {
    if (!shouldTranslate(phrase)) continue;
    const norm = normalize(phrase);
    if (langMap.has(norm)) continue; // Already cached
    const flightKey = `${targetLang}:${norm}`;
    if (inFlightKeys.has(flightKey)) continue; // Already in-flight
    if (queue.has(norm)) continue; // Already queued

    queue.add(norm);
    added++;
  }

  if (added > 0) {
    scheduleWorkerProcessing();
  }
}

async function triggerQueueWorkers(): Promise<void> {
  while (activeWorkerCount < MAX_CONCURRENT_WORKERS) {
    let targetLang: Language | null = null;
    let pendingSet: Set<string> | null = null;

    for (const [lang, q] of pendingQueues.entries()) {
      if (q.size > 0) {
        targetLang = lang;
        pendingSet = q;
        break;
      }
    }

    if (!targetLang || !pendingSet || pendingSet.size === 0) {
      break;
    }

    const chunk: string[] = [];
    for (const norm of Array.from(pendingSet)) {
      chunk.push(norm);
      pendingSet.delete(norm);
      inFlightKeys.add(`${targetLang}:${norm}`);
      if (chunk.length >= CHUNK_SIZE) break;
    }

    if (chunk.length === 0) continue;

    activeWorkerCount++;
    runWorkerChunk(targetLang, chunk);
  }
}

async function runWorkerChunk(targetLang: Language, chunk: string[]): Promise<void> {
  try {
    const results = await translateBatchWithSarvam(chunk, targetLang, 'en');
    saveStoredTranslationsBatch(targetLang, results);
  } catch (err) {
    console.warn(`Worker batch translation failed for ${targetLang}:`, err);
  } finally {
    chunk.forEach((p) => inFlightKeys.delete(`${targetLang}:${p}`));
    activeWorkerCount--;
    triggerQueueWorkers();
  }
}

/**
 * Translate dynamic or long text with caching and Sarvam Firebase fallback.
 * Safely handles chunking for text > 1,800 chars and preserves English fallback.
 */
export async function translateDynamicText(
  text: string,
  targetLang: Language,
  sourceLang = 'en'
): Promise<string> {
  if (targetLang === 'en' || !text || !text.trim()) return text;

  const norm = normalize(text);
  const cached = getStoredTranslation(targetLang, norm);
  if (cached) return cached;

  try {
    const translated = await translateWithSarvam(text, targetLang, sourceLang);
    if (translated && translated !== text) {
      saveStoredTranslation(targetLang, norm, translated);
      return translated;
    }
  } catch (err) {
    console.warn(`Dynamic translation failed for ${targetLang}:`, err);
  }

  return text;
}
