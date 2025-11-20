import { MotiView } from "moti";
import React, { ReactNode, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  delay?: number;
  style?: any;
}

export function Card({ children, hover = false, delay = 0, style }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (!hover) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: -2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (!hover) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay, duration: 400 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.card,
          style,
          hover && {
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <Pressable
          disabled={!hover}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
        >
          {children}
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  pressable: {
    borderRadius: 16,
    overflow: "hidden",
  },
});
