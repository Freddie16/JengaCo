
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMaterialPhoto = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Analyze this photo from a construction site in Kenya. 1. Identify what construction materials are visible (e.g., cement bags, bricks, timber). 2. Count the quantity if possible. 3. Look for a receipt and extract the total cost in KES. Format your response in JSON with properties: 'item', 'quantity', 'cost', 'confidence'.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          cost: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const getConstructionAdvice = async (message: string, context: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are JengaHub AI, a construction expert specializing in Kenyan building laws (NCA, NEMA, County Kanjo) and cost management. Context: ${context}. User asks: ${message}`,
  });
  return response.text;
};
