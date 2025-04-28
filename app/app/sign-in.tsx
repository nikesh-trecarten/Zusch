import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, TextInput } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

export default function SignInPage() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TextInput />
      <TextInput />
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
