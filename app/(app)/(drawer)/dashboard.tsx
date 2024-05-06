import { Text, View } from 'react-native';

import { useSession } from '../../../services/sb-ctx';
import { Stack } from 'expo-router';

export default function Dashboard() {
  const { signOut, user } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Text>Welcome to the app!</Text>
      <Text>User: {user?.email}</Text>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
