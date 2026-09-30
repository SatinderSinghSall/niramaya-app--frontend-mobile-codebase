import React from "react";
import { Text, View } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
}

export default function ExploreSectionHeader({ title, subtitle }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </Text>

      {subtitle ? (
        <Text className="mt-1 text-sm text-muted">{subtitle}</Text>
      ) : null}
    </View>
  );
}
