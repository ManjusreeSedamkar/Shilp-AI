import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, api-subscription-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface TranslateRequest {
  input?: string;
  source_language_code?: string;
  target_language_code?: string;
}

interface SarvamSuccessResponse {
  request_id?: string;
  translated_text: string;
  source_language_code?: string;
}

interface SarvamErrorResponse {
  message?: string;
  code?: string | number;
  detail?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed. Only POST requests are supported." }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    let body: TranslateRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body provided." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { input, source_language_code, target_language_code } = body;

    // Validate input non-empty
    if (typeof input !== "string" || input.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Field 'input' is required and must be a non-empty string." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const trimmedInput = input.trim();

    // Validate maximum 2,000 characters limit
    if (trimmedInput.length > 2000) {
      return new Response(
        JSON.stringify({
          error: `Input length (${trimmedInput.length} chars) exceeds Sarvam API limit of 2,000 characters.`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (typeof source_language_code !== "string" || source_language_code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Field 'source_language_code' is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (typeof target_language_code !== "string" || target_language_code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Field 'target_language_code' is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const srcLang = source_language_code.trim();
    const tgtLang = target_language_code.trim();

    // If source and target languages are the same, return original input without calling Sarvam
    if (srcLang !== "auto" && srcLang.toLowerCase() === tgtLang.toLowerCase()) {
      return new Response(
        JSON.stringify({
          translated_text: trimmedInput,
          source_language_code: srcLang,
          target_language_code: tgtLang,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Read the Sarvam API key ONLY from Supabase secret SARVAM_API_KEY
    const apiKey = Deno.env.get("SARVAM_API_KEY");
    if (!apiKey || apiKey.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "SARVAM_API_KEY secret is not configured in Supabase Edge Functions.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Sarvam AI Translation API
    const sarvamResponse = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey.trim(),
      },
      body: JSON.stringify({
        input: trimmedInput,
        source_language_code: srcLang,
        target_language_code: tgtLang,
        model: "sarvam-translate:v1",
      }),
    });

    const contentType = sarvamResponse.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!sarvamResponse.ok) {
      let sarvamErrorMessage = `Sarvam API responded with status ${sarvamResponse.status}`;
      if (isJson) {
        try {
          const errBody = (await sarvamResponse.json()) as SarvamErrorResponse;
          sarvamErrorMessage = errBody.message || errBody.detail || sarvamErrorMessage;
        } catch {
          // Keep default message
        }
      } else {
        const textBody = await sarvamResponse.text();
        if (textBody) {
          sarvamErrorMessage += `: ${textBody.slice(0, 200)}`;
        }
      }

      const statusCode =
        sarvamResponse.status >= 400 && sarvamResponse.status < 600
          ? sarvamResponse.status
          : 502;

      return new Response(
        JSON.stringify({ error: sarvamErrorMessage }),
        {
          status: statusCode,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!isJson) {
      return new Response(
        JSON.stringify({ error: "Sarvam API returned non-JSON response." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const sarvamData = (await sarvamResponse.json()) as SarvamSuccessResponse;

    if (typeof sarvamData.translated_text !== "string") {
      return new Response(
        JSON.stringify({ error: "Sarvam API response is missing 'translated_text' field." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        translated_text: sarvamData.translated_text,
        source_language_code: sarvamData.source_language_code || srcLang,
        target_language_code: tgtLang,
        request_id: sarvamData.request_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: `Internal error in translate edge function: ${errorMsg}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
