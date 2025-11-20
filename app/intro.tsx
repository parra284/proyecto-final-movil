import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Intro() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    router.replace("/(auth)/login");
  };

  return (
    <LinearGradient
      colors={["#00B98A", "#00A077", "#006062"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Monedas decorativas con K - arriba izquierda */}
      <MotiView
        animate={{ translateY: [0, 8, 0] }}
        transition={{ type: "timing", duration: 3000, loop: true }}
        style={styles.coinGroupTopLeft}
      >
        <View style={styles.sideCoinBig}>
          <Text style={styles.sideCoinText}>K</Text>
        </View>
        <View style={styles.sideCoinSmall}>
          <Text style={styles.sideCoinText}>K</Text>
        </View>
      </MotiView>

      {/* Monedas decorativas con K - abajo izquierda */}
      <MotiView
        animate={{ translateY: [0, -10, 0] }}
        transition={{ type: "timing", duration: 3400, loop: true }}
        style={styles.coinGroupBottomLeft}
      >
        <View style={styles.sideCoinSmall}>
          <Text style={styles.sideCoinText}>K</Text>
        </View>
        <View style={styles.sideCoinBig}>
          <Text style={styles.sideCoinText}>K</Text>
        </View>
      </MotiView>

      {/* Monedas decorativas con K - abajo derecha */}
      <MotiView
        animate={{ translateY: [0, -6, 0] }}
        transition={{ type: "timing", duration: 3600, loop: true }}
        style={styles.coinGroupBottomRight}
      >
        <View style={styles.sideCoinTiny}>
          <Text style={styles.sideCoinText}>K</Text>
        </View>
        <View style={styles.sideCoinTiny}>
          <Text style={styles.sideCoinText}>K</Text>
        </View>
      </MotiView>

      {/* MONEDA PRINCIPAL 3D */}
      <MotiView
        from={{ translateY: -120, opacity: 0, rotate: "0deg" }}
        animate={{ translateY: 0, opacity: 1, rotate: "360deg" }}
        transition={{ type: "timing", duration: 900 }}
        style={styles.mainCoinWrapper}
      >
        {/* disco sombra turquesa debajo */}
        <View style={styles.shadowDisk} />

        {/* moneda amarilla */}
        <LinearGradient
          colors={["#FCD34D", "#F59E0B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCoinOuter}
        >
          <View style={styles.mainCoinInner}>
            <Text style={styles.mainCoinText}>K</Text>
          </View>
        </LinearGradient>
      </MotiView>

      {/* TEXTO LOGO */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", delay: 350, duration: 700 }}
        style={styles.centerText}
      >
        <Text style={styles.title}>KOINS</Text>
        <Text style={styles.subtitle}>Control financiero inteligente</Text>
      </MotiView>

      {/* BOTÓN EMPZAR */}
      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", delay: 650, duration: 600 }}
        style={styles.startButtonWrapper}
      >
        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Empezar</Text>
        </Pressable>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },

  /* MONEDAS DECORATIVAS */
  sideCoinBase: {
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(5, 150, 105, 0.7)",
    backgroundColor: "rgba(4, 120, 87, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  sideCoinBig: {
    width: 46,
    height: 46,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(5, 150, 105, 0.7)",
    backgroundColor: "rgba(4, 120, 87, 0.30)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  sideCoinSmall: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(5, 150, 105, 0.6)",
    backgroundColor: "rgba(4, 120, 87, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  sideCoinTiny: {
    width: 26,
    height: 26,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(5, 150, 105, 0.55)",
    backgroundColor: "rgba(4, 120, 87, 0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  sideCoinText: {
    color: "rgba(209, 250, 229, 0.9)",
    fontWeight: "700",
    fontSize: 14,
  },

  coinGroupTopLeft: {
    position: "absolute",
    top: 70,
    left: 36,
    opacity: 0.25,
  },
  coinGroupBottomLeft: {
    position: "absolute",
    bottom: 110,
    left: 30,
    opacity: 0.25,
  },
  coinGroupBottomRight: {
    position: "absolute",
    bottom: 140,
    right: 40,
    opacity: 0.25,
    alignItems: "flex-end",
  },

  /* MONEDA PRINCIPAL */

  mainCoinWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  shadowDisk: {
    position: "absolute",
    top: 20,
    width: 170,
    height: 170,
    borderRadius: 9999,
    backgroundColor: "#006766",
    opacity: 0.9,
  },
  mainCoinOuter: {
    width: 140,
    height: 140,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  mainCoinInner: {
    width: 104,
    height: 104,
    borderRadius: 9999,
    backgroundColor: "#FDE68A",
    justifyContent: "center",
    alignItems: "center",
  },
  mainCoinText: {
    fontSize: 54,
    fontWeight: "800",
    color: "#1F2937",
  },

  /* TEXTO CENTRAL */

  centerText: {
    alignItems: "center",
  },
  title: {
    color: "#FDF5DC",
    fontSize: 40,
    marginBottom: 6,
    letterSpacing: 6,
    fontWeight: "800",
  },
  subtitle: {
    color: "#EEE8CC",
    fontSize: 15,
    textAlign: "center",
  },

  /* BOTÓN EMPAZAR */

  startButtonWrapper: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    paddingHorizontal: 40,
  },
  startButton: {
    width: "100%",
    borderRadius: 9999,
    paddingVertical: 14,
    backgroundColor: "#00C48C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  startButtonText: {
    color: "#ECFEFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
