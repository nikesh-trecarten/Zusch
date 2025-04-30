import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/styles/globalStyles";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import Map from "@/components/Map";

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView style={[globalStyles.pageContainer]}>
        <Text style={[globalStyles.heading]}>Welcome to Zusch!</Text>
        <Map />
      </SafeAreaView>
    </>
  );
}
