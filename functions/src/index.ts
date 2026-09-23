/**
 * Shilp-AI Firebase Cloud Functions - Phase 1
 *
 * Secure Firebase Cloud Function for Sarvam AI Translation.
 * - Reads SARVAM_API_KEY securely from Firebase Secret Manager.
 * - Maps Shilp-AI 21 language IDs to Sarvam codes.
 * - Calls https://api.sarvam.ai/translate with model 'sarvam-translate:v1'.
 * - Never exposes SARVAM_API_KEY to the frontend.
 */

import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
export {
  resolveSarvamLanguageCode,
  SHILP_TO_SARVAM_LANG_MAP,
  SUPPORTED_SARVAM_CODES
} from "./languageMap";
import {
  resolveSarvamLanguageCode,
  SHILP_TO_SARVAM_LANG_MAP
} from "./languageMap";
import { callSarvamTranslate } from "./sarvamService";

// Define the secret in Firebase Secret Manager
export const sarvamApiKeySecret = defineSecret("SARVAM_API_KEY");

/**
 * Retrieve the Sarvam API key securely from Firebase Secret Manager.
 * Never exposed through VITE_* or frontend code.
 */
function getSarvamApiKey(): string {
  try {
    const val = sarvamApiKeySecret.value();
    if (val && val.trim().length > 0) {
      return val.trim();
    }
  } catch {
    // Secret may not be initialized in non-secret-manager execution contexts
  }

  // Fallback to process.env (for emulator / local testing)
  if (process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY.trim().length > 0) {
    return process.env.SARVAM_API_KEY.trim();
  }

  return "";
}

/**
 * Request payload interface
 */
export interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslateResponse {
  success: boolean;
  text: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  requestId?: string;
}

/**
 * Validates and normalizes translation inputs
 */
function validateAndResolveInput(data: any): {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceCode: string;
  targetCode: string;
} {
  if (!data || typeof data !== "object") {
    throw new Error("Request body must be a valid JSON object containing { text, sourceLanguage, targetLanguage }.");
  }

  const { text, sourceLanguage, targetLanguage } = data;

  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Field 'text' is required and must be a non-empty string.");
  }

  if (text.length > 2000) {
    throw new Error(
      `Text length exceeds Sarvam AI limit of 2,000 characters. Received length: ${text.length}.`
    );
  }

  if (typeof sourceLanguage !== "string" || sourceLanguage.trim().length === 0) {
    throw new Error("Field 'sourceLanguage' is required (e.g. 'en', 'hi', or 'auto').");
  }

  if (typeof targetLanguage !== "string" || targetLanguage.trim().length === 0) {
    throw new Error("Field 'targetLanguage' is required (e.g. 'hi', 'te', 'ta').");
  }

  const sourceCode = resolveSarvamLanguageCode(sourceLanguage, true);
  if (!sourceCode) {
    const allowed = Object.keys(SHILP_TO_SARVAM_LANG_MAP).join(", ");
    throw new Error(
      `Unsupported sourceLanguage '${sourceLanguage}'. Supported language IDs: ${allowed}, or 'auto'.`
    );
  }

  const targetCode = resolveSarvamLanguageCode(targetLanguage, false);
  if (!targetCode) {
    const allowed = Object.keys(SHILP_TO_SARVAM_LANG_MAP).join(", ");
    throw new Error(
      `Unsupported targetLanguage '${targetLanguage}'. Supported language IDs: ${allowed}.`
    );
  }

  return {
    text: text.trim(),
    sourceLanguage: sourceLanguage.trim(),
    targetLanguage: targetLanguage.trim(),
    sourceCode,
    targetCode
  };
}

function sendJsonResponse(res: any, statusCode: number, data: any): void {
  if (typeof res.status === "function" && typeof res.json === "function") {
    res.status(statusCode).json(data);
  } else {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  }
}

