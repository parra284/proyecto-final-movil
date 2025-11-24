import { CategoryTotal } from "@/types/data.types";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface PieCategoriesProps {
  data: CategoryTotal[];
}

export const PieCategories = ({ data }: PieCategoriesProps) => {
  const pieData = data.length > 0
    ? data
    : [{ key: "No data", total: 1 }];

  const totalAmount = useMemo(
    () => pieData.reduce((acc, item) => acc + item.total, 0),
    [pieData]
  );

  const chartData = pieData.map((item, index) => {
    const percentage = ((item.total / totalAmount) * 100).toFixed(1);

    return {
      value: item.total,
      text: `${item.key} (${percentage}%)`,
      color: COLORS[index % COLORS.length],
      showText: true,
      textColor: "white",
    };
  });

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <PieChart
        data={chartData}
        donut
        radius={120}
        textSize={11}
        showValuesAsLabels     // 🔥 hace que los labels se posicionen bien
      />

      {/* Leyenda */}
      <View style={{ marginTop: 20 }}>
        {pieData.map((item, idx) => {
          const percentage = ((item.total / totalAmount) * 100).toFixed(1);

          return (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: COLORS[idx % COLORS.length],
                  marginRight: 8,
                }}
              />
              <Text style={{ color: "#2A9D8F" }}>
                {item.key}: ${item.total.toLocaleString("es-CO")} ({percentage}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C",
  "#FF9F1C", "#2A9D8F", "#E76F51", "#9D4EDD",
];
