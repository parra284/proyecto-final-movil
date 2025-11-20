import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Coins } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Intro() {

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#00C48C", "#00A077", "#1F2937"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Animated coin falling */}
      <MotiView
        from={{ translateY: -200, rotate: "0deg" }}
        animate={{ translateY: 0, rotate: "360deg" }}
        transition={{ type: "timing", duration: 1000 }}
        style={styles.mb8}
      >
        <View style={styles.relative}>
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              type: "timing",
              duration: 2000,
              loop: true,
            }}
            style={styles.coinCircle}
          >
            <Text style={styles.coinText}>K</Text>
          </MotiView>
        </View>
      </MotiView>

      {/* Logo text */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", delay: 500, duration: 800 }}
        style={styles.centerText}
      >
        <Text style={styles.title}>KOINS</Text>
        <Text style={styles.subtitle}>Control financiero inteligente</Text>
      </MotiView>

      {/* Decorative coins */}
      <MotiView
        animate={{ translateY: [0, 10, 0], rotate: ["0deg", "5deg", "0deg"] }}
        transition={{ type: "timing", duration: 3000, loop: true }}
        style={styles.coinTopLeft}
      >
        <Coins size={48} color="white" />
      </MotiView>

      <MotiView
        animate={{ translateY: [0, -10, 0], rotate: ["0deg", "-5deg", "0deg"] }}
        transition={{ type: "timing", duration: 4000, loop: true }}
        style={styles.coinBottomRight}
      >
        <Coins size={64} color="white" />
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },

  mb8: { marginBottom: 32 },
  relative: { position: "relative" },

  coinCircle: {
    width: 112,
    height: 112,
    backgroundColor: "#FBBF24",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  coinText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  centerText: { alignItems: "center" },

  title: {
    color: "white",
    fontSize: 48,
    marginBottom: 12,
    letterSpacing: 2,
    fontWeight: "600",
  },

  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },

  startButtonWrapper: {
    position: "absolute",
    bottom: 80,
  },

  startButton: {
    backgroundColor: "white",
    borderWidth: 0,
    paddingHorizontal: 64,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  coinTopLeft: {
    position: "absolute",
    top: 80,
    left: 40,
    opacity: 0.2,
  },

  coinBottomRight: {
    position: "absolute",
    bottom: 160,
    right: 40,
    opacity: 0.2,
  },
});
