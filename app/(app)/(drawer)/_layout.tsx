import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  DrawerContent,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { JSX, ReactNode, RefAttributes } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  ScrollViewProps,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSession } from "~/services/sb-ctx";

const CustomDrawerContent = (props: any) => {
  // hooks for session and safe area insets
  const { signOut, user } = useSession();
  const { top, bottom } = useSafeAreaInsets();


  return (
    <View style={{ display: "flex", flex: 1 }}>
      {/* BODY */}
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          {/* HEADER */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 16,
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderBottomColor: "lightgray",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Expo Supabase ⚡</Text>
            <Text style={{ fontSize: 16, color: "gray", paddingTop: 8 }}>
              {user?.email}
            </Text>
          </View>

          <DrawerItemList
            {...props}
            style={{ flex: 1, alignItem: "flex-start" }}
          />
        </DrawerContentScrollView>
      </View>

      {/* FOOTER */}
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: "white",
          paddingBottom: bottom + 16,
        }}
      >
        <Pressable
          onPress={() => signOut()}
          style={{
            borderRadius: 8,
            padding: 16,
            backgroundColor: 'lightblue',
            alignItems: "center",
          }}
        >
          <Text style={{ color: "blue", fontWeight: "bold" }}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
};

const DrawerLayout = () => (
  // <Drawer initialRouteName="/(app)/(drawer)/dashboard/">
  <Drawer
    initialRouteName="dashboard"
    drawerContent={(props: any) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="dashboard"
      options={{
        headerTitle: "Dashboard",
        drawerLabel: "Dashboard",
        drawerIcon: ({ size, color }: any) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />

    <Drawer.Screen
      name="(tabs)"
      options={{
        drawerLabel: "Activities",
        headerShown: false,
        drawerIcon: ({ size, color }: any) => (
          <Ionicons name="documents-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="about"
      options={{
        drawerLabel: "About",
        drawerIcon: ({ size, color }: any) => (
          <Ionicons name="cog-outline" size={size} color={color} />
        ),
      }}
    />
  </Drawer>
);

export default DrawerLayout;
