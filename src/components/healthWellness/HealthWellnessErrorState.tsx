import React from "react";

import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface HealthWellnessErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function HealthWellnessErrorState({
  message = "We couldn't load the wellness tips.",
  onRetry,
}: HealthWellnessErrorStateProps) {
  return (
    <View className="mx-5 mt-5 items-center rounded-3xl border border-red-100 bg-white px-6 py-8">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
        <Ionicons name="cloud-offline-outline" size={26} color="#dc2626" />
      </View>

      <Text className="mt-4 text-[15px] font-extrabold text-slate-900">
        Unable to load tips
      </Text>

      <Text className="mt-2 max-w-[280px] text-center text-xs leading-5 text-slate-500">
        {message}
      </Text>

      <Pressable
        onPress={onRetry}
        className="mt-5 flex-row items-center rounded-full bg-emerald-600 px-5 py-2.5 active:bg-emerald-700"
      >
        <Ionicons name="refresh" size={14} color="#ffffff" />

        <Text className="ml-2 text-xs font-bold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}
