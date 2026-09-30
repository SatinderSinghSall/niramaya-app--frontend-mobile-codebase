import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getDashboard } from "@/services/dashboard.service";

import {
  getFeaturedAyurveda,
  getFeaturedYoga,
  getRecommendations,
} from "@/services/explore.service";

import { DashboardData } from "@/types/dashboard";

import { ExploreItem, RecommendationItem } from "@/types/explore";
import ProgressCTA from "@/components/home/ProgressCTA";
import GoalsCTA from "@/components/home/GoalsCTA";
import HealthProfileCTA from "@/components/home/HealthProfileCTA";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import { getUnreadNotificationCount } from "@/services/notification.service";
import { useDrawer } from "@/components/navigation/DrawerContext";

/* ==========================================================================
   COLORS
========================================================================== */

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",

  text: "#263128",
  muted: "#777C74",
  softMuted: "#A0A29A",

  green: "#4D6A50",
  darkGreen: "#304B36",

  turquoise: "#28A5AC",

  border: "#E4DED3",

  sage: "#D9E5D4",
  sand: "#E9DEC9",
};

/* ==========================================================================
   IMAGES
========================================================================== */

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=90";

const WISDOM_IMAGE =
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=88";

const CALM_IMAGE =
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=88";

const NATURE_IMAGE =
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=88";

const YOGA_IMAGE =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=88";

const AYURVEDA_IMAGE =
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=88";

const SHORT_IMAGE_1 =
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=700&q=88";

const SHORT_IMAGE_2 =
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=88";

const SHORT_IMAGE_3 =
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=700&q=88";

/* ==========================================================================
   TYPES
========================================================================== */

type HomeContentItem = ExploreItem | RecommendationItem | any;

/* ==========================================================================
   HELPERS
========================================================================== */

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getTodayDate() {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date());
}

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "U";
}

function getItemTitle(item: HomeContentItem) {
  return item?.title || item?.name || "Wellness Practice";
}

function getItemDescription(item: HomeContentItem) {
  return item?.description || item?.shortDescription || "";
}

