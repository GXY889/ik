
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient && process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

// ==========================================
//  OFFLINE BRAIN (Fallback)
// ==========================================

const processOfflineInput = (text: string, imageProvided?: boolean): { text: string, image?: string } => {
  if (imageProvided) {
      return { text: "يا غالي، ودي أشوف الصورة بس أنا حالياً 'أوفلاين' (بدون نت). شغل النت وأبشر بعزك! 📶" };
  }
  return { text: "أنا حالياً في وضع عدم الاتصال 🔌. أقدر أسولف معك خفيف، بس عشان أعطيك كامل ذكائي وشطارتي أحتاج نت!" };
};

// --- PUBLIC API ---

export const generateAIResponse = async (message: string, imageBase64?: string): Promise<{ text: string, image?: string }> => {
  if (!navigator.onLine) {
    return processOfflineInput(message, !!imageBase64);
  }
  
  try {
    const ai = getClient();
    if (!ai) return processOfflineInput(message, !!imageBase64);
    
    // DECISION LOGIC: 
    // If image is provided, use multimodal model. 
    // If text only, use the powerful Pro model for high-IQ reasoning.
    const modelName = imageBase64 ? "gemini-2.5-flash-image" : "gemini-3-pro-preview";
    
    const systemInstruction = `
    أنت "المساعد الذكي" في تطبيق "حارسي الأمين". أنت سعودي، فزعة، ذكي جداً، وأسلوبك "رهيب" وغير رسمي.
    
    شخصيتك:
    - استخدم كلمات مثل: (يا غالي، أبشر، من عيوني، هلا والله، تسلم).
    - خلك ذكي وما تحتاج المستخدم يكرر كلامه.
    - إذا سألك عن "حارسي الأمين"، قله إنه تطبيقك المفضل لحماية كلمات المرور.
    
    قدراتك التقنية:
    1. التحليل: إذا شفت صورة، حللها كأنك خبير.
    2. الرسم: إذا طلب منك ترسم، ارسم بخيال واسع جداً.
    3. البرمجة: إذا طلب كود، عطه كود نظيف واحترافي.
    
    قاعدة ذهبية: لا تجاوب بردود آلية مملة. خلك كأنك خوي المستخدم.
    `;
    
    let contents: any;
    if (imageBase64) {
        const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
        contents = {
            parts: [
                { text: message || "حلل هذه الصورة أو عدلها" }, 
                { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
            ]
        };
    } else {
        contents = message;
    }
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: { 
          systemInstruction: systemInstruction,
          temperature: 0.8, // More creative and human-like
          thinkingConfig: modelName.includes('pro') ? { thinkingBudget: 4000 } : undefined
      }
    });
    
    let responseText = "";
    let responseImage = undefined;

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.text) responseText += part.text;
            if (part.inlineData) {
                const mime = part.inlineData.mimeType || 'image/png';
                responseImage = `data:${mime};base64,${part.inlineData.data}`;
            }
        }
    }

    return { 
        text: responseText || "يا غالي ما وصلني رد، جرب تعيد كلامك؟", 
        image: responseImage 
    };

  } catch (error) {
    console.error("AI Generation failed", error);
    return { text: "يبدو إن فيه ضغط على السيرفرات يا غالي، جرب ترسل مرة ثانية وبتمشي الأمور بإذن الله! 🙏" };
  }
};
