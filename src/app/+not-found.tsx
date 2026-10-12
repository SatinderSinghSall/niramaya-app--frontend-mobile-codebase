import { Stack, router } from "expo-router";
import { View, Text, Pressable, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  const handleGoHome = () => {
    router.replace("/(main)/(tabs)/home" as never);
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      handleGoHome();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Page Not Found",
          headerShown: false,
        }}
      />

      <SafeAreaView className="flex-1 bg-[#F7F8F2]" edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7F8F2" />

        <View className="flex-1 items-center justify-center px-6 py-8">
          <View className="w-full max-w-md items-center">
            {/* Wellness icon */}
            <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-[#E4EDDF]">
              <View className="h-24 w-24 items-center justify-center rounded-full bg-[#D2E3C9]">
                <Ionicons name="leaf-outline" size={48} color="#356B46" />
              </View>
            </View>

            {/* Error code */}
            <Text className="text-7xl font-extrabold tracking-tight text-[#356B46]">
              404
            </Text>

            <Text className="mt-4 text-center text-2xl font-bold text-[#20382A]">
              Oops! Wrong Path
            </Text>

            <Text className="mt-3 max-w-xs text-center text-base leading-6 text-[#718075]">
              It looks like this page has wandered off the path. Let’s get you
              back to your wellness journey.
            </Text>

            {/* Primary action */}
            <Pressable
              onPress={handleGoHome}
              accessibilityRole="button"
              accessibilityLabel="Go to dashboard"
              className="mt-9 min-h-14 w-full flex-row items-center justify-center rounded-2xl bg-[#356B46] px-5 active:bg-[#285538]"
              style={({ pressed }) => ({
                opacity: pressed ? 0.88 : 1,
                ...(Platform.OS === "ios"
                  ? {
                      shadowColor: "#244B31",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12,
                      shadowRadius: 8,
                    }
                  : { elevation: 3 }),
              })}
            >
              <Ionicons name="home-outline" size={20} color="#FFFFFF" />
              <Text className="ml-2 text-base font-semibold text-white">
                Back to Dashboard
              </Text>
            </Pressable>

            {/* Secondary action */}
            <Pressable
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Go back to previous screen"
              className="mt-4 min-h-12 flex-row items-center justify-center px-5"
            >
              <Ionicons name="arrow-back-outline" size={18} color="#356B46" />
              <Text className="ml-2 text-base font-semibold text-[#356B46]">
                Go Back
              </Text>
            </Pressable>

            {/* Footer */}
            <View className="mt-12 flex-row items-center justify-center">
              <Ionicons name="leaf" size={15} color="#719477" />
              <Text className="ml-2 text-sm text-[#879287]">
                Niramaya · Your wellness, your journey
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
