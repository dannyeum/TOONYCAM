import { GoogleGenAI } from "@google/genai";
import { CartoonStyle } from "../types";

export const cartoonizeImage = async (base64Image: string, style: CartoonStyle): Promise<string> => {
  // [수정 1] Vite 환경에 맞게 API Key 가져오는 방식 변경
  // .env.local 파일에 VITE_GEMINI_API_KEY=... 라고 저장되어 있어야 합니다.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
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
      // [수정 2] 모델 변경: 무료로 사용 가능한 모델로 변경
      // 기존 gemini-2.5-flash-image는 무료 할당량이 없어 429 에러가 발생합니다.
      model: 'gemini-1.5-flash', 
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

    // 응답에서 이미지 데이터 추출
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    // 이미지가 없는 경우 (텍스트로 거절 메시지가 왔을 수 있음)
    console.warn("AI 응답:", response);
    throw new Error("AI가 이미지를 생성하지 못했습니다. (텍스트 응답만 반환됨)");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
