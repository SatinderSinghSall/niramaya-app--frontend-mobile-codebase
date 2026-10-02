import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { getGoals } from "@/services/goal.service";

import {
  getGoalCategoryIcon,
  getGoalCategoryLabel,
  getGoalStatusLabel,
} from "@/constants/goals";

import { Goal, GoalStatus } from "@/types/goal";

/* ============================================================================
   TYPES
============================================================================ */

type Filter = "all" | GoalStatus;

/* ============================================================================
   CONSTANTS
============================================================================ */

const PAGE_SIZE = 5;

const COLORS = {
  background: "#F7F3EA",
  surface: "#FFFFFF",

  text: "#263128",
  muted: "#777C74",
  softMuted: "#A0A29A",

  green: "#4D6A50",
  darkGreen: "#304B36",

  lightGreen: "#E7EFE3",
  lighterGreen: "#F0F5ED",

  border: "#E1DCD2",

  amber: "#B47A25",
  amberLight: "#F7EEDB",

  grey: "#858980",
  greyLight: "#ECECE8",
};

/* ============================================================================
   HELPERS
============================================================================ */

function clampProgress(value?: number) {
  return Math.min(Math.max(value || 0, 0), 100);
}

function getStatusConfig(status: GoalStatus) {
  switch (status) {
    case "active":
      return {
        icon: "radio-button-on-outline" as const,
        color: COLORS.green,
        background: COLORS.lightGreen,
        progress: COLORS.green,
      };

    case "paused":
      return {
        icon: "pause-circle-outline" as const,
        color: COLORS.amber,
        background: COLORS.amberLight,
        progress: COLORS.amber,
      };

    case "completed":
      return {
        icon: "checkmark-circle-outline" as const,
        color: "#4D8060",
        background: "#E5F0E7",
        progress: "#4D8060",
      };

    case "cancelled":
      return {
        icon: "close-circle-outline" as const,
        color: COLORS.grey,
        background: COLORS.greyLight,
        progress: COLORS.grey,
      };

    default:
      return {
        icon: "ellipse-outline" as const,
        color: COLORS.grey,
        background: COLORS.greyLight,
        progress: COLORS.grey,
      };
  }
}

function getCategoryIconName(category: string): keyof typeof Ionicons.glyphMap {
  const icon = getGoalCategoryIcon(category);

  const value = String(icon || "").toLowerCase();

  if (value.includes("weight") || value.includes("fitness")) {
    return "fitness-outline";
  }

  if (value.includes("sleep")) {
    return "moon-outline";
  }

  if (value.includes("nutrition") || value.includes("food")) {
    return "nutrition-outline";
  }

  if (
    value.includes("mental") ||
    value.includes("stress") ||
    value.includes("mind")
  ) {
    return "leaf-outline";
  }

  if (value.includes("water") || value.includes("hydration")) {
    return "water-outline";
  }

  if (value.includes("yoga")) {
    return "body-outline";
  }

  return "leaf-outline";
}

/* ============================================================================
   SKELETON
============================================================================ */

function GoalSkeletonCard() {
  return (
    <View className="mb-3 rounded-[10px] border border-[#E3DED4] bg-white px-4 py-4">
      <View className="flex-row items-start">
        <View className="h-9 w-9 rounded-full bg-[#E9E6DE]" />

        <View className="ml-3 flex-1">
          <View className="h-4 w-[64%] rounded bg-[#E9E6DE]" />

          <View className="mt-2 h-2.5 w-[30%] rounded bg-[#EFEBE3]" />
        </View>

        <View className="h-3 w-12 rounded bg-[#E9E6DE]" />
      </View>

      <View className="mt-5 h-1 rounded-full bg-[#ECE9E1]" />

      <View className="mt-4 flex-row justify-between">
        <View className="h-3 w-16 rounded bg-[#ECE9E1]" />

        <View className="h-3 w-20 rounded bg-[#ECE9E1]" />
      </View>
    </View>
  );
}

