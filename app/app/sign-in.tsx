import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, TextInput, StyleSheet, Alert } from "react-native";
import { globalStyles } from "@/styles/globalStyles";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView style={[styles.container]}>
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
        placeholder="Email"
        style={[styles.input]}
      />
      <TextInput
        value={password}
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry
        placeholder="Password"
        style={[styles.input]}
      />
      <Pressable
        style={({ pressed }) => {
          return [globalStyles.button, pressed && globalStyles.buttonPressed];
        }}
        onPress={() => {
          Alert.alert(`${email} ${password}`);
          setEmail("");
          setPassword("");
        }}
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
