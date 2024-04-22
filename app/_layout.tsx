import { Slot } from "expo-router";
import { SessionProvider } from "../services/sb-ctx";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: 'app/(app)/(drawer)/',
// };

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
