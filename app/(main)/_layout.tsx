import { AuthContext } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useRouter, useSegments } from "expo-router";
import { MotiView } from 'moti';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LayoutMain() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    // Detecta la screen activa
    const segments = useSegments();
    const current = segments[1] || "home";
    const sub = segments[2] || null; // dashboard, transactions, etc.

    // Saber si estamos en /home/transactions o subrutas
    const showBack = current === "home" && sub === "transactions";

    // Textos + colores dinámicos
    const titles: Record<
        string,
        {
            title: string;
            subtitle: string;
            gradient: readonly [string, string];
        }
    > = {
        home: {
            title: `Hola, ${user?.name} 👋`,
            subtitle: "Tu balance general",
            gradient: ["#00C48C", "#00A077"] as const,
        },
        transactions: {
            title: "Transacciones 📒",
            subtitle: "Historial completo",
            gradient: ["#6366F1", "#4338CA"] as const,
        },
        stats: {
            title: "Estadísticas 📊",
            subtitle: "Revisa tus métricas",
            gradient: ["#6366F1", "#818CF8"] as const,
        },
        predictions: {
            title: "Predicciones 🔮",
            subtitle: "Tu futuro financiero",
            gradient: ["#F59E0B", "#FBBF24"] as const,
        },
        points: {
            title: "Puntos ⭐",
            subtitle: "Tus recompensas",
            gradient: ["#EF4444", "#F87171"] as const,
        },
        profile: {
            title: "Perfil 👤",
            subtitle: "Administra tu cuenta",
            gradient: ["#3B82F6", "#60A5FA"] as const,
        },
        login: { title: "", subtitle: "", gradient: ["#000", "#000"] as const },
        register: { title: "", subtitle: "", gradient: ["#000", "#000"] as const },
    };

    const routeKey = sub ? sub : current;
    const { title, subtitle, gradient } = titles[routeKey] || titles.home;

    return (
        <DataProvider>

            {/* Header dinámico */}
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >

                {/* Contenedor del back button + texto */}
                <View style={styles.headerRow}>
                    {showBack && (
                        <Pressable onPress={() => router.back()} style={styles.backBtn}>
                            <AntDesign name="arrow-left" size={24} color="#FFF" />
                        </Pressable>
                    )}

                    <MotiView
                        key={routeKey}
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 400 }}
                        style={{ flex: 1 }}
                    >
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Text style={styles.headerSubtitle}>{subtitle}</Text>
                    </MotiView>
                </View>

            </LinearGradient>

            {/* Tabs */}
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: "#00C48C",
                    tabBarInactiveTintColor: "#9CA3AF",
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Inicio",
                        tabBarIcon: ({ color, focused }) => (
                            <MotiView
                                from={{ scale: 1 }}
                                animate={{ scale: focused ? 1.25 : 1 }}
                                transition={{ duration: 200 }}
                            >
                                <AntDesign name="home" size={24} color={color} />
                            </MotiView>
                        )
                    }}
                />

                <Tabs.Screen
                    name="stats"
                    options={{
                        tabBarLabel: "Estadísticas",
                        tabBarIcon: ({ color, focused }) => (
                            <MotiView
                                from={{ scale: 1 }}
                                animate={{ scale: focused ? 1.25 : 1 }}
                                transition={{ duration: 200 }}
                            >
                                <AntDesign name="line-chart" size={24} color={color} />
                            </MotiView>
                        )
                    }}
                />

                <Tabs.Screen
                    name="predictions"
                    options={{
                        tabBarLabel: "Predicciones",
                        tabBarIcon: ({ color, focused }) => (
                            <MotiView
                                from={{ scale: 1 }}
                                animate={{ scale: focused ? 1.25 : 1 }}
                                transition={{ duration: 200 }}
                            >
                                <AntDesign name="experiment" size={24} color={color} />
                            </MotiView>
                        )
                    }}
                />

                <Tabs.Screen
                    name="points"
                    options={{
                        tabBarLabel: "Puntos",
                        tabBarIcon: ({ color, focused }) => (
                            <MotiView
                                from={{ scale: 1 }}
                                animate={{ scale: focused ? 1.25 : 1 }}
                                transition={{ duration: 200 }}
                            >
                                <AntDesign name="star" size={24} color={color} />
                            </MotiView>
                        )
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarLabel: "Perfil",
                        tabBarIcon: ({ color, focused }) => (
                            <MotiView
                                from={{ scale: 1 }}
                                animate={{ scale: focused ? 1.25 : 1 }}
                                transition={{ duration: 200 }}
                            >
                                <AntDesign name="user" size={24} color={color} />
                            </MotiView>
                        )
                    }}
                />
            </Tabs>
        </DataProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    backBtn: {
        marginRight: 10,
        padding: 4,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    headerSubtitle: {
        marginTop: 4,
        fontSize: 16,
        color: "#FFFFFF",
    },

    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingTop: 10,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: 70,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 12,
    }
});
