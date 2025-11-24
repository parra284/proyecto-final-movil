import { Button } from "@/components/Button";
import { AuthContext } from "@/contexts/AuthContext";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { validate } from "@/utils/auth/validate";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Chrome, Lock, Mail } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Login() {
  const { loading, run } = useAsyncAction();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: "email" | "password", value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    const error = validate(form);
    if (error) {
      return Alert.alert("Error", error);
    }

    run(async () => {
      await login(form.email.trim(), form.password.trim());
      router.replace("/(main)/home/dashboard");
    }).catch((err) => {
      Alert.alert("Error", err.message || "No se pudo iniciar sesión");
    });
  };

  return (
    <LinearGradient
      colors={["#00C48C", "#00A077", "#1F2937"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Logo */}
      <MotiView
        from={{ scale: 0, rotate: "-180deg" }}
        animate={{ scale: 1, rotate: "0deg" }}
        transition={{ duration: 800, type: "spring" }}
        style={styles.logo}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoK}>K</Text>
        </View>

        <Text style={styles.logoTitle}>KOINS</Text>
        <Text style={styles.logoSubtitle}>
          Control financiero inteligente
        </Text>
      </MotiView>

      {/* Form Card */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>
          Iniciar sesión
        </Text>

        {/* Email Input */}
        <View style={styles.mb4}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              placeholder="tu@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.mb6}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        {/* Login Button */}
        <Button
          fullWidth
          variant="primary"
          size="lg"
          onClick={handleLogin}
          loading={loading}
        >
          Iniciar sesión
        </Button>

        {/* Google Button */}
        <Button
          fullWidth
          variant="outline"
          size="lg"
          icon={<Chrome size={20} color="#111827" />}
        >
          Continuar con Google
        </Button>

        {/* Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.switchAuth}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* Decorative Elements */}
      <MotiView
        animate={{
          translateY: [0, 10, 0],
          rotate: ["0deg", "5deg", "0deg"],
        }}
        transition={{ duration: 3000, loop: true }}
        style={styles.decorationTop}
      />

      <MotiView
        animate={{
          translateY: [0, -10, 0],
          rotate: ["0deg", "-5deg", "0deg"],
        }}
        transition={{ duration: 4000, loop: true }}
        style={styles.decorationBottom}
      />
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 64,
  },

  logo: { 
    marginBottom: 32, 
    alignItems: "center"
  },

  logoCircle: {
    width: 96,
    height: 96,
    backgroundColor: "#FBBF24",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 16,
  },

  logoK: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },

  logoTitle: {
    color: "white",
    fontSize: 32,
    textAlign: "center",
  },

  logoSubtitle: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  cardTitle: {
    color: "#111827",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },

  label: {
    color: "#4B5563",
    fontSize: 14,
    marginBottom: 8,
  },

  inputWrapper: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 48,
    justifyContent: "center",
  },

  inputIcon: {
    position: "absolute",
    left: 16,
    top: "50%",
    marginTop: -10,
  },

  input: {
    color: "#111827",
    fontSize: 16,
  },

  mb4: { marginBottom: 16 },
  mb6: { marginBottom: 24 },
  mb3: { marginBottom: 12 },

  linksContainer: {
    alignItems: "center",
    marginTop: 8,
  },

  forgotPassword: {
    color: "#00C48C",
    fontSize: 14,
    marginBottom: 8,
  },

  switchAuth: {
    color: "#4B5563",
    fontSize: 14,
  },

  decorationTop: {
    position: "absolute",
    top: 80,
    right: 32,
    width: 64,
    height: 64,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },

  decorationBottom: {
    position: "absolute",
    bottom: 128,
    left: 32,
    width: 48,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },
});
