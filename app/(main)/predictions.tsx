// app/(main)/predictions.tsx
import {
  AlertCircle,
  Bell,
  Car,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// AJUSTA ESTAS RUTAS A TU PROYECTO
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

const Predictions = () => {
  const predictions = useMemo(
    () => [
      {
        id: 1,
        title: "Transporte aumentará",
        description:
          "Tu gasto en transporte aumentará 12% este mes basado en tu patrón de uso.",
        icon: Car,
        color: "#1F2937",
        trend: "+12%",
        type: "warning" as const,
      },
      {
        id: 2,
        title: "Ahorro recomendado",
        description:
          "Podrías ahorrar $150 reduciendo compras impulsivas los fines de semana.",
        icon: TrendingUp,
        color: "#00C48C",
        trend: "$150",
        type: "success" as const,
      },
      {
        id: 3,
        title: "Compras online",
        description:
          "Tus compras en línea han aumentado. Considera establecer un límite mensual.",
        icon: ShoppingBag,
        color: "#FBBF24",
        trend: "+8%",
        type: "info" as const,
      },
    ],
    []
  );

  const reminders = useMemo(
    () => [
      { id: 1, title: "Pago de Netflix", date: "Mañana, 15 Nov", amount: 16.99 },
      { id: 2, title: "Arriendo apartamento", date: "01 Dic", amount: 800.0 },
      { id: 3, title: "Seguro de salud", date: "05 Dic", amount: 120.0 },
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
          {/* Predicciones financieras */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Predicciones financieras</Text>

            <View style={styles.cardsStack}>
              {predictions.map((prediction, index) => {
                const Icon = prediction.icon;
                return (
                  <Card key={prediction.id} delay={index * 120} hover>
                    <View style={styles.predictionCardInner}>
                      <View
                        style={[
                          styles.predictionIconBox,
                          {
                            backgroundColor: prediction.color + "20",
                          },
                        ]}
                      >
                        <Icon size={26} color={prediction.color} />
                      </View>

                      <View style={styles.predictionTextBlock}>
                        <View style={styles.predictionHeaderRow}>
                          <Text style={styles.predictionTitle}>
                            {prediction.title}
                          </Text>
                          <View
                            style={[
                              styles.predictionPill,
                              {
                                backgroundColor: prediction.color + "20",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.predictionPillText,
                                { color: prediction.color },
                              ]}
                            >
                              {prediction.trend}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.predictionDescription}>
                          {prediction.description}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

          {/* Recordatorios activos */}
          <View style={styles.section}>
            <View style={styles.reminderHeaderRow}>
              <Text style={styles.sectionTitle}>Recordatorios activos</Text>

              {/* Botón redondo para agregar recordatorio */}
              <Pressable
                onPress={() => {
                  // aquí luego conectas tu lógica para crear recordatorios
                }}
                style={styles.addReminderButton}
              >
                <Plus size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.cardsStack}>
              {reminders.map((reminder, index) => (
                <Card
                  key={reminder.id}
                  delay={300 + index * 90}
                  hover
                >
                  <View style={styles.reminderInner}>
                    <View style={styles.reminderIconCircle}>
                      <Bell size={22} color="#FBBF24" />
                    </View>

                    <View style={styles.reminderTextBlock}>
                      <Text style={styles.reminderTitle} numberOfLines={1}>
                        {reminder.title}
                      </Text>
                      <Text style={styles.reminderDate}>{reminder.date}</Text>
                    </View>

                    <Text style={styles.reminderAmount}>
                      ${reminder.amount.toFixed(2)}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* Consejo del mes */}
          <Card
            delay={650}
            style={styles.aiCard}
          >
            <View style={styles.aiCardInner}>
              <View style={styles.aiIconCircle}>
                <AlertCircle size={22} color="#2563EB" />
              </View>

              <View style={styles.aiTextBlock}>
                <Text style={styles.aiTitle}>💡 Consejo del mes</Text>
                <Text style={styles.aiDescription}>
                  Basado en tus hábitos, si reduces tus salidas a comer fuera en
                  un 20%, podrías ahorrar aproximadamente $180 este mes.
                </Text>

                <View style={styles.aiButtonWrapper}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      // podría abrir detalle o recomendaciones
                    }}
                  >
                    Ver recomendaciones
                  </Button>
                </View>
              </View>
            </View>
          </Card>

          <View style={{ height: 28 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Predictions;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  /** HEADER */
  header: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 18,
  },
  appName: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#064E3B",
    marginBottom: 10,
  },
  headerTextBlock: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#022C22",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#166534",
  },

  /** SCROLL */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },

  cardsStack: {
    gap: 10,
  },

  /** PREDICTIONS */
  predictionCardInner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  predictionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  predictionTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  predictionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flexShrink: 1,
  },
  predictionPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  predictionPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  predictionDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },

  /** REMINDERS */
  reminderHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addReminderButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "#00C48C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  reminderInner: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reminderIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reminderTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  reminderDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  reminderAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flexShrink: 0,
  },

  /** AI CARD */
  aiCard: {
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  aiCardInner: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  aiIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 9999,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  aiTextBlock: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  aiDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 10,
  },
  aiButtonWrapper: {
    alignSelf: "flex-start",
  },
});
