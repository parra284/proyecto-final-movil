export interface ExpenseType {
    id: string,
    type: string
}

export interface Expense {
    id: string,
    user_id: string,
    expensetype: ExpenseType,
    description: string,
    category?: string,
    value: number,
    created_at?: Date,
}