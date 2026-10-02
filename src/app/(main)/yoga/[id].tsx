import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import {
  getYogaRecommendation,
  incrementYogaViewCount,
} from "@/services/explore.service";

import { ExploreItem } from "@/types/explore";

import { API_BASE_URL } from "@/services/api";

function getYogaImageUrl(value?: string | null) {
  if (!value) return "";

  const url = String(value).trim();

  if (!url) return "";

  if (url.includes("commons.wikimedia.org/wiki/Special:FilePath/")) {
    return `${API_BASE_URL}/yoga/image?url=${encodeURIComponent(url)}`;
  }

  return url;
}

/* =========================================================
   DESIGN TOKENS
========================================================= */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",

  text: "#273128",
  muted: "#747A72",
  softMuted: "#9A9E97",

  green: "#4D6A50",
  darkGreen: "#31543B",

  greenSoft: "#E8F0E5",
  greenPale: "#F0F5ED",

  beige: "#EFE7D8",
  beigeSoft: "#F5F0E5",

  border: "#E5E0D6",

  warning: "#9A604B",
  warningSoft: "#F7E9E2",

  amber: "#8A7048",
  amberSoft: "#F5EFE1",
};

/* =========================================================
   TYPES
========================================================= */

type RecommendedFor = {
  energyLevels?: string[];
  stressLevels?: string[];
  sleepQualities?: string[];
  activityLevels?: string[];
  yogaExperience?: string[];
  concerns?: string[];
  goalCategories?: string[];
};

