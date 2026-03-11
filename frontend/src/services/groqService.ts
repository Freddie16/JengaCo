const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const groqFetch = async (messages: { role: string; content: string }[]) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error('VITE_GROQ_API_KEY is not set');
    return null;
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 1024
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Groq API error:', err);
    return null;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? null;
};

export const analyzeMaterialDescription = async (description: string) => {
  const text = await groqFetch([
    {
      role: 'system',
      content: 'You are a construction site assistant in Kenya. Extract material information from the user\'s description and respond ONLY with a valid JSON object — no markdown, no explanation. The JSON must have exactly these fields: item (string), quantity (number), cost (number in KES), confidence (number between 0 and 1).'
    },
    { role: 'user', content: description }
  ]);

  if (!text) return null;
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error('Failed to parse Groq response:', e);
    return null;
  }
};

export const getConstructionAdvice = async (
  message: string,
  context: string
): Promise<string | null> => {
  return groqFetch([
    {
      role: 'system',
      content: `You are JengaHub AI, a construction expert specialising in Kenyan building laws (NCA, NEMA, County Kanjo) and cost management. Be concise and practical. Project context: ${context}`
    },
    { role: 'user', content: message }
  ]);
};