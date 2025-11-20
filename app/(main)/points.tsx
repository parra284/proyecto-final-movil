// app/(main)/points.tsx
import {
  Gift,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// AJUSTA ESTAS RUTAS SEGÚN TU PROYECTO
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

const Points = () => {
  const rewards = useMemo(
    () => [
      { id: 1, name: "5% Descuento Uber", points: 500, icon: "🚗", available: true },
      { id: 2, name: "$10 Amazon Gift Card", points: 1000, icon: "🎁", available: true },
      { id: 3, name: "Café gratis Starbucks", points: 300, icon: "☕", available: true },
      { id: 4, name: "$25 Cashback", points: 2000, icon: "💵", available: false },
    ],
    []
  );

  const history = useMemo(
    () => [
      {
        id: 1,
        action: "Factura electrónica registrada",
        points: 10,
        date: "Hoy",
        type: "earn" as const,
      },
      {
        id: 2,
        action: "Meta de ahorro alcanzada",
        points: 50,
        date: "Ayer",
        type: "earn" as const,
      },
      {
        id: 3,
        action: "Café gratis canjeado",
        points: -300,
        date: "10 Nov",
        type: "redeem" as const,
      },
      {
        id: 4,
        action: "Conexión de 7 días",
        points: 25,
        date: "08 Nov",
        type: "earn" as const,
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
      

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta principal de puntos */}
          <View style={{ marginBottom: 18 }}>
            <Card
              delay={100}
              style={styles.pointsCard}
            >
              <View style={styles.pointsInner}>
                <View style={styles.pointsLeft}>
                  <Text style={styles.pointsLabel}>Puntos disponibles</Text>
                  <Text style={styles.pointsValue}>1,280</Text>
                  <Text style={styles.pointsThisWeek}>+85 esta semana</Text>
                </View>

                <View style={styles.pointsRight}>
                  <View style={styles.pointsStarCircle}>
                    <Star size={36} color="#F9FAFB" fill="#F9FAFB" />
                  </View>
                </View>
              </View>

              {/* Barra de progreso de nivel */}
              <View style={styles.levelBlock}>
                <View style={styles.levelRow}>
                  <Text style={styles.levelText}>Nivel: Plata</Text>
                  <Text style={styles.levelText}>280 pts para Oro</Text>
                </View>

                <View style={styles.levelBarBg}>
                  <View style={styles.levelBarFill} />
                </View>

                <View style={styles.levelLabelsRow}>
                  <Text style={styles.levelStepText}>Bronce</Text>
                  <Text style={styles.levelStepText}>Plata</Text>
                  <Text style={styles.levelStepText}>Oro</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Recompensas disponibles */}
          <View style={{ marginBottom: 22 }}>
            <Text style={styles.sectionTitle}>Recompensas disponibles</Text>

            <View style={styles.rewardsGrid}>
              {rewards.map((reward, index) => (
                <View key={reward.id} style={styles.rewardCol}>
                  <Card delay={180 + index * 80} hover={reward.available}>
                    <View
                      style={[
                        styles.rewardCardInner,
                        !reward.available && { opacity: 0.55 },
                      ]}
                    >
                      <Text style={styles.rewardEmoji}>{reward.icon}</Text>

                      <Text
                        style={styles.rewardName}
                        numberOfLines={2}
                      >
                        {reward.name}
                      </Text>

                      <View style={styles.rewardPointsRow}>
                        <Star
                          size={14}
                          color="#FBBF24"
                          fill="#FBBF24"
                        />
                        <Text style={styles.rewardPointsText}>
                          {reward.points} pts
                        </Text>
                      </View>

                      <Button
                        size="sm"
                        fullWidth
                        variant="primary"
                        disabled={!reward.available}
                        onClick={() => {
                          if (!reward.available) return;
                          // lógica de canje aquí
                        }}
                      >
                        {reward.available ? "Canjear" : "Bloqueado"}
                      </Button>
                    </View>
                  </Card>
                </View>
              ))}
            </View>
          </View>

          {/* Historial de puntos */}
          <View style={{ marginBottom: 22 }}>
            <Text style={styles.sectionTitle}>Historial de puntos</Text>

            <View style={{ gap: 8 }}>
              {history.map((item, index) => (
                <Card
                  key={item.id}
                  delay={320 + index * 80}
                  hover
                >
                  <View style={styles.historyInner}>
                    <View
                      style={[
                        styles.historyIconCircle,
                        item.type === "earn"
                          ? styles.historyIconEarn
                          : styles.historyIconRedeem,
                      ]}
                    >
                      {item.type === "earn" ? (
                        <TrendingUp size={22} color="#00C48C" />
                      ) : (
                        <Gift size={22} color="#FBBF24" />
                      )}
                    </View>

                    <View style={styles.historyTextBlock}>
                      <Text
                        style={styles.historyAction}
                        numberOfLines={1}
                      >
                        {item.action}
                      </Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>

                    <Text
                      style={[
                        styles.historyPoints,
                        item.type === "earn"
                          ? styles.historyPointsEarn
                          : styles.historyPointsRedeem,
                      ]}
                    >
                      {item.points > 0 ? "+" : ""}
                      {item.points}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* Cómo ganar más puntos */}
          <Card
            delay={650}
            style={styles.earnMoreCard}
          >
            <View style={styles.earnMoreInner}>
              <View style={styles.earnMoreIconCircle}>
                <Zap size={22} color="#7C3AED" />
              </View>

              <View style={styles.earnMoreTextBlock}>
                <Text style={styles.earnMoreTitle}>
                  ¿Cómo ganar más puntos?
                </Text>
                <Text style={styles.earnMoreBullet}>
                  • Registra facturas electrónicas (+10 pts)
                </Text>
                <Text style={styles.earnMoreBullet}>
                  • Alcanza tus metas de ahorro (+50 pts)
                </Text>
                <Text style={styles.earnMoreBullet}>
                  • Usa la app 7 días seguidos (+25 pts)
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ height: 28 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Points;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  /** Header naranja */
  header: {
    backgroundColor: "#FBBF24",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#FEFCE8",
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /** Tarjeta de puntos */
  pointsCard: {
    borderRadius: 22,
    backgroundColor: "#FBBF24",
  },
  pointsInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  pointsLeft: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 6,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FEFCE8",
    marginBottom: 4,
  },
  pointsThisWeek: {
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
  },
  pointsRight: {
    alignItems: "flex-end",
  },
  pointsStarCircle: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  levelBlock: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 10,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.95)",
  },
  levelBarBg: {
    width: "100%",
    height: 10,
    borderRadius: 9999,
    backgroundColor: "rgba(253,224,171,0.7)",
    overflow: "hidden",
    marginBottom: 6,
  },
  levelBarFill: {
    width: "64%", // porcentaje de progreso hacia oro
    height: "100%",
    backgroundColor: "#FEFCE8",
  },
  levelLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelStepText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
  },

  /** Secciones generales */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  /** Recompensas */
  rewardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  rewardCol: {
    width: "48%",
  },
  rewardCardInner: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  rewardEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    minHeight: 34,
    marginBottom: 6,
  },
  rewardPointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  rewardPointsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  /** Historial */
  historyInner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  historyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  historyIconEarn: {
    backgroundColor: "#DCFCE7",
  },
  historyIconRedeem: {
    backgroundColor: "#FEF3C7",
  },
  historyTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  historyDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyPointsEarn: {
    color: "#00C48C",
  },
  historyPointsRedeem: {
    color: "#FBBF24",
  },

  /** Card "Cómo ganar más puntos" */
  earnMoreCard: {
    borderRadius: 18,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  earnMoreInner: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  earnMoreIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 9999,
    backgroundColor: "#DDD6FE",
    alignItems: "center",
    justifyContent: "center",
  },
  earnMoreTextBlock: {
    flex: 1,
  },
  earnMoreTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  earnMoreBullet: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 2,
  },
});
