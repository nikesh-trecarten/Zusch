import { Redirect, Tabs } from "expo-router";
import React from "react";
import { COLORS } from "@/styles/constants";
import { useUser } from "@clerk/clerk-expo";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
