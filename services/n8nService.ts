// Using Vite's import.meta.env for environment variables
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";

/**
 * Sends a query to the n8n RAG webhook.
 * Note: Assumes the webhook accepts a JSON POST body with a 'query' field.
 */
export async function queryN8N(query: string): Promise<string> {
  if (!WEBHOOK_URL || WEBHOOK_URL === "YOUR_N8N_WEBHOOK_URL_HERE") {
    console.error("[EnerVision] VITE_N8N_WEBHOOK_URL is not configured. Check your environment variables.");
    return "⚠️ The AI engine is not configured. Please set the VITE_N8N_WEBHOOK_URL environment variable.";
  }

  try {
    console.log("[EnerVision] Sending query to:", WEBHOOK_URL);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error(`[EnerVision] HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Always read as text first to avoid crashing on empty JSON bodies
    const responseText = await response.text();

    if (!responseText || responseText.trim() === "") {
      console.warn("[EnerVision] Received empty response from n8n");
      return "The AI engine returned an empty response. Please try again.";
    }

    // Try parsing as JSON if content-type indicates JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      try {
        const data = JSON.parse(responseText);
        // Adjust this based on your n8n workflow output structure
        return data.output || data.text || data.message || JSON.stringify(data);
      } catch {
        // If JSON parsing fails, return raw text
        console.warn("[EnerVision] Failed to parse JSON, returning raw text");
        return responseText;
      }
    } else {
      return responseText;
    }
  } catch (error: any) {
    console.error("[EnerVision] Error querying n8n:", error);

    // Provide specific error messages for common deployment issues
    if (error?.message?.includes("Failed to fetch") || error?.name === "TypeError") {
      return "⚠️ Could not reach the AI engine. This is likely a CORS issue — the n8n webhook needs to allow requests from this domain.";
    }

    return "I'm sorry, I'm having trouble connecting to the energy analysis engine right now.";
  }
}