type YogaDetailData = ExploreItem & {
  title?: string;
  name?: string;
  slug?: string;

  description?: string;

  imageUrl?: string;
  image?: string;
  thumbnailUrl?: string;

  videoUrl?: string;

  type?: string;
  category?: string;
  difficulty?: string;

  durationMinutes?: number;
  duration?: number | string;

  equipment?: string[];
  bodyFocus?: string[];
  tags?: string[];

  benefits?: string[];
  instructions?: string[];
  precautions?: string[];
  contraindications?: string[];

  suitableFor?: string[];

  recommendedFor?: RecommendedFor;

  isActive?: boolean;
  isFeatured?: boolean;

  viewCount?: number;

  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function formatLabel(value?: string) {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function cleanList(values?: string[]) {
  if (!Array.isArray(values)) return [];

  return Array.from(
    new Set(
      values
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  );
}

function formatList(values?: string[]) {
  return cleanList(values).map(formatLabel);
}

function getDuration(item: YogaDetailData) {
  const value = item.durationMinutes ?? item.duration;

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    Number.isNaN(Number(value))
  ) {
    return null;
  }

  return `${Number(value)} min`;
}

function getTypeLabel(type?: string) {
  const labels: Record<string, string> = {
    pose: "Yoga Pose",
    practice: "Yoga Practice",
    routine: "Yoga Routine",
    breathing: "Breathing",
    meditation: "Meditation",
    knowledge: "Yoga Knowledge",
  };

  return labels[type || ""] || formatLabel(type) || "Yoga Practice";
}

function getCategoryLabel(category?: string) {
  return formatLabel(category) || "General Wellness";
}

function getDifficultyStyle(difficulty?: string) {
  switch (difficulty) {
    case "beginner":
      return {
        background: "#E8F0E5",
        text: "#4D6A50",
      };

    case "intermediate":
      return {
        background: "#F4EEDD",
        text: "#806B47",
      };

    case "advanced":
      return {
        background: "#F6E6DF",
        text: "#985C48",
      };

    default:
      return {
        background: "#F0EEE8",
        text: "#70756E",
      };
  }
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-4 mt-9">
      {eyebrow ? (
        <Text className="mb-1 text-[9px] font-bold uppercase tracking-[1.8px] text-[#8D948A]">
          {eyebrow}
        </Text>
      ) : null}

      <Text className="text-[20px] font-bold tracking-[-0.2px] text-[#273128]">
        {title}
      </Text>

      {subtitle ? (
        <Text className="mt-1.5 max-w-[92%] text-[12px] leading-[18px] text-[#7A8078]">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/* =========================================================
   SMALL BADGE
========================================================= */

function Badge({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="mr-2 flex-row items-center rounded-full bg-[#FFFFFFE8] px-3 py-2">
      {icon ? <Ionicons name={icon} size={12} color={COLORS.green} /> : null}

      <Text
        className="text-[10px] font-bold text-[#4D6A50]"
        style={{ marginLeft: icon ? 5 : 0 }}
      >
        {children}
      </Text>
    </View>
  );
}

/* =========================================================
   HEADER
========================================================= */

function DetailHeader({
  onBack,
  onShare,
}: {
  onBack: () => void;
  onShare: () => void;
}) {
  return (
    <View className="h-[56px] flex-row items-center justify-between px-5">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onBack}
        className="h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <View className="items-center">
        <Text className="text-[9px] font-bold uppercase tracking-[2px] text-[#969A93]">
          Niramaya
        </Text>

        <Text className="mt-0.5 text-[15px] font-bold text-[#273128]">
          Yoga
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onShare}
        className="h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <Ionicons name="share-outline" size={19} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero({
  item,
  onPractice,
}: {
  item: YogaDetailData;
  onPractice: () => void;
}) {
  const imageUrl = getYogaImageUrl(
    item.imageUrl || item.image || item.thumbnailUrl || undefined,
  );

  return (
    <View className="overflow-hidden rounded-[26px]">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-[280px] w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="h-[280px] items-center justify-center bg-[#DDE8D8]">
          <View className="absolute -right-20 -top-16 h-60 w-60 rounded-full bg-[#C8D9C2]" />

          <View className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#C4D5BE]" />

          <View className="h-[76px] w-[76px] items-center justify-center rounded-full bg-white/80">
            <Ionicons name="body-outline" size={36} color={COLORS.green} />
          </View>

          <Text className="mt-4 text-[9px] font-bold uppercase tracking-[2px] text-[#60735F]">
            Yoga Practice
          </Text>
        </View>
      )}

      {/* top labels */}
      <View className="absolute left-4 right-4 top-4 flex-row">
        <Badge icon="body-outline">{getTypeLabel(item.type)}</Badge>

        {item.isFeatured ? (
          <View className="flex-row items-center rounded-full bg-[#31543BE8] px-3 py-2">
            <Ionicons name="sparkles" size={11} color="#FFFFFF" />

            <Text className="ml-1.5 text-[10px] font-bold text-white">
              Featured
            </Text>
          </View>
        ) : null}
      </View>

      {/* bottom overlay */}
      <View className="absolute bottom-4 left-4 right-4">
        <View className="flex-row items-center rounded-[18px] bg-[#253229CC] px-4 py-3.5">
          <View className="flex-1 pr-3">
            <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-white/65">
              Wellness focus
            </Text>

            <Text className="mt-1 text-[16px] font-bold text-white">
              {getCategoryLabel(item.category)}
            </Text>
          </View>

          {item.videoUrl ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onPractice}
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              <Ionicons name="play" size={17} color={COLORS.green} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function Skeleton({ className }: { className: string }) {
  return <View className={`rounded-[16px] bg-[#E9E5DC] ${className}`} />;
}

function YogaDetailSkeleton() {
  return (
    <View className="flex-1 bg-[#F7F3EA]">
      <View className="px-5">
        <View className="h-[56px] flex-row items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </View>

        <Skeleton className="h-[280px] w-full rounded-[26px]" />

        <Skeleton className="mt-7 h-9 w-[82%] rounded-xl" />
        <Skeleton className="mt-3 h-4 w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-[88%] rounded-lg" />

        <View className="mt-5 flex-row">
          <Skeleton className="mr-2 h-8 w-24 rounded-full" />
          <Skeleton className="mr-2 h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </View>

        <Skeleton className="mt-5 h-[54px] w-full rounded-[17px]" />

        <View className="mt-3 flex-row">
          <Skeleton className="mr-2 h-12 flex-1 rounded-[15px]" />
          <Skeleton className="mr-2 h-12 flex-1 rounded-[15px]" />
          <Skeleton className="h-12 w-12 rounded-[15px]" />
        </View>

        <Skeleton className="mt-10 h-6 w-28 rounded-lg" />

        <View className="mt-4 flex-row">
          <Skeleton className="mr-2 h-[108px] flex-1 rounded-[17px]" />
          <Skeleton className="mr-2 h-[108px] flex-1 rounded-[17px]" />
          <Skeleton className="h-[108px] flex-1 rounded-[17px]" />
        </View>

        <Skeleton className="mt-10 h-6 w-40 rounded-lg" />
        <Skeleton className="mt-4 h-28 w-full rounded-[20px]" />

        <Skeleton className="mt-10 h-6 w-32 rounded-lg" />
        <Skeleton className="mt-4 h-40 w-full rounded-[20px]" />
      </View>
    </View>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-[#F7F3EA] px-8">
      <View className="h-[70px] w-[70px] items-center justify-center rounded-full bg-[#F4E5DE]">
        <Ionicons name="leaf-outline" size={31} color={COLORS.warning} />
      </View>

      <Text className="mt-5 text-center text-[21px] font-bold text-[#273128]">
        Practice unavailable
      </Text>

      <Text className="mt-2 max-w-[310px] text-center text-[13px] leading-[20px] text-[#777C74]">
        {message || "We couldn't load this Yoga practice right now."}
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onRetry}
        className="mt-6 h-12 flex-row items-center rounded-[15px] bg-[#4D6A50] px-6"
      >
        <Ionicons name="refresh" size={16} color="#FFFFFF" />

        <Text className="ml-2 text-[13px] font-bold text-white">Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.back()}
        className="mt-2 px-5 py-3"
      >
        <Text className="text-[12px] font-semibold text-[#4D6A50]">
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   META ROW
========================================================= */

function MetaRow({ item }: { item: YogaDetailData }) {
  const difficulty = formatLabel(item.difficulty);
  const duration = getDuration(item);
  const difficultyStyle = getDifficultyStyle(item.difficulty);

  return (
    <View className="mt-5 flex-row items-center">
      <View className="mr-2 flex-row items-center">
        <Ionicons name="leaf-outline" size={14} color={COLORS.green} />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#5F665F]">
          {getCategoryLabel(item.category)}
        </Text>
      </View>

      <View className="mx-1 h-1 w-1 rounded-full bg-[#B5B8B1]" />

      {difficulty ? (
        <>
          <View className="mx-2 flex-row items-center">
            <Ionicons
              name="speedometer-outline"
              size={14}
              color={difficultyStyle.text}
            />

            <Text
              className="ml-1.5 text-[11px] font-semibold"
              style={{ color: difficultyStyle.text }}
            >
              {difficulty}
            </Text>
          </View>

          <View className="mx-1 h-1 w-1 rounded-full bg-[#B5B8B1]" />
        </>
      ) : null}

      {duration ? (
        <View className="ml-2 flex-row items-center">
          <Ionicons name="time-outline" size={14} color={COLORS.softMuted} />

          <Text className="ml-1.5 text-[11px] font-semibold text-[#6F756E]">
            {duration}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* =========================================================
   PRIMARY BUTTON
========================================================= */

function PracticeButton({
  hasVideo,
  onPress,
}: {
  hasVideo: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      className="mt-5 h-[54px] flex-row items-center justify-center rounded-[17px] bg-[#4D6A50]"
    >
      <View className="h-8 w-8 items-center justify-center rounded-full bg-white/15">
        <Ionicons
          name={hasVideo ? "play" : "body-outline"}
          size={16}
          color="#FFFFFF"
        />
      </View>

      <Text className="ml-2 text-[13px] font-bold text-white">
        {hasVideo ? "Practice Now" : "View Practice Steps"}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   ACTION ROW
========================================================= */

function ActionRow({
  onOverview,
  onGuidelines,
  onShare,
}: {
  onOverview: () => void;
  onGuidelines: () => void;
  onShare: () => void;
}) {
  return (
    <View className="mt-3 flex-row">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onOverview}
        className="mr-2 h-[50px] flex-1 flex-row items-center justify-center rounded-[15px] border border-[#DDD8CD] bg-white"
      >
        <Ionicons name="book-outline" size={16} color={COLORS.green} />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#555B55]">
          Overview
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onGuidelines}
        className="mr-2 h-[50px] flex-1 flex-row items-center justify-center rounded-[15px] border border-[#DDD8CD] bg-white"
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={16}
          color={COLORS.green}
        />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#555B55]">
          Guidelines
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onShare}
        className="h-[50px] w-[50px] items-center justify-center rounded-[15px] border border-[#DDD8CD] bg-white"
      >
        <Ionicons name="share-social-outline" size={17} color={COLORS.green} />
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   AT A GLANCE
========================================================= */

function AtAGlance({ item }: { item: YogaDetailData }) {
  const difficultyStyle = getDifficultyStyle(item.difficulty);

  const cards = [
    {
      label: "Type",
      value: getTypeLabel(item.type),
      icon: "body-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Level",
      value: formatLabel(item.difficulty) || "All levels",
      icon: "speedometer-outline" as keyof typeof Ionicons.glyphMap,
      valueColor: difficultyStyle.text,
    },
    {
      label: "Duration",
      value: getDuration(item) || "Flexible",
      icon: "time-outline" as keyof typeof Ionicons.glyphMap,
    },
  ];

  return (
    <View className="flex-row">
      {cards.map((card, index) => (
        <View
          key={card.label}
          className={`flex-1 rounded-[17px] bg-white px-3.5 py-3.5 ${
            index < cards.length - 1 ? "mr-2" : ""
          }`}
        >
          <View className="h-8 w-8 items-center justify-center rounded-full bg-[#EEF4EB]">
            <Ionicons name={card.icon} size={15} color={COLORS.green} />
          </View>

          <Text className="mt-3 text-[9px] font-bold uppercase tracking-[1.2px] text-[#A0A39D]">
            {card.label}
          </Text>

          <Text
            numberOfLines={2}
            className="mt-1 text-[12px] font-semibold leading-[16px]"
            style={{
              color: card.valueColor || COLORS.text,
            }}
          >
            {card.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* =========================================================
   ABOUT
========================================================= */

function AboutSection({ description }: { description?: string }) {
  if (!description) return null;

  return (
    <>
      <SectionHeader eyebrow="The practice" title="About this practice" />

      <View className="rounded-[20px] bg-white px-5 py-5">
        <Text className="text-[13px] leading-[21px] text-[#606760]">
          {description}
        </Text>
      </View>
    </>
  );
}

/* =========================================================
   FOCUS
========================================================= */

function FocusSection({ item }: { item: YogaDetailData }) {
  const bodyFocus = formatList(item.bodyFocus);

  if (!bodyFocus.length && !item.category) {
    return null;
  }

  return (
    <>
      <SectionHeader
        eyebrow="Practice focus"
        title="What this practice focuses on"
        subtitle="Areas and wellness themes associated with this Yoga practice."
      />

      <View className="rounded-[20px] bg-[#EEF4EB] px-5 py-5">
        {item.category ? (
          <View className="mb-4 flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
              <Ionicons name="leaf-outline" size={16} color={COLORS.green} />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-[1px] text-[#899489]">
                Main wellness category
              </Text>

              <Text className="mt-0.5 text-[13px] font-bold text-[#3E5942]">
                {getCategoryLabel(item.category)}
              </Text>
            </View>
          </View>
        ) : null}

        {bodyFocus.length ? (
          <View className="flex-row flex-wrap">
            {bodyFocus.map((value) => (
              <View
                key={value}
                className="mr-2 mb-2 rounded-full bg-white px-3.5 py-2"
              >
                <Text className="text-[11px] font-semibold text-[#59655A]">
                  {value}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </>
  );
}

/* =========================================================
   EQUIPMENT
========================================================= */

function EquipmentSection({ equipment }: { equipment?: string[] }) {
  const values = formatList(equipment);

  if (!values.length) return null;

  return (
    <>
      <SectionHeader
        eyebrow="Preparation"
        title="What you need"
        subtitle="Keep your practice simple and comfortable."
      />

      <View className="rounded-[20px] bg-white px-5">
        {values.map((value, index) => (
          <View
            key={value}
            className={`flex-row items-center py-4 ${
              index < values.length - 1 ? "border-b border-[#F0ECE4]" : ""
            }`}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#EEF4EB]">
              <Ionicons name="checkmark" size={14} color={COLORS.green} />
            </View>

            <Text className="ml-3 flex-1 text-[12px] font-medium text-[#596059]">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   BENEFITS
========================================================= */

function BenefitsSection({ benefits }: { benefits?: string[] }) {
  const values = cleanList(benefits);

  if (!values.length) return null;

  const icons: Array<keyof typeof Ionicons.glyphMap> = [
    "sparkles-outline",
    "body-outline",
    "leaf-outline",
    "heart-outline",
  ];

  return (
    <>
      <SectionHeader
        eyebrow="Why practice it"
        title="Benefits"
        subtitle="Potential wellness benefits associated with this practice."
      />

      <View className="rounded-[20px] bg-[#F1E9DA] px-5">
        {values.map((benefit, index) => (
          <View
            key={`${benefit}-${index}`}
            className={`flex-row py-4 ${
              index < values.length - 1 ? "border-b border-[#E5DCCB]" : ""
            }`}
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white/80">
              <Ionicons
                name={icons[index % icons.length]}
                size={16}
                color={COLORS.green}
              />
            </View>

            <Text className="ml-3 flex-1 pt-0.5 text-[12px] leading-[19px] text-[#5E625B]">
              {benefit}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   INSTRUCTIONS
========================================================= */

function InstructionsSection({ instructions }: { instructions?: string[] }) {
  const values = cleanList(instructions);

  if (!values.length) return null;

  return (
    <>
      <SectionHeader
        eyebrow="Your practice"
        title="How to practice"
        subtitle="Move slowly, breathe naturally, and stay within a comfortable range."
      />

      <View className="rounded-[20px] bg-white px-5 py-2">
        {values.map((instruction, index) => (
          <View
            key={`${instruction}-${index}`}
            className={`flex-row py-4 ${
              index < values.length - 1 ? "border-b border-[#F0ECE4]" : ""
            }`}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#4D6A50]">
              <Text className="text-[11px] font-bold text-white">
                {index + 1}
              </Text>
            </View>

            <Text className="ml-3 flex-1 text-[12px] leading-[20px] text-[#555C55]">
              {instruction}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   SAFETY
========================================================= */

function SafetySection({
  precautions,
  contraindications,
}: {
  precautions?: string[];
  contraindications?: string[];
}) {
  const precautionsList = cleanList(precautions);
  const contraindicationsList = cleanList(contraindications);

  if (!precautionsList.length && !contraindicationsList.length) {
    return null;
  }

  return (
    <>
      <SectionHeader
        eyebrow="Important"
        title="Before you begin"
        subtitle="Please review these practice-specific safety notes."
      />

      <View>
        {precautionsList.length ? (
          <View className="rounded-[20px] bg-[#F5EFE1] px-5 py-5">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color={COLORS.amber}
                />
              </View>

              <Text className="ml-3 text-[14px] font-bold text-[#66563B]">
                Precautions
              </Text>
            </View>

            <View className="mt-3">
              {precautionsList.map((value) => (
                <View key={value} className="mb-2 flex-row">
                  <Text className="mr-2 text-[12px] text-[#8A7048]">•</Text>

                  <Text className="flex-1 text-[12px] leading-[19px] text-[#675E4C]">
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {contraindicationsList.length ? (
          <View
            className={`rounded-[20px] bg-[#F7E9E2] px-5 py-5 ${
              precautionsList.length ? "mt-3" : ""
            }`}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white/80">
                <Ionicons
                  name="warning-outline"
                  size={17}
                  color={COLORS.warning}
                />
              </View>

              <Text className="ml-3 text-[14px] font-bold text-[#754C3D]">
                Contraindications
              </Text>
            </View>

            <View className="mt-3">
              {contraindicationsList.map((value) => (
                <View key={value} className="mb-2 flex-row">
                  <Text className="mr-2 text-[12px] text-[#9A604B]">•</Text>

                  <Text className="flex-1 text-[12px] leading-[19px] text-[#70564C]">
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}

/* =========================================================
   SUITABLE FOR
========================================================= */

function SuitableForSection({ suitableFor }: { suitableFor?: string[] }) {
  const values = formatList(suitableFor);

  if (!values.length) return null;

  return (
    <>
      <SectionHeader eyebrow="Who it's for" title="Suitable for" />

      <View className="flex-row flex-wrap">
        {values.map((value) => (
          <View
            key={value}
            className="mr-2 mb-2 flex-row items-center rounded-full bg-white px-3.5 py-2.5"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color={COLORS.green}
            />

            <Text className="ml-1.5 text-[11px] font-medium text-[#5E655E]">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   WELLNESS FIT
========================================================= */

function WellnessFit({ recommendedFor }: { recommendedFor?: RecommendedFor }) {
  if (!recommendedFor) return null;

  const groups = [
    {
      label: "Energy",
      icon: "flash-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.energyLevels),
    },
    {
      label: "Stress",
      icon: "heart-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.stressLevels),
    },
    {
      label: "Sleep",
      icon: "moon-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.sleepQualities),
    },
    {
      label: "Activity",
      icon: "walk-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.activityLevels),
    },
    {
      label: "Yoga experience",
      icon: "body-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.yogaExperience),
    },
    {
      label: "Concerns",
      icon: "medical-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.concerns),
    },
    {
      label: "Goals",
      icon: "flag-outline" as keyof typeof Ionicons.glyphMap,
      values: formatList(recommendedFor.goalCategories),
    },
  ].filter((group) => group.values.length);

  if (!groups.length) return null;

  return (
    <>
      <SectionHeader
        eyebrow="Personalisation"
        title="Wellness fit"
        subtitle="Wellness profiles associated with this practice."
      />

      <View className="rounded-[20px] bg-[#EEF4EB] px-5 py-2">
        {groups.map((group, index) => (
          <View
            key={group.label}
            className={`py-4 ${
              index < groups.length - 1 ? "border-b border-[#DDE7D8]" : ""
            }`}
          >
            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                <Ionicons name={group.icon} size={15} color={COLORS.green} />
              </View>

              <Text className="ml-3 text-[12px] font-bold text-[#49604D]">
                {group.label}
              </Text>
            </View>

            <View className="mt-2.5 flex-row flex-wrap pl-11">
              {group.values.map((value) => (
                <View
                  key={value}
                  className="mr-2 mb-1.5 rounded-full bg-white px-2.5 py-1.5"
                >
                  <Text className="text-[10px] font-medium text-[#626961]">
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   TAGS
========================================================= */

function TagsSection({ tags }: { tags?: string[] }) {
  const values = formatList(tags);

  if (!values.length) return null;

  return (
    <>
      <SectionHeader eyebrow="Explore further" title="Practice tags" />

      <View className="flex-row flex-wrap">
        {values.map((value) => (
          <View
            key={value}
            className="mr-2 mb-2 rounded-full border border-[#DDD8CD] bg-white px-3.5 py-2"
          >
            <Text className="text-[10px] font-semibold text-[#686E67]">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   PRACTICE DETAILS
========================================================= */

function PracticeDetails({ item }: { item: YogaDetailData }) {
  const rows = [
    {
      label: "Practice type",
      value: getTypeLabel(item.type),
      icon: "body-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Category",
      value: getCategoryLabel(item.category),
      icon: "leaf-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Difficulty",
      value: formatLabel(item.difficulty) || "Not specified",
      icon: "speedometer-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Duration",
      value: getDuration(item) || "Not specified",
      icon: "time-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Video practice",
      value: item.videoUrl ? "Available" : "Not available",
      icon: "videocam-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Featured",
      value: item.isFeatured ? "Yes" : "No",
      icon: "sparkles-outline" as keyof typeof Ionicons.glyphMap,
    },
  ];

  return (
    <>
      <SectionHeader eyebrow="Reference" title="Practice details" />

      <View className="overflow-hidden rounded-[20px] bg-white px-5">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={`flex-row items-center py-4 ${
              index < rows.length - 1 ? "border-b border-[#F0ECE4]" : ""
            }`}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#EEF4EB]">
              <Ionicons name={row.icon} size={14} color={COLORS.green} />
            </View>

            <Text className="ml-3 flex-1 text-[12px] text-[#777C74]">
              {row.label}
            </Text>

            <Text
              numberOfLines={2}
              className="max-w-[48%] text-right text-[12px] font-semibold text-[#313A32]"
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   FOOTER QUOTE
========================================================= */

function QuoteCard() {
  return (
    <View className="mb-8 mt-10 rounded-[22px] bg-[#DDE7D8] px-5 py-5">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
        <Ionicons name="leaf-outline" size={17} color={COLORS.green} />
      </View>

      <Text className="mt-4 text-[16px] font-semibold leading-[23px] text-[#31543B]">
        Move gently, breathe steadily, and let the practice meet you where you
        are.
      </Text>

      <Text className="mt-3 text-[9px] font-bold uppercase tracking-[1.6px] text-[#718071]">
        Niramaya Yoga
      </Text>
    </View>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function YogaDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const scrollRef = useRef<ScrollView>(null);

  const [item, setItem] = useState<YogaDetailData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [overviewY, setOverviewY] = useState(0);
  const [guidelinesY, setGuidelinesY] = useState(0);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadYoga = useCallback(
    async (showSkeleton = true) => {
      if (!id) {
        setError("This Yoga practice could not be identified.");
        setLoading(false);
        return;
      }

      try {
        if (showSkeleton) {
          setLoading(true);
        }

        setError("");

        const data = await getYogaRecommendation(id);

        if (!data) {
          throw new Error("No Yoga practice was returned by the server.");
        }

        setItem(data as YogaDetailData);

        /*
         * View tracking should never prevent
         * the detail page from loading.
         */
        incrementYogaViewCount(id).catch(() => {});
      } catch (err: any) {
        console.error("Yoga detail loading error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this Yoga practice.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    loadYoga(true);
  }, [loadYoga]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadYoga(false);
  }, [loadYoga]);

  /* =======================================================
     SHARE
  ======================================================= */

  const handleShare = useCallback(async () => {
    if (!item) return;

    try {
      await Share.share({
        title: item.title || "Niramaya Yoga",
        message: [
          item.title || "Yoga Practice",
          item.description || "",
          "Explore this Yoga practice in Niramaya.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      });
    } catch (err) {
      console.warn("Yoga share cancelled or failed:", err);
    }
  }, [item]);

  /* =======================================================
     PRACTICE
  ======================================================= */

  const handlePractice = useCallback(async () => {
    if (!item) return;

    if (item.videoUrl) {
      try {
        const supported = await Linking.canOpenURL(item.videoUrl);

        if (!supported) {
          console.warn("Unable to open Yoga video URL:", item.videoUrl);
          return;
        }

        await Linking.openURL(item.videoUrl);
        return;
      } catch (err) {
        console.error("Unable to open Yoga video:", err);
      }
    }

    scrollRef.current?.scrollTo({
      y: Math.max(guidelinesY - 20, 0),
      animated: true,
    });
  }, [item, guidelinesY]);

  /* =======================================================
     SCROLL HELPERS
  ======================================================= */

  const scrollToOverview = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: Math.max(overviewY - 16, 0),
      animated: true,
    });
  }, [overviewY]);

  const scrollToGuidelines = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: Math.max(guidelinesY - 16, 0),
      animated: true,
    });
  }, [guidelinesY]);

  const title = useMemo(
    () => item?.title || item?.name || "Yoga Practice",
    [item],
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && !item) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F3EA]">
        <YogaDetailSkeleton />
      </SafeAreaView>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !item) {
    return (
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F3EA]">
        <ErrorState message={error} onRetry={() => loadYoga(true)} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F3EA]">
        <ErrorState
          message="This Yoga practice is not available right now."
          onRetry={() => loadYoga(true)}
        />
      </SafeAreaView>
    );
  }

  /* =======================================================
     SCREEN
  ======================================================= */

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#F7F3EA]">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
            colors={[COLORS.green]}
          />
        }
      >
        <DetailHeader onBack={() => router.back()} onShare={handleShare} />

        <View className="px-5">
          {/* =================================================
              HERO
          ================================================= */}

          <Hero item={item} onPractice={handlePractice} />

          {/* =================================================
              TITLE BLOCK
          ================================================= */}

          <View className="mt-7">
            <Text className="text-[29px] font-bold leading-[35px] tracking-[-0.5px] text-[#273128]">
              {title}
            </Text>

            <MetaRow item={item} />

            {item.description ? (
              <Text
                numberOfLines={4}
                className="mt-3 text-[13px] leading-[21px] text-[#737971]"
              >
                {item.description}
              </Text>
            ) : null}
          </View>

          {/* =================================================
              PRIMARY ACTION
          ================================================= */}

          <PracticeButton
            hasVideo={Boolean(item.videoUrl)}
            onPress={handlePractice}
          />

          {/* =================================================
              ACTIONS
          ================================================= */}

          <ActionRow
            onOverview={scrollToOverview}
            onGuidelines={scrollToGuidelines}
            onShare={handleShare}
          />

          {/* =================================================
              OVERVIEW ANCHOR
          ================================================= */}

          <View
            onLayout={(event) => {
              setOverviewY(event.nativeEvent.layout.y);
            }}
          >
            <SectionHeader
              eyebrow="At a glance"
              title="Practice essentials"
              subtitle="A quick look before you begin."
            />

            <AtAGlance item={item} />
          </View>

          {/* =================================================
              ABOUT
          ================================================= */}

          <AboutSection description={item.description} />

          {/* =================================================
              FOCUS
          ================================================= */}

          <FocusSection item={item} />

          {/* =================================================
              EQUIPMENT
          ================================================= */}

          <EquipmentSection equipment={item.equipment} />

          {/* =================================================
              BENEFITS
          ================================================= */}

          <BenefitsSection benefits={item.benefits} />

          {/* =================================================
              INSTRUCTIONS
          ================================================= */}

          <InstructionsSection instructions={item.instructions} />

          {/* =================================================
              GUIDELINES ANCHOR
          ================================================= */}

          <View
            onLayout={(event) => {
              setGuidelinesY(event.nativeEvent.layout.y);
            }}
          >
            <SafetySection
              precautions={item.precautions}
              contraindications={item.contraindications}
            />
          </View>

          {/* =================================================
              SUITABLE FOR
          ================================================= */}

          <SuitableForSection suitableFor={item.suitableFor} />

          {/* =================================================
              WELLNESS FIT
          ================================================= */}

          <WellnessFit recommendedFor={item.recommendedFor} />

          {/* =================================================
              TAGS
          ================================================= */}

          <TagsSection tags={item.tags} />

          {/* =================================================
              DETAILS
          ================================================= */}

          <PracticeDetails item={item} />

          {/* =================================================
              FOOTER
          ================================================= */}

          <QuoteCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
