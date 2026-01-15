
import { GoogleGenAI, Type } from "@google/genai";
import { RefinementResult } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineIntention = async (userIntention: string): Promise<RefinementResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `النية المراد رصدها وتحويلها إلى واقع ملموس: "${userIntention}"`,
    config: {
      systemInstruction: `أنت "نظام انهيار الدالة الموجية" المتقدم. مهمتك هي مساعدة المستخدم على توجيه وعيه المراقب لتحويل احتمالاته الكمومية إلى واقع مُثبّت.

القواعد والمبادئ:
1. صياغة النية (refinedIntention): حوّل نية المستخدم إلى حقيقة حاضرة بأسلوب "الآن". يجب أن تشعر النية بالقوة، الوضوح، واليقين التام. استخدم لغة تعكس أن الواقع قد بدأ بالتشكل فعلياً بمجرد رصده.
2. التفسير الكمي (explanation): اشرح للمستخدم كيف أن "تأثير المراقب" يعمل حالياً على تقليل تشتت الاحتمالات الأخرى (Superposition) وتركيز الطاقة في النسخة المختارة من الواقع. اربط بين وعيه الداخلي وبين الحقل الموحد.
3. الكلمات المفتاحية (focusKeywords): استخرج كلمات قوية ترددياً (مثل: وفرة، انسجام، رصد، تجلي، انهيار، يقين).
4. المرساة البصرية (visualPrompt): صف مشهداً سينمائياً فائق الواقعية (Hyper-realistic) يجسد "الشيفرة البصرية" لهذا التجلي. يجب أن يكون الوصف غنياً بالتفاصيل المادية والضوئية ليعمل كمرساة قوية للعقل الباطن (باللغة الإنجليزية حصراً).

المخرجات يجب أن تكون بتنسيق JSON حصراً وباللغة العربية (ما عدا visualPrompt).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          refinedIntention: { type: Type.STRING, description: "النية بصيغة الواقع المرصود حالاً" },
          explanation: { type: Type.STRING, description: "التفسير العلمي الطاقي لعملية الرصد هذه" },
          resonanceScore: { type: Type.NUMBER, description: "مستوى التوافق مع تردد التجلي (0-1)" },
          focusKeywords: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          visualPrompt: { type: Type.STRING, description: "Detailed cinematic visual sigil (English)" }
        },
        required: ["refinedIntention", "explanation", "resonanceScore", "focusKeywords", "visualPrompt"]
      }
    }
  });

  try {
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as RefinementResult;
  } catch (error) {
    console.error("Quantum Resonance Error:", error);
    throw new Error("حدث تداخل في ترددات الرصد. يرجى إعادة المحاولة.");
  }
};

export const generateIntentionImage = async (visualPrompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A profound and mystical hyper-realistic image serving as a quantum anchor for reality manifestation. Cinematic lighting, divine geometry, extreme details, 8k resolution. The image should visually encode the frequency of: ${visualPrompt}. Ethereal yet grounded in physical reality.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  
  throw new Error("فشل تشفير المرساة البصرية.");
};
