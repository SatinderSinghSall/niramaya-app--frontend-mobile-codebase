import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#EEF2E6]">
      <View className="flex-1 px-6">
        {/* ---------------------------------
            Main content
        --------------------------------- */}

        <View className="flex-1 items-center justify-center">
          {/* Logo */}
          <View className="h-[180px] w-[180px] items-center justify-center">
            <Image
              source={require("../../../assets/images/app-icon.jpeg")}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>

          {/* Brand */}
          <View className="mt-1 items-center">
            <Text className="text-[34px] font-semibold tracking-[5px] text-[#263F31]">
              NIRAMAYA
            </Text>

            <Text className="mt-2 text-[12px] font-medium tracking-[1.4px] text-[#6D796F]">
              Wellness
              <Text className="text-[#8BA08A]"> • </Text>
              Balance
              <Text className="text-[#8BA08A]"> • </Text>
              You
            </Text>
          </View>

          {/* Divider */}
          <View className="mt-7 h-[1px] w-9 bg-[#718571] opacity-60" />

          {/* Heading */}
          <Text className="mt-6 max-w-[340px] text-center text-[25px] font-bold leading-[32px] text-[#263F31]">
            Your journey to better wellness starts here.
          </Text>

          {/* Description */}
          <Text className="mt-4 max-w-[330px] text-center text-[13px] leading-[20px] text-[#6F7B71]">
            Understand your body, build healthier habits, and discover
            personalized guidance for everyday wellbeing.
          </Text>
        </View>

        {/* ---------------------------------
            Actions
        --------------------------------- */}

        <View className="pb-7">
          {/* Get Started */}
          <Pressable
            onPress={() => router.push("/(public)/signup")}
            className="h-[53px] flex-row items-center justify-center rounded-[15px] bg-[#4D6A50]"
            style={({ pressed }) => ({
              opacity: pressed ? 0.86 : 1,
            })}
          >
            <Text className="text-[14px] font-bold text-white">
              Get Started
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
              style={{
                marginLeft: 8,
              }}
            />
          </Pressable>

          {/* Login */}
          <View className="mt-5 flex-row items-center justify-center">
            <Text className="text-[13px] text-[#7B857C]">
              Already have an account?
            </Text>

            <Pressable
              onPress={() => router.push("/(public)/login")}
              className="ml-1.5"
              hitSlop={8}
            >
              <Text className="text-[13px] font-bold text-[#4D6A50]">
                Login
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="mt-6 items-center">
            <Text className="text-[9px] font-medium tracking-[1px] text-[#9AA39A]">
              HOLISTIC HEALTH & WELLBEING
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
