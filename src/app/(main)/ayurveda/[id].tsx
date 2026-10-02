import React, { useCallback, useEffect, useState } from "react";

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
  getAyurvedaById,
  incrementAyurvedaViewCount,
} from "@/services/explore.service";

import { ExploreItem } from "@/types/explore";

/* -------------------------------------------------------------------------- */

/* Colors                                                                     */

/* -------------------------------------------------------------------------- */

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

  warning: "#A75D43",

  warningSoft: "#F5E6DE",

  herb: "#70885F",
};

/* -------------------------------------------------------------------------- */

/* Types                                                                      */

/* -------------------------------------------------------------------------- */

type Ingredient = {
  name?: string;

  description?: string;

  quantity?: string;

  form?: string;
};

type PropertyData = {
  rasa?: string[];

  guna?: string[];

  virya?: string;

  vipaka?: string;
};

type RecommendedFor = {
  energyLevels?: string[];

  digestion?: string[];

  stressLevels?: string[];

  sleepQualities?: string[];

  activityLevels?: string[];

  concerns?: string[];

  goalCategories?: string[];
};

type SourceItem = {
  title?: string;

  url?: string;

  publisher?: string;
};

type AyurvedaDetailData = ExploreItem & {
  slug?: string;

  imageUrl?: string;

  image?: string;

  thumbnailUrl?: string;

  videoUrl?: string;

  type?: string;

  category?: string;

  shortDescription?: string;

  durationMinutes?: number;

  difficulty?: string;

  bestTime?: string[];

  frequency?: string;

  duration?: string;

  preparation?: string;

  usage?: string;

  howToUse?: string[];

  doshas?: string[];

  prakriti?: string[];

  properties?: PropertyData;

  bodySystems?: string[];

  wellnessGoals?: string[];

  tags?: string[];

  benefits?: string[];

  suitableFor?: string[];

  ingredients?: Ingredient[];

  precautions?: string[];

  contraindications?: string[];

  recommendedFor?: RecommendedFor;

  traditionalUseNote?: string;

  evidenceNote?: string;

  sources?: SourceItem[];

  isActive?: boolean;

  isFeatured?: boolean;

  viewCount?: number;
};

/* -------------------------------------------------------------------------- */

/* Helpers                                                                    */

/* -------------------------------------------------------------------------- */

