import { Text, View } from 'react-native';

import { Stack } from 'expo-router';
import { supabaseClient } from '~/services/supabase-service';
import { useEffect, useState } from 'react';

export default function AboutScreen() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  useEffect(() => {
  supabaseClient.auth.getUser().then((user) => {
    console.log(user);
    setCurrentUser(user?.data?.user);
  });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Screen options={{ title: 'About' }} />
      <Text>Welcome to the app - About Page</Text>
      <Text>{ JSON.stringify(currentUser,null,2)}</Text>
    </View>
  );
}
