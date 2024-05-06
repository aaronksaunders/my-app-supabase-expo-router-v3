import { Slot } from "expo-router";
import { SessionProvider } from "../services/sb-ctx";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Network from 'expo-network';
import { Alert } from "react-native";


// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'app/(app)/(drawer)/',
// };

(async () => {
  const networkState = await Network.getNetworkStateAsync();
  console.log("[Network]==>",networkState);
  if (!networkState.isConnected) { 
    console.log("Not connected to the internet");
    Alert.alert("No Internet Connection", "Please connect to the internet to use this app", [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
    return;
  }
})();

export default function Root() {

  const client = new QueryClient();

  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={client}>
        <Slot />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
