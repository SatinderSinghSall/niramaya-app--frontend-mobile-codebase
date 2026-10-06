import React, { useEffect, useState } from "react";

import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import type { HealthWellnessTip } from "../../types/healthWellnessTip";

interface HealthWellnessDetailSheetProps {
  tip: HealthWellnessTip | null;
  visible: boolean;
  onClose: () => void;
}

function formatCategory(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatType(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDifficultyLabel(difficulty: HealthWellnessTip["difficulty"]) {
  switch (difficulty) {
    case "beginner":
      return "Beginner";

    case "intermediate":
      return "Intermediate";

    case "advanced":
      return "Advanced";

    default:
      return difficulty;
  }
}

function getDifficultyIcon(
  difficulty: HealthWellnessTip["difficulty"],
): keyof typeof Ionicons.glyphMap {
  switch (difficulty) {
    case "advanced":
      return "flame-outline";

    case "intermediate":
      return "speedometer-outline";

    default:
      return "leaf-outline";
  }
}

export default function HealthWellnessDetailSheet({
  tip,
  visible,
  onClose,
}: HealthWellnessDetailSheetProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [tip?._id]);

  if (!tip) {
    return null;
  }

  const image =
    tip.image?.enabled && tip.image?.url ? tip.image.url : tip.thumbnailUrl;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* BACKDROP */}

      <View className="flex-1 bg-black/40">
        {/* SHEET */}

        <View className="mt-10 flex-1 overflow-hidden rounded-t-[30px] bg-slate-50">
          <SafeAreaView edges={["top", "bottom"]} className="flex-1">
            {/* =====================================================
                SHEET HEADER
            ====================================================== */}

            <View className="border-b border-slate-100 bg-white px-5 pb-3 pt-2">
              {/* DRAG HANDLE */}

              <View className="mb-3 items-center">
                <View className="h-1.5 w-10 rounded-full bg-slate-200" />
              </View>

              <View className="flex-row items-center">
                {/* CLOSE */}

                <Pressable
                  onPress={onClose}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Close wellness tip"
                  className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 active:bg-slate-100"
                >
                  <Ionicons name="chevron-down" size={20} color="#334155" />
                </Pressable>

                {/* TITLE */}

                <View className="min-w-0 flex-1 px-3">
                  <Text
                    numberOfLines={1}
                    className="text-center text-[15px] font-extrabold text-slate-900"
                  >
                    Wellness Tip
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="mt-0.5 text-center text-[9px] font-medium text-slate-400"
                  >
                    Niramaya Health & Wellness
                  </Text>
                </View>

                {/* BRAND ICON */}

                <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Ionicons name="leaf" size={18} color="#059669" />
                </View>
              </View>
            </View>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 42,
              }}
            >
              {/* =================================================
                  HERO
              ================================================= */}

              <View className="mx-4 mt-4 overflow-hidden rounded-[26px] bg-emerald-50">
                {image && !imageError ? (
                  <View className="h-[230px] w-full">
                    <Image
                      source={{ uri: image }}
                      resizeMode="cover"
                      onError={() => setImageError(true)}
                      className="h-full w-full"
                    />

                    {/* IMAGE OVERLAY */}

                    <View className="absolute inset-x-0 bottom-0 h-28 bg-black/25" />

                    {/* FEATURED */}

                    {tip.featured ? (
                      <View className="absolute left-4 top-4 flex-row items-center rounded-full bg-white/95 px-3 py-2">
                        <Ionicons name="sparkles" size={12} color="#d97706" />

                        <Text className="ml-1.5 text-[9px] font-extrabold text-amber-700">
                          Featured
                        </Text>
                      </View>
                    ) : null}

                    {/* IMAGE CREDIT */}

                    {tip.image?.credit ? (
                      <View className="absolute bottom-3 left-4 right-4">
                        <Text
                          numberOfLines={1}
                          className="text-[8px] font-medium text-white/80"
                        >
                          Photo: {tip.image.credit}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <View className="h-[190px] items-center justify-center">
                    <View className="h-20 w-20 items-center justify-center rounded-[24px] bg-white/80">
                      <Ionicons name="leaf-outline" size={42} color="#059669" />
                    </View>
                  </View>
                )}
              </View>

              {/* =================================================
                  MAIN INFORMATION
              ================================================= */}

              <View className="px-5">
                {/* CATEGORY / TYPE */}

                <View className="mt-5 flex-row flex-wrap items-center">
                  <View className="mb-2 rounded-full bg-emerald-50 px-3 py-1.5">
                    <Text className="text-[9px] font-extrabold uppercase tracking-[0.7px] text-emerald-700">
                      {formatCategory(tip.category)}
                    </Text>
                  </View>

                  <View className="mb-2 ml-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <Text className="text-[9px] font-bold text-slate-600">
                      {formatType(tip.type)}
                    </Text>
                  </View>

                  {tip.reviewed ? (
                    <View className="mb-2 ml-2 flex-row items-center rounded-full bg-blue-50 px-3 py-1.5">
                      <Ionicons
                        name="shield-checkmark"
                        size={10}
                        color="#2563eb"
                      />

                      <Text className="ml-1 text-[9px] font-bold text-blue-700">
                        Reviewed
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* TITLE */}

                <Text className="mt-1 text-[26px] font-extrabold leading-[32px] text-slate-950">
                  {tip.title}
                </Text>

                {/* DESCRIPTION */}

                <Text className="mt-3 text-[14px] leading-[22px] text-slate-500">
                  {tip.shortDescription}
                </Text>

                {/* =================================================
                    META CARD
                ================================================= */}

                <View className="mt-5 flex-row overflow-hidden rounded-2xl border border-slate-100 bg-white">
                  {/* TIME */}

                  <View className="flex-1 border-r border-slate-100 px-3.5 py-3">
                    <View className="flex-row items-center">
                      <View className="h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#059669"
                        />
                      </View>

                      <View className="ml-2">
                        <Text className="text-[9px] font-medium text-slate-400">
                          Reading
                        </Text>

                        <Text className="mt-0.5 text-[11px] font-bold text-slate-700">
                          {tip.readTimeMinutes} min
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* DIFFICULTY */}

                  <View className="flex-1 px-3.5 py-3">
                    <View className="flex-row items-center">
                      <View className="h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                        <Ionicons
                          name={getDifficultyIcon(tip.difficulty)}
                          size={16}
                          color="#2563eb"
                        />
                      </View>

                      <View className="ml-2 flex-1">
                        <Text className="text-[9px] font-medium text-slate-400">
                          Level
                        </Text>

                        <Text
                          numberOfLines={1}
                          className="mt-0.5 text-[11px] font-bold text-slate-700"
                        >
                          {getDifficultyLabel(tip.difficulty)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* =================================================
                    WHAT IS THIS?
                ================================================= */}

                <View className="mt-8">
                  <SectionTitle
                    icon="information-circle-outline"
                    title="What is this?"
                  />

                  <View className="mt-3 rounded-2xl bg-white p-4">
                    <Text className="text-[14px] leading-[23px] text-slate-600">
                      {tip.content}
                    </Text>
                  </View>
                </View>

                {/* =================================================
                    KEY POINTS
                ================================================= */}

                {tip.highlights?.length > 0 ? (
                  <View className="mt-8">
                    <SectionTitle
                      icon="checkmark-circle-outline"
                      title="Key points"
                    />

                    <View className="mt-3">
                      {tip.highlights.map((highlight, index) => (
                        <View
                          key={`${tip._id}-highlight-${index}`}
                          className="mb-2.5 flex-row rounded-2xl bg-white p-3.5"
                        >
                          <View className="h-7 w-7 items-center justify-center rounded-xl bg-emerald-50">
                            <Text className="text-[10px] font-extrabold text-emerald-600">
                              {index + 1}
                            </Text>
                          </View>

                          <Text className="ml-3 flex-1 pt-0.5 text-[13px] leading-[20px] text-slate-600">
                            {highlight}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                {/* =================================================
                    SAFETY NOTE
                ================================================= */}

                {tip.safetyNote ? (
                  <View className="mt-6 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <View className="flex-row items-center">
                      <View className="h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                        <Ionicons
                          name="warning-outline"
                          size={18}
                          color="#b45309"
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[13px] font-extrabold text-amber-900">
                          Safety note
                        </Text>

                        <Text className="mt-0.5 text-[9px] font-medium text-amber-700">
                          Please read before trying
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-3 text-[12px] leading-[19px] text-amber-800">
                      {tip.safetyNote}
                    </Text>
                  </View>
                ) : null}

                {/* =================================================
                    REVIEWED BY
                ================================================= */}

                {tip.reviewed ? (
                  <View className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <View className="flex-row">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={20}
                          color="#059669"
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[13px] font-extrabold text-emerald-900">
                          Reviewed content
                        </Text>

                        {tip.reviewedBy?.name ? (
                          <Text className="mt-1 text-[11px] font-semibold text-emerald-700">
                            {tip.reviewedBy.name}
                          </Text>
                        ) : null}

                        {tip.reviewedBy?.qualification ? (
                          <Text className="mt-1 text-[10px] leading-4 text-emerald-700">
                            {tip.reviewedBy.qualification}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    {tip.reviewedBy?.reviewedAt ? (
                      <View className="mt-3 flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={12}
                          color="#059669"
                        />

                        <Text className="ml-1.5 text-[9px] font-medium text-emerald-700">
                          Reviewed {formatDate(tip.reviewedBy.reviewedAt)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* =================================================
                    TOPICS
                ================================================= */}

                {tip.tags?.length > 0 ? (
                  <View className="mt-8">
                    <SectionTitle icon="pricetags-outline" title="Topics" />

                    <View className="mt-3 flex-row flex-wrap">
                      {tip.tags.map((tag) => (
                        <View
                          key={tag}
                          className="mb-2 mr-2 rounded-full border border-slate-200 bg-white px-3 py-2"
                        >
                          <Text className="text-[10px] font-semibold text-slate-600">
                            #{tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                {/* =================================================
                    SOURCE
                ================================================= */}

                {tip.source?.name ? (
                  <View className="mt-7 rounded-2xl bg-white p-4">
                    <View className="flex-row items-center">
                      <View className="h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                        <Ionicons
                          name="library-outline"
                          size={17}
                          color="#64748b"
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Source
                        </Text>

                        <Text className="mt-1 text-[12px] font-semibold text-slate-700">
                          {tip.source.name}
                        </Text>
                      </View>
                    </View>

                    {tip.source.accessedAt ? (
                      <Text className="mt-3 text-[9px] text-slate-400">
                        Accessed {formatDate(tip.source.accessedAt)}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                {/* =================================================
                    REFERENCES
                ================================================= */}

                {tip.references?.length > 0 ? (
                  <View className="mt-8">
                    <SectionTitle icon="book-outline" title="References" />

                    <View className="mt-3">
                      {tip.references.map((reference, index) => (
                        <View
                          key={`${tip._id}-reference-${index}`}
                          className="mb-2.5 rounded-2xl border border-slate-100 bg-white p-3.5"
                        >
                          <View className="flex-row">
                            <View className="h-7 w-7 items-center justify-center rounded-lg bg-slate-50">
                              <Text className="text-[9px] font-bold text-slate-500">
                                {index + 1}
                              </Text>
                            </View>

                            <View className="ml-3 flex-1">
                              <Text className="text-[12px] font-semibold leading-[18px] text-slate-700">
                                {reference.title}
                              </Text>

                              {reference.source ? (
                                <Text className="mt-1 text-[10px] text-slate-400">
                                  {reference.source}
                                </Text>
                              ) : null}

                              {reference.publishedDate ? (
                                <Text className="mt-1 text-[9px] text-slate-400">
                                  Published{" "}
                                  {formatDate(reference.publishedDate)}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                {/* =================================================
                    DISCLAIMER
                ================================================= */}

                {tip.disclaimer ? (
                  <View className="mt-7 rounded-2xl bg-slate-100 p-4">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="information-circle-outline"
                        size={15}
                        color="#64748b"
                      />

                      <Text className="ml-2 text-[9px] font-extrabold uppercase tracking-[0.7px] text-slate-500">
                        Wellness disclaimer
                      </Text>
                    </View>

                    <Text className="mt-2 text-[10px] leading-[17px] text-slate-500">
                      {tip.disclaimer}
                    </Text>
                  </View>
                ) : null}

                {/* =================================================
                    ACTION
                ================================================= */}

                {tip.action?.enabled && tip.action?.label ? (
                  <Pressable
                    className="mt-7 min-h-[52px] flex-row items-center justify-center rounded-2xl bg-emerald-600 px-5 active:bg-emerald-700"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Text className="text-[13px] font-extrabold text-white">
                      {tip.action.label}
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color="#ffffff"
                      style={{
                        marginLeft: 8,
                      }}
                    />
                  </Pressable>
                ) : null}

                {/* BOTTOM BRAND */}

                <View className="mt-8 items-center">
                  <View className="flex-row items-center">
                    <View className="h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                      <Ionicons name="leaf" size={14} color="#059669" />
                    </View>

                    <Text className="ml-2 text-[10px] font-bold text-slate-400">
                      Niramaya Health & Wellness
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

/* ================================================================
   SECTION TITLE
================================================================ */

interface SectionTitleProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <View className="flex-row items-center">
      <View className="h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
        <Ionicons name={icon} size={16} color="#059669" />
      </View>

      <Text className="ml-2.5 text-[17px] font-extrabold text-slate-900">
        {title}
      </Text>
    </View>
  );
}
