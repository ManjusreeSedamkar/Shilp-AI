import { Language } from '../types';
import { getSpeechLangCode, LANGUAGE_METADATA } from './translations';

/**
 * SHILP-AI Gemini API Service
 * 
 * Uses Google Gemini API for the Copilot chatbot and hybrid runtime translation.
 * API key is read from environment variable VITE_GEMINI_API_KEY (secure, not in frontend code or GitHub).
 * Falls back to localStorage for user-provided key via the AI Engines settings modal.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Get API key from environment variable (Vite) or localStorage
export function getGeminiApiKey(): string {
  // Vite exposes env vars prefixed with VITE_ via import.meta.env
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (envKey) return envKey;
  
  // Fallback to localStorage (user can set via AI Engines modal)
  return localStorage.getItem('gemini_api_key') || '';
}

export function hasGeminiApiKey(): boolean {
  return getGeminiApiKey().length > 0;
}

interface GeminiRequest {
  contents: {
    parts: { text: string }[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
  };
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: {
    message?: string;
  };
}

/**
 * Send a prompt to Gemini and get a response
 */
export async function askGemini(
  prompt: string,
  language: Language = 'en',
  systemContext?: string
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add it in AI Engines settings or set VITE_GEMINI_API_KEY environment variable.');
  }

  const langName = getLanguageNameForPrompt(language);
  const baseSystem = systemContext || `You are SHILP-AI Copilot, a helpful assistant for Indian artisans and buyers on the MoSJE (Ministry of Social Justice and Empowerment) handicraft marketplace. ` +
    `You help with: app usage, Smart Catalog, publishing products, explaining features, translating content, pricing advice, government schemes (PM Vishwakarma, Shilp Samagam), GST rules, packaging, and business growth. `;
  const systemPrompt = `${baseSystem}\n\nCRITICAL INSTRUCTION: You MUST write your entire response strictly and fluently in ${langName} (${language}) language. Use simple, supportive phrasing for artisans.`;
    `You help with: app usage, Smart Catalog, publishing products, explaining features, translating content, pricing advice, government schemes (PM Vishwakarma, Shilp Samagam), GST rules, packaging, and business growth. ` +
    `IMPORTANT: Always respond in ${langName} language. Keep responses clear, simple, and friendly for low-literacy users. Use emojis where helpful.`;

  const fullPrompt = `${systemPrompt}\n\nUser question: ${prompt}`;

  const requestBody: GeminiRequest = {
    contents: [
      {
        parts: [{ text: fullPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Get language name for prompt - supports all 21 languages
 */
export function getLanguageNameForPrompt(lang: Language): string {
  const meta = LANGUAGE_METADATA[lang];
  if (meta) {
    return `${meta.name} (${meta.nativeName})`;
  }
  return 'English';
}

/**
 * Translate text to the selected language using Gemini
 */
export async function translateWithGemini(text: string, targetLang: Language): Promise<string> {
  const langName = getLanguageNameForPrompt(targetLang);
  const prompt = `Translate the following text to ${langName}. Only return the translated text, nothing else:\n\n${text}`;
  return askGemini(prompt, targetLang);
}

/**
 * Translate a batch of UI labels to target language using Gemini in a single request.
 * Returns a JSON mapping of { originalEnglish: translatedText }.
 */
export async function translateBatchWithGemini(
  texts: string[],
  targetLang: Language
): Promise<Record<string, string>> {
  if (!texts.length || targetLang === 'en') {
    const res: Record<string, string> = {};
    for (const t of texts) res[t] = t;
    return res;
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return {};
  }

  const langName = getLanguageNameForPrompt(targetLang);
  const prompt = `Translate the following user interface phrases from English into ${langName} for an Indian artisan craft e-commerce application.

STRICT RULES:
1. Return ONLY a single raw JSON object mapping each English string to its translation.
2. The JSON keys MUST be the exact English input strings.
3. Keep brand names unchanged: "SHILP-AI", "MoSJE", "FabIndia", "TRIFED", "GeM", "XGBoost".
4. Do NOT output markdown code fences (\`\`\`json or \`\`\`), do NOT output explanation, notes or markdown.
5. Return raw parseable JSON only.

Input strings to translate:
${JSON.stringify(texts)}`;

  try {
    const raw = await askGemini(
      prompt,
      targetLang,
      `You are an expert multilingual translator specialized in Indian languages for government and artisan e-commerce platforms. You output ONLY valid raw JSON.`
    );

    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
  } catch (err) {
    console.warn(`Batch translation with Gemini failed for ${targetLang}:`, err);
  }

  return {};
}