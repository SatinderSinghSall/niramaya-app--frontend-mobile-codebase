import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HealthWellnessTipCategory } from "../../types/healthWellnessTip";

interface HealthWellnessCategoryChipProps {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}

export default function HealthWellnessCategoryChip({
  label,
  icon,
  selected,
  onPress,
}: HealthWellnessCategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 flex-row items-center rounded-full border px-4 py-2.5 ${
        selected
          ? "border-emerald-600 bg-emerald-600"
          : "border-slate-200 bg-white"
      }`}
    >
      <Ionicons
        name={icon}
        size={16}
        color={selected ? "#ffffff" : "#64748b"}
      />

      <Text
        className={`ml-2 text-sm font-semibold ${
          selected ? "text-white" : "text-slate-600"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
