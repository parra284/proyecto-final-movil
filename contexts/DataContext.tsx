import { fetchTransactions, fetchUserStats, fetchUserStatsByCategory, uploadTransaction } from "@/services/dataService";
import { Transaction, UserStats, UserStatsCategories } from "@/types/data.types";
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
    getUserStats: (options?: {
        month?: number
    }) => Promise<UserStats>;
    getStatsCategories: (options?: {
        month?: number
    }) => Promise<UserStatsCategories>;
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

    const getUserStats = async (options?: { month?: number }): Promise<UserStats> => {
        try {
            if (!user) return { income: 0, expense: 0, balance: 0 };

            // Pasamos el month a fetchUserStats
            const stats = await fetchUserStats(user.id, options?.month);

            return stats;
        } catch (err) {
            console.error("Error in getUserStats context:", err);
            return { income: 0, expense: 0, balance: 0 };
        }
    };

    const getStatsCategories = async (
    options?: { month?: number }
    ): Promise<UserStatsCategories> => {
    try {
        const { month } = options || {};

        if (!user) {
        return {
            income: 0,
            expense: 0,
            categories: {
            income: [],
            expense: []
            }
        };
        }

        const safeMonth = month ?? (new Date().getMonth() + 1);
        const stats = await fetchUserStatsByCategory(user.id, safeMonth);
        
        // Separar por income y expense
        const incomeCategories = stats.categories
        .filter((c: any) => c.type === "income")
        .map((c: any) => ({
            key: c.category,
            total: c.total
        }));

        const expenseCategories = stats.categories
        .filter((c: any) => c.type === "expense")
        .map((c: any) => ({
            key: c.category,
            total: c.total
        }));

        return {
        income: stats.totals.income,
        expense: stats.totals.expense,
        categories: {
            income: incomeCategories,
            expense: expenseCategories
        }
        };
    } catch (err) {
        console.error("Error getting user stats categories:", err);

        return {
        income: 0,
        expense: 0,
        categories: {
            income: [],
            expense: []
        }
        };
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
        <DataContext.Provider value={{ getTransactions, getUserStats, getStatsCategories, createTransaction }}>
            {children}
        </DataContext.Provider>
    )
}