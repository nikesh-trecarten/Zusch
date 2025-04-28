import { StyleSheet, View, Text, Button, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/styles/globalStyles";

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView style={[styles.container]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
