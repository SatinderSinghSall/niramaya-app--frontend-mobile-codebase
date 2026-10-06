import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { getActiveHealthWellnessTips } from "@/services/healthWellnessTip.service";
import type { HealthWellnessTip } from "@/types/healthWellnessTip";

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCategoryConfig(category: string) {
  const configs: Record<
    string,
    {
      icon: keyof typeof Ionicons.glyphMap;
      iconColor: string;
      iconBg: string;
      labelColor: string;
      accent: string;
    }
  > = {
    nutrition: {
      icon: "nutrition-outline",
      iconColor: "#059669",
      iconBg: "bg-emerald-50",
      labelColor: "text-emerald-700",
      accent: "bg-emerald-500",
    },

    fitness: {
      icon: "fitness-outline",
      iconColor: "#2563EB",
      iconBg: "bg-blue-50",
      labelColor: "text-blue-700",
      accent: "bg-blue-500",
    },

    yoga: {
      icon: "body-outline",
      iconColor: "#7C3AED",
      iconBg: "bg-violet-50",
      labelColor: "text-violet-700",
      accent: "bg-violet-500",
    },

    ayurveda: {
      icon: "leaf-outline",
      iconColor: "#16A34A",
      iconBg: "bg-green-50",
      labelColor: "text-green-700",
      accent: "bg-green-500",
    },

    "mental-wellbeing": {
      icon: "happy-outline",
      iconColor: "#DB2777",
      iconBg: "bg-pink-50",
      labelColor: "text-pink-700",
      accent: "bg-pink-500",
    },

    sleep: {
      icon: "moon-outline",
      iconColor: "#4F46E5",
      iconBg: "bg-indigo-50",
      labelColor: "text-indigo-700",
      accent: "bg-indigo-500",
    },

    "stress-management": {
      icon: "heart-outline",
      iconColor: "#E11D48",
      iconBg: "bg-rose-50",
      labelColor: "text-rose-700",
      accent: "bg-rose-500",
    },

    lifestyle: {
      icon: "sparkles-outline",
      iconColor: "#D97706",
      iconBg: "bg-amber-50",
      labelColor: "text-amber-700",
      accent: "bg-amber-500",
    },

    "preventive-care": {
      icon: "shield-checkmark-outline",
      iconColor: "#0284C7",
      iconBg: "bg-sky-50",
      labelColor: "text-sky-700",
      accent: "bg-sky-500",
    },

    "personal-care": {
      icon: "flower-outline",
      iconColor: "#C026D3",
      iconBg: "bg-fuchsia-50",
      labelColor: "text-fuchsia-700",
      accent: "bg-fuchsia-500",
    },

    "healthy-habits": {
      icon: "checkmark-circle-outline",
      iconColor: "#0891B2",
      iconBg: "bg-cyan-50",
      labelColor: "text-cyan-700",
      accent: "bg-cyan-500",
    },

    "general-wellness": {
      icon: "leaf-outline",
      iconColor: "#059669",
      iconBg: "bg-emerald-50",
      labelColor: "text-emerald-700",
      accent: "bg-emerald-500",
    },
  };

  return configs[category] ?? configs["general-wellness"];
}

