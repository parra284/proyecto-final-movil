// aiTransactionService.ts
import { GeminiResponse, TransactionPrediction } from "@/types/ai.types";
import { Transaction } from "@/types/data.types";

export const getTransactionPredictions = async (
  transactions: Transaction[]
): Promise<TransactionPrediction[]> => {
  if (!transactions.length) return [];

  // 1️⃣ Construimos el prompt a partir de las transacciones
  const transactionText = transactions
    .map(
      (t) =>
        `ID: ${t.id}, Description: ${t.description}, Category: ${t.category ?? "N/A"}, Value: ${t.value}, Date: ${t.created_at.toISOString()}`
    )
    .join("\n");

  const prompt = `Analyze the following transactions and provide a prediction or insight for each. 
Return the result as a JSON array with objects containing "transactionId" and "prediction":\n\n${transactionText}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            transactionId: { type: "STRING" },
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
