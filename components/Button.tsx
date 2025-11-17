import React, { ReactNode, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  icon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;      
  disabled?: boolean;     
  style?: any;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  icon,
  fullWidth = false,
  loading = false,
  disabled = false,
  style
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isDisabled = loading || disabled;

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true
    }).start();
  };

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    ghost: styles.ghost,
  };

  const disabledStyles = {
    primary: styles.primaryDisabled,
    secondary: styles.secondaryDisabled,
    outline: styles.outlineDisabled,
    ghost: styles.ghostDisabled,
  };

  const sizeStyles = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  // Color dinámico del loader
  const loaderColor =
    variant === 'primary' || variant === 'secondary'
      ? '#FFF'
      : '#111827';

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        width: fullWidth ? '100%' : undefined,
        opacity: isDisabled ? 0.7 : 1
      }}
    >
      <Pressable
        disabled={isDisabled}
        onPress={onClick}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          isDisabled ? disabledStyles[variant] : variantStyles[variant],
          sizeStyles[size],
          fullWidth && styles.fullWidth,
          style
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={loaderColor} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text
              style={[
                styles.text,
                variant === 'primary' && styles.textPrimary,
                variant === 'secondary' && styles.textSecondary
              ]}
            >
              {children}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  /* Variants */
  primary: {
    backgroundColor: "#00C48C",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  secondary: {
    backgroundColor: "#1F2937",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  ghost: {
    backgroundColor: "#F3F4F6",
  },

  /* Disabled variants */
  primaryDisabled: {
    backgroundColor: "#7DD3C0",
  },
  secondaryDisabled: {
    backgroundColor: "#4B5563",
  },
  outlineDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
  },
  ghostDisabled: {
    backgroundColor: "#E5E7EB",
  },

  /* Sizes */
  sm: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  md: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },

  /* Text */
  text: {
    color: "#111827",
    fontWeight: "600",
  },
  textPrimary: {
    color: "white",
  },
  textSecondary: {
    color: "white",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  fullWidth: {
    width: "100%",
  },
});
