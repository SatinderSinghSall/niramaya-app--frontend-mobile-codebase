import React from "react";
import { Text, View } from "react-native";

interface Props {
  title: string;
  description: string;
}

export default function ExploreEmptyState({ title, description }: Props) {
  return (
    <View className="items-center rounded-[26px] border border-border bg-white px-6 py-8">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
        <Text className="text-2xl">🌿</Text>
      </View>

      <Text className="mt-4 text-lg font-bold text-foreground">{title}</Text>

      <Text className="mt-2 text-center text-sm leading-5 text-muted">
        {description}
      </Text>
    </View>
  );
}
