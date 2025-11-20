import { fetchExpenses } from "@/services/dataService";
import { Expense } from "@/types/data.types";
import { createContext } from "react";

interface DataContextProps {
    getExpenses: (userId: string) => Promise<Expense[]>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
    
    const getExpenses = async(userId: string) => {
        try {
            const data = await fetchExpenses(userId);
            return data; 
        } catch (err) {
            console.error("Error in getExpenses context:", err);
            return [];
        }
    }   

    return (
        <DataContext.Provider value={{ getExpenses }}>
            {children}
        </DataContext.Provider>
    )
}