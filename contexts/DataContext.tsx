import { fetchTransactions, fetchUserStats } from "@/services/dataService";
import { Transaction, UserStats } from "@/types/data.types";
import { createContext } from "react";

interface DataContextProps {
    getTransactions: (userId: string) => Promise<Transaction[]>;
    getUserStats: (userId: string) => Promise<UserStats>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
    
    const getTransactions = async(userId: string) => {
        try {
            const data = await fetchTransactions(userId);
            return data; 
        } catch (err) {
            console.error("Error in getTransactions context:", err);
            return [];
        }
    }   

    const getUserStats = async (userId: string) => {
        try {
            const stats = await fetchUserStats(userId);
            return stats;
        } catch (err) {
            console.error("Error in getUserStats context:", err);
            return { income: 0, expense: 0, balance: 0 }; 
        }
    };

    return (
        <DataContext.Provider value={{ getTransactions, getUserStats, }}>
            {children}
        </DataContext.Provider>
    )
}