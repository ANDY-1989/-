import { GoogleGenAI, Type } from "@google/genai";
import { ConsultationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// Schema for a single prescription (reused inside the array)
const prescriptionSchema = {
  type: Type.OBJECT,
  properties: {
    prescriptionName: { type: Type.STRING, description: "Name of the prescription" },
    ingredients: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Medicine name (e.g. 桂枝)" },
          dosage: { type: Type.STRING, description: "Dosage (e.g. 9g)" },
          origin: { type: Type.STRING, description: "Recommended Dao Di origin (e.g. 广东新会 for Chenpi)" },
          buyingTips: { type: Type.STRING, description: "Brief tips on how to identify high quality ingredients (e.g. 油性大、气味浓者佳)" }
        }
      },
      description: "List of ingredients with dosages, origins, and selection tips"
    },
    sourceChapter: { type: Type.STRING, description: "Book and Chapter (e.g., 《伤寒论》... or 《千金要略》...)" },
    originalText: { type: Type.STRING, description: "Original classical text" },
    translation: { type: Type.STRING, description: "Modern colloquial translation" },
    usageMethod: { type: Type.STRING, description: "Decoction and usage instructions" },
    precautions: { type: Type.STRING, description: "Contraindications and warnings" },
    pharmacology: { type: Type.STRING, description: "Modern pharmacology or TCM mechanism" },
    matchedSymptoms: { type: Type.STRING, description: "Why this specific prescription fits the symptoms" },
    relatedPrescriptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      },
      description: "1-2 similar prescriptions (optional)"
    }
  },
  required: ["prescriptionName", "ingredients", "sourceChapter", "originalText", "translation", "usageMethod", "precautions", "pharmacology", "matchedSymptoms"]
};

// Main schema for the full consultation
const consultationSchema = {
  type: Type.OBJECT,
  properties: {
    symptomAnalysis: { type: Type.STRING, description: "TCM analysis of the user's symptoms (pathology/mechanism)" },
    prescriptions: {
      type: Type.ARRAY,
      items: prescriptionSchema,
      description: "A list of 2-3 distinct prescriptions from different supported books that treat these symptoms"
    },
    comparison: { type: Type.STRING, description: "A detailed comparison of the provided prescriptions. Discuss differences in focus, strength, and suitable body types." },
    recommendation: { type: Type.STRING, description: "Final recommendation: which one is best for this specific user and why." }
  },
  required: ["symptomAnalysis", "prescriptions", "comparison", "recommendation"]
};

export const getPrescription = async (query: string): Promise<ConsultationResult> => {
  try {
    const prompt = `
      你是一位精通中国历代医学经典的中医专家。
      用户的输入是：${query}。
      
      请根据用户的描述，进行中医辨证分析，并从以下四部经典著作中寻找最对症的方剂：
      1. **《金匮要略》**
      2. **《伤寒杂病论》（伤寒论）**
      3. **《千金药方》（或千金翼方）**
      4. **《黄帝内经》**（虽然内经方剂较少，若有经典对应亦可引用，主要以药方为主的书籍优先）

      **任务要求：**
      1.  **辨证分析**：首先分析病机（如：表证、里证、寒热虚实）。
      2.  **多方推荐**：请找出 **2-3 个** 针对该症状的经典方剂。尽量涵盖不同书籍的思路（例如：一个来自《伤寒论》主治表证，一个来自《金匮》主治杂病，或《千金》的加减法）。如果只能找到一个完全对症的，也可以只返回一个，但尽量提供对比选项。
      3.  **药材详情**：对于方剂中的每一味药，请务必提供**道地产地**（如：怀山药、杭白菊）以及**选购注意事项**（如：色泽、气味、质地等鉴别要点）。
      4.  **异同对比**：对比这几个方剂的侧重点。例如：A方重在发汗，B方重在温补；A方适合体壮者，B方适合体虚者。
      5.  **最终推荐**：给出一个综合建议。

      **内容风格要求：**
      -   **translation（译文）**：必须使用**极度通俗、口语化**的大白话，像老中医给邻居讲故事一样解释。
      -   **sourceChapter**：格式为“《书籍名》·章节名”。

      请务必返回标准的 JSON 格式，严格按照 Schema 定义。
      确保内容专业、准确、古文引用无误。
      所有输出请使用简体中文。
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: consultationSchema,
        temperature: 0.4, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    const data = JSON.parse(jsonText) as ConsultationResult;
    return data;
  } catch (error) {
    console.error("Error fetching prescription:", error);
    throw error;
  }
};