import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HealthWellnessEmptyStateProps {
  onReset?: () => void;
}

export default function HealthWellnessEmptyState({
  onReset,
}: HealthWellnessEmptyStateProps) {
  return (
    <View className="items-center rounded-3xl border border-slate-100 bg-white px-6 py-12">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <Ionicons name="leaf-outline" size={30} color="#10b981" />
      </View>

      <Text className="text-center text-lg font-bold text-slate-900">
        No wellness tips found
      </Text>

      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
        Try another search or explore a different wellness category.
      </Text>

      {onReset ? (
        <Pressable
          onPress={onReset}
          className="mt-5 rounded-full bg-emerald-600 px-5 py-3"
        >
          <Text className="text-sm font-bold text-white">Explore all tips</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
