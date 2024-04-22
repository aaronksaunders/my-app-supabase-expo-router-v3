import { router } from "expo-router";
import { Text, TextInput, View } from "react-native";

import { useSession } from "../services/sb-ctx";
import { useState } from "react";

export default function SignUp() {
  const { signUp } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <View style={{ width: 300, alignSelf: "center" }}>
      <Text>Name</Text>
        <TextInput
          autoCapitalize="none"
          spellCheck={false}
          value={name}
          onChangeText={(text) => setName(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />
        <Text style={{marginTop:16}}>Password</Text>
        <TextInput
          autoCapitalize="none"
          spellCheck={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        />

        <Text  style={{marginTop:16}}
          onPress={async () => {
            await signUp(email, password, name);
            // Navigate after signing in. You may want to tweak this to ensure sign-in is
            // successful before navigating.
            router.replace("/(app)/(drawer)/dashboard");
          }}
        >
          Sign Up
        </Text>

        <Text  style={{marginTop:16}}
          onPress={async () => {
            router.replace("/sign-in");
          }}
        >
          Go To Sign In
        </Text>
      </View>
    </View>
  );
}
