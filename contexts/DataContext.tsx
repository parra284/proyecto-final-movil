import { fetchTransactions, fetchUserStats, uploadTransaction } from "@/services/dataService";
import { Transaction, UserStats } from "@/types/data.types";
import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
    getTransactions: (
        options?: {
            daily?: boolean;     // solo hoy
            page?: number;       // página de paginación
            pageSize?: number;   // tamaño por página

            fromDate?: Date;     // filtro fecha inicio
            toDate?: Date;       // filtro fecha fin
            category?: string;   // filtro categoría
        }
    ) => Promise<Transaction[]>;
    getUserStats: () => Promise<UserStats>;
    createTransaction: (type: string, description: string, value: number, category?: string, expenseType?: string) => Promise<void>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
    const { user } = useContext(AuthContext);
    
    const getTransactions = async (
        options?: {
            daily?: boolean;     // solo hoy
            page?: number;       // página de paginación
            pageSize?: number;   // tamaño por página

            fromDate?: Date;     // filtro fecha inicio
            toDate?: Date;       // filtro fecha fin
            category?: string;   // filtro categoría
        }
        ): Promise<Transaction[]> => {
        try {
            if(!user) return[];
            const data = await fetchTransactions(user?.id, options);
            return data;
        } catch (err) {
            console.error("Error in getTransactions context:", err);
            return [];
        }
    };

    const getUserStats = async (): Promise<UserStats> => {
        try {
            if(!user) return { income: 0, expense: 0, balance: 0 }; ;
            const stats = await fetchUserStats(user?.id);
            return stats;
        } catch (err) {
            console.error("Error in getUserStats context:", err);
            return { income: 0, expense: 0, balance: 0 }; 
        }
    };

    const createTransaction = async (
        type: string,          
        description: string,
        value: number,
        category?: string,
        expenseType?: string,   
    ) => {
        try {
            if(!user) return;
            await uploadTransaction(
                user?.id,
                type,
                description,
                value,
                category,
                expenseType
            )
        } catch (err) {
            console.error("Error in createTransaction context:", err); 
        }
    }

    return (
        <DataContext.Provider value={{ getTransactions, getUserStats, createTransaction }}>
            {children}
        </DataContext.Provider>
    )
}