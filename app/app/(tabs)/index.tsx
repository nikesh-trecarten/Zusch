import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import Map from "@/components/Map";
import { useFocusEffect } from "expo-router";
import { Header } from "@/components/Header";
import { MapLegend } from "@/components/MapLegend";

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView style={[globalStyles.pageContainer]}>
        <Header />
        <Text style={[globalStyles.heading]}>Welcome to Zusch!</Text>
        <Map />
        <MapLegend />
      </SafeAreaView>
    </>
  );
}
