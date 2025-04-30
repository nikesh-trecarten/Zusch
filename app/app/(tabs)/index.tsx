import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/styles/globalStyles";
import { useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { Header } from "@/components/Header";

const API_HOST = process.env.EXPO_PUBLIC_API_HOST;

export default function HomeScreen() {
  const { getToken } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await getToken();
          const response = await axios.get(`${API_HOST}/boxes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      console.log("I've got focus");
      return () => {
        console.log("I've lost focus");
      };
    }, [])
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = await getToken();
  //       const response = await axios.get(`${API_HOST}/boxes`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  return (
    <>
      <SafeAreaView style={[globalStyles.pageContainer]}>
        <Header />
        <Text style={[globalStyles.heading]}>I am the homepage</Text>
        <Pressable
          style={({ pressed }) => {
            return [globalStyles.button, pressed && globalStyles.buttonPressed];
          }}
          onPress={() => {
            console.log("Button Pressed");
          }}
        >
          <Text style={[globalStyles.buttonText]}>I am a button</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
