import { StyleSheet, View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/styles/globalStyles";

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView style={[styles.container]}>
        <Text style={[globalStyles.heading]}>I am the homepage</Text>
        <Button title="I am a button" />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
