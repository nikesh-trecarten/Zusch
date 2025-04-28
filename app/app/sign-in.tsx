import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, TextInput, StyleSheet, Alert } from "react-native";
import { globalStyles } from "@/styles/globalStyles";
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, setActive, isLoaded } = useSignIn();

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <TextInput
        autoCapitalize="none"
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
        onPress={onSignInPress}
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