function getItemCategory(item: HomeContentItem) {
  const value = item?.category || item?.type || item?.resultType || "";

  if (!value) {
    return "";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getItemImage(item: HomeContentItem, fallback: string) {
  return (
    item?.imageUrl ||
    item?.image ||
    item?.thumbnailUrl ||
    item?.thumbnail ||
    item?.coverImage ||
    item?.featuredImage ||
    fallback
  );
}

/* ==========================================================================
   HEADER
========================================================================== */

function HomeHeader({
  firstName,
  lastName,
  unreadCount,
}: {
  firstName: string;
  lastName: string;
  unreadCount: number;
}) {
  const { openDrawer } = useDrawer();

  return (
    <View className="flex-row items-center justify-between">
      {/* ================================================================
          LEFT — MENU + GREETING
      ================================================================ */}

      <View className="flex-1 flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={openDrawer}
          className="mr-3.5 h-11 w-11 items-center justify-center rounded-full border border-[#E3DED4] bg-white"
        >
          <Ionicons name="menu-outline" size={25} color={COLORS.text} />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-[11px] font-medium text-[#858C85]">
            Namaskaram
          </Text>

          <Text
            numberOfLines={1}
            className="mt-0.5 font-serif text-[22px] font-semibold leading-[26px] text-foreground"
          >
            {firstName || "Welcome"}
          </Text>

          <Text className="mt-1 text-[10px] font-medium text-[#989E97]">
            {getTodayDate()}
          </Text>
        </View>
      </View>

      {/* ================================================================
          RIGHT — NOTIFICATIONS + PROFILE
      ================================================================ */}

      <View className="ml-2 flex-row items-center">
        {/* Notification */}

        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => router.push("/(main)/notifications")}
          className="relative mr-2.5 h-11 w-11 items-center justify-center rounded-full border border-[#E3DED4] bg-white"
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={COLORS.text}
          />

          {unreadCount > 0 ? (
            <View className="absolute -right-1 -top-1 min-h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-[#F7F3EA] bg-[#4D6A50] px-1">
              <Text className="text-[7px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>

        {/* Profile */}

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.push("/(main)/profile")}
          className="h-11 w-11 items-center justify-center rounded-full border border-[#D8D2C7] bg-[#E7E1D5]"
        >
          <Text className="text-[12px] font-bold text-[#4D6A50]">
            {getInitials(firstName, lastName)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ==========================================================================
   HERO
========================================================================== */

function HeroSection() {
  return (
    <View className="mt-4 overflow-hidden rounded-[4px] bg-white">
      <Image
        source={{ uri: HERO_IMAGE }}
        resizeMode="cover"
        className="h-[205px] w-full"
      />

      <View className="absolute inset-x-0 bottom-0 h-[75px] bg-black/10" />
    </View>
  );
}

/* ==========================================================================
   DAILY THOUGHT
========================================================================== */

function DailyThought() {
  return (
    <View className="items-center bg-white px-5 pb-3 pt-1">
      <View className="-mt-6 h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#F5FAF7]">
        <Text className="font-serif text-[27px] leading-7 text-[#28A5AC]">
          “
        </Text>
      </View>

      <Text className="mt-3 text-center font-serif text-[13px] leading-[20px] text-[#303830]">
        You cannot be receptive when you are too full of yourself. The less you
        are, the more you receive.
      </Text>

      <Text className="mt-1 text-center text-[9px] text-[#999B94]">
        Begin your day with a little space.
      </Text>
    </View>
  );
}

/* ==========================================================================
   START DAY
========================================================================== */

function StartDayButton() {
  return (
    <View className="bg-white px-3 pb-3 pt-2">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(main)/yoga")}
        className="h-[42px] flex-row items-center justify-center rounded-[5px] border border-[#29A5AC]"
      >
        <Ionicons name="play-outline" size={13} color={COLORS.turquoise} />

        <Text className="ml-1.5 text-[10px] font-semibold text-[#249DA4]">
          Start Your Day
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ==========================================================================
   SECTION HEADER
========================================================================== */

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-end justify-between">
      <Text className="font-serif text-[18px] font-bold text-foreground">
        {title}
      </Text>

      {action && onAction ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onAction}>
          <Text className="text-[9px] font-bold text-[#169BA3]">{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   PRACTICE CARD
========================================================================== */

function PracticeCard({
  item,
  type,
  onPress,
}: {
  item: HomeContentItem;
  type: "yoga" | "ayurveda";
  onPress: () => void;
}) {
  const fallback = type === "yoga" ? YOGA_IMAGE : AYURVEDA_IMAGE;

  const image = getItemImage(item, fallback);

  const title = getItemTitle(item);

  const category =
    getItemCategory(item) || (type === "yoga" ? "Yoga" : "Ayurveda");

  const duration = item?.duration || item?.durationMinutes;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mr-3 w-[194px] overflow-hidden rounded-[5px] border border-[#E3DDD2] bg-white"
    >
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        className="h-[135px] w-full"
      />

      <View className="p-2.5">
        <View className="flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className="max-w-[120px] text-[8px] text-[#777C74]"
          >
            {category}
          </Text>

          {duration ? (
            <Text className="text-[8px] font-semibold text-[#777C74]">
              {duration} min
            </Text>
          ) : null}
        </View>

        <Text
          numberOfLines={2}
          className="mt-1.5 font-serif text-[13px] font-bold leading-[17px] text-foreground"
        >
          {title}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          className="mt-2.5 h-[30px] items-center justify-center rounded-[4px] bg-[#28A5AC]"
        >
          <Text className="text-[9px] font-bold text-white">Explore</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   RECOMMENDED PRACTICES
========================================================================== */

function getItemId(item: any): string | null {
  return item?._id || item?.id || item?.yogaId || item?.ayurvedaId || null;
}

function RecommendedPractices({
  yoga,
  ayurveda,
  onYoga,
  onAyurveda,
}: {
  yoga: ExploreItem[];
  ayurveda: ExploreItem[];
  onYoga: (id: string) => void;
  onAyurveda: (id: string) => void;
}) {
  const items = [
    ...yoga.slice(0, 3).map((item, index) => ({
      item,
      type: "yoga" as const,
      index,
    })),

    ...ayurveda.slice(0, 3).map((item, index) => ({
      item,
      type: "ayurveda" as const,
      index,
    })),
  ];

  if (!items.length) {
    return null;
  }

  return (
    <View className="mt-7">
      <SectionHeader title="Recommended Practices" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: 10,
        }}
      >
        {items.map(({ item, type, index }) => {
          if (!item) {
            return null;
          }

          const itemId = getItemId(item);

          return (
            <PracticeCard
              key={`${type}-${itemId || index}`}
              item={item}
              type={type}
              onPress={() => {
                if (!itemId) {
                  console.warn(`Missing ${type} item ID`, item);
                  return;
                }

                if (type === "yoga") {
                  onYoga(itemId);
                } else {
                  onAyurveda(itemId);
                }
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ==========================================================================
   WISDOM CARD
========================================================================== */

function WisdomCard() {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push("/(main)/search")}
      className="overflow-hidden rounded-[5px] bg-white"
    >
      <Image
        source={{ uri: WISDOM_IMAGE }}
        resizeMode="cover"
        className="h-[125px] w-full"
      />

      <View className="px-3.5 py-3">
        <Text className="font-serif text-[15px] font-bold text-foreground">
          A little wisdom for today
        </Text>

        <Text
          numberOfLines={2}
          className="mt-1 text-[10px] leading-[15px] text-muted"
        >
          Discover simple ideas that help you slow down, become aware and
          reconnect with yourself.
        </Text>

        <View className="mt-2 flex-row items-center">
          <Text className="text-[9px] font-bold text-[#1B9EA5]">
            Explore wisdom
          </Text>

          <Ionicons
            name="arrow-forward"
            size={10}
            color={COLORS.turquoise}
            style={{ marginLeft: 4 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   WISDOM TILES
========================================================================== */

function WisdomTiles() {
  return (
    <View className="mt-3 flex-row">
      <TouchableOpacity
        activeOpacity={0.9}
        className="mr-1.5 h-[125px] flex-1 overflow-hidden rounded-[5px]"
      >
        <Image
          source={{ uri: CALM_IMAGE }}
          resizeMode="cover"
          className="h-full w-full"
        />

        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute bottom-3 left-3">
          <Text className="font-serif text-[15px] font-bold text-white">
            Breathe
          </Text>

          <Text className="mt-0.5 text-[8px] text-white/90">
            Return to yourself
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        className="ml-1.5 h-[125px] flex-1 overflow-hidden rounded-[5px]"
      >
        <Image
          source={{ uri: NATURE_IMAGE }}
          resizeMode="cover"
          className="h-full w-full"
        />

        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute bottom-3 left-3">
          <Text className="font-serif text-[15px] font-bold text-white">
            Stillness
          </Text>

          <Text className="mt-0.5 text-[8px] text-white/90">
            Make some space
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

/* ==========================================================================
   POPULAR PRACTICES
========================================================================== */

function PracticeRow({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      className="mb-2 flex-row items-center rounded-[5px] border border-[#E5DFD4] bg-white px-2.5 py-2"
    >
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        className="h-9 w-9 rounded-[4px]"
      />

      <View className="ml-2.5 flex-1">
        <Text
          numberOfLines={1}
          className="font-serif text-[11px] font-semibold text-foreground"
        >
          {title}
        </Text>

        <Text className="mt-0.5 text-[8px] text-muted">{subtitle}</Text>
      </View>

      <View className="h-7 w-7 items-center justify-center rounded-full bg-[#F0EFEB]">
        <Ionicons name="ellipsis-horizontal" size={13} color="#72766F" />
      </View>
    </TouchableOpacity>
  );
}

function PopularPractices() {
  return (
    <View className="mt-7">
      <SectionHeader
        title="Popular Practices"
        action="See All"
        onAction={() => router.push("/(main)/yoga")}
      />

      <PracticeRow
        title="Nadi Shodhana"
        subtitle="Breathing practice"
        image={CALM_IMAGE}
      />

      <PracticeRow
        title="Bhramari"
        subtitle="Calming breath"
        image={NATURE_IMAGE}
      />

      <PracticeRow
        title="Morning Yoga"
        subtitle="Movement and awareness"
        image={YOGA_IMAGE}
      />
    </View>
  );
}

/* ==========================================================================
   SHORT CARD
========================================================================== */

function ShortCard({ title, image }: { title: string; image: string }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="mr-2.5 h-[190px] w-[125px] overflow-hidden rounded-[5px] bg-black"
    >
      <Image
        source={{ uri: image }}
        resizeMode="cover"
        className="h-full w-full"
      />

      <View className="absolute inset-0 bg-black/15" />

      <View className="absolute left-2 top-2 rounded-[3px] bg-white px-1.5 py-1">
        <Text className="text-[7px] font-bold text-[#333]">NEW</Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-black/45 px-2.5 py-2.5">
        <Text
          numberOfLines={4}
          className="font-serif text-[10px] font-semibold leading-[14px] text-white"
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   SHORTS
========================================================================== */

function WellnessShorts() {
  return (
    <View className="mt-7">
      <SectionHeader
        title="Wellness Shorts"
        action="See All"
        onAction={() => router.push("/(main)/search")}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ShortCard
          title="Slow down. Breathe. Give yourself a little space."
          image={SHORT_IMAGE_1}
        />

        <ShortCard
          title="Awareness changes the way you experience your day."
          image={SHORT_IMAGE_2}
        />

        <ShortCard
          title="Wellbeing begins with the way you live every day."
          image={SHORT_IMAGE_3}
        />
      </ScrollView>
    </View>
  );
}

/* ==========================================================================
   LARGE FEATURE BANNER
========================================================================== */

function FeatureBanner() {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push("/(main)/yoga")}
      className="mt-5 overflow-hidden rounded-[5px]"
    >
      <Image
        source={{ uri: YOGA_IMAGE }}
        resizeMode="cover"
        className="h-[225px] w-full"
      />

      <View className="absolute inset-0 bg-black/20" />

      <View className="absolute bottom-4 left-4 right-4">
        <Text className="text-[8px] font-semibold uppercase tracking-[1.5px] text-white">
          Niramaya wellness
        </Text>

        <Text className="mt-1 font-serif text-[22px] font-bold text-white">
          Make space for yourself.
        </Text>

        <View className="mt-3 self-start rounded-[4px] bg-white px-4 py-2.5">
          <Text className="text-[9px] font-bold text-[#304B36]">
            Explore Now
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   FOOTER
========================================================================== */

function HomeFooter() {
  return (
    <View className="items-center pb-3 pt-10">
      <View className="h-px w-8 bg-[#D6D0C4]" />

      <Text className="mt-4 font-serif text-[15px] text-[#8B8D85]">
        Niramaya
      </Text>

      <Text className="mt-1 text-[9px] text-[#A0A29B]">
        A space for your wellbeing
      </Text>
    </View>
  );
}

/* ==========================================================================
   LOADING
========================================================================== */

function HomeLoading() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 40,
        }}
      >
        <View className="flex-row justify-between">
          <View>
            <View className="h-2.5 w-16 rounded bg-[#E5E0D6]" />
            <View className="mt-2 h-5 w-28 rounded bg-[#E5E0D6]" />
            <View className="mt-1.5 h-2.5 w-20 rounded bg-[#E5E0D6]" />
          </View>

          <View className="h-9 w-20 rounded-full bg-[#E5E0D6]" />
        </View>

        <View className="mt-4 h-[205px] rounded-[4px] bg-[#E5E0D6]" />

        <View className="items-center bg-white px-5 pb-4 pt-1">
          <View className="-mt-6 h-10 w-10 rounded-full bg-[#E5E0D6]" />

          <View className="mt-4 h-4 w-[85%] rounded bg-[#E5E0D6]" />

          <View className="mt-2 h-4 w-[65%] rounded bg-[#E5E0D6]" />

          <View className="mt-4 h-[42px] w-full rounded bg-[#E5E0D6]" />
        </View>

        <View className="mt-7 h-6 w-52 rounded bg-[#E5E0D6]" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          {[1, 2].map((item) => (
            <View
              key={item}
              className="mr-3 w-[194px] overflow-hidden rounded-[5px] bg-white"
            >
              <View className="h-[135px] bg-[#E5E0D6]" />

              <View className="p-2.5">
                <View className="h-2 w-12 rounded bg-[#E5E0D6]" />

                <View className="mt-2 h-4 w-[85%] rounded bg-[#E5E0D6]" />

                <View className="mt-2 h-[30px] rounded bg-[#E5E0D6]" />
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="mt-7 h-6 w-36 rounded bg-[#E5E0D6]" />

        <View className="mt-3 h-[165px] rounded-[5px] bg-[#E5E0D6]" />

        <View className="mt-7 h-6 w-40 rounded bg-[#E5E0D6]" />

        <View className="mt-3 h-12 rounded bg-[#E5E0D6]" />
        <View className="mt-2 h-12 rounded bg-[#E5E0D6]" />
        <View className="mt-2 h-12 rounded bg-[#E5E0D6]" />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ==========================================================================
   ERROR
========================================================================== */

function HomeError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center justify-center bg-background px-6"
    >
      <View className="w-full rounded-[6px] border border-[#E3DDD2] bg-white p-6">
        <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-[#E8F0E4]">
          <Ionicons name="leaf-outline" size={24} color={COLORS.green} />
        </View>

        <Text className="mt-4 text-center font-serif text-[21px] font-bold text-foreground">
          Welcome to Niramaya
        </Text>

        <Text className="mt-2 text-center text-[11px] leading-[18px] text-muted">
          {message}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRetry}
          className="mt-5 items-center rounded-[5px] bg-[#4D6A50] py-3"
        >
          <Text className="text-[10px] font-bold text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   HOME SCREEN
========================================================================== */

export default function HomeScreen() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );

  const [featuredYoga, setFeaturedYoga] = useState<ExploreItem[]>([]);

  const [featuredAyurveda, setFeaturedAyurveda] = useState<ExploreItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------
     LOAD
  ------------------------------------------------------------------------ */

  const loadHome = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const [
        dashboardData,
        recommendationData,
        yogaData,
        ayurvedaData,
        unreadCount,
      ] = await Promise.all([
        getDashboard(),
        getRecommendations("all", 10),
        getFeaturedYoga(),
        getFeaturedAyurveda(),
        getUnreadNotificationCount(),
      ]);

      setDashboard(dashboardData);

      setUnreadNotificationCount(unreadCount);

      setRecommendations(recommendationData || []);

      setFeaturedYoga(yogaData || []);

      setFeaturedAyurveda(ayurvedaData || []);
    } catch (err: any) {
      console.error("Home loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your home.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ------------------------------------------------------------------------
     INITIAL LOAD
  ------------------------------------------------------------------------ */

  useEffect(() => {
    loadHome(true);
  }, [loadHome]);

  /* ------------------------------------------------------------------------
     REFRESH WHEN SCREEN BECOMES ACTIVE
  ------------------------------------------------------------------------ */

  useFocusEffect(
    useCallback(() => {
      loadHome(false);

      return undefined;
    }, [loadHome]),
  );

  /* ------------------------------------------------------------------------
     PULL TO REFRESH
  ------------------------------------------------------------------------ */

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadHome(false);
  }, [loadHome]);

  /* ------------------------------------------------------------------------
     RECOMMENDATIONS
  ------------------------------------------------------------------------ */

  const recommendedYoga = useMemo(() => {
    return recommendations.filter(
      (item: any) => item?.resultType === "yoga" || item?.type === "yoga",
    );
  }, [recommendations]);

  const recommendedAyurveda = useMemo(() => {
    return recommendations.filter(
      (item: any) =>
        item?.resultType === "ayurveda" || item?.type === "ayurveda",
    );
  }, [recommendations]);

  const homeYoga = recommendedYoga.length > 0 ? recommendedYoga : featuredYoga;

  const homeAyurveda =
    recommendedAyurveda.length > 0 ? recommendedAyurveda : featuredAyurveda;

  /* ------------------------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------------------------ */

  const openYoga = (id: string) => {
    router.push({
      pathname: "/(main)/yoga/[id]",
      params: {
        id,
      },
    });
  };

  const openAyurveda = (id: string) => {
    router.push({
      pathname: "/(main)/ayurveda/[id]",
      params: {
        id,
      },
    });
  };

  /* ------------------------------------------------------------------------
     LOADING
  ------------------------------------------------------------------------ */

  if (loading) {
    return <HomeLoading />;
  }

  /* ------------------------------------------------------------------------
     ERROR
  ------------------------------------------------------------------------ */

  if (error && !dashboard) {
    return <HomeError message={error} onRetry={() => loadHome(true)} />;
  }

  if (!dashboard) {
    return null;
  }

  /* ------------------------------------------------------------------------
     USER
  ------------------------------------------------------------------------ */

  const firstName = dashboard.user?.firstName || "Friend";

  const lastName = dashboard.user?.lastName || "";

  /* ------------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------ */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 40,
        }}
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <HomeHeader
          firstName={firstName}
          lastName={lastName}
          unreadCount={unreadNotificationCount}
        />

        {/* ================================================================
            HERO
        ================================================================ */}

        <HeroSection />

        {/* ================================================================
            DAILY THOUGHT
        ================================================================ */}

        <DailyThought />

        {/* ================================================================
            START YOUR DAY
        ================================================================ */}

        <StartDayButton />

        {/* ================================================================
            DAILY PROGRESS
        ================================================================ */}

        {/* Health Profile CTA */}
        <HealthProfileCTA />

        <ProgressCTA />

        {/* ================================================================
            RECOMMENDED PRACTICES
        ================================================================ */}

        <RecommendedPractices
          yoga={homeYoga}
          ayurveda={homeAyurveda}
          onYoga={openYoga}
          onAyurveda={openAyurveda}
        />

        {/* Goals CTA */}
        <GoalsCTA />

        {/* ================================================================
            DAILY WISDOM
        ================================================================ */}

        <View className="mt-8">
          <SectionHeader
            title="Daily Wisdom"
            action="See All"
            onAction={() => router.push("/(main)/search")}
          />

          <WisdomCard />

          <WisdomTiles />
        </View>

        {/*Consultation CTA  */}
        <ConsultationCTA />

        {/* ================================================================
            POPULAR PRACTICES
        ================================================================ */}

        <PopularPractices />

        {/* ================================================================
            WELLNESS SHORTS
        ================================================================ */}

        <WellnessShorts />

        {/* ================================================================
            FEATURE BANNER
        ================================================================ */}

        <FeatureBanner />

        {/* ================================================================
            FOOTER
        ================================================================ */}

        <HomeFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
