
const WEBHOOK_URL = "https://sitykid1.app.n8n.cloud/webhook/rag-query";

/**
 * Sends a query to the n8n RAG webhook.
 * Note: Assumes the webhook accepts a JSON POST body with a 'query' field.
 */
export async function queryN8N(query: string): Promise<string> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Attempt to parse text or JSON depending on what n8n returns
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      // Adjust this based on your n8n workflow output structure
      return data.output || data.text || data.message || JSON.stringify(data);
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Error querying n8n:", error);
    return "I'm sorry, I'm having trouble connecting to the energy analysis engine right now.";
  }
}
