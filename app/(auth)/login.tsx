import { Button } from "@/components/Button";
import { AuthContext } from "@/contexts/AuthContext";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { validate } from "@/utils/auth/validate";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { Chrome, Lock, Mail } from "lucide-react-native";
import { MotiView } from "moti";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { loading, run } = useAsyncAction();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: "email" | "password", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      {/* HERO: Lottie arriba + textos */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800, type: "timing" }}
        style={styles.hero}
      >
        <LottieView
          source={require("../../assets/images/loCoin.json")}
          autoPlay
          loop
          style={styles.lottieLogo}
        />

        <Text style={styles.appName}>KOINS</Text>
        <Text style={styles.heroTitle}>Bienvenido de nuevo</Text>
        <Text style={styles.heroSubtitle}>
          Revisa tus gastos, puntos y facturas electrónicas en un solo lugar.
        </Text>
      </MotiView>

      {/* CARD DEL FORMULARIO */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 250, type: "timing" }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Iniciar sesión</Text>

        {/* Email */}
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

        {/* Password */}
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

        {/* Botón login */}
        <Button
          fullWidth
          variant="primary"
          size="lg"
          onClick={handleLogin}
          loading={loading}
        >
          Iniciar sesión
        </Button>

        {/* Google */}
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

      {/* DECORACIONES */}
      <MotiView
        animate={{ translateY: [0, 10, 0] }}
        transition={{ duration: 3000, loop: true }}
        style={styles.decorationTop}
      />
      <MotiView
        animate={{ translateY: [0, -10, 0] }}
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
    paddingTop: 48,
  },

  /* HERO */
  hero: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    marginBottom: 16,
  },
  lottieLogo: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  appName: {
    color: "#D1FAE5",
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#E5E7EB",
    fontSize: 13,
    textAlign: "center",
  },

  /* CARD */
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(255,255,255,0.98)",
    padding: 28,
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
    marginBottom: 20,
    fontWeight: "600",
  },

  label: {
    color: "#4B5563",
    fontSize: 14,
    marginBottom: 6,
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

  linksContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  forgotPassword: {
    color: "#00F5B1",
    fontSize: 14,
    marginBottom: 8,
  },
  switchAuth: {
    color: "#4B5563",
    fontSize: 14,
  },

  decorationTop: {
    position: "absolute",
    top: 70,
    right: 22,
    width: 64,
    height: 64,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },
  decorationBottom: {
    position: "absolute",
    bottom: 110,
    left: 32,
    width: 48,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
  },
});