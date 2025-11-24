import { getTransactionPredictions } from "@/services/aiService";
import { TransactionPrediction } from "@/types/ai.types";
import { createContext, useContext } from "react";
import { DataContext } from "./DataContext";

interface ExtraContextProps {
    getPredictions: () => Promise<TransactionPrediction[]>
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

    return (
            <ExtraContext.Provider value={{ getPredictions }}>
                {children}
            </ExtraContext.Provider>
        )
}