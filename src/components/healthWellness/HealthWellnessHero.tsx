import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { HealthWellnessTip } from "../../types/healthWellnessTip";

interface HealthWellnessHeroProps {
  tip: HealthWellnessTip;
  onPress: () => void;
}

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getImage(tip: HealthWellnessTip) {
  if (tip.image?.enabled && tip.image?.url) {
    return tip.image.url;
  }

  if (tip.thumbnailUrl) {
    return tip.thumbnailUrl;
  }

  return null;
}

export default function HealthWellnessHero({
  tip,
  onPress,
}: HealthWellnessHeroProps) {
  const image = getImage(tip);

  return (
    <Pressable
      onPress={onPress}
      className="mb-6 overflow-hidden rounded-[28px] bg-slate-900"
    >
      <View className="h-[250px]">
        {image ? (
          <Image
            source={{ uri: image }}
            className="absolute inset-0 h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="absolute inset-0 items-center justify-center bg-emerald-800">
            <Ionicons
              name="leaf-outline"
              size={72}
              color="rgba(255,255,255,0.25)"
            />
          </View>
        )}

        {/* Image overlay */}
        <View className="absolute inset-0 bg-black/45" />

        {/* Top badges */}
        <View className="absolute left-4 right-4 top-4 flex-row items-center justify-between">
          <View className="rounded-full bg-white/90 px-3 py-1.5">
            <Text className="text-xs font-bold text-emerald-700">
              {formatCategory(tip.category)}
            </Text>
          </View>

          {tip.featured ? (
            <View className="flex-row items-center rounded-full bg-white/90 px-3 py-1.5">
              <Ionicons name="sparkles" size={13} color="#d97706" />

              <Text className="ml-1 text-xs font-bold text-slate-700">
                Featured
              </Text>
            </View>
          ) : null}
        </View>

        {/* Content */}
        <View className="absolute bottom-0 left-0 right-0 p-5">
          <View className="mb-2 flex-row items-center">
            <View className="flex-row items-center rounded-full bg-white/15 px-2.5 py-1">
              <Ionicons name="time-outline" size={13} color="#ffffff" />

              <Text className="ml-1 text-xs font-medium text-white">
                {tip.readTimeMinutes} min read
              </Text>
            </View>

            <View className="ml-2 rounded-full bg-white/15 px-2.5 py-1">
              <Text className="text-xs font-medium capitalize text-white">
                {tip.difficulty}
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={2}
            className="text-[24px] font-extrabold leading-7 text-white"
          >
            {tip.title}
          </Text>

          <Text
            numberOfLines={2}
            className="mt-2 text-sm leading-5 text-white/85"
          >
            {tip.shortDescription}
          </Text>

          <View className="mt-4 flex-row items-center">
            <Text className="text-sm font-bold text-white">
              Read wellness guide
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color="#ffffff"
              style={{ marginLeft: 6 }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
