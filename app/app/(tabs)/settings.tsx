import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@/styles/globalStyles";
import { useAuth } from "@clerk/clerk-expo";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  return (
    <>
      <SafeAreaView style={[globalStyles.pageContainer]}>
        <Text style={[globalStyles.heading]}>I am the settings page</Text>
        <Pressable
          style={({ pressed }) => {
            return [globalStyles.button, pressed && globalStyles.buttonPressed];
          }}
          onPress={() => {
            signOut();
          }}
        >
          <Text style={[globalStyles.buttonText]}>Logout</Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
