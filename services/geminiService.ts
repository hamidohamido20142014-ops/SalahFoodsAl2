import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, IngredientStatus } from "../types";

// Initialize the client
// Note: In a production environment, process.env.API_KEY is injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable multimodal model

  const prompt = `
    أنت خبير كيميائي وغذائي متخصص في تحليل المنتجات (مأكولات أو مستحضرات تجميل).
    قم بتحليل الصورة المرفقة للمنتج. استخرج قائمة المكونات وحللها.
    
    يجب عليك تصنيف كل مكون بدقة:
    - SAFE: آمن للاستخدام العام.
    - WARNING: يجب الحذر منه (مثل السكريات العالية، المواد الحافظة المشكوك فيها، مسببات الحساسية الشائعة).
    - DANGER: مواد ضارة أو مسرطنة محتملة أو ممنوعة في بعض الدول.
    
    قم بتقدير درجة صحية للمنتج من 0 (سيء جداً) إلى 100 (ممتاز وصحي).
    
    اكتب الأسماء والوصف باللغة العربية.
  `;

  // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING, description: "اسم المنتج الظاهر في الصورة" },
            productType: { type: Type.STRING, enum: ["Food", "Cosmetic", "Other"] },
            overallScore: { type: Type.NUMBER, description: "تقييم صحي من 0 الى 100" },
            summary: { type: Type.STRING, description: "ملخص عام عن المنتج وهل ينصح به أم لا" },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["SAFE", "WARNING", "DANGER", "UNKNOWN"] },
                  description: { type: Type.STRING, description: "شرح مختصر لماذا تم تصنيف المكون بهذا الشكل" }
                },
                required: ["name", "status", "description"]
              }
            }
          },
          required: ["productName", "productType", "ingredients", "summary", "overallScore"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AnalysisResult;
      return data;
    } else {
      throw new Error("لم يتم استلام أي بيانات من النموذج");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.");
  }
};
