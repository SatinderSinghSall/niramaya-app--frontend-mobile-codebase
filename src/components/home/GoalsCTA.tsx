import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type GoalsCTAProps = {
  activeGoals?: number;
};

export default function GoalsCTA({ activeGoals = 0 }: GoalsCTAProps) {
  const hasActiveGoals = activeGoals > 0;

  const handlePress = () => {
    router.push("/(main)/goals" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      className="mt-8 overflow-hidden rounded-[22px] border border-white/10"
    >
      <ImageBackground
        source={require("../../../assets/images/goals-cta.jpg")}
        resizeMode="cover"
        className="h-[205px]"
        imageStyle={{
          transform: [{ scale: 1.02 }],
        }}
      >
        {/* Main dark overlay */}
        <View className="absolute inset-0 bg-[#17251B]/45" />

        {/* Soft bottom gradient/depth */}
        <View className="absolute inset-x-0 bottom-0 h-32 bg-[#17251B]/55" />

        {/* Subtle image tint */}
        <View className="absolute inset-0 bg-[#304B36]/10" />

        {/* Decorative glow */}
        <View className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/5" />

        <View className="flex-1 justify-between px-5 py-5">
          {/* ───────────────── TOP ───────────────── */}
          <View className="flex-row items-center justify-between">
            {/* Goals label */}
            <View className="flex-row items-center rounded-full border border-white/15 bg-black/10 px-2.5 py-1.5">
              <Ionicons name="flag-outline" size={12} color="#FFFFFF" />

              <Text className="ml-1.5 text-[8px] font-bold uppercase tracking-[1.5px] text-white">
                Goals
              </Text>
            </View>

            {/* Active count */}
            {hasActiveGoals ? (
              <View className="flex-row items-center rounded-full bg-white/15 px-2.5 py-1.5">
                <View className="h-1.5 w-1.5 rounded-full bg-[#B9D7B7]" />

                <Text className="ml-1.5 text-[8px] font-semibold text-white/90">
                  {activeGoals} active {activeGoals === 1 ? "goal" : "goals"}
                </Text>
              </View>
            ) : null}
          </View>

          {/* ───────────────── MAIN CONTENT ───────────────── */}
          <View className="mt-2">
            <Text className="font-serif text-[27px] font-bold leading-[31px] text-white">
              Set your goals
            </Text>

            <Text className="mt-1.5 max-w-[285px] text-[10px] leading-[15px] text-white/80">
              Create goals and keep track of your progress.
            </Text>
          </View>

          {/* ───────────────── BOTTOM CTA ───────────────── */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
                name={
                  hasActiveGoals
                    ? "checkmark-circle-outline"
                    : "add-circle-outline"
                }
                size={13}
                color="#D7E6D4"
              />

              <Text className="ml-1.5 text-[8px] font-medium text-white/75">
                {hasActiveGoals
                  ? "Keep tracking your progress"
                  : "Create your first goal"}
              </Text>
            </View>

            <View className="flex-row items-center rounded-full bg-white px-4 py-2.5">
              <Text className="text-[9px] font-bold text-[#304B36]">
                View goals
              </Text>

              <View className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-[#E9F0E6]">
                <Ionicons name="arrow-forward" size={11} color="#304B36" />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
