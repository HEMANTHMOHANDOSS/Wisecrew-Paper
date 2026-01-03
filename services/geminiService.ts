
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeSubmission(title: string, domain: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate this academic research title: "${title}" in the domain of "${domain}". 
      Provide a professional 2-sentence feedback summary of its relevance and technical feasibility.`,
      config: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your abstract is being queued for peer review. Please check back shortly.";
  }
}