function formatLabel(value?: string) {
  if (!value) return "";

  return value

    .replace(/\_/g, " ")

    .replace(/-/g, " ")

    .replace(/\s+/g, " ")

    .trim()

    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatList(values?: string[]) {
  if (!values?.length) return [];

  return values.filter(Boolean).map((value) => formatLabel(value));
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

/* -------------------------------------------------------------------------- */

/* Header                                                                     */

/* -------------------------------------------------------------------------- */

function DetailHeader({
  onBack,
  onShare,
}: {
  onBack: () => void;
  onShare: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onBack}
        className="h-11 w-11 items-center justify-center rounded-full bg-white"
        style={{
          borderWidth: 1,
          borderColor: "rgba(229,224,214,0.95)",
          shadowColor: "#203426",
          shadowOpacity: 0.07,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        <Ionicons name="arrow-back" size={19} color={COLORS.text} />
      </TouchableOpacity>

      <View className="rounded-full bg-white px-4 py-2">
        <Text
          className="text-[10px] font-bold uppercase tracking-[1.8px]"
          style={{ color: COLORS.green }}
        >
          Ayurveda
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onShare}
        className="h-11 w-11 items-center justify-center rounded-full bg-white"
        style={{
          borderWidth: 1,
          borderColor: "rgba(229,224,214,0.95)",
          shadowColor: "#203426",
          shadowOpacity: 0.07,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        }}
      >
        <Ionicons name="share-outline" size={19} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

function HeroImage({ item }: { item: AyurvedaDetailData }) {
  const imageUrl = item.imageUrl || item.image || item.thumbnailUrl || "";

  if (imageUrl) {
    return (
      <View
        className="mt-5 overflow-hidden rounded-[28px]"
        style={{ backgroundColor: COLORS.lightGreen }}
      >
        <Image
          source={{ uri: imageUrl }}
          className="h-[238px] w-full"
          resizeMode="cover"
        />

        <View className="absolute bottom-0 left-0 right-0 px-5 py-4">
          <View
            className="self-start rounded-full px-3 py-1.5"
            style={{ backgroundColor: "rgba(35,55,40,0.72)" }}
          >
            <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-white">
              Ayurvedic wellness
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className="mt-5 h-[238px] overflow-hidden rounded-[28px]"
      style={{ backgroundColor: "#E2E8D9" }}
    >
      <View className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#CAD9BE]" />

      <View className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#C6D5BA]" />

      <View className="flex-1 items-center justify-center">
        <View className="h-[72px] w-[72px] items-center justify-center rounded-full bg-white/80">
          <Ionicons name="leaf-outline" size={36} color={COLORS.green} />
        </View>

        <Text className="mt-4 text-[10px] font-bold uppercase tracking-[2px] text-[#627761]">
          Ayurvedic wellness
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Meta Pills                                                                 */

/* -------------------------------------------------------------------------- */

function MetaPill({
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
      className="mb-2 mr-2 flex-row items-center rounded-full px-3 py-2"
      style={{
        backgroundColor: highlighted ? COLORS.lighterGreen : COLORS.surface,

        borderWidth: highlighted ? 0 : 1,

        borderColor: COLORS.border,
      }}
    >
      <Ionicons
        name={icon}
        size={13}
        color={highlighted ? COLORS.green : COLORS.softMuted}
      />

      <Text
        className="ml-1.5 text-[10px] font-semibold"
        style={{ color: highlighted ? COLORS.green : COLORS.muted }}
      >
        {label}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Section Title                                                              */

/* -------------------------------------------------------------------------- */

function SectionTitle({
  title,

  subtitle,
}: {
  title: string;

  subtitle?: string;
}) {
  return (
    <View className="mb-3 mt-7">
      <Text
        className="text-[20px] font-bold"
        style={{ color: COLORS.text, fontFamily: "serif" }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          className="mt-1 text-[11px] leading-4"
          style={{ color: COLORS.muted }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Intro                                                                      */

/* -------------------------------------------------------------------------- */

function IntroSection({ item }: { item: AyurvedaDetailData }) {
  const title = item.title || item.name || "Ayurvedic Wellness";
  const description = item.description || item.shortDescription;

  return (
    <View className="mt-6">
      <View
        className="mb-3 h-1 w-10 rounded-full"
        style={{ backgroundColor: COLORS.green }}
      />

      <Text
        className="text-[29px] leading-[36px]"
        style={{ color: COLORS.text, fontFamily: "serif", fontWeight: "700" }}
      >
        {title}
      </Text>

      {item.shortDescription ? (
        <Text
          className="mt-2 text-[13px] font-semibold leading-5"
          style={{ color: COLORS.green }}
        >
          {item.shortDescription}
        </Text>
      ) : null}

      {description ? (
        <Text
          className="mt-3 text-[12.5px] leading-[21px]"
          style={{ color: COLORS.muted }}
        >
          {description}
        </Text>
      ) : null}

      <View className="mt-4 flex-row flex-wrap">
        {item.category ? (
          <MetaPill
            icon="leaf-outline"
            label={formatLabel(item.category)}
            highlighted
          />
        ) : null}
        {item.type ? (
          <MetaPill icon="grid-outline" label={formatLabel(item.type)} />
        ) : null}
        {item.difficulty ? (
          <MetaPill
            icon="speedometer-outline"
            label={formatLabel(item.difficulty)}
          />
        ) : null}
        {item.durationMinutes ? (
          <MetaPill icon="time-outline" label={`${item.durationMinutes} min`} />
        ) : null}
        {item.isFeatured ? (
          <MetaPill icon="star" label="Featured" highlighted />
        ) : null}
      </View>
    </View>
  );
}

function QuickFacts({ item }: { item: AyurvedaDetailData }) {
  const facts = [
    {
      label: "Best time",
      value: item.bestTime?.length ? formatList(item.bestTime).join(", ") : "",
      icon: "sunny-outline" as const,
    },
    {
      label: "Frequency",
      value: item.frequency || "",
      icon: "repeat-outline" as const,
    },
    {
      label: "Duration",
      value: item.duration || "",
      icon: "hourglass-outline" as const,
    },
  ].filter((fact) => fact.value);

  if (!facts.length) return null;

  return (
    <>
      <SectionTitle
        title="Quick guide"
        subtitle="At-a-glance details for building this into your wellness routine."
      />

      <View className="flex-row">
        {facts.map((fact, index) => (
          <View
            key={fact.label}
            className="rounded-[18px] bg-white p-3.5"
            style={{
              flex: 1,
              marginLeft: index === 0 ? 0 : 5,
              marginRight: index === facts.length - 1 ? 0 : 5,
              borderWidth: 1,
              borderColor: COLORS.border,
              minHeight: 112,
            }}
          >
            <View className="h-8 w-8 items-center justify-center rounded-[10px] bg-[#EEF5EC]">
              <Ionicons name={fact.icon} size={15} color={COLORS.green} />
            </View>
            <Text
              className="mt-3 text-[8.5px] font-bold uppercase tracking-[0.9px]"
              style={{ color: COLORS.softMuted }}
            >
              {fact.label}
            </Text>
            <Text
              className="mt-1.5 text-[11px] font-semibold leading-4"
              style={{ color: COLORS.text }}
              numberOfLines={3}
            >
              {fact.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

function ChipList({
  values,

  accent = COLORS.green,

  background = COLORS.lighterGreen,
}: {
  values?: string[];

  accent?: string;

  background?: string;
}) {
  const formatted = formatList(values);

  if (!formatted.length) return null;

  return (
    <View className="flex-row flex-wrap">
      {uniqueValues(formatted).map((value, index) => (
        <View
          key={`${value}-${index}`}
          className="mb-2 mr-2 rounded-full px-3 py-2"
          style={{ backgroundColor: background }}
        >
          <Text className="text-[10px] font-semibold" style={{ color: accent }}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Dosha & Prakriti                                                           */

/* -------------------------------------------------------------------------- */

function DoshaSection({ item }: { item: AyurvedaDetailData }) {
  const hasDoshas = Boolean(item.doshas?.length);

  const hasPrakriti = Boolean(item.prakriti?.length);

  if (!hasDoshas && !hasPrakriti) return null;

  return (
    <>
      <SectionTitle
        title="Dosha & Prakriti"
        subtitle="Ayurvedic constitution and dosha associations provided for this content."
      />

      <View
        className="rounded-[18px] bg-white p-4"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {hasDoshas ? (
          <View>
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons name="leaf-outline" size={17} color={COLORS.green} />
              </View>

              <View className="ml-3">
                <Text
                  className="text-[13px] font-bold"
                  style={{ color: COLORS.text }}
                >
                  Associated doshas
                </Text>

                <Text
                  className="mt-0.5 text-[10px]"
                  style={{ color: COLORS.softMuted }}
                >
                  Traditional dosha associations
                </Text>
              </View>
            </View>

            <View className="mt-3">
              <ChipList values={item.doshas} />
            </View>
          </View>
        ) : null}

        {hasDoshas && hasPrakriti ? (
          <View
            className="my-4 h-px"
            style={{ backgroundColor: COLORS.border }}
          />
        ) : null}

        {hasPrakriti ? (
          <View>
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F2ECDD]">
                <Ionicons
                  name="person-outline"
                  size={17}
                  color={COLORS.green}
                />
              </View>

              <View className="ml-3">
                <Text
                  className="text-[13px] font-bold"
                  style={{ color: COLORS.text }}
                >
                  Prakriti
                </Text>

                <Text
                  className="mt-0.5 text-[10px]"
                  style={{ color: COLORS.softMuted }}
                >
                  Constitution associations
                </Text>
              </View>
            </View>

            <View className="mt-3">
              <ChipList
                values={item.prakriti}
                background="#F4F1E9"
                accent="#686C65"
              />
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Ayurvedic Properties                                                       */

/* -------------------------------------------------------------------------- */

function PropertiesSection({ properties }: { properties?: PropertyData }) {
  if (!properties) return null;

  const rows = [
    {
      label: "Rasa",

      value: formatList(properties.rasa).join(", "),
    },

    {
      label: "Guna",

      value: formatList(properties.guna).join(", "),
    },

    {
      label: "Virya",

      value: properties.virya ? formatLabel(properties.virya) : "",
    },

    {
      label: "Vipaka",

      value: properties.vipaka ? formatLabel(properties.vipaka) : "",
    },
  ].filter((row) => row.value);

  if (!rows.length) return null;

  return (
    <>
      <SectionTitle
        title="Ayurvedic properties"
        subtitle="Traditional properties recorded for this content."
      />

      <View
        className="overflow-hidden rounded-[18px] bg-white"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {rows.map((row, index) => (
          <View
            key={row.label}
            className="flex-row items-start justify-between px-4 py-4"
            style={
              index !== rows.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: COLORS.border }
                : undefined
            }
          >
            <Text
              className="text-[12px] font-semibold"
              style={{ color: COLORS.muted }}
            >
              {row.label}
            </Text>

            <Text
              className="max-w-[65%] text-right text-[12px] font-semibold leading-5"
              style={{ color: COLORS.text }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Benefits                                                                   */

/* -------------------------------------------------------------------------- */

function BenefitsSection({ benefits }: { benefits?: string[] }) {
  if (!benefits?.length) return null;

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
            className="mb-2.5 flex-row items-start rounded-[15px] px-4 py-3.5"
            style={{ backgroundColor: "#EFE7D4" }}
          >
            <View className="mr-3 mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-white/75">
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

            <Text
              className="flex-1 text-[12px] leading-5"
              style={{ color: "#575344" }}
            >
              {benefit}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* How To Use                                                                 */

/* -------------------------------------------------------------------------- */

function HowToUseSection({ item }: { item: AyurvedaDetailData }) {
  const hasSteps = Boolean(item.howToUse?.length);

  const hasPreparation = Boolean(item.preparation);

  const hasUsage = Boolean(item.usage);

  if (!hasSteps && !hasPreparation && !hasUsage) return null;

  return (
    <>
      <SectionTitle
        title="How to use"
        subtitle="Practical information provided for using this Ayurvedic content."
      />

      <View
        className="overflow-hidden rounded-[18px] bg-white"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {hasPreparation ? (
          <View className="p-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons
                  name="construct-outline"
                  size={17}
                  color={COLORS.green}
                />
              </View>

              <Text
                className="ml-3 text-[13px] font-bold"
                style={{ color: COLORS.text }}
              >
                Preparation
              </Text>
            </View>

            <Text
              className="mt-3 text-[12px] leading-5"
              style={{ color: COLORS.muted }}
            >
              {item.preparation}
            </Text>
          </View>
        ) : null}

        {hasPreparation && (hasSteps || hasUsage) ? (
          <View className="h-px" style={{ backgroundColor: COLORS.border }} />
        ) : null}

        {hasSteps ? (
          <View className="p-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons name="list-outline" size={17} color={COLORS.green} />
              </View>

              <Text
                className="ml-3 text-[13px] font-bold"
                style={{ color: COLORS.text }}
              >
                Steps
              </Text>
            </View>

            <View className="mt-4">
              {item.howToUse?.map((step, index) => (
                <View
                  key={`${step}-${index}`}
                  className="mb-3 flex-row items-start"
                >
                  <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-[#E8F0E5]">
                    <Text
                      className="text-[9px] font-bold"
                      style={{ color: COLORS.green }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    className="flex-1 text-[12px] leading-5"
                    style={{ color: COLORS.muted }}
                  >
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {hasSteps && hasUsage ? (
          <View className="h-px" style={{ backgroundColor: COLORS.border }} />
        ) : null}

        {hasUsage ? (
          <View className="p-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F4F1E9]">
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={COLORS.green}
                />
              </View>

              <Text
                className="ml-3 text-[13px] font-bold"
                style={{ color: COLORS.text }}
              >
                Usage
              </Text>
            </View>

            <Text
              className="mt-3 text-[12px] leading-5"
              style={{ color: COLORS.muted }}
            >
              {item.usage}
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Ingredients                                                                */

/* -------------------------------------------------------------------------- */

function IngredientsSection({ ingredients }: { ingredients?: Ingredient[] }) {
  if (!ingredients?.length) return null;

  return (
    <>
      <SectionTitle
        title="Ingredients"
        subtitle="Ingredients associated with this Ayurvedic content."
      />

      <View
        className="overflow-hidden rounded-[18px] bg-white"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {ingredients.map((ingredient, index) => (
          <View
            key={`${ingredient.name || "ingredient"}-${index}`}
            className="px-4 py-4"
            style={
              index !== ingredients.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: COLORS.border }
                : undefined
            }
          >
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons name="leaf-outline" size={17} color={COLORS.herb} />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[13px] font-bold"
                  style={{ color: COLORS.text }}
                >
                  {ingredient.name || "Ingredient"}
                </Text>

                {ingredient.quantity || ingredient.form ? (
                  <Text
                    className="mt-1 text-[10px]"
                    style={{ color: COLORS.softMuted }}
                  >
                    {[ingredient.quantity, ingredient.form]

                      .filter(Boolean)

                      .join(" • ")}
                  </Text>
                ) : null}
              </View>
            </View>

            {ingredient.description ? (
              <Text
                className="mt-2 ml-12 text-[12px] leading-5"
                style={{ color: COLORS.muted }}
              >
                {ingredient.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Wellness Context                                                           */

/* -------------------------------------------------------------------------- */

function WellnessContext({ item }: { item: AyurvedaDetailData }) {
  const bodySystems = formatList(item.bodySystems);

  const wellnessGoals = formatList(item.wellnessGoals);

  const suitableFor = formatList(item.suitableFor);

  if (!bodySystems.length && !wellnessGoals.length && !suitableFor.length) {
    return null;
  }

  return (
    <>
      <SectionTitle
        title="Wellness context"
        subtitle="Areas and audiences associated with this content."
      />

      <View
        className="rounded-[18px] bg-white p-4"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {bodySystems.length ? (
          <View>
            <Text
              className="text-[12px] font-bold"
              style={{ color: COLORS.text }}
            >
              Body systems
            </Text>

            <View className="mt-3">
              <ChipList values={bodySystems} />
            </View>
          </View>
        ) : null}

        {bodySystems.length && wellnessGoals.length ? (
          <View
            className="my-4 h-px"
            style={{ backgroundColor: COLORS.border }}
          />
        ) : null}

        {wellnessGoals.length ? (
          <View>
            <Text
              className="text-[12px] font-bold"
              style={{ color: COLORS.text }}
            >
              Wellness goals
            </Text>

            <View className="mt-3">
              <ChipList
                values={wellnessGoals}
                background="#F4F1E9"
                accent="#686C65"
              />
            </View>
          </View>
        ) : null}

        {(bodySystems.length || wellnessGoals.length) && suitableFor.length ? (
          <View
            className="my-4 h-px"
            style={{ backgroundColor: COLORS.border }}
          />
        ) : null}

        {suitableFor.length ? (
          <View>
            <Text
              className="text-[12px] font-bold"
              style={{ color: COLORS.text }}
            >
              Suitable for
            </Text>

            <View className="mt-3">
              <ChipList
                values={suitableFor}
                background="#E9EFE5"
                accent={COLORS.green}
              />
            </View>
          </View>
        ) : null}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Personal Relevance                                                         */

/* -------------------------------------------------------------------------- */

function PersonalRelevance({
  recommendedFor,
}: {
  recommendedFor?: RecommendedFor;
}) {
  if (!recommendedFor) return null;

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

  if (!groups.length) return null;

  return (
    <>
      <SectionTitle
        title="Personal relevance"
        subtitle="Wellness areas associated with this Ayurveda content."
      />

      <View
        className="rounded-[18px] bg-white px-4"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {groups.map((group, index) => (
          <View
            key={group.title}
            className="py-4"
            style={
              index !== groups.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: COLORS.border }
                : undefined
            }
          >
            <View className="flex-row items-center">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons name={group.icon} size={15} color={COLORS.green} />
              </View>

              <Text
                className="ml-3 text-[12px] font-semibold"
                style={{ color: COLORS.text }}
              >
                {group.title}
              </Text>
            </View>

            <View className="mt-2.5 ml-11 flex-row flex-wrap">
              {uniqueValues(group.values).map((value, valueIndex) => (
                <View
                  key={`${value}-${valueIndex}`}
                  className="mb-1.5 mr-1.5 rounded-full bg-[#F4F1E9] px-2.5 py-1.5"
                >
                  <Text
                    className="text-[10px] font-medium"
                    style={{ color: "#686C65" }}
                  >
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

/* -------------------------------------------------------------------------- */

/* Safety                                                                     */

/* -------------------------------------------------------------------------- */

function SafetySection({ item }: { item: AyurvedaDetailData }) {
  const hasPrecautions = Boolean(item.precautions?.length);

  const hasContraindications = Boolean(item.contraindications?.length);

  if (!hasPrecautions && !hasContraindications) return null;

  return (
    <>
      <SectionTitle
        title="Safety information"
        subtitle="Read the safety information provided for this content before use."
      />

      <View
        className="overflow-hidden rounded-[18px]"
        style={{
          backgroundColor: COLORS.warningSoft,

          borderWidth: 1,

          borderColor: "#E8CFC3",
        }}
      >
        {hasPrecautions ? (
          <View className="p-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white/75">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={COLORS.warning}
                />
              </View>

              <Text
                className="ml-3 text-[13px] font-bold"
                style={{ color: COLORS.warning }}
              >
                Precautions
              </Text>
            </View>

            <View className="mt-3">
              {item.precautions?.map((value, index) => (
                <View
                  key={`${value}-${index}`}
                  className="mb-2.5 flex-row items-start"
                >
                  <Text
                    className="mr-2 text-[12px] font-bold"
                    style={{ color: COLORS.warning }}
                  >
                    •
                  </Text>

                  <Text
                    className="flex-1 text-[12px] leading-5"
                    style={{ color: "#6C5146" }}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {hasPrecautions && hasContraindications ? (
          <View className="h-px" style={{ backgroundColor: "#E8CFC3" }} />
        ) : null}

        {hasContraindications ? (
          <View className="p-4">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white/75">
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color={COLORS.warning}
                />
              </View>

              <Text
                className="ml-3 text-[13px] font-bold"
                style={{ color: COLORS.warning }}
              >
                Contraindications
              </Text>
            </View>

            <View className="mt-3">
              {item.contraindications?.map((value, index) => (
                <View
                  key={`${value}-${index}`}
                  className="mb-2.5 flex-row items-start"
                >
                  <Text
                    className="mr-2 text-[12px] font-bold"
                    style={{ color: COLORS.warning }}
                  >
                    •
                  </Text>

                  <Text
                    className="flex-1 text-[12px] leading-5"
                    style={{ color: "#6C5146" }}
                  >
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

/* -------------------------------------------------------------------------- */

/* Educational Notes                                                          */

/* -------------------------------------------------------------------------- */

function EducationalNotes({ item }: { item: AyurvedaDetailData }) {
  if (!item.traditionalUseNote && !item.evidenceNote) return null;

  return (
    <>
      <SectionTitle
        title="Traditional & educational notes"
        subtitle="Context supplied with this Ayurveda content."
      />

      {item.traditionalUseNote ? (
        <View
          className="rounded-[18px] p-4"
          style={{ backgroundColor: "#E2E7D8" }}
        >
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#CBD7C2]">
              <Ionicons
                name="leaf-outline"
                size={17}
                color={COLORS.darkGreen}
              />
            </View>

            <Text
              className="ml-3 text-[13px] font-bold"
              style={{ color: COLORS.darkGreen }}
            >
              Traditional use
            </Text>
          </View>

          <Text
            className="mt-3 text-[12px] leading-5"
            style={{ color: "#58705B" }}
          >
            {item.traditionalUseNote}
          </Text>
        </View>
      ) : null}

      {item.evidenceNote ? (
        <View
          className="mt-3 rounded-[18px] bg-white p-4"
          style={{ borderWidth: 1, borderColor: COLORS.border }}
        >
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
              <Ionicons name="school-outline" size={17} color={COLORS.green} />
            </View>

            <Text
              className="ml-3 text-[13px] font-bold"
              style={{ color: COLORS.text }}
            >
              Evidence / educational note
            </Text>
          </View>

          <Text
            className="mt-3 text-[12px] leading-5"
            style={{ color: COLORS.muted }}
          >
            {item.evidenceNote}
          </Text>
        </View>
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Sources                                                                    */

/* -------------------------------------------------------------------------- */

function SourcesSection({ sources }: { sources?: SourceItem[] }) {
  const validSources = (sources || []).filter(
    (source) => source.title || source.publisher || source.url,
  );

  if (!validSources.length) return null;

  const openSource = async (url?: string) => {
    if (!url) return;

    try {
      await Linking.openURL(url);
    } catch {
      // Ignore invalid/unavailable source URLs.
    }
  };

  return (
    <>
      <SectionTitle
        title="Sources"
        subtitle="References provided with this Ayurveda content."
      />

      <View
        className="overflow-hidden rounded-[18px] bg-white"
        style={{ borderWidth: 1, borderColor: COLORS.border }}
      >
        {validSources.map((source, index) => (
          <TouchableOpacity
            key={`${source.title || "source"}-${index}`}
            activeOpacity={source.url ? 0.75 : 1}
            disabled={!source.url}
            onPress={() => openSource(source.url)}
            className="p-4"
            style={
              index !== validSources.length - 1
                ? { borderBottomWidth: 1, borderBottomColor: COLORS.border }
                : undefined
            }
          >
            <View className="flex-row items-start">
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF5EC]">
                <Ionicons
                  name={source.url ? "open-outline" : "document-text-outline"}
                  size={16}
                  color={COLORS.green}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[12px] font-bold leading-5"
                  style={{ color: COLORS.text }}
                >
                  {source.title || "Reference"}
                </Text>

                {source.publisher ? (
                  <Text
                    className="mt-1 text-[10px]"
                    style={{ color: COLORS.softMuted }}
                  >
                    {source.publisher}
                  </Text>
                ) : null}

                {source.url ? (
                  <Text
                    numberOfLines={1}
                    className="mt-1 text-[10px]"
                    style={{ color: COLORS.green }}
                  >
                    {source.url}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* Tags                                                                       */

/* -------------------------------------------------------------------------- */

function TagsSection({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null;

  return (
    <>
      <SectionTitle title="Tags" />

      <View className="flex-row flex-wrap">
        {uniqueValues(tags).map((tag, index) => (
          <View
            key={`${tag}-${index}`}
            className="mb-2 mr-2 rounded-full border bg-white px-3 py-2"
            style={{ borderColor: COLORS.border }}
          >
            <Text
              className="text-[10px] font-medium"
              style={{ color: "#6F746D" }}
            >
              #{formatLabel(tag)}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/* View / Status                                                              */

/* -------------------------------------------------------------------------- */

function ContentStatus({ item }: { item: AyurvedaDetailData }) {
  return (
    <View className="mt-8 flex-row items-center justify-center">
      {item.isFeatured ? (
        <View className="mr-2 flex-row items-center rounded-full bg-[#E8F0E5] px-3 py-2">
          <Ionicons name="star" size={12} color={COLORS.green} />

          <Text
            className="ml-1.5 text-[10px] font-semibold"
            style={{ color: COLORS.green }}
          >
            Featured
          </Text>
        </View>
      ) : null}

      {typeof item.viewCount === "number" ? (
        <View className="flex-row items-center rounded-full bg-white px-3 py-2">
          <Ionicons name="eye-outline" size={12} color={COLORS.softMuted} />

          <Text className="ml-1.5 text-[10px]" style={{ color: COLORS.muted }}>
            {item.viewCount} views
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */

/* Skeleton                                                                    */

/* -------------------------------------------------------------------------- */

function AyurvedaDetailSkeleton() {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,

          paddingTop: 10,

          paddingBottom: 56,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="h-10 w-10 rounded-full bg-[#E8E3D9]" />

          <View className="h-5 w-24 rounded bg-[#E8E3D9]" />

          <View className="h-10 w-10" />
        </View>

        <View className="mt-5 h-[225px] rounded-[24px] bg-[#E5E0D6]" />

        <View className="mt-5 h-9 w-[82%] rounded bg-[#E5E0D6]" />

        <View className="mt-3 h-4 w-[65%] rounded bg-[#E8E3D9]" />

        <View className="mt-3 h-4 w-full rounded bg-[#E8E3D9]" />

        <View className="mt-2 h-4 w-[88%] rounded bg-[#E8E3D9]" />

        <View className="mt-5 flex-row">
          <View className="mr-2 h-9 w-24 rounded-full bg-[#E8E3D9]" />

          <View className="mr-2 h-9 w-20 rounded-full bg-[#E8E3D9]" />

          <View className="h-9 w-24 rounded-full bg-[#E8E3D9]" />
        </View>

        {[1, 2, 3, 4, 5].map((section) => (
          <View key={section} className="mt-9">
            <View className="h-6 w-40 rounded bg-[#E8E3D9]" />

            <View className="mt-2 h-3 w-56 rounded bg-[#E8E3D9]" />

            <View className="mt-3 h-28 rounded-[18px] bg-white" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */

/* Error                                                                      */

/* -------------------------------------------------------------------------- */

function AyurvedaDetailError({
  message,

  onBack,

  onRetry,
}: {
  message: string;

  onBack: () => void;

  onRetry: () => void;
}) {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <View className="px-5 pt-3">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.75}
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
          style={{ borderWidth: 1, borderColor: COLORS.border }}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-7">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#E3EBDD]">
          <Ionicons name="leaf-outline" size={30} color={COLORS.green} />
        </View>

        <Text
          className="mt-5 text-center text-[22px] font-bold"
          style={{ color: COLORS.text, fontFamily: "serif" }}
        >
          Content unavailable
        </Text>

        <Text
          className="mt-2 text-center text-[12px] leading-5"
          style={{ color: COLORS.muted }}
        >
          {message || "This Ayurveda content could not be found."}
        </Text>

        <TouchableOpacity
          onPress={onRetry}
          activeOpacity={0.8}
          className="mt-6 rounded-full px-7 py-3.5"
          style={{ backgroundColor: COLORS.green }}
        >
          <Text className="text-[12px] font-bold text-white">Try again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */

/* Main Screen                                                                */

/* -------------------------------------------------------------------------- */

export default function AyurvedaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [item, setItem] = useState<AyurvedaDetailData | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const loadAyurveda = useCallback(
    async (showLoader = true) => {
      if (!id) {
        setError("Ayurveda content not found.");

        setLoading(false);

        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const data = await getAyurvedaById(String(id));

        setItem(data as AyurvedaDetailData);

        incrementAyurvedaViewCount(String(id))
          .then((viewCount) => {
            if (typeof viewCount === "number") {
              setItem((current) =>
                current ? { ...current, viewCount } : current,
              );
            }
          })

          .catch(() => {
            // View tracking must never block the detail page.
          });
      } catch (err: any) {
        console.error("Ayurveda detail loading error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this Ayurveda content.",
        );
      } finally {
        setLoading(false);

        setRefreshing(false);
      }
    },

    [id],
  );

  useEffect(() => {
    loadAyurveda(true);
  }, [loadAyurveda]);

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadAyurveda(false);
  };

  const handleShare = useCallback(async () => {
    if (!item) return;

    const shareText = [
      item.title || item.name || "Ayurvedic Wellness",
      item.shortDescription || item.description || "",
      category ? `Category: ${category}` : "",
      type ? `Type: ${type}` : "",
      item.sources?.[0]?.url ? `Learn more: ${item.sources[0].url}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await Share.share({
        message: shareText,
        title: item.title || item.name || "Ayurvedic Wellness",
      });
    } catch (shareError) {
      console.log("Ayurveda share cancelled:", shareError);
    }
  }, [item, category, type]);

  const category = formatLabel(item?.category);

  const type = formatLabel(item?.type);

  if (loading) {
    return <AyurvedaDetailSkeleton />;
  }

  if (!item || error) {
    return (
      <AyurvedaDetailError
        message={error}
        onBack={() => router.back()}
        onRetry={() => loadAyurveda(true)}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,

          paddingTop: 10,

          paddingBottom: 56,
        }}
      >
        {/* Header */}

        <DetailHeader onBack={() => router.back()} onShare={handleShare} />

        {/* Hero */}

        <HeroImage item={item} />

        {/* Introduction */}

        <IntroSection item={item} />

        {/* Quick guide */}

        <QuickFacts item={item} />

        {/* About / focus */}

        {item.bodySystems?.length ||
        item.wellnessGoals?.length ||
        item.tags?.length ? (
          <>
            <SectionTitle
              title="About this practice"
              subtitle="The main wellness areas and themes associated with this content."
            />

            <View
              className="rounded-[18px] bg-white p-4"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              {item.bodySystems?.length ? (
                <View>
                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: COLORS.text }}
                  >
                    Body systems
                  </Text>

                  <View className="mt-3">
                    <ChipList values={item.bodySystems} />
                  </View>
                </View>
              ) : null}

              {item.wellnessGoals?.length ? (
                <View className={item.bodySystems?.length ? "mt-4" : ""}>
                  {item.bodySystems?.length ? (
                    <View
                      className="mb-4 h-px"
                      style={{ backgroundColor: COLORS.border }}
                    />
                  ) : null}

                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: COLORS.text }}
                  >
                    Wellness goals
                  </Text>

                  <View className="mt-3">
                    <ChipList
                      values={item.wellnessGoals}
                      background="#F4F1E9"
                      accent="#686C65"
                    />
                  </View>
                </View>
              ) : null}
            </View>
          </>
        ) : null}

        {/* Benefits */}

        <BenefitsSection benefits={item.benefits} />

        {/* Dosha */}

        <DoshaSection item={item} />

        {/* Ayurvedic properties */}

        <PropertiesSection properties={item.properties} />

        {/* How to use */}

        <HowToUseSection item={item} />

        {/* Ingredients */}

        <IngredientsSection ingredients={item.ingredients} />

        {/* Wellness context */}

        <WellnessContext item={item} />

        {/* Personal relevance */}

        <PersonalRelevance recommendedFor={item.recommendedFor} />

        {/* Safety */}

        <SafetySection item={item} />

        {/* Educational notes */}

        <EducationalNotes item={item} />

        {/* Tags */}

        <TagsSection tags={item.tags} />

        {/* Sources */}

        <SourcesSection sources={item.sources} />

        {/* Video */}

        {item.videoUrl ? (
          <>
            <SectionTitle
              title="Video"
              subtitle="Open the video associated with this content."
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => Linking.openURL(item.videoUrl!)}
              className="flex-row items-center rounded-[18px] p-4"
              style={{ backgroundColor: COLORS.green }}
            >
              <View className="h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <Ionicons name="play" size={20} color="#FFFFFF" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-bold text-white">
                  Watch this Ayurveda content
                </Text>

                <Text className="mt-1 text-[10px] text-white/75">
                  Open the associated video
                </Text>
              </View>

              <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : null}

        {/* Status */}

        <ContentStatus item={item} />

        {/* Closing message */}

        <View className="mt-10 items-center rounded-[24px] bg-[#EEF2E9] px-6 py-7">
          <View
            className="mb-5 h-px w-10"
            style={{ backgroundColor: COLORS.border }}
          />

          <Text
            className="text-center text-[19px] font-bold leading-7"
            style={{ color: COLORS.text, fontFamily: "serif" }}
          >
            Find balance{"\n"}in the way you live.
          </Text>

          <Text
            className="mt-3 text-center text-[11px] leading-5"
            style={{ color: COLORS.softMuted }}
          >
            Explore Ayurveda with awareness and choose practices thoughtfully.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
