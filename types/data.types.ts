// Gastos

export interface UserStats {
  income: number;
  expense: number;
  balance: number;
}

export interface UserStatsCategories {
  income: number;
  expense: number;
  categories: {
    income: CategoryTotal[];
    expense: CategoryTotal[];
  };
}

export interface CategoryTotal {
  key: string;   // nombre de la categoría (ej: "Alimentos")
  total: number; // total gasto/ingreso de esa categoría
}

export interface TransactionType {
    id: string,
    name: string
}

export interface ExpenseType {
    id: string,
    name: string
}

export interface Transaction {
    id: string,
    user_id: string,
    type: TransactionType,
    expensetype?: ExpenseType,
    description: string,
    category?: string,
    value: number,
    created_at: Date,
}