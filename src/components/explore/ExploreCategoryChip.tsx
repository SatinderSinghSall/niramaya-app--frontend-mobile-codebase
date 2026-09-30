import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export default function ExploreCategoryChip({
  label,
  selected = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`mr-2 rounded-full px-4 py-2.5 ${
        selected ? "bg-primary-700" : "bg-white"
      }`}
    >
      <Text
        className={`text-xs font-bold ${
          selected ? "text-white" : "text-muted"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
