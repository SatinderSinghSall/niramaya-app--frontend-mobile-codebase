import { Stack } from "expo-router";

import { View } from "react-native";

import { DrawerProvider } from "@/components/navigation/DrawerContext";
import AppDrawer from "@/components/navigation/AppDrawer";

export default function MainLayout() {
  return (
    <DrawerProvider>
      <View className="flex-1 bg-white">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        <AppDrawer />
      </View>
    </DrawerProvider>
  );
}
