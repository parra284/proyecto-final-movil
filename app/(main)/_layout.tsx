import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function LayoutMain() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: "#00C48C",
                tabBarInactiveTintColor: "#9CA3AF",
                headerShown: false,
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
                            transition={{ type: "timing", duration: 200 }}
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
                            transition={{ type: "timing", duration: 200 }}
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
                            transition={{ type: "timing", duration: 200 }}
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
                            transition={{ type: "timing", duration: 200 }}
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
                            transition={{ type: "timing", duration: 200 }}
                        >
                            <AntDesign name="user" size={24} color={color} />
                        </MotiView>
                    )
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
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
