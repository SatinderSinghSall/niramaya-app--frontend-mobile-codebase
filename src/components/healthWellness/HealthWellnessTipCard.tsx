import React, { useState } from "react";

import { Image, Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { HealthWellnessTip } from "../../types/healthWellnessTip";

interface HealthWellnessTipCardProps {
  tip: HealthWellnessTip;
  onPress: () => void;
}

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function HealthWellnessTipCard({
  tip,
  onPress,
}: HealthWellnessTipCardProps) {
  const [imageError, setImageError] = useState(false);

  const image =
    tip.image?.enabled && tip.image?.url ? tip.image.url : tip.thumbnailUrl;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3.5 overflow-hidden rounded-[22px] border border-slate-100 bg-white"
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [
          {
            scale: pressed ? 0.99 : 1,
          },
        ],
      })}
    >
      <View className="flex-row p-3">
        {/* IMAGE */}

        <View className="h-[104px] w-[104px] overflow-hidden rounded-[18px] bg-emerald-50">
          {image && !imageError ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              onError={() => setImageError(true)}
              className="h-full w-full"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="leaf-outline" size={27} color="#059669" />
            </View>
          )}
        </View>

        {/* CONTENT */}

        <View className="ml-3 flex-1 justify-between py-0.5">
          <View>
            <View className="flex-row items-center">
              <View className="rounded-full bg-emerald-50 px-2.5 py-1">
                <Text className="text-[8px] font-extrabold uppercase tracking-[0.7px] text-emerald-700">
                  {formatCategory(tip.category)}
                </Text>
              </View>

              {tip.featured ? (
                <View className="ml-1.5 h-5 w-5 items-center justify-center rounded-full bg-amber-50">
                  <Ionicons name="sparkles" size={10} color="#d97706" />
                </View>
              ) : null}
            </View>

            <Text
              numberOfLines={2}
              className="mt-2 text-[14px] font-extrabold leading-[18px] text-slate-900"
            >
              {tip.title}
            </Text>

            <Text
              numberOfLines={2}
              className="mt-1 text-[10px] leading-4 text-slate-500"
            >
              {tip.shortDescription}
            </Text>
          </View>

          {/* META */}

          <View className="mt-2 flex-row items-center">
            <Ionicons name="time-outline" size={11} color="#94a3b8" />

            <Text className="ml-1 text-[9px] font-medium text-slate-400">
              {tip.readTimeMinutes} min read
            </Text>

            <View className="mx-2 h-1 w-1 rounded-full bg-slate-300" />

            <Text className="text-[9px] font-medium capitalize text-slate-400">
              {tip.difficulty}
            </Text>

            <View className="flex-1" />

            <View className="h-7 w-7 items-center justify-center rounded-full bg-slate-50">
              <Ionicons name="chevron-forward" size={13} color="#64748b" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
