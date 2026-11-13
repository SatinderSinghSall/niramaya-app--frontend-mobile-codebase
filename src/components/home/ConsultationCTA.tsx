import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const COLORS = {
  surface: "#FCFDFB",
  primary: "#496B50",
  primaryDark: "#304B36",
  primarySoft: "#EDF4ED",
  text: "#26372B",
  textSecondary: "#737F75",
  muted: "#929C93",
  border: "#E1E9E0",
  divider: "#EDF1EC",
  accent: "#B69A67",
  white: "#FFFFFF",
};

interface ConsultationCTAProps {
  compact?: boolean;
}

export default function ConsultationCTA({
  compact = false,
}: ConsultationCTAProps) {
  const handlePress = () => {
    router.push("/(main)/consultation" as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Talk to an Ayurvedic Consultant"
      accessibilityHint="Opens the Ayurvedic consultation booking screen"
      className={`mt-6 overflow-hidden rounded-[26px] border ${
        compact ? "p-4" : "p-[18px]"
      }`}
      style={({ pressed }) => ({
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        opacity: pressed ? 0.96 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
        shadowColor: "#304B36",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: pressed ? 0.04 : 0.07,
        shadowRadius: 14,
        elevation: pressed ? 2 : 3,
      })}
    >
      {/* PREMIUM TOP LABEL */}
      <View className="mb-3 flex-row items-center">
        <View
          className="mr-2 h-[3px] w-5 rounded-full"
          style={{ backgroundColor: COLORS.accent }}
        />

        <Text
          className="text-[9px] font-bold tracking-[1.5px]"
          style={{ color: COLORS.primary }}
        >
          PERSONALISED AYURVEDIC CARE
        </Text>

        <View
          className="ml-auto flex-row items-center rounded-full px-2 py-1"
          style={{ backgroundColor: COLORS.primarySoft }}
        >
          <Text
            className="ml-1 text-[8px] font-semibold"
            style={{ color: COLORS.primary }}
          >
            EXPERT GUIDANCE
          </Text>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <View className="flex-row items-center">
        {/* CONSULTANT ICON */}
        <View
          className={`items-center justify-center rounded-[18px] ${
            compact ? "h-12 w-12" : "h-[54px] w-[54px]"
          }`}
          style={{
            backgroundColor: COLORS.primarySoft,
            borderWidth: 1,
            borderColor: "#E2EBE1",
          }}
        >
          <Ionicons
            name="person-outline"
            size={compact ? 21 : 24}
            color={COLORS.primary}
          />
          <View
            className="absolute bottom-[-3px] right-[-3px] h-[13px] w-[13px] items-center justify-center rounded-full"
            style={{
              backgroundColor: COLORS.primary,
              borderWidth: 2,
              borderColor: COLORS.surface,
            }}
          >
            <Ionicons name="checkmark" size={8} color={COLORS.white} />
          </View>
        </View>

        {/* TITLE AND DESCRIPTION */}
        <View className="ml-3.5 flex-1 pr-2">
          <Text
            numberOfLines={2}
            className={`font-bold tracking-[-0.35px] ${
              compact ? "text-[13px]" : "text-[15px]"
            }`}
            style={{ color: COLORS.text }}
          >
            Talk to an Ayurvedic Consultant
          </Text>

          <Text
            numberOfLines={2}
            className="mt-1 text-[10px] leading-[16px]"
            style={{ color: COLORS.textSecondary }}
          >
            Get expert guidance tailored to your wellness goals and concerns.
          </Text>
        </View>

        {/* ARROW ACTION */}
        <View
          className={`items-center justify-center rounded-full ${
            compact ? "h-9 w-9" : "h-10 w-10"
          }`}
          style={{ backgroundColor: COLORS.primary }}
        >
          <Ionicons
            name="arrow-forward"
            size={compact ? 16 : 18}
            color={COLORS.white}
          />
        </View>
      </View>

      {/* DIVIDER */}
      <View
        className="my-4 h-px w-full"
        style={{ backgroundColor: COLORS.divider }}
      />

      {/* SERVICE OPTIONS */}
      <View className="flex-row items-center">
        {/* ONLINE */}
        <View className="flex-row items-center">
          <View
            className="h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.primarySoft }}
          >
            <Ionicons
              name="videocam-outline"
              size={13}
              color={COLORS.primary}
            />
          </View>

          <Text
            className="ml-1.5 text-[9px] font-semibold"
            style={{ color: COLORS.textSecondary }}
          >
            Online
          </Text>
        </View>

        {/* SEPARATOR */}
        <View
          className="mx-3 h-4 w-px"
          style={{ backgroundColor: COLORS.border }}
        />

        {/* IN-PERSON */}
        <View className="flex-row items-center">
          <View
            className="h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.primarySoft }}
          >
            <Ionicons
              name="location-outline"
              size={13}
              color={COLORS.primary}
            />
          </View>

          <Text
            className="ml-1.5 text-[9px] font-semibold"
            style={{ color: COLORS.textSecondary }}
          >
            In-person
          </Text>
        </View>

        {/* PERSONAL CARE INDICATOR */}
        <View className="ml-auto flex-row items-center">
          <View
            className="mr-1.5 h-[7px] w-[7px] rounded-full"
            style={{ backgroundColor: "#79A47D" }}
          />

          <Text
            numberOfLines={1}
            className="text-[9px] font-medium"
            style={{ color: COLORS.muted }}
          >
            Personalised care
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
