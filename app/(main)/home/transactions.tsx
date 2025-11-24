import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ShoppingBag } from "lucide-react-native";

import { Card } from "@/components/Card";
import { DataContext } from "@/contexts/DataContext";
import { CATEGORIES } from "@/types/categories";
import { Transaction } from "@/types/data.types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function TransactionsScreen() {
  const { getTransactions } = useContext(DataContext);

  const PAGE_SIZE = 20;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  // Filters
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  /* -------------------------------------------- */
  /* LOAD WITH FILTERS                            */
  /* -------------------------------------------- */

    useEffect(() => {
    // Resetear lista y estado de paginación
    setTransactions([]);
    setPage(0);
    setEndReached(false);

    // Cargar primera página con filtros actualizados
    fetchTransactions(0, true);
    }, [fromDate, toDate, category]);

    const fetchTransactions = async (pageToLoad: number, replace = false) => {
    setLoading(true);
    try {
        const data = await getTransactions({
        page: pageToLoad,
        pageSize: PAGE_SIZE,
        fromDate,
        toDate,
        category,
        });

        if (data.length === 0) {
        setEndReached(true);
        }

        setTransactions((prev) =>
        replace ? data : [...prev, ...data]
        );

        setPage(pageToLoad); // actualizar page actual
    } catch (error) {
        console.error("Error loading transactions:", error);
    } finally {
        setLoading(false);
    }
    };

    const loadMore = () => {
    if (loading || endReached) return;

    fetchTransactions(page + 1);
    };


  /* -------------------------------------------- */
  /* RENDER                                       */
  /* -------------------------------------------- */

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Todas tus transacciones</Text>

        {/* -------------------------------------------- */}
        {/* FILTROS */}
        {/* -------------------------------------------- */}

        <View style={styles.filtersContainer}>
            {/* --- FILA 1: Desde / Hasta --- */}
            <View style={styles.filtersRow}>
                <Pressable style={styles.filterSmall} onPress={() => setShowFromPicker(true)}>
                <Text style={styles.filterLabel}>Desde</Text>
                <Text style={styles.filterValue}>
                    {fromDate ? fromDate.toLocaleDateString("es-CO") : "Seleccionar"}
                </Text>
                </Pressable>

                <Pressable style={styles.filterSmall} onPress={() => setShowToPicker(true)}>
                <Text style={styles.filterLabel}>Hasta</Text>
                <Text style={styles.filterValue}>
                    {toDate ? toDate.toLocaleDateString("es-CO") : "Seleccionar"}
                </Text>
                </Pressable>
            </View>

            {/* Pickers */}
            {showFromPicker && (
                <DateTimePicker
                value={fromDate ?? new Date()}
                mode="date"
                display="calendar"
                onChange={(e, date) => {
                    setShowFromPicker(false);
                    if (date) setFromDate(date);
                }}
                />
            )}

            {showToPicker && (
                <DateTimePicker
                value={toDate ?? new Date()}
                mode="date"
                display="calendar"
                onChange={(e, date) => {
                    setShowToPicker(false);
                    if (date) setToDate(date);
                }}
                />
            )}

            {/* --- FILA 2: Categoría --- */}
            <View style={styles.filterSmall}>
                <Text style={styles.filterLabel}>Categoría</Text>

                <Picker
                selectedValue={category ?? "all"}
                onValueChange={(v) => setCategory(v === "all" ? undefined : v)}
                style={styles.picker}
                >
                <Picker.Item label="Todas" value="all" />

                {CATEGORIES.expense.map((c) => (
                    <Picker.Item key={c.key} label={c.key} value={c.key} />
                ))}

                {CATEGORIES.income.map((c) => (
                    <Picker.Item key={c.key} label={`${c.key} (Ingreso)`} value={c.key} />
                ))}
                </Picker>

            </View>
            </View>


        {/* -------------------------------------------- */}
        {/* LISTA DE TRANSACCIONES */}
        {/* -------------------------------------------- */}

        <View style={styles.list}>
          {transactions.map((transaction, index) => {
            const isIncome = transaction.type.name === "income";
            const color = isIncome ? "#00C48C" : "#EF4444";

            const CategoryIcon =
              CATEGORIES[isIncome ? "income" : "expense"].find(
                (c) => c.key === transaction.category
              )?.icon || ShoppingBag;

            return (
              <Card key={transaction.id} delay={0.1 + index * 0.05} hover>
                <View style={styles.item}>
                  <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
                    <CategoryIcon size={24} color={color} />
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.name}>{transaction.description}</Text>
                    <Text style={styles.category}>
                      {transaction.category ?? "Sin categoría"}
                    </Text>
                    <Text style={styles.date}>
                      {new Date(transaction.created_at).toLocaleDateString("es-CO")}
                    </Text>
                  </View>

                  <Text style={[styles.amount, { color }]}>
                    {isIncome ? "+" : "-"}$
                    {transaction.value.toLocaleString("es-CO")}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>

        {/* -------------------------------------------- */}
        {/* LOAD MORE */}
        {/* -------------------------------------------- */}

        {!endReached && (
          <Pressable style={styles.loadMore} onPress={loadMore}>
            {loading ? (
              <ActivityIndicator color="#00C48C" />
            ) : (
              <Text style={styles.loadMoreText}>Cargar más</Text>
            )}
          </Pressable>
        )}

        {endReached && (
          <Text style={styles.endText}>No hay más transacciones</Text>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

/* ---------------------------- */
/*   STYLES (igual que antes)   */
/* ---------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  scroll: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  list: {
    gap: 12,
  },

  item: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },

  info: { flex: 1 },

  name: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },

  category: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 2,
  },

  date: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },

  amount: {
    fontWeight: "700",
    fontSize: 15,
  },

  loadMore: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#00C48C20",
    borderRadius: 12,
    alignItems: "center",
  },

  loadMoreText: {
    color: "#00C48C",
    fontWeight: "600",
    fontSize: 16,
  },

  endText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
  },

filtersContainer: {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 20,
  gap: 12,
},

filtersRow: {
  flexDirection: "row",
  gap: 10,
},

filterSmall: {
  flex: 1,
  backgroundColor: "#F3F4F6",
  padding: 8,
  borderRadius: 8,
},

filterLabel: {
  color: "#6B7280",
  fontSize: 11,
  marginBottom: 2,
},

filterValue: {
  fontSize: 13,
  fontWeight: "600",
  color: "#111827",
},

picker: {
  height: 38,
  fontSize: 13,
  color: "#111827",
},

});
