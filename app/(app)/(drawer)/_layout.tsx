import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

const DrawerLayout = () => (
  <Drawer initialRouteName="/(app)/(drawer)/dashboard/">
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
        drawerLabel: "Tabs",
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
