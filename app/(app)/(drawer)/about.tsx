import { Text, View } from 'react-native';

import { Stack } from 'expo-router';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen options={{ title: 'About' }} />
      <Text>Welcome to the app - About Page</Text>
    </View>
  );
}
