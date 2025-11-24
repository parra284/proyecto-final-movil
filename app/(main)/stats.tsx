import { LinearGradient } from "expo-linear-gradient";
import { Activity, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// AJUSTA ESTAS RUTAS SEGÚN TU PROYECTO
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DataContext } from "@/contexts/DataContext";
import { CategoryTotal } from "@/types/data.types";

// 👉 NUEVO
import { PieCategories } from "@/components/PieCategories";

type Period = "current" | "previous";

const Stats = () => {
  const { getUserStats, getStatsCategories } = useContext(DataContext);

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("current");
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryType, setCategoryType] = useState<"income" | "expense">("income");
  const [categories, setCategories] = useState<{
    income: CategoryTotal[];
    expense: CategoryTotal[];
  }>({
    income: [],
    expense: [],
  });



  // estado para porcentajes
  const [delta, setDelta] = useState({
    income: 0,
    expense: 0,
  });

  // Convierte el periodo seleccionado al número de mes
  const getMonthNumber = (period: Period) => {
    const today = new Date();
    if (period === "current") return today.getMonth() + 1; // JS: 0-11
    if (period === "previous")
      return today.getMonth() === 0 ? 12 : today.getMonth();
    return today.getMonth() + 1;
  };

  useEffect(() => {
    const fetchStats = async () => {
      const month = getMonthNumber(selectedPeriod);

      // 1. Stats del mes seleccionado
      const current = await getUserStats({ month });

      // 2. Mes anterior real (independiente de selectedPeriod)
      const today = new Date();
      const prevMonth =
        today.getMonth() + 1 === 1 ? 12 : today.getMonth(); // mes anterior

      const previous = await getUserStats({ month: prevMonth });

      setStats(current);

      // Calcula % evitando división por cero
      const calcPercent = (curr: number, prev: number) => {
        if (prev === 0) return 0;
        return ((curr - prev) / prev) * 100;
      };

      setDelta({
        income: calcPercent(current.income, previous.income),
        expense: calcPercent(current.expense, previous.expense),
      });

      const statsCat = await getStatsCategories({ month });
      setCategories({
        income: statsCat.categories.income,
        expense: statsCat.categories.expense,
      });

      console.log("Categorías:", JSON.stringify(statsCat.categories.income, null, 2));
    };

    fetchStats();
  }, [selectedPeriod]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selector de periodo */}
        <View style={styles.periodRow}>
          <View style={styles.periodButton}>
            <Button
              size="sm"
              fullWidth
              variant={selectedPeriod === "current" ? "primary" : "outline"}
              onClick={() => setSelectedPeriod("current")}
            >
              Mes actual
            </Button>
          </View>
          <View style={styles.periodButton}>
            <Button
              size="sm"
              fullWidth
              variant={selectedPeriod === "previous" ? "primary" : "outline"}
              onClick={() => setSelectedPeriod("previous")}
            >
              Mes anterior
            </Button>
          </View>
        </View>

        {/* Tarjetas de resumen */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Card delay={100}>
              <View style={styles.summaryCardContent}>
                <View style={styles.summaryIconRow}>
                  <View style={[styles.iconCircle, styles.iconCircleIncome]}>
                    <TrendingUp size={18} color="#00C48C" />
                  </View>
                  <Text style={styles.summaryLabel}>Ingresos</Text>
                </View>

                <Text style={styles.summaryValueIncome}>
                  ${stats.income.toLocaleString()}
                </Text>

                <Text style={styles.summaryDelta}>
                  {delta.income >= 0
                    ? `+${delta.income.toFixed(0)}% vs mes anterior`
                    : `${delta.income.toFixed(0)}% vs mes anterior`}
                </Text>
              </View>
            </Card>
          </View>

          <View style={styles.summaryCol}>
            <Card delay={150}>
              <View style={styles.summaryCardContent}>
                <View style={styles.summaryIconRow}>
                  <View style={[styles.iconCircle, styles.iconCircleExpense]}>
                    <TrendingDown size={18} color="#EF4444" />
                  </View>
                  <Text style={styles.summaryLabel}>Gastos</Text>
                </View>

                <Text style={styles.summaryValueExpense}>
                  ${stats.expense.toLocaleString()}
                </Text>

                <Text style={styles.summaryDelta}>
                  {delta.expense >= 0
                    ? `+${delta.expense.toFixed(0)}% vs mes anterior`
                    : `${delta.expense.toFixed(0)}% vs mes anterior`}
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Balance mensual */}
        <Card delay={200} style={styles.balanceCardWrapper}>
          <LinearGradient
            colors={["#00C48C", "#00A077"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceContent}>
              <View>
                <View style={styles.balanceLabelRow}>
                  <Activity size={20} color="#ECFEFF" />
                  <Text style={styles.balanceLabel}>Balance mensual</Text>
                </View>
                <Text style={styles.balanceValue}>
                  ${stats.balance.toLocaleString()}
                </Text>
              </View>

              <View style={styles.balanceEmojiWrapper}>
                <View style={styles.balanceEmojiCircle}>
                  <Text style={styles.balanceEmoji}>💰</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* 👉 NUEVO: PIE CHART DE CATEGORÍAS */}
        <Card delay={250} style={styles.chartCard}>
          <Text style={styles.chartTitle}>Distribución por categorías</Text>

          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <PieCategories
              data={(categoryType === "income" ? categories.income : categories.expense).map(
                (c) => ({
                  key: c.key,
                  total: c.total,
                })
              )}
            />
            <Button
              size="sm"
              variant="outline"
              fullWidth
              onClick={() =>
                setCategoryType((prev) => (prev === "income" ? "expense" : "income"))
              }
            >
              {categoryType === "income"
                ? "Ver gastos por categoría"
                : "Ver ingresos por categoría"}
            </Button>

          </View>
        </Card>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  scroll: {
    flex: 1,
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  // Period selector
  periodRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  periodButton: {
    flex: 1,
  },

  // Summary cards
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryCol: {
    flex: 1,
  },
  summaryCardContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleIncome: {
    backgroundColor: "#DCFCE7",
  },
  iconCircleExpense: {
    backgroundColor: "#FEE2E2",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  summaryValueIncome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#00C48C",
    marginBottom: 2,
  },
  summaryValueExpense: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  summaryDelta: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  // Balance card
  balanceCardWrapper: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    elevation: 0,
    marginBottom: 16,
  },
  balanceGradient: {
    borderRadius: 16,
    padding: 18,
  },
  balanceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(241,245,249,0.9)",
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  balanceSubtitle: {
    fontSize: 13,
    color: "rgba(226,232,240,0.9)",
  },
  balanceEmojiWrapper: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  balanceEmojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: "rgba(15,23,42,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceEmoji: {
    fontSize: 30,
  },

  // Chart card
  chartCard: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  donutWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  donutOuter: {
    width: 150,
    height: 150,
    borderRadius: 9999,
    borderWidth: 14,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  donutInner: {
    width: 90,
    height: 90,
    borderRadius: 9999,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  donutLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  donutValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  categoriesList: {
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    alignItems: "center",
  },
  categoryRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryColorDot: {
    width: 14,
    height: 14,
    borderRadius: 9999,
  },
  categoryName: {
    fontSize: 14,
    color: "#111827",
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  categoryPercent: {
    fontSize: 11,
    color: "#6B7280",
  },

  // Eco card
  ecoCardWrapper: {
    backgroundColor: "#ECFDF3",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginTop: 8,
  },
  ecoContent: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  ecoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
  },
  ecoTextWrapper: {
    flex: 1,
  },
  ecoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14532D",
    marginBottom: 4,
  },
  ecoSubtitle: {
    fontSize: 13,
    color: "#166534",
    marginBottom: 8,
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    borderRadius: 9999,
    backgroundColor: "#DCFCE7",
    overflow: "hidden",
  },
  progressBarFill: {
    width: "85%",
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 9999,
  },
});
