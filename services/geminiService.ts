import { GoogleGenerativeAI } from "@google/generative-ai";
import { CartoonStyle } from "../types";

export const cartoonizeImage = async (base64Image: string, style: CartoonStyle): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key가 설정되지 않았습니다.");

  const genAI = new GoogleGenerativeAI(apiKey);

  // 1. 이미지 데이터 준비
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  try {
    // [1단계] Gemini 1.5 Flash에게 사진 속 인물 묘사를 부탁합니다.
    // (이 모델은 그림을 못 그리지만, 사진은 아주 잘 봅니다.)
    const visionModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const descriptionPrompt = `
      Describe the person in this photo in detail to generate a cartoon character.
      Include details about: gender, approximate age, hair style and color, facial expression, clothing, and accessories.
      Keep it concise (within 3 sentences).
    `;

    const descriptionResult = await visionModel.generateContent([
      descriptionPrompt,
      { inlineData: { data: base64Data, mimeType: mimeType } }
    ]);

    const description = descriptionResult.response.text();
    console.log("사진 분석 결과:", description);

    // [2단계] 분석된 내용을 바탕으로 Imagen 3에게 그림을 그려달라고 합니다.
    // (이 모델은 그림을 아주 잘 그립니다.)
    const imageModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
    
    const imagePrompt = `
      (Cartoon style: ${style})
      A high-quality cartoon character portrait.
      ${description}
      Vibrant colors, professional digital art style, smooth lighting.
    `;

    const imageResult = await imageModel.generateContent(imagePrompt);
    const candidate = imageResult.response.candidates?.[0];

    // Imagen 3가 이미지를 생성했는지 확인
    if (candidate?.content?.parts?.[0]?.inlineData) {
        const imgData = candidate.content.parts[0].inlineData.data;
        return `data:image/png;base64,${imgData}`;
    }

    throw new Error("이미지 생성에 실패했습니다.");

  } catch (error: any) {
    console.error("AI Error:", error);
    
    // 친절한 에러 메시지 처리
    if (error.message?.includes("404")) {
      throw new Error("모델을 찾을 수 없습니다. Vercel 환경 변수 이름이 VITE_GEMINI_API_KEY가 맞는지 확인해주세요.");
    }
    if (error.message?.includes("429")) {
      throw new Error("사용량이 너무 많습니다. 잠시 후 다시 시도해주세요.");
    }
    throw new Error("변환 중 오류가 발생했습니다: " + (error.message || "Unknown error"));
  }
};
