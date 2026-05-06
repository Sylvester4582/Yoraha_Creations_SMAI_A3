export async function summarizeArticle(
  title: string,
  content: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return "• Groq API key not configured.\n• Add GROQ_API_KEY to .env.local.\n• Get a free key at console.groq.com.";

  const prompt = `Summarize this tech article in exactly 3 concise bullet points. Each bullet must start with "• ". Be direct, factual, and specific. No preamble.

Title: ${title}

${content.slice(0, 1500)}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Groq]", err);
    return "• Summary unavailable — API error.\n• Check GROQ_API_KEY in .env.local.\n• Verify the Groq service is reachable.";
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content?.trim() ?? "• No summary returned.";
}
