import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HealthProfileCTA() {
  const handlePress = () => {
    router.push("/(main)/health-profile" as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-5 mt-4 overflow-hidden rounded-[20px] bg-[#4D6A50]"
    >
      <View className="p-5">
        {/* -------------------------------------------------------------- */}
        {/* TOP CONTENT                                                     */}
        {/* -------------------------------------------------------------- */}

        <View className="flex-row items-start">
          <View className="h-[44px] w-[44px] items-center justify-center rounded-[14px] bg-white/15">
            <Ionicons name="heart-outline" size={22} color="#FFFFFF" />
          </View>

          <View className="ml-3 flex-1 pr-2">
            <Text className="text-[10px] font-bold uppercase tracking-[1.4px] text-[#DCE8DD]">
              Health profile
            </Text>

            <Text className="mt-1 text-[17px] font-bold leading-6 text-white">
              Your health profile
            </Text>

            <Text className="mt-1.5 text-[11px] leading-5 text-[#E4ECE5]">
              Review your health information, lifestyle, wellbeing and personal
              details.
            </Text>
          </View>
        </View>

        {/* -------------------------------------------------------------- */}
        {/* CTA                                                             */}
        {/* -------------------------------------------------------------- */}

        <View className="mt-5 flex-row items-center justify-between rounded-[13px] bg-white/10 px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={16} color="#FFFFFF" />

            <Text className="ml-2 text-[11px] font-bold text-white">
              View Health Profile
            </Text>
          </View>

          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
        </View>
      </View>
    </Pressable>
  );
}
