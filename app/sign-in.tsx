import { router } from "expo-router";
import { Alert, Text, TextInput, View } from "react-native";

import { useSession } from "../services/sb-ctx";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <View style={{ width: 300, alignSelf: "center" }}>
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />
        <Text style={{ marginTop: 16 }}>Password</Text>
        <TextInput
          autoCapitalize="none"
          spellCheck={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />

        <Text
          style={{ marginTop: 16 }}
          onPress={async () => {
            try {
              await signIn(email, password);
              // Navigate after signing in. You may want to tweak this to ensure sign-in is
              // successful before navigating.
              router.replace("/(app)/(drawer)/dashboard");
            } catch (error) {
              Alert.alert("Sign In Error", (error as any)?.message);
            }
          }}
        >
          Sign In
        </Text>

        <Text
          style={{ marginTop: 16 }}
          onPress={async () => {
            router.replace("/sign-up");
          }}
        >
          Go To Sign Up
        </Text>
      </View>
    </View>
  );
}
