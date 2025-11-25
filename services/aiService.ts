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
  const prompt = `Analyze the following transactions and provide 3 to 5 interesting insights or recommendations about the user's spending habits, saving opportunities, or patterns. 
Return the result as a JSON array of objects with a "prediction" field only. Do not tie predictions to individual transactions.\n\n${transactionText}`;

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
You will receive a raw text that may describe a purchase, payment, or expense.

Extract ONLY the following fields if they can be inferred:

- "description": a short description of the item or service.
- "value": the monetary amount as a number. Convert formats like "25k" to 25000.
- "category": MUST be exactly one of the following Spanish categories:

${allowedCategories.map((c) => `- ${c}`).join("\n")}

Do NOT create new categories.  
If you are unsure, use "Otros gastos".

Return ONLY a JSON object in this exact form:
{
  "description": "...",
  "value": 12345,
  "category": "..."
}

If a field cannot be determined, omit it.

Text to analyze:
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