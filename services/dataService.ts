import { Transaction } from "@/types/data.types";
import { supabase } from "@/utils/supabase";

export const fetchTransactions = async (
  userId: string,
  options?: {
    daily?: boolean;       // true → solo las de hoy
    page?: number;         // para traer totales por partes
    pageSize?: number;     // tamaño de cada parte (default 20)
    
    fromDate?: Date;       // fecha inicial del filtro
    toDate?: Date;         // fecha final del filtro
    category?: string;     // categoría a filtrar
  }
): Promise<Transaction[]> => {
  const page = options?.page ?? 0;
  const pageSize = options?.pageSize ?? 20;

  let query = supabase
    .from("transactions")
    .select(
      `
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
      `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // -----------------------
  // 1️⃣ FILTRO DIARIO
  // -----------------------
  if (options?.daily) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    query = query
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());
  }

  // -----------------------
  // 2️⃣ FILTRO POR RANGO DE FECHAS
  // -----------------------
  if (options?.fromDate) {
    const fromISO = new Date(options.fromDate);
    fromISO.setHours(0, 0, 0, 0);

    query = query.gte("created_at", fromISO.toISOString());
  }

  if (options?.toDate) {
    const toISO = new Date(options.toDate);
    toISO.setHours(23, 59, 59, 999);

    query = query.lte("created_at", toISO.toISOString());
  }

  // -----------------------
  // 3️⃣ FILTRO POR CATEGORÍA
  // -----------------------
  if (options?.category) {
    query = query.eq("category", options.category);
  }

  // -----------------------
  // 4️⃣ PAGINACIÓN SOLO SI NO ES DIARIO
  // -----------------------
  if (!options?.daily) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);
  }

  const { data, error } = await query;

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
      created_at: new Date(tran.created_at),

      type: {
        id: tran.type.id,
        name: tran.type.name,
      },

      expensetype: tran.expensetype
        ? {
            id: tran.expensetype.id,
            name: tran.expensetype.name,
          }
        : undefined,
    })) ?? []
  );
};


export const fetchUserStats = async (userId: string, month?: number) => {
  const { data, error } = month
    ? await supabase.rpc("calculate_user_stats_month", { uid: userId, month })
    : await supabase.rpc("calculate_user_stats", { uid: userId });

  if (error) throw error;

  const stats = data[0];
  return {
    income: Number(stats.income),
    expense: Number(stats.expense),
    balance: Number(stats.balance),
  };
};

export const fetchUserStatsByCategory = async (userId: string, month: number) => {
  const { data, error } = await supabase.rpc(
    "calculate_user_stats_month_by_category",
    { uid: userId, month }
  );

  if (error) throw error;
 
  // Totales globales vienen con category = "TOTAL"
  const totals = data.find((row: any) => row.category === "TOTAL");

  const categories = data.filter((row: any) => row.category !== "TOTAL");

  return {
    totals: {
      income: Number(totals.income),
      expense: Number(totals.expense),
      balance: Number(totals.balance),
    },
    categories: categories.map((c: any) => ({
      category: c.category,
      type: c.type,
      total: Number(c.total),
    })),
  };
};



export const uploadTransaction = async (
  userId: string,
  type: string,          // "income", "expense", etc   (string)
  description: string,
  value: number,
  category?: string,
  expenseType?: string,  // "food", "transport", etc   (string opcional)
) => {

  // 1. Buscar ID del transactiontype
  const { data: tData, error: tError } = await supabase
    .from("transactiontypes")
    .select("id")
    .eq("name", type)
    .single();

  if (tError || !tData) {
    console.error("Transaction type not found:", tError);
    throw new Error("Invalid transaction type: " + type);
  }

  // 2. Si es gasto, buscar ID del expensetype
  let expenseTypeId = null;

  if (expenseType) {
    const { data: eData, error: eError } = await supabase
      .from("expensetypes")
      .select("id")
      .eq("name", expenseType)
      .single();

    if (eError || !eData) {
      console.error("Expense type not found:", eError);
      throw new Error("Invalid expense type: " + expenseType);
    }

    expenseTypeId = eData.id;
  }

  // 3. Insertar la transacción
  const { error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type_id: tData.id,
      expensetype_id: expenseTypeId,
      description,
      category: category || null,
      value,
    });

  if (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
