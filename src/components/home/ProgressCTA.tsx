import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  green: "#496B50",
  darkGreen: "#304B36",
  softGreen: "#EDF4ED",
  surface: "#FCFDFB",
  text: "#26372B",
  secondary: "#737F75",
  muted: "#929C93",
  border: "#E1E9E0",
  divider: "#EDF1EC",
  accent: "#B69A67",
  turquoise: "#28A5AC",
  white: "#FFFFFF",
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
      activeOpacity={0.94}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        hasProgressToday
          ? "Review your wellbeing today"
          : "Start your daily wellness check-in"
      }
      accessibilityHint="Opens your daily wellness progress"
      className="mt-4 overflow-hidden rounded-[24px] border"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        shadowColor: COLORS.darkGreen,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.07,
        shadowRadius: 13,
        elevation: 3,
      }}
    >
      {/* TOP ACCENT */}
      <View className="h-[3px] flex-row">
        <View
          className="h-full flex-1"
          style={{ backgroundColor: COLORS.green }}
        />
        <View
          className="h-full w-12"
          style={{ backgroundColor: COLORS.accent }}
        />
      </View>

      <View className="p-[17px]">
        {/* EYEBROW LABEL */}
        <View className="mb-3 flex-row items-center">
          <View
            className="mr-2 h-[3px] w-5 rounded-full"
            style={{ backgroundColor: COLORS.accent }}
          />

          <Text
            className="text-[9px] font-bold tracking-[1.5px]"
            style={{ color: COLORS.green }}
          >
            DAILY WELLNESS CHECK-IN
          </Text>

          {hasProgressToday && (
            <View
              className="ml-auto flex-row items-center rounded-full px-2.5 py-1"
              style={{ backgroundColor: COLORS.softGreen }}
            >
              <Ionicons
                name="checkmark-circle"
                size={11}
                color={COLORS.green}
              />
              <Text
                className="ml-1 text-[8px] font-bold tracking-[0.5px]"
                style={{ color: COLORS.green }}
              >
                COMPLETED TODAY
              </Text>
            </View>
          )}
        </View>

        {/* MAIN CONTENT */}
        <View className="flex-row items-center">
          {/* WELLNESS ICON */}
          <View
            className="h-[54px] w-[54px] items-center justify-center rounded-[18px]"
            style={{
              backgroundColor: COLORS.softGreen,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons
              name={
                hasProgressToday
                  ? "checkmark-done-circle-outline"
                  : "leaf-outline"
              }
              size={25}
              color={COLORS.green}
            />

            {hasProgressToday && (
              <View
                className="absolute bottom-[-3px] right-[-3px] h-[14px] w-[14px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: COLORS.green,
                  borderWidth: 2,
                  borderColor: COLORS.surface,
                }}
              >
                <Ionicons name="checkmark" size={8} color={COLORS.white} />
              </View>
            )}
          </View>

          {/* TEXT CONTENT */}
          <View className="ml-3.5 flex-1 pr-2">
            <Text
              numberOfLines={2}
              className="font-serif text-[15px] font-bold tracking-[-0.3px]"
              style={{ color: COLORS.text }}
            >
              {hasProgressToday
                ? "Your wellbeing today"
                : "How are you feeling today?"}
            </Text>

            <Text
              numberOfLines={2}
              className="mt-1 text-[10px] leading-[16px]"
              style={{ color: COLORS.secondary }}
            >
              {hasProgressToday
                ? "Take a look at your daily wellness and celebrate your progress."
                : "Pause, reflect and check in with your mood, energy, sleep and habits."}
            </Text>
          </View>

          {/* ARROW */}
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.green }}
          >
            <Ionicons name="arrow-forward" size={17} color={COLORS.white} />
          </View>
        </View>

        {/* DIVIDER */}
        <View
          className="my-4 h-px"
          style={{ backgroundColor: COLORS.divider }}
        />

        {/* BOTTOM MESSAGE */}
        <View className="flex-row items-center">
          <View
            className="h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: "#F1F5F1" }}
          >
            <Ionicons
              name={hasProgressToday ? "calendar-outline" : "time-outline"}
              size={13}
              color={COLORS.turquoise}
            />
          </View>

          <Text
            numberOfLines={2}
            className="ml-2 flex-1 text-[9px] leading-[14px]"
            style={{ color: COLORS.secondary }}
          >
            {hasProgressToday
              ? "Your daily check-in is ready to review"
              : "A mindful moment today can make a difference"}
          </Text>

          <View className="ml-2 flex-row items-center">
            <Text
              className="mr-1 text-[9px] font-semibold"
              style={{ color: COLORS.green }}
            >
              {hasProgressToday ? "Review" : "Check in"}
            </Text>

            <Ionicons name="chevron-forward" size={12} color={COLORS.green} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
