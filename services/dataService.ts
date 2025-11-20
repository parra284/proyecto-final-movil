import { Expense } from "@/types/data.types";
import { supabase } from "@/utils/supabase";

export const fetchExpenses = async (userId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      user_id,
      description,
      category,
      value,
      created_at,
      expensetype:expensetype!inner (
        id,
        type
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }

  // 🔥 Mapeo correcto al tipo Expense
  return (
    data?.map((exp: any): Expense => ({
      id: exp.id,
      user_id: exp.user_id,
      description: exp.description,
      category: exp.category,
      value: exp.value,
      created_at: exp.created_at,
      expensetype: {
        id: exp.expensetype.id,
        type: exp.expensetype.type
      }
    })) ?? []
  );
};
