import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const COLORS = {
  surface: "#FFFFFF",
  primary: "#4D6A50",
  primaryDark: "#304B36",
  primarySoft: "#EEF4EC",
  text: "#263128",
  textSecondary: "#687269",
  muted: "#8A938B",
  border: "#E5E8E3",
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
      className={`mt-6 overflow-hidden rounded-[24px] border ${
        compact ? "p-4" : "p-[18px]"
      }`}
      style={({ pressed }) => ({
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        opacity: pressed ? 0.94 : 1,
        transform: [
          {
            scale: pressed ? 0.995 : 1,
          },
        ],
      })}
    >
      {/* TOP CONTENT */}
      <View className="flex-row items-center">
        {/* ICON */}

        <View
          className={`items-center justify-center rounded-2xl ${
            compact ? "h-11 w-11" : "h-12 w-12"
          }`}
          style={{
            backgroundColor: COLORS.primarySoft,
          }}
        >
          <Ionicons
            name="person-outline"
            size={compact ? 20 : 21}
            color={COLORS.primary}
          />
        </View>

        {/* CONTENT */}

        <View className="ml-3 flex-1 pr-3">
          <Text
            numberOfLines={2}
            className={`font-bold tracking-[-0.15px] ${
              compact ? "text-[13px]" : "text-[14px]"
            }`}
            style={{
              color: COLORS.text,
            }}
          >
            Talk to an Ayurvedic Consultant
          </Text>

          <Text
            numberOfLines={compact ? 2 : 2}
            className="mt-1 text-[10px] leading-[15px]"
            style={{
              color: COLORS.textSecondary,
            }}
          >
            Get personalised guidance for your wellness goals and concerns.
          </Text>
        </View>

        {/* CHEVRON */}

        <View
          className={`items-center justify-center rounded-full ${
            compact ? "h-8 w-8" : "h-9 w-9"
          }`}
          style={{
            backgroundColor: COLORS.primary,
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={compact ? 15 : 16}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* SERVICE DETAILS */}

      <View
        className="mt-3 flex-row items-center border-t pt-3"
        style={{
          borderColor: "#F0F1EE",
        }}
      >
        {/* ONLINE */}

        <View className="flex-row items-center">
          <View className="h-6 w-6 items-center justify-center rounded-lg bg-emerald-50">
            <Ionicons
              name="videocam-outline"
              size={12}
              color={COLORS.primary}
            />
          </View>

          <Text
            className="ml-1.5 text-[9px] font-semibold"
            style={{
              color: COLORS.textSecondary,
            }}
          >
            Online
          </Text>
        </View>

        {/* DIVIDER */}

        <View
          className="mx-3 h-3.5 w-px"
          style={{
            backgroundColor: "#E5E7E4",
          }}
        />

        {/* OFFLINE */}

        <View className="flex-row items-center">
          <View className="h-6 w-6 items-center justify-center rounded-lg bg-emerald-50">
            <Ionicons
              name="location-outline"
              size={12}
              color={COLORS.primary}
            />
          </View>

          <Text
            className="ml-1.5 text-[9px] font-semibold"
            style={{
              color: COLORS.textSecondary,
            }}
          >
            In-person
          </Text>
        </View>

        {/* RIGHT LABEL */}

        <View className="ml-auto flex-row items-center">
          <View
            className="mr-1.5 h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: "#6B8F71",
            }}
          />

          <Text
            className="text-[9px] font-medium"
            style={{
              color: COLORS.muted,
            }}
          >
            Personalised care
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