function GoalsLoading() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F3EA]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* Header */}

        <View className="px-[18px] pt-2">
          <View className="h-2.5 w-20 rounded bg-[#E2DED4]" />

          <View className="mt-2 flex-row items-center">
            <View className="h-9 w-9 rounded-full bg-[#E7E3DA]" />

            <View className="ml-3 h-9 w-28 rounded bg-[#E2DED4]" />

            <View className="ml-auto h-10 w-10 rounded-full bg-[#DDE7DA]" />
          </View>

          <View className="mt-2 h-3 w-52 rounded bg-[#E9E5DC]" />
        </View>

        {/* Search */}

        <View className="mx-[18px] mt-5 h-[46px] rounded-[9px] bg-white">
          <View className="m-3 h-5 w-5 rounded-full bg-[#E9E6DE]" />
        </View>

        {/* Stats */}

        <View className="mt-4 flex-row px-[18px]">
          <View className="mr-2 h-[82px] flex-1 rounded-[9px] bg-white" />
          <View className="mr-2 h-[82px] flex-1 rounded-[9px] bg-white" />
          <View className="h-[82px] flex-1 rounded-[9px] bg-white" />
        </View>

        {/* Progress */}

        <View className="mx-[18px] mt-4 rounded-[10px] bg-white px-4 py-4">
          <View className="h-2.5 w-24 rounded bg-[#E8E4DA]" />

          <View className="mt-2 h-7 w-16 rounded bg-[#E8E4DA]" />

          <View className="mt-4 h-1 rounded-full bg-[#ECE9E1]" />
        </View>

        {/* Heading */}

        <View className="mx-[18px] mt-7">
          <View className="h-6 w-28 rounded bg-[#E5E1D8]" />

          <View className="mt-2 h-2.5 w-20 rounded bg-[#ECE8DF]" />
        </View>

        {/* Filters */}

        <View className="mt-4 flex-row px-[18px]">
          <View className="mr-2 h-9 w-16 rounded-full bg-[#E2DED4]" />

          <View className="mr-2 h-9 w-20 rounded-full bg-[#E9E5DC]" />

          <View className="mr-2 h-9 w-20 rounded-full bg-[#E9E5DC]" />

          <View className="h-9 w-24 rounded-full bg-[#E9E5DC]" />
        </View>

        {/* Cards */}

        <View className="mt-4 px-[18px]">
          <GoalSkeletonCard />
          <GoalSkeletonCard />
          <GoalSkeletonCard />
        </View>

        <View className="items-center pt-2">
          <ActivityIndicator size="small" color={COLORS.green} />

          <Text className="mt-2 text-[10px] text-[#8B8E86]">
            Loading your goals...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============================================================================
   HEADER
============================================================================ */

/*
 * IMPORTANT:
 * This intentionally keeps the original Goals header style.
 *
 * Only the back button is added beside "Goals".
 */

function GoalsHeader({
  onBack,
  onCreate,
}: {
  onBack: () => void;
  onCreate: () => void;
}) {
  return (
    <View className="px-[18px] pt-3">
      {/* Small eyebrow stays the same */}

      <Text className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#718071]">
        Your journey
      </Text>

      {/* Title row */}

      <View className="mt-1 flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onBack}
          className="mr-3 h-9 w-9 items-center justify-center rounded-full border border-[#DED9CF] bg-white"
        >
          <Ionicons name="chevron-back" size={18} color={COLORS.text} />
        </TouchableOpacity>

        <Text className="font-serif text-[29px] font-bold leading-[34px] text-[#263128]">
          Goals
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onCreate}
          className="ml-auto h-11 w-11 items-center justify-center rounded-full bg-[#4D6A50]"
        >
          <Ionicons name="add" size={23} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text className="mt-1.5 text-[11px] leading-[17px] text-[#777C74]">
        Small intentions can become meaningful changes.
      </Text>
    </View>
  );
}

/* ============================================================================
   SEARCH
============================================================================ */

function GoalSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="mx-[18px] mt-5 flex-row items-center rounded-[9px] border border-[#DED9CF] bg-white px-3.5">
      <Ionicons name="search-outline" size={18} color="#8A8F86" />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search goals"
        placeholderTextColor="#A2A59E"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        className="ml-2 flex-1 py-3 text-[12px] text-[#263128]"
      />

      {value.length > 0 ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onChange("")}
          className="h-8 w-8 items-center justify-center"
        >
          <Ionicons name="close-circle" size={17} color="#A2A59E" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ============================================================================
   STAT CARD
