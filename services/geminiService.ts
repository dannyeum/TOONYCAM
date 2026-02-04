
import { GoogleGenAI } from "@google/genai";
import { CartoonStyle } from "../types";

export const cartoonizeImage = async (base64Image: string, style: CartoonStyle): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract base64 data from Data URL
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  const prompt = `
    Transform this person's photo into a high-quality, professional ${style}. 
    - Keep the facial features and hair style recognizable so it looks like the original person.
    - Use vibrant colors, smooth lines, and stylized textures appropriate for the ${style}.
    - Ensure the background is also stylized to match the character.
    - Output ONLY the edited image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image part found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
