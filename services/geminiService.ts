import { GoogleGenAI } from "@google/genai"; import { CartoonStyle } from "../types";

export const cartoonizeImage = async (base64Image: string, style: CartoonStyle): Promise<string> => { const apiKey = import.meta.env.VITE_GEMINI_API_KEY; if (!apiKey) throw new Error("API Key Missing");

const ai = new GoogleGenAI({ apiKey }); const base64Data = base64Image.split(',')[1]; const mimeType = base64Image.split(';')[0].split(':')[1]; const prompt = Transform this photo into ${style} style. Output ONLY the image.;

try { const response = await ai.models.generateContent({ model: 'gemini-1.5-flash', contents: { parts: [ { inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }, ], }, });

} catch (error) { console.error(error); throw error; } };
