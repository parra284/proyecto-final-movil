import { Transaction } from "@/types/data.types";
import { supabase } from "@/utils/supabase";

export const fetchTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      id,
      user_id,
      description,
      category,
      value,
      created_at,
      type:transactiontypes (
        id,
        name
      ),
      expensetype:expensetypes (
        id,
        name
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  return (
    data?.map((tran: any): Transaction => ({
      id: tran.id,
      user_id: tran.user_id,
      description: tran.description,
      category: tran.category,
      value: tran.value,
      created_at: tran.created_at,

      // TransactionType (obligatorio)
      type: {
        id: tran.type.id,
        name: tran.type.name,
      },

      // ExpenseType (opcional)
      expensetype: tran.expensetype
        ? {
            id: tran.expensetype.id,
            name: tran.expensetype.name,
          }
        : undefined,
    })) ?? []
  );
};

export const fetchUserStats = async (userId: string) => {
  const { data, error } = await supabase.rpc("calculate_user_stats", {
    uid: userId,
  });

  if (error) throw error;

  const stats = data[0]; 

  return {
    income: Number(stats.income),
    expense: Number(stats.expense),
    balance: Number(stats.balance),
  };
};
