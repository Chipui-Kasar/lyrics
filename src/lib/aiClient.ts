type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

interface ChatCompletionOptions {
  messages: ChatMessage[];
  openRouterModel: string;
  groqModel: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

async function requestChatCompletion(
  url: string,
  apiKey: string,
  model: string,
  { messages, temperature, maxTokens, jsonMode }: ChatCompletionOptions,
  extraHeaders?: Record<string, string>
): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages,
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxTokens !== undefined ? { max_tokens: maxTokens } : {}),
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Request to ${url} failed: ${response.status} ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Empty response from ${url}`);
  return text;
}

// Tries OpenRouter first, falls back to Groq if OpenRouter is unavailable or errors.
export async function chatCompletion(
  options: ChatCompletionOptions
): Promise<string> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (openRouterKey) {
    try {
      return await requestChatCompletion(
        "https://openrouter.ai/api/v1/chat/completions",
        openRouterKey,
        options.openRouterModel,
        options,
        {
          "HTTP-Referer": process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
          "X-Title": "Tangkhul Lyrics",
        }
      );
    } catch (error) {
      console.error("OpenRouter request failed, falling back to Groq:", error);
    }
  }

  if (!groqKey) {
    throw new Error(
      "OpenRouter failed and GROQ_API_KEY is not configured for fallback"
    );
  }

  return requestChatCompletion(
    "https://api.groq.com/openai/v1/chat/completions",
    groqKey,
    options.groqModel,
    options
  );
}
