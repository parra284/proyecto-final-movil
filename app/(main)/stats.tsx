// app/(main)/stats.tsx
import { LinearGradient } from "expo-linear-gradient";
import {
  Activity,
  Leaf,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// AJUSTA ESTAS RUTAS SEGÚN TU PROYECTO
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

type Period = "current" | "previous";

const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("current");

  // Puedes cambiar estos datos luego para cada periodo
  const data = useMemo(
    () => [
      { name: "Alimentos", value: 850, color: "#00C48C" },
      { name: "Transporte", value: 320, color: "#1F2937" },
      { name: "Entretenimiento", value: 430, color: "#FBBF24" },
      { name: "Servicios", value: 290, color: "#6B7280" },
    ],
    []
  );

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

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

        {/* Tarjetas resumen ingresos/gastos */}
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

                <Text style={styles.summaryValueIncome}>$2,450</Text>
                <Text style={styles.summaryDelta}>+12% vs mes anterior</Text>
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

                <Text style={styles.summaryValueExpense}>$1,890</Text>
                <Text style={styles.summaryDelta}>-5% vs mes anterior</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Balance mensual */}
        <Card
          delay={200}
          style={styles.balanceCardWrapper}
        >
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
                <Text style={styles.balanceValue}>$560</Text>
                <Text style={styles.balanceSubtitle}>Ahorrado este mes</Text>
              </View>

              <View style={styles.balanceEmojiWrapper}>
                <View style={styles.balanceEmojiCircle}>
                  <Text style={styles.balanceEmoji}>💰</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Distribución de gastos */}
        <Card delay={250}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Distribución de gastos</Text>

            {/* Donut simple (placeholder visual) */}
            <View style={styles.donutWrapper}>
              <View style={styles.donutOuter}>
                <View style={styles.donutInner}>
                  <Text style={styles.donutLabel}>Total</Text>
                  <Text style={styles.donutValue}>${total}</Text>
                </View>
              </View>
            </View>

            {/* Lista de categorías */}
            <View style={styles.categoriesList}>
              {data.map((item, index) => {
                const percent = ((item.value / total) * 100).toFixed(0);

                return (
                  <View
                    key={item.name}
                    style={[
                      styles.categoryRow,
                      index < data.length - 1 && styles.categoryRowBorder,
                    ]}
                  >
                    <View style={styles.categoryLeft}>
                      <View
                        style={[
                          styles.categoryColorDot,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <Text style={styles.categoryName}>{item.name}</Text>
                    </View>

                    <View style={styles.categoryRight}>
                      <Text style={styles.categoryValue}>
                        ${item.value.toFixed(2)}
                      </Text>
                      <Text style={styles.categoryPercent}>{percent}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>

        {/* Impacto ecológico */}
        <Card
          delay={300}
          style={styles.ecoCardWrapper}
        >
          <View style={styles.ecoContent}>
            <View style={styles.ecoIconCircle}>
              <Leaf size={24} color="#15803D" />
            </View>

            <View style={styles.ecoTextWrapper}>
              <Text style={styles.ecoTitle}>Impacto ecológico</Text>
              <Text style={styles.ecoSubtitle}>
                85% de tus facturas fueron electrónicas este mes. ¡Excelente
                trabajo!
              </Text>

              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
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