============================================================================ */

function StatCard({
  icon,
  label,
  value,
  active = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <View
      className={`flex-1 rounded-[9px] border px-3 py-3.5 ${
        active ? "border-[#D8E5D3] bg-[#F0F5ED]" : "border-[#E1DCD2] bg-white"
      }`}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          size={14}
          color={active ? COLORS.green : "#858980"}
        />

        <Text
          className={`ml-1.5 text-[8px] font-semibold ${
            active ? "text-[#4D6A50]" : "text-[#858980]"
          }`}
        >
          {label}
        </Text>
      </View>

      <Text
        className={`mt-2 font-serif text-[22px] font-bold ${
          active ? "text-[#4D6A50]" : "text-[#263128]"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

/* ============================================================================
   STATS
============================================================================ */

function GoalStats({
  total,
  active,
  completed,
}: {
  total: number;
  active: number;
  completed: number;
}) {
  return (
    <View className="mt-4 flex-row px-[18px]">
      <StatCard icon="layers-outline" label="Total" value={total} />

      <View className="w-2" />

      <StatCard
        icon="radio-button-on-outline"
        label="Active"
        value={active}
        active
      />

      <View className="w-2" />

      <StatCard
        icon="checkmark-circle-outline"
        label="Done"
        value={completed}
      />
    </View>
  );
}

/* ============================================================================
   PROGRESS SUMMARY
============================================================================ */

function ProgressSummary({
  progress,
  total,
}: {
  progress: number;
  total: number;
}) {
  return (
    <View className="mx-[18px] mt-4 rounded-[10px] border border-[#DED9CF] bg-white px-4 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[9px] font-semibold uppercase tracking-[1.1px] text-[#8A8F86]">
            Overall progress
          </Text>

          <View className="mt-1 flex-row items-baseline">
            <Text className="font-serif text-[27px] font-bold text-[#304B36]">
              {progress}%
            </Text>

            <Text className="ml-2 text-[10px] text-[#858980]">
              across {total} {total === 1 ? "goal" : "goals"}
            </Text>
          </View>
        </View>

        <Text className="text-[10px] font-medium text-[#8B8E86]">
          {progress === 100 ? "Complete" : "In progress"}
        </Text>
      </View>

      <View className="mt-4 h-[4px] overflow-hidden rounded-full bg-[#ECE9E1]">
        <View
          className="h-full rounded-full bg-[#4D6A50]"
          style={{
            width: `${progress}%`,
          }}
        />
      </View>
    </View>
  );
}

/* ============================================================================
   FILTER BUTTON
============================================================================ */

function FilterButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`mr-2 flex-row items-center rounded-full border px-3.5 py-2 ${
        active ? "border-[#4D6A50] bg-[#4D6A50]" : "border-[#DDD8CE] bg-white"
      }`}
    >
      <Text
        className={`text-[9px] font-semibold ${
          active ? "text-white" : "text-[#686D66]"
        }`}
      >
        {label}
      </Text>

      <View
        className={`ml-1.5 min-w-[17px] items-center rounded-full px-1 ${
          active ? "bg-white/20" : "bg-[#F1EFE9]"
        }`}
      >
        <Text
          className={`text-[8px] font-bold ${
            active ? "text-white" : "text-[#858980]"
          }`}
        >
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ============================================================================
   GOAL CARD
============================================================================ */

function GoalCard({ goal, onPress }: { goal: Goal; onPress: () => void }) {
  const progress = clampProgress(goal.progressPercentage);

  const status = getStatusConfig(goal.status);

  const categoryLabel = getGoalCategoryLabel(goal.category);

  const icon = getCategoryIconName(goal.category);

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      className="mb-3 rounded-[10px] border border-[#E0DBD1] bg-white px-4 py-4"
    >
      {/* Top */}

      <View className="flex-row items-start">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F0F4ED]">
          <Ionicons name={icon} size={17} color={COLORS.green} />
        </View>

        <View className="ml-3 flex-1 pr-2">
          <Text
            numberOfLines={2}
            className="font-serif text-[16px] font-bold leading-[20px] text-[#263128]"
          >
            {goal.title}
          </Text>

          <Text className="mt-1 text-[9px] text-[#8B8E86]">
            {categoryLabel}
          </Text>
        </View>

        <View className="items-end">
          <Text
            className="text-[9px] font-semibold"
            style={{
              color: status.color,
            }}
          >
            {getGoalStatusLabel(goal.status)}
          </Text>

          <Text
            className="mt-1 text-[11px] font-bold"
            style={{
              color: status.color,
            }}
          >
            {progress}%
          </Text>
        </View>
      </View>

      {/* Progress */}

      <View className="mt-4 h-[4px] overflow-hidden rounded-full bg-[#ECE9E1]">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: status.progress,
          }}
        />
      </View>

      {/* Values */}

      <View className="mt-3 flex-row items-center justify-between">
        <View>
          <Text className="text-[8px] uppercase tracking-[0.7px] text-[#A0A29A]">
            Current
          </Text>

          <Text className="mt-0.5 text-[10px] font-semibold text-[#3E4840]">
            {goal.currentValue ?? 0}
            {goal.target?.unit ? ` ${goal.target.unit}` : ""}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="mr-3 items-end">
            <Text className="text-[8px] uppercase tracking-[0.7px] text-[#A0A29A]">
              Target
            </Text>

            <Text className="mt-0.5 text-[10px] font-semibold text-[#3E4840]">
              {goal.target?.value ?? 0}
              {goal.target?.unit ? ` ${goal.target.unit}` : ""}
            </Text>
          </View>

          <View className="h-7 w-7 items-center justify-center rounded-full bg-[#F2F4EF]">
            <Ionicons name="chevron-forward" size={13} color={COLORS.green} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ============================================================================
   EMPTY STATE
============================================================================ */

function EmptyGoals({
  filter,
  search,
  onCreate,
  onClearSearch,
}: {
  filter: Filter;
  search: string;
  onCreate: () => void;
  onClearSearch: () => void;
}) {
  const searching = search.trim().length > 0;

  return (
    <View className="items-center rounded-[10px] border border-[#E1DCD2] bg-white px-6 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#EEF4EB]">
        <Ionicons
          name={
            searching
              ? "search-outline"
              : filter === "all"
                ? "leaf-outline"
                : "filter-outline"
          }
          size={24}
          color={COLORS.green}
        />
      </View>

      <Text className="mt-4 text-center font-serif text-[19px] font-bold text-[#263128]">
        {searching
          ? "No goals found"
          : filter === "all"
            ? "No goals yet"
            : "Nothing here yet"}
      </Text>

      <Text className="mt-2 max-w-[270px] text-center text-[10px] leading-[16px] text-[#777C74]">
        {searching
          ? "Try a different search or clear the search field."
          : filter === "all"
            ? "Start with one small goal and build from there."
            : "There are no goals with this status right now."}
      </Text>

      {searching ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onClearSearch}
          className="mt-5 rounded-full border border-[#D8D4CA] px-5 py-2.5"
        >
          <Text className="text-[10px] font-semibold text-[#4D6A50]">
            Clear search
          </Text>
        </TouchableOpacity>
      ) : filter === "all" ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onCreate}
          className="mt-5 flex-row items-center rounded-full bg-[#4D6A50] px-5 py-3"
        >
          <Ionicons name="add" size={15} color="#FFFFFF" />

          <Text className="ml-1.5 text-[10px] font-bold text-white">
            Create your first goal
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/* ============================================================================
   ERROR
============================================================================ */

function GoalsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center justify-center bg-[#F7F3EA] px-[18px]"
    >
      <View className="w-full rounded-[10px] border border-[#E1DCD2] bg-white px-6 py-8">
        <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-[#EEF4EB]">
          <Ionicons
            name="cloud-offline-outline"
            size={24}
            color={COLORS.green}
          />
        </View>

        <Text className="mt-4 text-center font-serif text-[20px] font-bold text-[#263128]">
          We couldn't load your goals
        </Text>

        <Text className="mt-2 text-center text-[10px] leading-[16px] text-[#777C74]">
          {message}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRetry}
          className="mt-5 items-center rounded-[7px] bg-[#4D6A50] py-3"
        >
          <Text className="text-[10px] font-bold text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ============================================================================
   MAIN SCREEN
============================================================================ */

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const [filter, setFilter] = useState<Filter>("all");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  /*
   * Progressive client-side pagination.
   */
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /*
   * Android keyboard height.
   */
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  /* ==========================================================================
     KEYBOARD
  ========================================================================== */

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const keyboardDidShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowSubscription.remove();
      keyboardDidHideSubscription.remove();
    };
  }, []);

  /* ==========================================================================
     LOAD
  ========================================================================== */

  const loadGoals = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getGoals();

      setGoals(data);

      setVisibleCount(PAGE_SIZE);
    } catch (err: any) {
      console.error("Goals loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your goals.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* ==========================================================================
     REFRESH ON FOCUS
  ========================================================================== */

  useFocusEffect(
    useCallback(() => {
      loadGoals();

      return undefined;
    }, [loadGoals]),
  );

  /* ==========================================================================
     FILTER + SEARCH
  ========================================================================== */

  const filteredGoals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return goals.filter((goal) => {
      const matchesStatus = filter === "all" || goal.status === filter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const title = String(goal.title || "").toLowerCase();

      const category = String(
        getGoalCategoryLabel(goal.category),
      ).toLowerCase();

      return title.includes(query) || category.includes(query);
    });
  }, [goals, filter, search]);

  /* ==========================================================================
     RESET PAGINATION
  ========================================================================== */

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, search]);

  /* ==========================================================================
     VISIBLE GOALS
  ========================================================================== */

  const visibleGoals = useMemo(() => {
    return filteredGoals.slice(0, visibleCount);
  }, [filteredGoals, visibleCount]);

  const hasMore = visibleCount < filteredGoals.length;

  /* ==========================================================================
     STATS
  ========================================================================== */

  const stats = useMemo(() => {
    return {
      total: goals.length,

      active: goals.filter((goal) => goal.status === "active").length,

      paused: goals.filter((goal) => goal.status === "paused").length,

      completed: goals.filter((goal) => goal.status === "completed").length,

      cancelled: goals.filter((goal) => goal.status === "cancelled").length,
    };
  }, [goals]);

  /* ==========================================================================
     AVERAGE PROGRESS
  ========================================================================== */

  const averageProgress = useMemo(() => {
    if (goals.length === 0) {
      return 0;
    }

    return Math.round(
      goals.reduce(
        (total, goal) => total + clampProgress(goal.progressPercentage),
        0,
      ) / goals.length,
    );
  }, [goals]);

  /* ==========================================================================
     LOAD MORE
  ========================================================================== */

  const loadMoreGoals = useCallback(() => {
    if (loadingMore || !hasMore || loading) {
      return;
    }

    setLoadingMore(true);

    /*
     * Small delay gives the user a visible loading
     * state while keeping the UI smooth.
     */
    setTimeout(() => {
      setVisibleCount((current) =>
        Math.min(current + PAGE_SIZE, filteredGoals.length),
      );

      setLoadingMore(false);
    }, 350);
  }, [loadingMore, hasMore, loading, filteredGoals.length]);

  /* ==========================================================================
     SCROLL
  ========================================================================== */

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;

      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);

      /*
       * Load before reaching the exact bottom.
       */
      if (distanceFromBottom < 220) {
        loadMoreGoals();
      }
    },
    [loadMoreGoals],
  );

  /* ==========================================================================
     INITIAL LOADING
  ========================================================================== */

  if (loading && goals.length === 0) {
    return <GoalsLoading />;
  }

  /* ==========================================================================
     INITIAL ERROR
  ========================================================================== */

  if (error && goals.length === 0) {
    return (
      <GoalsError
        message={error}
        onRetry={() => {
          setLoading(true);
          loadGoals();
        }}
      />
    );
  }

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F3EA]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadGoals(true)}
              tintColor={COLORS.green}
              colors={[COLORS.green]}
            />
          }
          contentContainerStyle={{
            /*
             * Keep this small.
             *
             * Android gets keyboard height + 32 so the
             * last goal can be reached while keyboard
             * stays open.
             */
            paddingBottom: Platform.OS === "android" ? keyboardHeight + 32 : 32,
          }}
        >
          {/* ================================================================
              HEADER
          ================================================================ */}

          <GoalsHeader
            onBack={() => router.back()}
            onCreate={() => router.push("/(main)/goal-create")}
          />

          {/* ================================================================
              SEARCH
          ================================================================ */}

          <GoalSearch value={search} onChange={setSearch} />

          {/* ================================================================
              STATS
          ================================================================ */}

          <GoalStats
            total={stats.total}
            active={stats.active}
            completed={stats.completed}
          />

          {/* ================================================================
              OVERALL PROGRESS
          ================================================================ */}

          <ProgressSummary progress={averageProgress} total={stats.total} />

          {/* ================================================================
              GOALS
          ================================================================ */}

          <View className="mt-7 px-[18px]">
            {/* Heading */}

            <View className="flex-row items-end justify-between">
              <View className="flex-1">
                <Text className="font-serif text-[20px] font-bold text-[#263128]">
                  Your goals
                </Text>

                <Text className="mt-1 text-[9px] text-[#8B8E86]">
                  {filteredGoals.length}{" "}
                  {filteredGoals.length === 1 ? "goal" : "goals"} found
                </Text>
              </View>

              {filteredGoals.length > 0 ? (
                <Text className="text-[9px] text-[#8B8E86]">
                  Showing {Math.min(visibleCount, filteredGoals.length)} of{" "}
                  {filteredGoals.length}
                </Text>
              ) : null}
            </View>

            {/* ============================================================
                FILTERS
            ============================================================ */}

            <View className="mt-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <FilterButton
                  label="All"
                  count={stats.total}
                  active={filter === "all"}
                  onPress={() => setFilter("all")}
                />

                <FilterButton
                  label="Active"
                  count={stats.active}
                  active={filter === "active"}
                  onPress={() => setFilter("active")}
                />

                <FilterButton
                  label="Paused"
                  count={stats.paused}
                  active={filter === "paused"}
                  onPress={() => setFilter("paused")}
                />

                <FilterButton
                  label="Completed"
                  count={stats.completed}
                  active={filter === "completed"}
                  onPress={() => setFilter("completed")}
                />

                <FilterButton
                  label="Cancelled"
                  count={stats.cancelled}
                  active={filter === "cancelled"}
                  onPress={() => setFilter("cancelled")}
                />
              </ScrollView>
            </View>

            {/* ============================================================
                REFRESH ERROR
            ============================================================ */}

            {error && goals.length > 0 ? (
              <View className="mt-3 flex-row items-center rounded-[8px] border border-[#E7D8BF] bg-[#FBF4E8] px-3 py-2.5">
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color={COLORS.amber}
                />

                <Text className="ml-2 flex-1 text-[9px] leading-[14px] text-[#7D6745]">
                  {error}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => loadGoals()}
                >
                  <Text className="text-[9px] font-bold text-[#7D6745]">
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* ============================================================
                LIST
            ============================================================ */}

            <View className="mt-4">
              {filteredGoals.length === 0 ? (
                <EmptyGoals
                  filter={filter}
                  search={search}
                  onClearSearch={() => setSearch("")}
                  onCreate={() => router.push("/(main)/goal-create")}
                />
              ) : (
                <>
                  {visibleGoals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      onPress={() =>
                        router.push({
                          pathname: "/(main)/goals/[id]",
                          params: {
                            id: goal._id,
                          },
                        })
                      }
                    />
                  ))}

                  {/* ======================================================
                      LOAD MORE
                  ====================================================== */}

                  {loadingMore ? (
                    <View className="items-center py-5">
                      <ActivityIndicator size="small" color={COLORS.green} />

                      <Text className="mt-2 text-[9px] text-[#8B8E86]">
                        Loading more goals...
                      </Text>
                    </View>
                  ) : hasMore ? (
                    <View className="items-center py-4">
                      <Text className="text-[9px] text-[#A0A29A]">
                        Scroll for more
                      </Text>
                    </View>
                  ) : (
                    <View className="items-center py-4">
                      <View className="h-px w-10 bg-[#DDD8CE]" />

                      <Text className="mt-3 text-[9px] text-[#A0A29A]">
                        All goals shown
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* ================================================================
              FOOTER
          ================================================================ */}

          {filteredGoals.length > 0 ? (
            <View className="items-center px-10 pb-2 pt-4">
              <Text className="text-center text-[9px] leading-[14px] text-[#A0A29A]">
                Keep your goals simple and achievable.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
