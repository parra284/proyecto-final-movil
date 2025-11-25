// app/(main)/predictions.tsx
import { Card } from "@/components/Card";
import { ExtraContext } from "@/contexts/ExtraContext";
import { TransactionPrediction } from "@/types/ai.types";
import { AlertCircle } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const Predictions = () => {
  const { getPredictions } = useContext(ExtraContext);

  const [predictions, setPredictions] = useState<TransactionPrediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        // 2️⃣ Pedimos predicciones a Gemini
        const aiPredictions = await getPredictions();

        setPredictions(aiPredictions);
      } catch (error) {
        console.error("Error loading predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Cargando predicciones...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Predicciones financieras</Text>

          <View style={styles.cardsStack}>
            {predictions.map((prediction, index) => (
              <Card key={index} delay={index * 120} hover>
                <View style={styles.predictionCardInner}>
                  <View style={styles.predictionIconBox}>
                    <AlertCircle size={28} color="#2563EB" />
                  </View>
                  <View style={styles.predictionTextBlock}>
                    <Text style={styles.predictionTitle}>{prediction.prediction}</Text>
                    {/* Si quieres agregar descripción futura */}
                    {/* <Text style={styles.predictionDescription}>{prediction.description}</Text> */}
                  </View>
                </View>
              </Card>

            ))}
          </View>
        </View>

        {/* Aquí podrías mantener recordatorios y AI card */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Predictions;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 16 },
  cardsStack: { gap: 12 },

  predictionCardInner: {
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4, // para Android
  },

  predictionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB20", // azul claro semi-transparente
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  predictionTextBlock: { flex: 1, minWidth: 0 },

  predictionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },

  predictionDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginTop: 4,
  },
});

