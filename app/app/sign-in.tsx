import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, TextInput, StyleSheet } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

export default function SignInPage() {
  return (
    <SafeAreaView style={[styles.container]}>
      <TextInput style={[styles.input]} />
      <TextInput style={[styles.input]} />
      <Pressable
        style={({ pressed }) => {
          return [globalStyles.button, pressed && globalStyles.buttonPressed];
        }}
        onPress={() => {}}
      >
        <Text style={[globalStyles.buttonText]}>Sign In</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});
