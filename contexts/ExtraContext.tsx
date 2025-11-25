import { getTransactionPredictions, parseTextToTransactionData } from "@/services/aiService";
import { ParsedTransaction, TransactionPrediction } from "@/types/ai.types";
import { createContext, useContext } from "react";
import { DataContext } from "./DataContext";

interface ExtraContextProps {
    getPredictions: () => Promise<TransactionPrediction[]>;
    getTransactionData: (text: string) => Promise<ParsedTransaction>;
}

export const ExtraContext = createContext({} as ExtraContextProps);

export const ExtraProvider = ({children} : any) => {
    const {getTransactions} = useContext(DataContext);

    const getPredictions = async() => {
        try {
            const transactions = await getTransactions({
                fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                toDate: new Date(),
            });
            const data = await getTransactionPredictions(transactions);
            return data;
        } catch (err) {
            console.error("Error in getPredictions context:", err);
            return [];
        }
    }

    const getTransactionData = async (text: string): Promise<ParsedTransaction> => {
    try {
        if (!text || text.trim().length === 0) {
            return { description: "", value: 0, category: "" };
        }

        const data = await parseTextToTransactionData(text);
        console.log(data);

        const hasAnyField =
        (data.description && data.description.trim() !== "") ||
        (data.value && typeof data.value === "number" && data.value > 0) ||
        (data.category && data.category !== "");

        // 👉 Si NO encontró nada, devolvemos un objeto vacío "seguro"
        if (!hasAnyField) {
        return { description: "", value: 0, category: "" };
        }

        // 👉 Si sí encontró algo, devolvemos lo que tenga, normalizado
        return {
        description: data.description ?? "",
        value: data.value ?? 0,
        category: data.category ?? "",
        };
    } catch (error) {
        console.error("Error in getTransactionData context:", error);
        return { description: "", value: 0, category: "" };
    }
    };

    return (
            <ExtraContext.Provider value={{ getPredictions, getTransactionData }}>
                {children}
            </ExtraContext.Provider>
        )
}