export default function HealthWellnessTipsCTA() {
  const router = useRouter();

  const [tips, setTips] = useState<HealthWellnessTip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getActiveHealthWellnessTips({
        limit: 3,
      });

      setTips(data.items ?? []);
    } catch (error) {
      console.error("Failed to fetch health & wellness tips:", error);

      setTips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTips();
    }, [fetchTips]),
  );

  const openWellnessTips = () => {
    router.push("/(main)/health-wellness-tips" as never);
  };

  const openTip = (_tip: HealthWellnessTip) => {
    router.push("/(main)/health-wellness-tips" as never);
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <View className="rounded-[28px] border border-slate-200 bg-white p-5">
        {/* HEADER SKELETON */}
        <View className="mb-5 flex-row items-center">
          <View className="mr-3 h-10 w-10 rounded-xl bg-slate-100" />

          <View className="flex-1">
            <View className="mb-2 h-4 w-36 rounded bg-slate-200" />
            <View className="h-3 w-48 rounded bg-slate-100" />
          </View>
        </View>

        {/* TIP SKELETONS */}
        {[1, 2].map((item) => (
          <View
            key={item}
            className="mb-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-10 w-10 rounded-xl bg-slate-200" />

              <View className="flex-1">
                <View className="mb-2 h-2.5 w-24 rounded bg-slate-200" />

                <View className="mb-2 h-4 w-4/5 rounded bg-slate-200" />

                <View className="h-3 w-full rounded bg-slate-100" />
              </View>

              <View className="ml-2 h-8 w-8 rounded-full bg-slate-100" />
            </View>
          </View>
        ))}
      </View>
    );
  }

  /*
   * ============================================================
   * EMPTY
   * ============================================================
   */

  if (tips.length === 0) {
    return null;
  }

  /*
   * ============================================================
   * MAIN
   * ============================================================
   */

  return (
    <View className="mb-6 mt-6 rounded-[28px] border border-slate-200 bg-white p-5">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          {/* SECTION ICON */}

          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <Ionicons name="leaf-outline" size={19} color="#059669" />
          </View>

          {/* TITLE */}

          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="text-[15px] font-bold tracking-[-0.2px] text-slate-900"
            >
              Health & Wellness
            </Text>

            <Text
              numberOfLines={1}
              className="mt-0.5 text-[11px] font-medium text-slate-500"
            >
              Simple ideas for healthier everyday habits
            </Text>
          </View>
        </View>

        {/* HEADER ACTION */}

        <Pressable
          onPress={openWellnessTips}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="View all health and wellness tips"
          className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-slate-50 active:bg-slate-100"
        >
          <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </Pressable>
      </View>

      {/* ========================================================
          TIPS
      ======================================================== */}

      <View>
        {tips.slice(0, 3).map((tip, index) => {
          const config = getCategoryConfig(tip.category);

          return (
            <Pressable
              key={tip._id}
              onPress={() => openTip(tip)}
              accessibilityRole="button"
              accessibilityLabel={`Open wellness tip: ${tip.title}`}
              className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 active:bg-slate-100 ${
                index !== Math.min(tips.length, 3) - 1 ? "mb-2.5" : ""
              }`}
              style={({ pressed }) => ({
                opacity: pressed ? 0.96 : 1,
              })}
            >
              {/* CATEGORY ACCENT */}

              <View
                className={`absolute bottom-0 left-0 top-0 w-1 ${config.accent}`}
              />

              <View className="flex-row items-center">
                {/* CATEGORY ICON */}

                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-xl ${config.iconBg}`}
                >
                  <Ionicons
                    name={config.icon}
                    size={18}
                    color={config.iconColor}
                  />
                </View>

                {/* CONTENT */}

                <View className="flex-1 pr-2">
                  <View className="mb-1 flex-row items-center">
                    <Text
                      numberOfLines={1}
                      className={`text-[9px] font-extrabold uppercase tracking-[0.6px] ${config.labelColor}`}
                    >
                      {formatCategory(tip.category)}
                    </Text>

                    {tip.readTimeMinutes ? (
                      <>
                        <View className="mx-1.5 h-1 w-1 rounded-full bg-slate-300" />

                        <Ionicons
                          name="time-outline"
                          size={10}
                          color="#94A3B8"
                        />

                        <Text className="ml-1 text-[9px] font-medium text-slate-400">
                          {tip.readTimeMinutes} min
                        </Text>
                      </>
                    ) : null}
                  </View>

                  <Text
                    numberOfLines={2}
                    className="text-[13px] font-bold leading-[18px] text-slate-900"
                  >
                    {tip.title}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="mt-1 text-[10px] leading-[15px] text-slate-500"
                  >
                    {tip.shortDescription}
                  </Text>
                </View>

                {/* ARROW */}

                <View className="ml-1 h-8 w-8 items-center justify-center rounded-full bg-white">
                  <Ionicons name="chevron-forward" size={15} color="#94A3B8" />
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ========================================================
          VIEW ALL CTA
      ======================================================== */}

      <Pressable
        onPress={openWellnessTips}
        accessibilityRole="button"
        accessibilityLabel="View all health and wellness tips"
        className="mt-4 flex-row items-center rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-3 active:bg-emerald-100"
        style={({ pressed }) => ({
          opacity: pressed ? 0.92 : 1,
        })}
      >
        {/* SMALL ICON */}

        <View className="h-9 w-9 items-center justify-center rounded-xl bg-white">
          <Ionicons name="leaf-outline" size={17} color="#059669" />
        </View>

        {/* CTA TEXT */}

        <View className="ml-3 flex-1">
          <Text className="text-[12px] font-bold text-emerald-900">
            View all wellness tips
          </Text>

          <Text
            numberOfLines={1}
            className="mt-0.5 text-[10px] font-medium text-emerald-700"
          >
            More practical health guidance
          </Text>
        </View>

        {/* CHEVRON */}

        <View className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-white">
          <Ionicons name="chevron-forward" size={15} color="#059669" />
        </View>
      </Pressable>
    </View>
  );
}