/**
 * HTTP REST Translation Endpoint
 *
 * Accepts POST { text, sourceLanguage, targetLanguage }
 * Returns JSON { success: true, text, translatedText, ... }
 */
export const translate = onRequest(
  {
    secrets: [sarvamApiKeySecret],
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 30
  },
  async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      if (typeof res.status === "function") {
        res.status(204).send("");
      } else {
        res.statusCode = 204;
        res.end();
      }
      return;
    }

    if (req.method !== "POST") {
      sendJsonResponse(res, 405, {
        success: false,
        error: "Method Not Allowed",
        message: "Only POST requests are supported for translation."
      });
      return;
    }

    try {
      const { text, sourceLanguage, targetLanguage, sourceCode, targetCode } =
        validateAndResolveInput(req.body);

      // Short circuit if source and target are identical
      if (sourceCode !== "auto" && sourceCode === targetCode) {
        sendJsonResponse(res, 200, {
          success: true,
          text,
          translatedText: text,
          sourceLanguage,
          targetLanguage,
          sourceLanguageCode: sourceCode,
          targetLanguageCode: targetCode
        });
        return;
      }

      const apiKey = getSarvamApiKey();
      if (!apiKey) {
        logger.error(
          "SARVAM_API_KEY is not configured in Firebase Secret Manager or environment."
        );
        sendJsonResponse(res, 500, {
          success: false,
          error: "Configuration Error",
          message: "SARVAM_API_KEY is not configured in Firebase Secret Manager."
        });
        return;
      }

      logger.info(
        `Translating from ${sourceCode} to ${targetCode} (length: ${text.length})`
      );

      const result = await callSarvamTranslate(text, sourceCode, targetCode, apiKey);

      const response: TranslateResponse = {
        success: true,
        text,
        translatedText: result.translated_text,
        sourceLanguage,
        targetLanguage,
        sourceLanguageCode: result.source_language_code || sourceCode,
        targetLanguageCode: targetCode,
        requestId: result.request_id
      };

      sendJsonResponse(res, 200, response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error("Translation request failed:", message);

      const isValidationError =
        message.includes("is required") ||
        message.includes("Unsupported") ||
        message.includes("exceeds Sarvam AI limit");

      const statusCode = isValidationError ? 400 : 502;

      sendJsonResponse(res, statusCode, {
        success: false,
        error: isValidationError ? "Bad Request" : "Translation Error",
        message
      });
    }
  }
);

/**
 * Firebase Callable Translation Endpoint
 *
 * Callable from client SDKs: httpsCallable(functions, 'translateCallable')
 */
export const translateCallable = onCall(
  {
    secrets: [sarvamApiKeySecret],
    maxInstances: 10,
    timeoutSeconds: 30
  },
  async (request) => {
    try {
      const { text, sourceLanguage, targetLanguage, sourceCode, targetCode } =
        validateAndResolveInput(request.data);

      if (sourceCode !== "auto" && sourceCode === targetCode) {
        return {
          success: true,
          text,
          translatedText: text,
          sourceLanguage,
          targetLanguage,
          sourceLanguageCode: sourceCode,
          targetLanguageCode: targetCode
        };
      }

      const apiKey = getSarvamApiKey();
      if (!apiKey) {
        logger.error(
          "SARVAM_API_KEY is not configured in Firebase Secret Manager."
        );
        throw new HttpsError(
          "failed-precondition",
          "SARVAM_API_KEY is not configured in Firebase Secret Manager."
        );
      }

      const result = await callSarvamTranslate(text, sourceCode, targetCode, apiKey);

      return {
        success: true,
        text,
        translatedText: result.translated_text,
        sourceLanguage,
        targetLanguage,
        sourceLanguageCode: result.source_language_code || sourceCode,
        targetLanguageCode: targetCode,
        requestId: result.request_id
      };
    } catch (err: unknown) {
      if (err instanceof HttpsError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new HttpsError("internal", message);
    }
  }
);
