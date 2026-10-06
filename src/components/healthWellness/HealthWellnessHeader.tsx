import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HealthWellnessHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBackground?: string;
}

export default function HealthWellnessHeader({
  title,
  subtitle,
  onBack,
  icon = "heart",
  iconColor = "#059669",
  iconBackground = "#ecfdf5",
}: HealthWellnessHeaderProps) {
  return (
    <View className="border-b border-slate-100 bg-white px-5 pb-4 pt-2">
      <View className="flex-row items-center">
        {/* BACK */}

        <Pressable
          onPress={onBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 active:bg-slate-100"
        >
          <Ionicons name="arrow-back" size={20} color="#0f172a" />
        </Pressable>

        {/* TITLE */}

        <View className="min-w-0 flex-1 px-3">
          <Text
            numberOfLines={1}
            className="text-center text-[17px] font-extrabold tracking-tight text-slate-950"
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              numberOfLines={1}
              className="mt-0.5 text-center text-[10px] font-medium text-slate-400"
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* ICON */}

        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{
            backgroundColor: iconBackground,
          }}
        >
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
      </View>
    </View>
  );
}
