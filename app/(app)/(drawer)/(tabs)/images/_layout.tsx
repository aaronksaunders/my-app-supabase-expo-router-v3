import { DrawerToggleButton } from "@react-navigation/drawer";
import { Redirect, Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";


export default function TabHomeLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Images",
        title: "Images",
        headerLeft: () => <DrawerToggleButton />,
      }}
    />
  );
}
