"use strict";
/**
 * Sarvam AI Translation Service
 *
 * Calls https://api.sarvam.ai/translate using model 'sarvam-translate:v1'.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSarvamTranslate = callSarvamTranslate;
const SARVAM_TRANSLATE_API_URL = "https://api.sarvam.ai/translate";
const SARVAM_DEFAULT_MODEL = "sarvam-translate:v1";
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
async function callSarvamTranslate(text, sourceCode, targetCode, apiKey) {
    if (!apiKey || apiKey.trim().length === 0) {
        throw new Error("SARVAM_API_KEY is missing or empty.");
    }
    const payload = {
        input: text,
        source_language_code: sourceCode,
        target_language_code: targetCode,
        model: SARVAM_DEFAULT_MODEL
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS);
    try {
        const response = await fetch(SARVAM_TRANSLATE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": apiKey.trim()
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        if (!response.ok) {
            let errorMessage = `Sarvam API responded with status ${response.status} (${response.statusText})`;
            if (isJson) {
                try {
                    const errorBody = (await response.json());
                    errorMessage = errorBody.message || errorBody.detail || errorMessage;
                }
                catch {
                    // ignore parsing error and keep generic message
                }
            }
            else {
                const textBody = await response.text();
                if (textBody) {
                    errorMessage += `: ${textBody.substring(0, 200)}`;
                }
            }
            throw new Error(errorMessage);
        }
        if (!isJson) {
            throw new Error("Invalid response format received from Sarvam API (expected application/json).");
        }
        const data = (await response.json());
        if (typeof data.translated_text !== "string") {
            throw new Error("Sarvam API response is missing 'translated_text' field.");
        }
        return data;
    }
    catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error) {
            if (err.name === "AbortError") {
                throw new Error(`Sarvam API request timed out after ${DEFAULT_REQUEST_TIMEOUT_MS}ms.`);
            }
            throw err;
        }
        throw new Error(`Unexpected error while calling Sarvam API: ${String(err)}`);
    }
}
//# sourceMappingURL=sarvamService.js.map