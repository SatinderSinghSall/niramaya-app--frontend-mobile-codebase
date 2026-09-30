import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const COLORS = {
  surface: "#FFFFFF",
  primary: "#4D6A50",
  primaryDark: "#304B36",
  primarySoft: "#EAF1E7",
  text: "#263128",
  textSecondary: "#5F6A61",
  border: "#E4E2DA",
};

interface ConsultationCTAProps {
  compact?: boolean;
}

export default function ConsultationCTA({
  compact = false,
}: ConsultationCTAProps) {
  return (
    <Pressable
      onPress={() => router.push("/(main)/consultation" as any)}
      className={`mt-8 overflow-hidden rounded-[22px] border ${
        compact ? "p-4" : "p-5"
      }`}
      style={({ pressed }) => ({
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className={`items-center justify-center rounded-full ${
            compact ? "h-11 w-11" : "h-12 w-12"
          }`}
          style={{ backgroundColor: COLORS.primarySoft }}
        >
          <Ionicons
            name="person-outline"
            size={compact ? 20 : 22}
            color={COLORS.primary}
          />
        </View>

        {/* Content */}
        <View className="ml-3 flex-1 pr-3">
          <View className="flex-row items-center">
            <Text
              className={`font-bold ${compact ? "text-[14px]" : "text-[15px]"}`}
              style={{ color: COLORS.text }}
            >
              Talk to an Ayurvedic Consultant
            </Text>
          </View>

          <Text
            numberOfLines={compact ? 2 : 3}
            className="mt-1 text-[11px] leading-4"
            style={{ color: COLORS.textSecondary }}
          >
            Get personalised guidance for your wellness goals and concerns.
          </Text>

          <View className="mt-2 flex-row items-center">
            <Ionicons
              name="videocam-outline"
              size={12}
              color={COLORS.primary}
            />

            <Text
              className="ml-1 text-[9px] font-medium"
              style={{ color: COLORS.primary }}
            >
              Online
            </Text>

            <View
              className="mx-2 h-1 w-1 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            />

            <Ionicons
              name="location-outline"
              size={12}
              color={COLORS.primary}
            />

            <Text
              className="ml-1 text-[9px] font-medium"
              style={{ color: COLORS.primary }}
            >
              Offline
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
        </View>
      </View>
    </Pressable>
  );
}
