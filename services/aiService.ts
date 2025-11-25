import { GeminiResponse, ParsedTransaction, TransactionPrediction } from "@/types/ai.types";
import { CATEGORIES } from "@/types/categories";
import { Transaction } from "@/types/data.types";

export const getTransactionPredictions = async (
  transactions: Transaction[]
): Promise<TransactionPrediction[]> => {
  if (!transactions.length) return [];

  // Convertimos las transacciones en texto para dar contexto a la IA
  const transactionText = transactions
    .map(
      (t) =>
        `Description: ${t.description}, Category: ${t.category ?? "N/A"}, Value: ${t.value}, Date: ${t.created_at.toISOString()}`
    )
    .join("\n");

  // Prompt actualizado para generar insights generales
const prompt = `Analyze the following transactions and give 3 to 5 short insights about the user's spending habits, savings, or patterns. 
Return a JSON array with objects containing only a "prediction" field. Do not reference individual transactions.\n\n${transactionText}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            prediction: { type: "STRING" },
          },
        },
      },
    },
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data: GeminiResponse = await response.json();

    console.log(data);
    

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    const parsed: TransactionPrediction[] = JSON.parse(text);

    return parsed;
  } catch (error) {
    console.error("Error fetching Gemini predictions:", error);
    return [];
  }
};

export const parseTextToTransactionData = async (
  text: string
): Promise<ParsedTransaction> => {
  if (!text.trim()) return {};

  // Extraemos dinámicamente las categorías válidas desde tu objeto
  const allowedCategories = CATEGORIES.expense.map((c) => c.key);

  const prompt = `
Extract from the text the following fields if possible:

- description: short description of the item or service.
- value: numeric amount. Convert "25k" to 25000.
- category: one of the following Spanish categories: ${allowedCategories.join(", ")}.
  Use "Otros gastos" if unsure.

Return ONLY a single JSON object like:
{"description":"...", "value":12345, "category":"..."}

Text:
"""${text}"""
`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING" },
          value: { type: "NUMBER" },
          category: { type: "STRING" },
        },
      },
    },
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log(response);

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    const parsed = JSON.parse(rawText);

    // ✨ Validación final de categoría
    if (parsed.category && !allowedCategories.includes(parsed.category)) {
      parsed.category = "Otros gastos";
    }

    return parsed;
  } catch (err) {
    console.error("Error parsing text:", err);
    return {};
  }
};