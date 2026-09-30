import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  green: "#4D6A50",
  darkGreen: "#304B36",
  turquoise: "#28A5AC",
  softGreen: "#EAF2E8",
  border: "#DCE5D9",
};

type ProgressCTAProps = {
  hasProgressToday?: boolean;
};

export default function ProgressCTA({
  hasProgressToday = false,
}: ProgressCTAProps) {
  const handlePress = () => {
    router.push("/(main)/progress" as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className="mt-4 overflow-hidden rounded-[7px] bg-white"
    >
      <View className="border border-[#DCE5D9]">
        {/* Top accent */}
        <View className="h-[3px] bg-[#4D6A50]" />

        <View className="flex-row items-center px-3.5 py-3.5">
          {/* Icon */}
          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#EAF2E8]">
            <Ionicons
              name={
                hasProgressToday ? "checkmark-circle-outline" : "leaf-outline"
              }
              size={21}
              color={COLORS.green}
            />
          </View>

          {/* Text */}
          <View className="ml-3 flex-1 pr-2">
            <View className="flex-row items-center">
              <Text className="font-serif text-[14px] font-bold text-foreground">
                {hasProgressToday
                  ? "Your wellbeing today"
                  : "How are you feeling today?"}
              </Text>

              {hasProgressToday ? (
                <View className="ml-2 rounded-full bg-[#EAF2E8] px-1.5 py-0.5">
                  <Text className="text-[7px] font-bold text-[#4D6A50]">
                    LOGGED
                  </Text>
                </View>
              ) : null}
            </View>

            <Text
              numberOfLines={2}
              className="mt-1 text-[9px] leading-[14px] text-muted"
            >
              {hasProgressToday
                ? "Review your daily wellness and keep your journey going."
                : "Take a quiet moment to reflect on your mood, energy, sleep and habits."}
            </Text>
          </View>

          {/* Arrow button */}
          <View className="h-9 w-9 items-center justify-center rounded-full bg-[#4D6A50]">
            <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
          </View>
        </View>

        {/* Bottom hint */}
        <View className="flex-row items-center border-t border-[#EEF1EC] px-3.5 py-2">
          <Ionicons name="time-outline" size={11} color={COLORS.turquoise} />

          <Text className="ml-1.5 text-[8px] text-[#7B8179]">
            {hasProgressToday
              ? "Your daily check-in is ready to review"
              : "A small check-in can help you understand your day"}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={10}
            color="#A0A59F"
            style={{ marginLeft: "auto" }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
