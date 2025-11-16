import React, { ReactNode, useRef } from 'react';
import {
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
  className?: string; 
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: any;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  icon,
  fullWidth = false,
  style
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
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
    ghost: styles.ghost
  };

  const sizeStyles = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg
  };

  return (
    <Animated.View style={{ transform: [{ scale }], width: fullWidth ? '100%' : undefined }}>
      <Pressable
        onPress={onClick}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && styles.fullWidth,
          style
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.text}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Variants
  primary: {
    backgroundColor: '#00C48C',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4
  },
  secondary: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  ghost: {
    backgroundColor: '#F3F4F6'
  },

  // Sizes
  sm: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  md: {
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 16
  },

  text: {
    color: '#111827'
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4
  },

  fullWidth: {
    width: '100%'
  }
});
