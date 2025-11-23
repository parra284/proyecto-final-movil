import { fetchTransactions, fetchUserStats, uploadTransaction } from "@/services/dataService";
import { Transaction, UserStats } from "@/types/data.types";
import { createContext } from "react";

interface DataContextProps {
    getTransactions: (
        userId: string,
        options?: {
            daily?: boolean;     // solo hoy
            page?: number;       // página de paginación
            pageSize?: number;   // tamaño por página

            fromDate?: Date;     // filtro fecha inicio
            toDate?: Date;       // filtro fecha fin
            category?: string;   // filtro categoría
        }
    ) => Promise<Transaction[]>;
    getUserStats: (userId: string) => Promise<UserStats>;
    createTransaction: (userId: string, type: string, description: string, value: number, category?: string, expenseType?: string) => Promise<void>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
    
    const getTransactions = async (
        userId: string,
        options?: {
            daily?: boolean;     // solo hoy
            page?: number;       // página de paginación
            pageSize?: number;   // tamaño por página

            fromDate?: Date;     // filtro fecha inicio
            toDate?: Date;       // filtro fecha fin
            category?: string;   // filtro categoría
        }
        ) => {
        try {
            const data = await fetchTransactions(userId, options);
            return data;
        } catch (err) {
            console.error("Error in getTransactions context:", err);
            return [];
        }
    };

 

    const getUserStats = async (userId: string) => {
        try {
            const stats = await fetchUserStats(userId);
            return stats;
        } catch (err) {
            console.error("Error in getUserStats context:", err);
            return { income: 0, expense: 0, balance: 0 }; 
        }
    };

    const createTransaction = async (
        userId: string,
        type: string,          
        description: string,
        value: number,
        category?: string,
        expenseType?: string,   
    ) => {
        try {
            await uploadTransaction(
                userId,
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