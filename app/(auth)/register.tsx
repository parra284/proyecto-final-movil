import { Button } from "@/components/Button";
import { AuthContext } from "@/contexts/AuthContext";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { validate } from "@/utils/auth/validate";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { Chrome, Lock, Mail, User } from "lucide-react-native";
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

export default function Register() {
  const { loading, run } = useAsyncAction();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    name: "",
    lastName: "",
    password: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const error = validate(form);
    if (error) {
      return Alert.alert("Error", error);
    }

    run(async () => {
      await register(
        {
          email: form.email.trim(),
          name: form.name.trim(),
          last_name: form.lastName.trim(),
          id: "",
        },
        form.password
      );
      router.replace("/(main)/home/dashboard");
    }).catch((err) =>
      Alert.alert("Error", err.message || "No se pudo crear la cuenta")
    );
  };

  return (
    <LinearGradient
      colors={["#00C48C", "#00A077", "#1F2937"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* HERO CON LOTTIE + TEXTO */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800, type: "timing" }}
        style={styles.hero}
      >
        <View style={styles.heroText}>
          <Text style={styles.appName}>KOINS</Text>
          <Text style={styles.heroTitle}>Crea tu cuenta</Text>
          <Text style={styles.heroSubtitle}>
            Empieza a organizar tu dinero, ganar puntos por facturas
            electrónicas y dejar de sufrir por tus gastos.
          </Text>
        </View>

        <View style={styles.heroLottieWrapper}>
          <LottieView
            source={require("../../assets/images/loCoin.json")}
            autoPlay
            loop
            style={styles.lottieLogo}
          />
        </View>
      </MotiView>

      {/* TARJETA DEL FORMULARIO */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 250, type: "timing" }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Registro</Text>

        {/* Nombre */}
        <View style={styles.mb4}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              placeholder="Tu nombre"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>
        </View>

        {/* Apellido */}
        <View style={styles.mb4}>
          <Text style={styles.label}>Apellido</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              value={form.lastName}
              onChangeText={(v) => handleChange("lastName", v)}
              placeholder="Tu apellido"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>
        </View>

        {/* Correo */}
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

        {/* Contraseña */}
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

        {/* Botón registrar */}
        <Button
          fullWidth
          variant="primary"
          size="lg"
          onClick={handleRegister}
          loading={loading}
        >
          Crear cuenta
        </Button>

        {/* Google */}
        <Button
          fullWidth
          variant="outline"
          size="lg"
          icon={<Chrome size={20} color="#111827" />}
        >
          Registrarse con Google
        </Button>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.switchAuth}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* DECORACIONES SUAVES */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  heroText: {
    flex: 1.2,
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
  },
  heroSubtitle: {
    color: "#E5E7EB",
    fontSize: 13,
  },
  heroLottieWrapper: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieLogo: {
    width: 110,
    height: 110,
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

  mb4: { marginBottom: 14 },
  mb6: { marginBottom: 22 },

  linksContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  switchAuth: {
    color: "#4B5563",
    fontSize: 14,
  },

  decorationTop: {
    position: "absolute",
    top: 70,
    right: 18,
    width: 68,
    height: 68,
    backgroundColor: "rgba(255,255,255,0.12)",
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