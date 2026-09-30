import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { getYogaRecommendation } from "@/services/explore.service";
import { ExploreItem } from "@/types/explore";

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",
  softSurface: "#EFE9DC",

  text: "#273128",
  muted: "#777C74",
  softMuted: "#A0A29B",

  green: "#4D6A50",
  darkGreen: "#31543B",
  lightGreen: "#DDE7D8",
  lighterGreen: "#EEF5EC",

  border: "#E5E0D6",

  accent: "#2FA6B0",

  warning: "#A75D43",
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
  slug?: string;

  imageUrl?: string;
  image?: string;
  thumbnailUrl?: string;

  type?: string;

  category?: string;

  difficulty?: string;

  durationMinutes?: number;

  duration?: number | string;

  tags?: string[];

  benefits?: string[];

  instructions?: string[];

  precautions?: string[];

  contraindications?: string[];

  suitableFor?: string[];

  recommendedFor?: RecommendedFor;

  isActive?: boolean;

  isFeatured?: boolean;
};

/* =========================================================
   HELPERS
========================================================= */

function formatLabel(value?: string) {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatList(values?: string[]) {
  if (!values?.length) return [];

  return values.filter(Boolean).map((value) => formatLabel(value));
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

/* =========================================================
   HEADER
========================================================= */

function DetailHeader({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onBack}
        className="h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.text} />
      </TouchableOpacity>

      <Text className="text-[17px] font-bold text-foreground">
        Yoga for Health
      </Text>

      <TouchableOpacity
        activeOpacity={0.75}
        className="h-10 w-10 items-center justify-center rounded-full bg-white"
      >
        <Ionicons name="share-outline" size={20} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   HERO
========================================================= */

function HeroImage({ item }: { item: YogaDetailData }) {
  const imageUrl = item.imageUrl || item.image || item.thumbnailUrl || "";

  if (imageUrl) {
    return (
      <View className="mt-5 overflow-hidden rounded-[24px]">
        <Image
          source={{ uri: imageUrl }}
          className="h-[215px] w-full"
          resizeMode="cover"
        />

        <View className="absolute bottom-0 left-0 right-0 bg-black/20 px-5 py-3">
          <Text className="text-[10px] font-bold uppercase tracking-[2px] text-white">
            Yoga practice
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-5 h-[215px] overflow-hidden rounded-[24px] bg-[#DEE8D9]">
      <View className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#C8D9C2]" />

      <View className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#C4D5BE]" />

      <View className="flex-1 items-center justify-center">
        <View className="h-[70px] w-[70px] items-center justify-center rounded-full bg-white/80">
          <Ionicons name="body-outline" size={36} color={COLORS.green} />
        </View>

        <Text className="mt-4 text-[10px] font-bold uppercase tracking-[2px] text-[#627761]">
          Yoga practice
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   META
========================================================= */

function MetaItem({
  icon,
  label,
  highlighted = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <View
      className={`mr-2 flex-row items-center rounded-full px-3 py-2 ${
        highlighted ? "bg-[#E8F0E5]" : "bg-white"
      }`}
    >
      <Ionicons
        name={icon}
        size={13}
        color={highlighted ? COLORS.green : COLORS.softMuted}
      />

      <Text
        className={`ml-1.5 text-[11px] font-semibold ${
          highlighted ? "text-[#4D6A50]" : "text-muted"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   PRIMARY BUTTON
========================================================= */

function PracticeButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      className="mt-5 h-[48px] flex-row items-center justify-center rounded-[13px] bg-[#2FA6B0]"
    >
      <Ionicons name="play" size={17} color="#FFFFFF" />

      <Text className="ml-2 text-[13px] font-bold text-white">
        Practice Now
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   SECONDARY ACTIONS
========================================================= */

function ActionButtons({
  onIntroduction,
  onLearn,
}: {
  onIntroduction: () => void;
  onLearn: () => void;
}) {
  return (
    <View className="mt-3 flex-row gap-2">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onIntroduction}
        className="h-[52px] flex-1 flex-row items-center justify-center rounded-[12px] border border-[#DDD8CD] bg-white"
      >
        <Ionicons name="book-outline" size={16} color={COLORS.green} />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#505650]">
          Introduction
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onLearn}
        className="h-[52px] flex-1 flex-row items-center justify-center rounded-[12px] border border-[#DDD8CD] bg-white"
      >
        <Ionicons name="school-outline" size={16} color={COLORS.green} />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#505650]">
          Learn
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        className="h-[52px] flex-1 flex-row items-center justify-center rounded-[12px] border border-[#DDD8CD] bg-white"
      >
        <Ionicons name="calendar-outline" size={16} color={COLORS.green} />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#505650]">
          Schedule
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-3 mt-8">
      <Text className="text-[18px] font-bold text-foreground">{title}</Text>

      {subtitle ? (
        <Text className="mt-1 text-xs leading-4 text-muted">{subtitle}</Text>
      ) : null}
    </View>
  );
}

/* =========================================================
   THREE INFO CARDS
========================================================= */

function PracticeInfoCards({ item }: { item: YogaDetailData }) {
  const type = formatLabel(item.type);
  const level = formatLabel(item.difficulty);

  const duration = item.durationMinutes || item.duration;

  return (
    <View className="flex-row gap-2">
      {/* CARD 1 */}
      <View className="min-h-[92px] flex-1 rounded-[14px] bg-white px-3 py-3.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EEF5EC]">
          <Ionicons name="body-outline" size={15} color={COLORS.green} />
        </View>

        <Text className="mt-2 text-[9px] font-bold uppercase tracking-[1px] text-soft-muted">
          Type
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 text-[12px] font-semibold text-foreground"
        >
          {type || "—"}
        </Text>
      </View>

      {/* CARD 2 */}
      <View className="min-h-[92px] flex-1 rounded-[14px] bg-white px-3 py-3.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EEF5EC]">
          <Ionicons name="speedometer-outline" size={15} color={COLORS.green} />
        </View>

        <Text className="mt-2 text-[9px] font-bold uppercase tracking-[1px] text-soft-muted">
          Level
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 text-[12px] font-semibold text-foreground"
        >
          {level || "—"}
        </Text>
      </View>

      {/* CARD 3 */}
      <View className="min-h-[92px] flex-1 rounded-[14px] bg-white px-3 py-3.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EEF5EC]">
          <Ionicons name="time-outline" size={15} color={COLORS.green} />
        </View>

        <Text className="mt-2 text-[9px] font-bold uppercase tracking-[1px] text-soft-muted">
          Duration
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 text-[12px] font-semibold text-foreground"
        >
          {duration ? `${duration} min` : "—"}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   FOCUS SECTION
========================================================= */

function FocusSection({ item }: { item: YogaDetailData }) {
  const values = uniqueValues([
    formatLabel(item.category),
    ...(item.tags || []).map(formatLabel),
  ]);

  if (!values.length) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Focus"
        subtitle="The areas this practice is designed around."
      />

      <View className="flex-row flex-wrap">
        {values.map((value, index) => (
          <View
            key={`${value}-${index}`}
            className="mb-2 mr-2 rounded-full bg-[#E9EFE5] px-3.5 py-2"
          >
            <Text className="text-[11px] font-semibold text-[#4D6A50]">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   RECOMMENDED FOR
========================================================= */

function RecommendedSection({ item }: { item: YogaDetailData }) {
  const recommended = item.recommendedFor;

  const values = uniqueValues([
    ...formatList(item.suitableFor),
    ...formatList(recommended?.yogaExperience),
    ...formatList(recommended?.activityLevels),
  ]);

  if (!values.length) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Recommended for"
        subtitle="Based on the practice information in your wellness library."
      />

      <View className="rounded-[16px] bg-white px-4 py-4">
        <View className="flex-row flex-wrap">
          {values.map((value, index) => (
            <View
              key={`${value}-${index}`}
              className="mb-2 mr-2 flex-row items-center rounded-full bg-[#F3F1EA] px-3 py-2"
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={COLORS.green}
              />

              <Text className="ml-1.5 text-[11px] font-medium text-[#5B615B]">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

/* =========================================================
   BENEFITS
========================================================= */

function BenefitsSection({ benefits }: { benefits?: string[] }) {
  if (!benefits?.length) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Benefits"
        subtitle="Why this practice may be useful."
      />

      <View>
        {benefits.map((benefit, index) => (
          <View
            key={`${benefit}-${index}`}
            className="mb-2.5 flex-row items-center rounded-[14px] bg-[#EFE7D4] px-3.5 py-3"
          >
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-white/75">
              <Ionicons
                name={
                  index % 3 === 0
                    ? "sparkles-outline"
                    : index % 3 === 1
                      ? "body-outline"
                      : "leaf-outline"
                }
                size={16}
                color={COLORS.green}
              />
            </View>

            <Text className="flex-1 text-[12px] font-medium leading-5 text-[#575344]">
              {benefit}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   DROPDOWN ROW
========================================================= */

function DetailDropdown({
  title,
  icon,
  items,
  accent = COLORS.green,
  defaultOpen = false,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items?: string[];
  accent?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (!items?.length) {
    return null;
  }

  return (
    <View className="border-b border-[#ECE8DF] last:border-b-0">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen((value) => !value)}
        className="min-h-[56px] flex-row items-center px-4"
      >
        <View
          className="mr-3 h-8 w-8 items-center justify-center rounded-full"
          style={{
            backgroundColor: `${accent}12`,
          }}
        >
          <Ionicons name={icon} size={16} color={accent} />
        </View>

        <View className="flex-1">
          <Text className="text-[13px] font-semibold text-foreground">
            {title}
          </Text>

          <Text className="mt-0.5 text-[10px] text-soft-muted">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Text>
        </View>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={17}
          color={COLORS.softMuted}
        />
      </TouchableOpacity>

      {open ? (
        <View className="px-4 pb-4">
          {items.map((item, index) => (
            <View key={`${item}-${index}`} className="mb-2.5 flex-row">
              <View
                className="mr-2.5 mt-1 h-5 w-5 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${accent}12`,
                }}
              >
                <Text
                  className="text-[9px] font-bold"
                  style={{ color: accent }}
                >
                  {index + 1}
                </Text>
              </View>

              <Text className="flex-1 text-[12px] leading-5 text-muted">
                {item}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/* =========================================================
   GUIDELINES
========================================================= */

function GuidelinesSection({
  item,
  sectionRef,
}: {
  item: YogaDetailData;
  sectionRef: React.RefObject<View | null>;
}) {
  const hasAny =
    item.instructions?.length ||
    item.precautions?.length ||
    item.suitableFor?.length ||
    item.contraindications?.length;

  if (!hasAny) {
    return null;
  }

  return (
    <View ref={sectionRef} className="mt-8">
      <SectionTitle
        title="Guidelines"
        subtitle="Read these before beginning your practice."
      />

      <View className="overflow-hidden rounded-[16px] bg-white">
        <DetailDropdown
          title="Instructions"
          icon="list-outline"
          items={item.instructions}
          defaultOpen
        />

        <DetailDropdown
          title="Precautions"
          icon="shield-checkmark-outline"
          items={item.precautions}
          accent={COLORS.warning}
        />

        <DetailDropdown
          title="Suitable for"
          icon="people-outline"
          items={item.suitableFor}
        />

        <DetailDropdown
          title="Not suitable for"
          icon="alert-circle-outline"
          items={item.contraindications}
          accent={COLORS.warning}
        />
      </View>
    </View>
  );
}

/* =========================================================
   PERSONAL RELEVANCE
========================================================= */

function PersonalRelevance({
  recommendedFor,
}: {
  recommendedFor?: RecommendedFor;
}) {
  if (!recommendedFor) {
    return null;
  }

  const groups = [
    {
      title: "Energy levels",
      icon: "flash-outline" as const,
      values: formatList(recommendedFor.energyLevels),
    },
    {
      title: "Stress levels",
      icon: "heart-outline" as const,
      values: formatList(recommendedFor.stressLevels),
    },
    {
      title: "Sleep qualities",
      icon: "moon-outline" as const,
      values: formatList(recommendedFor.sleepQualities),
    },
    {
      title: "Activity levels",
      icon: "walk-outline" as const,
      values: formatList(recommendedFor.activityLevels),
    },
    {
      title: "Yoga experience",
      icon: "body-outline" as const,
      values: formatList(recommendedFor.yogaExperience),
    },
    {
      title: "Concerns",
      icon: "chatbubble-ellipses-outline" as const,
      values: formatList(recommendedFor.concerns),
    },
    {
      title: "Goal categories",
      icon: "flag-outline" as const,
      values: formatList(recommendedFor.goalCategories),
    },
  ].filter((group) => group.values.length > 0);

  if (!groups.length) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Personal relevance"
        subtitle="The wellness areas associated with this practice."
      />

      <View className="rounded-[16px] bg-white px-4">
        {groups.map((group, index) => (
          <View
            key={group.title}
            className={`py-4 ${
              index !== groups.length - 1 ? "border-b border-[#ECE8DF]" : ""
            }`}
          >
            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons name={group.icon} size={15} color={COLORS.green} />
              </View>

              <Text className="ml-3 text-[12px] font-semibold text-foreground">
                {group.title}
              </Text>
            </View>

            <View className="mt-2.5 ml-11 flex-row flex-wrap">
              {group.values.map((value, valueIndex) => (
                <View
                  key={`${value}-${valueIndex}`}
                  className="mb-1.5 mr-1.5 rounded-full bg-[#F4F1E9] px-2.5 py-1.5"
                >
                  <Text className="text-[10px] font-medium text-[#686C65]">
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
  if (!tags?.length) {
    return null;
  }

  return (
    <>
      <SectionTitle title="Tags" />

      <View className="flex-row flex-wrap">
        {tags.map((tag, index) => (
          <View
            key={`${tag}-${index}`}
            className="mb-2 mr-2 rounded-full border border-[#DDD8CD] bg-white px-3 py-2"
          >
            <Text className="text-[10px] font-medium text-[#6F746D]">
              #{tag}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   PRACTICE INFORMATION
========================================================= */

function PracticeInformation({ item }: { item: YogaDetailData }) {
  const rows = [
    {
      label: "Practice type",
      value: formatLabel(item.type),
    },
    {
      label: "Category",
      value: formatLabel(item.category),
    },
    {
      label: "Difficulty",
      value: formatLabel(item.difficulty),
    },
    {
      label: "Duration",
      value: item.durationMinutes ? `${item.durationMinutes} minutes` : "",
    },
  ].filter((row) => row.value);

  if (!rows.length && !item.isFeatured) {
    return null;
  }

  return (
    <>
      <SectionTitle title="Practice information" />

      <View className="rounded-[16px] bg-white px-4">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={`flex-row items-center justify-between py-3.5 ${
              index !== rows.length - 1 ? "border-b border-[#ECE8DF]" : ""
            }`}
          >
            <Text className="text-[12px] text-muted">{row.label}</Text>

            <Text className="max-w-[55%] text-right text-[12px] font-semibold text-foreground">
              {row.value}
            </Text>
          </View>
        ))}

        {item.isFeatured ? (
          <View className="flex-row items-center border-t border-[#ECE8DF] py-3.5">
            <Ionicons name="star-outline" size={15} color={COLORS.green} />

            <Text className="ml-2 text-[12px] font-semibold text-[#4D6A50]">
              Featured practice
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
}

/* =========================================================
   QUOTE
========================================================= */

function PracticeQuote() {
  return (
    <View className="mt-9 px-5 pb-2 pt-2">
      <Text className="text-center text-[34px] leading-8 text-[#7D9A79]">
        “
      </Text>

      <Text className="mt-1 text-center font-serif text-[16px] leading-6 text-[#555A53]">
        Come to the practice with no expectation.
      </Text>

      <View className="mt-4 h-px w-10 self-center bg-[#D3CEC2]" />

      <Text className="mt-3 text-center text-[10px] text-[#8A8B84]">
        Practice with awareness and ease
      </Text>
    </View>
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function YogaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const scrollRef = useRef<ScrollView>(null);

  const introRef = useRef<View>(null);

  const guidelinesRef = useRef<View>(null);

  const [item, setItem] = useState<YogaDetailData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Yoga practice not found.");

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getYogaRecommendation(String(id));

        setItem(data as YogaDetailData);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this yoga practice.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const title = useMemo(() => {
    return item?.title || item?.name || "Yoga Practice";
  }, [item]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="flex-1 items-center justify-center bg-background"
      >
        <ActivityIndicator size="small" color={COLORS.green} />

        <Text className="mt-4 text-[12px] text-muted">
          Preparing your practice...
        </Text>
      </SafeAreaView>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (!item || error) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-background px-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-3 h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center px-8">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-[#E3EBDD]">
            <Ionicons name="leaf-outline" size={30} color={COLORS.green} />
          </View>

          <Text className="mt-5 text-center text-xl font-bold text-foreground">
            Practice unavailable
          </Text>

          <Text className="mt-2 text-center text-[12px] leading-5 text-muted">
            {error || "This yoga practice could not be found."}
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-full bg-[#4D6A50] px-6 py-3"
          >
            <Text className="text-[12px] font-bold text-white">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const category = formatLabel(item.category);

  const difficulty = formatLabel(item.difficulty);

  const duration = item.durationMinutes || item.duration;

  /* =======================================================
     SCREEN
  ======================================================= */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 45,
        }}
      >
        {/* HEADER */}

        <DetailHeader onBack={() => router.back()} />

        {/* HERO */}

        <HeroImage item={item} />

        {/* INTRODUCTION */}

        <View ref={introRef} className="mt-5">
          <Text className="font-serif text-[25px] leading-8 text-foreground">
            {title}
          </Text>

          {item.description ? (
            <Text className="mt-2.5 text-[12px] leading-5 text-muted">
              {item.description}
            </Text>
          ) : null}
        </View>

        {/* META */}

        <View className="mt-4 flex-row flex-wrap">
          {category ? (
            <MetaItem icon="leaf-outline" label={category} highlighted />
          ) : null}

          {difficulty ? (
            <MetaItem icon="speedometer-outline" label={difficulty} />
          ) : null}

          {duration ? (
            <MetaItem icon="time-outline" label={`${duration} min`} />
          ) : null}
        </View>

        {/* CTA */}

        <PracticeButton />

        {/* ACTION BUTTONS */}

        <ActionButtons
          onIntroduction={() =>
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            })
          }
          onLearn={() =>
            guidelinesRef.current?.measureLayout(
              scrollRef.current as any,
              (x, y) => {
                scrollRef.current?.scrollTo({
                  y: Math.max(y - 20, 0),
                  animated: true,
                });
              },
              () => {},
            )
          }
        />

        {/* =================================================
            THREE INFORMATION CARDS
        ================================================= */}

        <SectionTitle
          title="Practice"
          subtitle="A quick overview of this yoga practice."
        />

        <PracticeInfoCards item={item} />

        {/* FOCUS */}

        <FocusSection item={item} />

        {/* RECOMMENDED FOR */}

        <RecommendedSection item={item} />

        {/* BENEFITS */}

        <BenefitsSection benefits={item.benefits} />

        {/* GUIDELINES */}

        <GuidelinesSection item={item} sectionRef={guidelinesRef} />

        {/* PERSONAL RELEVANCE */}

        <PersonalRelevance recommendedFor={item.recommendedFor} />

        {/* TAGS */}

        <TagsSection tags={item.tags} />

        {/* PRACTICE INFORMATION */}

        <PracticeInformation item={item} />

        {/* QUOTE */}

        <PracticeQuote />
      </ScrollView>
    </SafeAreaView>
  );
}
