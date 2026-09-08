import { Language } from '../types';
import { getSpeechLangCode } from './translations';

/**
 * SHILP-AI Gemini API Service
 * 
 * Uses Google Gemini API for the Copilot chatbot.
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
  const systemPrompt = systemContext || 
    `You are SHILP-AI Copilot, a helpful assistant for Indian artisans and buyers on the MoSJE (Ministry of Social Justice and Empowerment) handicraft marketplace. ` +
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
 * Get language name for prompt
 */
function getLanguageNameForPrompt(lang: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi (हिन्दी)',
    te: 'Telugu (తెలుగు)',
    ta: 'Tamil (தமிழ்)',
    bn: 'Bengali (বাংলা)',
    mr: 'Marathi (मराठी)',
    gu: 'Gujarati (ગુજરાતી)',
  };
  return names[lang] || 'English';
}

/**
 * Translate text to the selected language using Gemini
 */
export async function translateWithGemini(text: string, targetLang: Language): Promise<string> {
  const langName = getLanguageNameForPrompt(targetLang);
  const prompt = `Translate the following text to ${langName}. Only return the translated text, nothing else:\n\n${text}`;
  return askGemini(prompt, targetLang);
}