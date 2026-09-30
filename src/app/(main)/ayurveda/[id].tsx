import React, { useEffect, useMemo, useState } from "react";
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

import { getAyurvedaRecommendation } from "@/services/explore.service";
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

  herb: "#70885F",
};

/* =========================================================
   TYPES
========================================================= */

type RecommendedFor = {
  energyLevels?: string[];
  digestion?: string[];
  stressLevels?: string[];
  sleepQualities?: string[];
  activityLevels?: string[];
  concerns?: string[];
  goalCategories?: string[];
};

type Ingredient = {
  name?: string;
  description?: string;
};

type AyurvedaDetailData = ExploreItem & {
  slug?: string;

  imageUrl?: string;
  image?: string;
  thumbnailUrl?: string;

  type?: string;
  category?: string;

  tags?: string[];

  benefits?: string[];

  suitableFor?: string[];

  ingredients?: Ingredient[];

  usage?: string;

  precautions?: string[];

  contraindications?: string[];

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

      <Text className="text-[17px] font-bold text-foreground">Ayurveda</Text>

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

function HeroImage({ item }: { item: AyurvedaDetailData }) {
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
            Ayurvedic wellness
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-5 h-[215px] overflow-hidden rounded-[24px] bg-[#E2E8D9]">
      <View className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#CAD9BE]" />

      <View className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#C6D5BA]" />

      <View className="flex-1 items-center justify-center">
        <View className="h-[70px] w-[70px] items-center justify-center rounded-full bg-white/80">
          <Ionicons name="leaf-outline" size={36} color={COLORS.green} />
        </View>

        <Text className="mt-4 text-[10px] font-bold uppercase tracking-[2px] text-[#627761]">
          Ayurvedic wellness
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

function ExploreButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      className="mt-5 h-[48px] flex-row items-center justify-center rounded-[13px] bg-[#4D6A50]"
    >
      <Ionicons name="leaf-outline" size={17} color="#FFFFFF" />

      <Text className="ml-2 text-[13px] font-bold text-white">
        Explore This
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   SECONDARY BUTTONS
========================================================= */

function ActionButtons({ onIntroduction }: { onIntroduction: () => void }) {
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
        <Ionicons name="bookmark-outline" size={16} color={COLORS.green} />

        <Text className="ml-1.5 text-[11px] font-semibold text-[#505650]">
          Save
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
   THREE INFORMATION CARDS
========================================================= */

function AyurvedaInfoCards({ item }: { item: AyurvedaDetailData }) {
  const type = formatLabel(item.type);
  const category = formatLabel(item.category);

  return (
    <View className="flex-row gap-2">
      {/* TYPE */}

      <View className="min-h-[92px] flex-1 rounded-[14px] bg-white px-3 py-3.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EEF5EC]">
          <Ionicons name="leaf-outline" size={15} color={COLORS.green} />
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

      {/* CATEGORY */}

      <View className="min-h-[92px] flex-1 rounded-[14px] bg-white px-3 py-3.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EEF5EC]">
          <Ionicons name="grid-outline" size={15} color={COLORS.green} />
        </View>

        <Text className="mt-2 text-[9px] font-bold uppercase tracking-[1px] text-soft-muted">
          Category
        </Text>

        <Text
          numberOfLines={1}
          className="mt-0.5 text-[12px] font-semibold text-foreground"
        >
          {category || "—"}
        </Text>
      </View>

      {/* FEATURED */}

      <View className="min-h-[92px] flex-1 rounded-[14px] bg-white px-3 py-3.5">
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#EEF5EC]">
          <Ionicons
            name={item.isFeatured ? "star" : "star-outline"}
            size={15}
            color={COLORS.green}
          />
        </View>

        <Text className="mt-2 text-[9px] font-bold uppercase tracking-[1px] text-soft-muted">
          Featured
        </Text>

        <Text className="mt-0.5 text-[12px] font-semibold text-foreground">
          {item.isFeatured ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   FOCUS
========================================================= */

function FocusSection({ item }: { item: AyurvedaDetailData }) {
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
        subtitle="The wellness areas associated with this content."
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
        subtitle="Potential wellness benefits described for this content."
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
                    ? "leaf-outline"
                    : index % 3 === 1
                      ? "sparkles-outline"
                      : "heart-outline"
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
   INGREDIENTS
========================================================= */

function IngredientsSection({ ingredients }: { ingredients?: Ingredient[] }) {
  if (!ingredients?.length) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Ingredients"
        subtitle="Ingredients associated with this Ayurvedic content."
      />

      <View className="overflow-hidden rounded-[16px] bg-white">
        {ingredients.map((ingredient, index) => (
          <View
            key={`${ingredient.name}-${index}`}
            className={`px-4 py-4 ${
              index !== ingredients.length - 1
                ? "border-b border-[#ECE8DF]"
                : ""
            }`}
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons name="leaf-outline" size={17} color={COLORS.herb} />
              </View>

              <Text className="ml-3 flex-1 text-[13px] font-semibold text-foreground">
                {ingredient.name || "Ingredient"}
              </Text>
            </View>

            {ingredient.description ? (
              <Text className="mt-2 ml-12 text-[12px] leading-5 text-muted">
                {ingredient.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </>
  );
}

/* =========================================================
   USAGE
========================================================= */

function UsageSection({ usage }: { usage?: string }) {
  if (!usage) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Usage"
        subtitle="Information provided for using this content."
      />

      <View className="rounded-[16px] bg-white px-4 py-4">
        <View className="flex-row">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={COLORS.green}
            />
          </View>

          <Text className="ml-3 flex-1 text-[12px] leading-5 text-muted">
            {usage}
          </Text>
        </View>
      </View>
    </>
  );
}

/* =========================================================
   DROPDOWN
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
                  style={{
                    color: accent,
                  }}
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

function GuidelinesSection({ item }: { item: AyurvedaDetailData }) {
  const hasContent =
    item.suitableFor?.length ||
    item.precautions?.length ||
    item.contraindications?.length;

  if (!hasContent) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Guidelines"
        subtitle="Important information to read before using this content."
      />

      <View className="overflow-hidden rounded-[16px] bg-white">
        <DetailDropdown
          title="Suitable for"
          icon="people-outline"
          items={item.suitableFor}
          defaultOpen
        />

        <DetailDropdown
          title="Precautions"
          icon="shield-checkmark-outline"
          items={item.precautions}
          accent={COLORS.warning}
        />

        <DetailDropdown
          title="Not suitable for"
          icon="alert-circle-outline"
          items={item.contraindications}
          accent={COLORS.warning}
        />
      </View>
    </>
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
      title: "Digestion",
      icon: "restaurant-outline" as const,
      values: formatList(recommendedFor.digestion),
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
        subtitle="Wellness areas associated with this Ayurveda content."
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
   INFORMATION
========================================================= */

function PracticeInformation({ item }: { item: AyurvedaDetailData }) {
  const rows = [
    {
      label: "Type",
      value: formatLabel(item.type),
    },

    {
      label: "Category",
      value: formatLabel(item.category),
    },
  ].filter((row) => row.value);

  return (
    <>
      <SectionTitle title="Content information" />

      <View className="rounded-[16px] bg-white px-4">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={`flex-row items-center justify-between py-3.5 ${
              index !== rows.length - 1 || item.isFeatured
                ? "border-b border-[#ECE8DF]"
                : ""
            }`}
          >
            <Text className="text-[12px] text-muted">{row.label}</Text>

            <Text className="max-w-[55%] text-right text-[12px] font-semibold text-foreground">
              {row.value}
            </Text>
          </View>
        ))}

        {item.isFeatured ? (
          <View className="flex-row items-center py-3.5">
            <Ionicons name="star-outline" size={15} color={COLORS.green} />

            <Text className="ml-2 text-[12px] font-semibold text-[#4D6A50]">
              Featured wellness content
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

function AyurvedaQuote() {
  return (
    <View className="mt-9 px-5 pb-2 pt-2">
      <Text className="text-center text-[34px] leading-8 text-[#7D9A79]">
        “
      </Text>

      <Text className="mt-1 text-center font-serif text-[16px] leading-6 text-[#555A53]">
        Balance begins with understanding the way you live.
      </Text>

      <View className="mt-4 h-px w-10 self-center bg-[#D3CEC2]" />

      <Text className="mt-3 text-center text-[10px] text-[#8A8B84]">
        Explore Ayurveda with awareness
      </Text>
    </View>
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function AyurvedaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const scrollRef = React.useRef<ScrollView>(null);

  const [item, setItem] = useState<AyurvedaDetailData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Ayurveda content not found.");

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAyurvedaRecommendation(String(id));

        setItem(data as AyurvedaDetailData);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this Ayurveda content.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const title = useMemo(() => {
    return item?.title || item?.name || "Ayurvedic Wellness";
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
          Preparing your Ayurveda content...
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
            Content unavailable
          </Text>

          <Text className="mt-2 text-center text-[12px] leading-5 text-muted">
            {error || "This Ayurveda content could not be found."}
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

  const category = formatLabel(item.category);

  const type = formatLabel(item.type);

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

        <View className="mt-5">
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

          {type ? <MetaItem icon="grid-outline" label={type} /> : null}
        </View>

        {/* CTA */}

        <ExploreButton />

        {/* ACTIONS */}

        <ActionButtons
          onIntroduction={() =>
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            })
          }
        />

        {/* =================================================
            THREE INFORMATION CARDS
        ================================================= */}

        <SectionTitle
          title="Wellness content"
          subtitle="A quick overview of this Ayurvedic content."
        />

        <AyurvedaInfoCards item={item} />

        {/* FOCUS */}

        <FocusSection item={item} />

        {/* BENEFITS */}

        <BenefitsSection benefits={item.benefits} />

        {/* INGREDIENTS */}

        <IngredientsSection ingredients={item.ingredients} />

        {/* USAGE */}

        <UsageSection usage={item.usage} />

        {/* GUIDELINES */}

        <GuidelinesSection item={item} />

        {/* PERSONAL RELEVANCE */}

        <PersonalRelevance recommendedFor={item.recommendedFor} />

        {/* TAGS */}

        <TagsSection tags={item.tags} />

        {/* INFORMATION */}

        <PracticeInformation item={item} />

        {/* QUOTE */}

        <AyurvedaQuote />
      </ScrollView>
    </SafeAreaView>
  );
}
