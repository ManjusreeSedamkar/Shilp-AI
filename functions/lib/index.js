"use strict";
/**
 * Shilp-AI Firebase Cloud Functions - Phase 1
 *
 * Secure Firebase Cloud Function for Sarvam AI Translation.
 * - Reads SARVAM_API_KEY securely from Firebase Secret Manager.
 * - Maps Shilp-AI 21 language IDs to Sarvam codes.
 * - Calls https://api.sarvam.ai/translate with model 'sarvam-translate:v1'.
 * - Never exposes SARVAM_API_KEY to the frontend.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateCallable = exports.translate = exports.sarvamApiKeySecret = exports.SUPPORTED_SARVAM_CODES = exports.SHILP_TO_SARVAM_LANG_MAP = exports.resolveSarvamLanguageCode = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const logger = __importStar(require("firebase-functions/logger"));
var languageMap_1 = require("./languageMap");
Object.defineProperty(exports, "resolveSarvamLanguageCode", { enumerable: true, get: function () { return languageMap_1.resolveSarvamLanguageCode; } });
Object.defineProperty(exports, "SHILP_TO_SARVAM_LANG_MAP", { enumerable: true, get: function () { return languageMap_1.SHILP_TO_SARVAM_LANG_MAP; } });
Object.defineProperty(exports, "SUPPORTED_SARVAM_CODES", { enumerable: true, get: function () { return languageMap_1.SUPPORTED_SARVAM_CODES; } });
const languageMap_2 = require("./languageMap");
const sarvamService_1 = require("./sarvamService");
// Define the secret in Firebase Secret Manager
exports.sarvamApiKeySecret = (0, params_1.defineSecret)("SARVAM_API_KEY");
/**
 * Retrieve the Sarvam API key securely from Firebase Secret Manager.
 * Never exposed through VITE_* or frontend code.
 */
function getSarvamApiKey() {
    try {
        const val = exports.sarvamApiKeySecret.value();
        if (val && val.trim().length > 0) {
            return val.trim();
        }
    }
    catch {
        // Secret may not be initialized in non-secret-manager execution contexts
    }
    // Fallback to process.env (for emulator / local testing)
    if (process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY.trim().length > 0) {
        return process.env.SARVAM_API_KEY.trim();
    }
    return "";
}
/**
 * Validates and normalizes translation inputs
 */
function validateAndResolveInput(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Request body must be a valid JSON object containing { text, sourceLanguage, targetLanguage }.");
    }
    const { text, sourceLanguage, targetLanguage } = data;
    if (typeof text !== "string" || text.trim().length === 0) {
        throw new Error("Field 'text' is required and must be a non-empty string.");
    }
    if (text.length > 2000) {
        throw new Error(`Text length exceeds Sarvam AI limit of 2,000 characters. Received length: ${text.length}.`);
    }
    if (typeof sourceLanguage !== "string" || sourceLanguage.trim().length === 0) {
        throw new Error("Field 'sourceLanguage' is required (e.g. 'en', 'hi', or 'auto').");
    }
    if (typeof targetLanguage !== "string" || targetLanguage.trim().length === 0) {
        throw new Error("Field 'targetLanguage' is required (e.g. 'hi', 'te', 'ta').");
    }
    const sourceCode = (0, languageMap_2.resolveSarvamLanguageCode)(sourceLanguage, true);
    if (!sourceCode) {
        const allowed = Object.keys(languageMap_2.SHILP_TO_SARVAM_LANG_MAP).join(", ");
        throw new Error(`Unsupported sourceLanguage '${sourceLanguage}'. Supported language IDs: ${allowed}, or 'auto'.`);
    }
    const targetCode = (0, languageMap_2.resolveSarvamLanguageCode)(targetLanguage, false);
    if (!targetCode) {
        const allowed = Object.keys(languageMap_2.SHILP_TO_SARVAM_LANG_MAP).join(", ");
        throw new Error(`Unsupported targetLanguage '${targetLanguage}'. Supported language IDs: ${allowed}.`);
    }
    return {
        text: text.trim(),
        sourceLanguage: sourceLanguage.trim(),
        targetLanguage: targetLanguage.trim(),
        sourceCode,
        targetCode
    };
}
function sendJsonResponse(res, statusCode, data) {
    if (typeof res.status === "function" && typeof res.json === "function") {
        res.status(statusCode).json(data);
    }
    else {
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
exports.translate = (0, https_1.onRequest)({
    secrets: [exports.sarvamApiKeySecret],
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 30
}, async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        if (typeof res.status === "function") {
            res.status(204).send("");
        }
        else {
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
        const { text, sourceLanguage, targetLanguage, sourceCode, targetCode } = validateAndResolveInput(req.body);
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
            logger.error("SARVAM_API_KEY is not configured in Firebase Secret Manager or environment.");
            sendJsonResponse(res, 500, {
                success: false,
                error: "Configuration Error",
                message: "SARVAM_API_KEY is not configured in Firebase Secret Manager."
            });
            return;
        }
        logger.info(`Translating from ${sourceCode} to ${targetCode} (length: ${text.length})`);
        const result = await (0, sarvamService_1.callSarvamTranslate)(text, sourceCode, targetCode, apiKey);
        const response = {
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
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error("Translation request failed:", message);
        const isValidationError = message.includes("is required") ||
            message.includes("Unsupported") ||
            message.includes("exceeds Sarvam AI limit");
        const statusCode = isValidationError ? 400 : 502;
        sendJsonResponse(res, statusCode, {
            success: false,
            error: isValidationError ? "Bad Request" : "Translation Error",
            message
        });
    }
});
/**
 * Firebase Callable Translation Endpoint
 *
 * Callable from client SDKs: httpsCallable(functions, 'translateCallable')
 */
exports.translateCallable = (0, https_1.onCall)({
    secrets: [exports.sarvamApiKeySecret],
    maxInstances: 10,
    timeoutSeconds: 30
}, async (request) => {
    try {
        const { text, sourceLanguage, targetLanguage, sourceCode, targetCode } = validateAndResolveInput(request.data);
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
            logger.error("SARVAM_API_KEY is not configured in Firebase Secret Manager.");
            throw new https_1.HttpsError("failed-precondition", "SARVAM_API_KEY is not configured in Firebase Secret Manager.");
        }
        const result = await (0, sarvamService_1.callSarvamTranslate)(text, sourceCode, targetCode, apiKey);
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
    }
    catch (err) {
        if (err instanceof https_1.HttpsError) {
            throw err;
        }
        const message = err instanceof Error ? err.message : String(err);
        throw new https_1.HttpsError("internal", message);
    }
});
//# sourceMappingURL=index.js.map