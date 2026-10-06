import React, { useState } from "react";

import { Image, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { HealthWellnessTip } from "../../types/healthWellnessTip";

interface HealthWellnessFeaturedCardProps {
  tip: HealthWellnessTip;
  onPress: () => void;
}

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function HealthWellnessFeaturedCard({
  tip,
  onPress,
}: HealthWellnessFeaturedCardProps) {
  const [imageError, setImageError] = useState(false);

  const image =
    tip.image?.enabled && tip.image?.url ? tip.image.url : tip.thumbnailUrl;

  return (
    <Pressable
      onPress={onPress}
      className="mr-3 w-[220px] overflow-hidden rounded-3xl border border-slate-100 bg-white"
      style={({ pressed }) => ({
        opacity: pressed ? 0.94 : 1,
        transform: [
          {
            scale: pressed ? 0.985 : 1,
          },
        ],
      })}
    >
      {/* IMAGE */}

      <View className="h-[125px] w-full overflow-hidden bg-emerald-50">
        {image && !imageError ? (
          <Image
            source={{ uri: image }}
            resizeMode="cover"
            onError={() => setImageError(true)}
            className="h-full w-full"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/80">
              <Ionicons name="leaf-outline" size={25} color="#059669" />
            </View>
          </View>
        )}

        {/* FEATURED */}

        <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-white/90 px-2.5 py-1.5">
          <Ionicons name="sparkles" size={11} color="#059669" />

          <Text className="ml-1 text-[9px] font-bold text-emerald-700">
            Featured
          </Text>
        </View>
      </View>

      {/* CONTENT */}

      <View className="p-3.5">
        <Text
          numberOfLines={1}
          className="text-[9px] font-bold uppercase tracking-[0.8px] text-emerald-600"
        >
          {formatCategory(tip.category)}
        </Text>

        <Text
          numberOfLines={2}
          className="mt-1.5 text-[14px] font-extrabold leading-[18px] text-slate-900"
        >
          {tip.title}
        </Text>

        <View className="mt-3 flex-row items-center">
          <Ionicons name="time-outline" size={12} color="#94a3b8" />

          <Text className="ml-1 text-[10px] font-medium text-slate-400">
            {tip.readTimeMinutes} min
          </Text>

          <View className="mx-2 h-1 w-1 rounded-full bg-slate-300" />

          <Text className="text-[10px] font-medium capitalize text-slate-400">
            {tip.difficulty}
          </Text>

          <View className="flex-1" />

          <View className="h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
            <Ionicons name="arrow-forward" size={13} color="#059669" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
