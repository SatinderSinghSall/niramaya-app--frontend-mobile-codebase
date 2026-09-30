import React, { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
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

/* ==========================================================================
   TYPES
========================================================================== */

type Filter = "all" | GoalStatus;

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

  lightGreen: "#E7EFE3",
  lighterGreen: "#F0F5ED",

  border: "#E3DDD2",

  amber: "#B47A25",
  amberLight: "#F7EEDB",

  blue: "#52718B",
  blueLight: "#EAF0F4",

  grey: "#858980",
  greyLight: "#ECECE8",
};

/* ==========================================================================
   HELPERS
========================================================================== */

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

  return "sparkles-outline";
}

function clampProgress(value?: number) {
  return Math.min(Math.max(value || 0, 0), 100);
}

/* ==========================================================================
   PAGE HEADER
========================================================================== */

function GoalsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <View className="px-[18px] pt-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-5">
          <Text className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#718071]">
            Your journey
          </Text>

          <Text className="mt-1 font-serif text-[29px] font-bold leading-[34px] text-[#263128]">
            Goals
          </Text>

          <Text className="mt-1.5 text-[11px] leading-[17px] text-[#777C74]">
            Small intentions can become meaningful changes.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onCreate}
          className="h-12 w-12 items-center justify-center rounded-full bg-[#4D6A50]"
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ==========================================================================
   JOURNEY CARD
========================================================================== */

function JourneyCard({
  averageProgress,
  active,
  total,
}: {
  averageProgress: number;
  active: number;
  total: number;
}) {
  const progress = clampProgress(averageProgress);

  return (
    <View className="mx-[18px] mt-5 overflow-hidden rounded-[7px] bg-[#4D6A50] px-5 py-5">
      {/* Decorative shapes */}

      <View className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10" />

      <View className="absolute -bottom-14 right-16 h-28 w-28 rounded-full bg-white/5" />

      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-5">
          <Text className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#DDE8D9]">
            Wellness journey
          </Text>

          <Text className="mt-2 font-serif text-[21px] font-bold leading-[26px] text-white">
            Keep going, gently.
          </Text>

          <Text className="mt-1.5 text-[10px] leading-[16px] text-[#DDE8D9]">
            You have {active} active {active === 1 ? "goal" : "goals"} to focus
            on.
          </Text>
        </View>

        <View className="h-[58px] w-[58px] items-center justify-center rounded-full border border-white/30 bg-white/10">
          <Text className="text-[15px] font-bold text-white">{progress}%</Text>

          <Text className="text-[7px] text-[#DDE8D9]">progress</Text>
        </View>
      </View>

      <View className="mt-5">
        <View className="h-[5px] overflow-hidden rounded-full bg-white/20">
          <View
            className="h-full rounded-full bg-white"
            style={{
              width: `${progress}%`,
            }}
          />
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-[8px] text-[#DDE8D9]">
            {total} {total === 1 ? "goal" : "goals"} in your journey
          </Text>

          <Text className="text-[8px] font-semibold text-white">
            {progress}% complete
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ==========================================================================
   MINI STAT
========================================================================== */

function MiniStat({
  icon,
  label,
  value,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <View
      className={`flex-1 rounded-[6px] border px-3 py-3.5 ${
        active ? "border-[#D8E5D3] bg-[#F0F5ED]" : "border-[#E3DDD2] bg-white"
      }`}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          size={14}
          color={active ? COLORS.green : "#8B8E86"}
        />

        <Text
          className={`ml-1.5 text-[8px] font-semibold ${
            active ? "text-[#4D6A50]" : "text-[#8B8E86]"
          }`}
        >
          {label}
        </Text>
      </View>

      <Text
        className={`mt-2 font-serif text-[21px] font-bold ${
          active ? "text-[#4D6A50]" : "text-[#263128]"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

/* ==========================================================================
   FILTER
========================================================================== */

function FilterButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`mr-2 flex-row items-center rounded-full border px-3.5 py-2 ${
        active ? "border-[#4D6A50] bg-[#4D6A50]" : "border-[#DDD7CB] bg-white"
      }`}
    >
      <Text
        className={`text-[9px] font-semibold ${
          active ? "text-white" : "text-[#686D66]"
        }`}
      >
        {label}
      </Text>

      {count !== undefined ? (
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
      ) : null}
    </TouchableOpacity>
  );
}

/* ==========================================================================
   GOAL CARD
========================================================================== */

function GoalCard({ goal, onPress }: { goal: Goal; onPress: () => void }) {
  const progress = clampProgress(goal.progressPercentage);

  const status = getStatusConfig(goal.status);

  const categoryLabel = getGoalCategoryLabel(goal.category);

  const icon = getCategoryIconName(goal.category);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mb-3.5 rounded-[7px] border border-[#E3DDD2] bg-white px-4 py-4"
    >
      {/* Top row */}

      <View className="flex-row items-start">
        <View className="h-11 w-11 items-center justify-center rounded-[5px] bg-[#F0F4ED]">
          <Ionicons name={icon} size={20} color={COLORS.green} />
        </View>

        <View className="ml-3 flex-1 pr-2">
          <Text
            numberOfLines={2}
            className="font-serif text-[15px] font-bold leading-[19px] text-[#263128]"
          >
            {goal.title}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Ionicons name="leaf-outline" size={9} color="#92968D" />

            <Text className="ml-1 text-[8px] text-[#8B8E86]">
              {categoryLabel}
            </Text>
          </View>
        </View>

        <View
          className="flex-row items-center rounded-full px-2.5 py-1.5"
          style={{
            backgroundColor: status.background,
          }}
        >
          <Ionicons name={status.icon} size={10} color={status.color} />

          <Text
            className="ml-1 text-[8px] font-bold"
            style={{
              color: status.color,
            }}
          >
            {getGoalStatusLabel(goal.status)}
          </Text>
        </View>
      </View>

      {/* Progress */}

      <View className="mt-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-[8px] font-medium uppercase tracking-[0.8px] text-[#9A9C95]">
            Progress
          </Text>

          <Text
            className="text-[10px] font-bold"
            style={{
              color: status.color,
            }}
          >
            {progress}%
          </Text>
        </View>

        <View className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#EEECE6]">
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: status.progress,
            }}
          />
        </View>
      </View>

      {/* Current / Target */}

      <View className="mt-4 flex-row items-center rounded-[5px] bg-[#F8F6F1] px-3 py-2.5">
        <View className="flex-1">
          <Text className="text-[7px] uppercase tracking-[0.8px] text-[#9A9C95]">
            Current
          </Text>

          <Text className="mt-1 text-[11px] font-bold text-[#344038]">
            {goal.currentValue ?? 0}
            {goal.target?.unit ? ` ${goal.target.unit}` : ""}
          </Text>
        </View>

        <View className="h-7 w-7 items-center justify-center rounded-full bg-white">
          <Ionicons name="arrow-forward" size={12} color="#8B8E86" />
        </View>

        <View className="flex-1 items-end">
          <Text className="text-[7px] uppercase tracking-[0.8px] text-[#9A9C95]">
            Target
          </Text>

          <Text className="mt-1 text-[11px] font-bold text-[#344038]">
            {goal.target?.value ?? 0}
            {goal.target?.unit ? ` ${goal.target.unit}` : ""}
          </Text>
        </View>
      </View>

      {/* Bottom */}

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-[8px] text-[#9A9C95]">
          Tap to view goal details
        </Text>

        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#F1F3EE]">
          <Ionicons name="chevron-forward" size={12} color={COLORS.green} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   EMPTY STATE
========================================================================== */

function EmptyGoals({
  filter,
  onCreate,
}: {
  filter: Filter;
  onCreate: () => void;
}) {
  const isAll = filter === "all";

  return (
    <View className="items-center rounded-[7px] border border-[#E3DDD2] bg-white px-6 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-[#EEF4EB]">
        <Ionicons
          name={isAll ? "leaf-outline" : "filter-outline"}
          size={25}
          color={COLORS.green}
        />
      </View>

      <Text className="mt-4 text-center font-serif text-[19px] font-bold text-[#263128]">
        {isAll ? "Begin your journey" : "Nothing here yet"}
      </Text>

      <Text className="mt-1.5 max-w-[270px] text-center text-[10px] leading-[16px] text-[#777C74]">
        {isAll
          ? "Choose one small intention for your wellbeing and take the first step."
          : "There are no goals with this status right now."}
      </Text>

      {isAll ? (
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

/* ==========================================================================
   LOADING
========================================================================== */

function GoalsLoading() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F3EA]">
      <View className="px-[18px] pt-5">
        <View className="h-2.5 w-20 rounded-full bg-[#E5E0D6]" />

        <View className="mt-2 h-8 w-28 rounded bg-[#E5E0D6]" />

        <View className="mt-2 h-3 w-48 rounded bg-[#E5E0D6]" />

        <View className="mt-5 h-[155px] rounded-[7px] bg-[#E5E0D6]" />

        <View className="mt-4 flex-row">
          <View className="mr-2 h-[75px] flex-1 rounded-[6px] bg-[#E5E0D6]" />

          <View className="mr-2 h-[75px] flex-1 rounded-[6px] bg-[#E5E0D6]" />

          <View className="h-[75px] flex-1 rounded-[6px] bg-[#E5E0D6]" />
        </View>

        <View className="mt-7 h-5 w-32 rounded bg-[#E5E0D6]" />

        <View className="mt-3 h-10 w-full rounded-full bg-[#E5E0D6]" />

        <View className="mt-3 h-[220px] rounded-[7px] bg-[#E5E0D6]" />
      </View>

      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={COLORS.green} />

        <Text className="mt-3 text-[10px] text-[#777C74]">
          Preparing your goals...
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ==========================================================================
   ERROR
========================================================================== */

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
      <View className="w-full rounded-[7px] border border-[#E3DDD2] bg-white px-6 py-7">
        <View className="mx-auto h-14 w-14 items-center justify-center rounded-full bg-[#EEF4EB]">
          <Ionicons name="leaf-outline" size={24} color={COLORS.green} />
        </View>

        <Text className="mt-4 text-center font-serif text-[20px] font-bold text-[#263128]">
          Your goals are taking a moment
        </Text>

        <Text className="mt-2 text-center text-[10px] leading-[16px] text-[#777C74]">
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
   MAIN SCREEN
========================================================================== */

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const [filter, setFilter] = useState<Filter>("all");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------
     LOAD
  ------------------------------------------------------------------------ */

  const loadGoals = useCallback(async () => {
    try {
      setError("");

      const data = await getGoals();

      setGoals(data);
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

  /* ------------------------------------------------------------------------
     REFRESH WHEN ACTIVE
  ------------------------------------------------------------------------ */

  useFocusEffect(
    useCallback(() => {
      loadGoals();

      return undefined;
    }, [loadGoals]),
  );

  /* ------------------------------------------------------------------------
     FILTER
  ------------------------------------------------------------------------ */

  const filteredGoals = useMemo(() => {
    if (filter === "all") {
      return goals;
    }

    return goals.filter((goal) => goal.status === filter);
  }, [goals, filter]);

  /* ------------------------------------------------------------------------
     STATS
  ------------------------------------------------------------------------ */

  const stats = useMemo(() => {
    return {
      total: goals.length,

      active: goals.filter((goal) => goal.status === "active").length,

      paused: goals.filter((goal) => goal.status === "paused").length,

      completed: goals.filter((goal) => goal.status === "completed").length,

      cancelled: goals.filter((goal) => goal.status === "cancelled").length,
    };
  }, [goals]);

  /* ------------------------------------------------------------------------
     AVERAGE
  ------------------------------------------------------------------------ */

  const averageProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (total, goal) => total + clampProgress(goal.progressPercentage),
            0,
          ) / goals.length,
        )
      : 0;

  /* ------------------------------------------------------------------------
     LOADING
  ------------------------------------------------------------------------ */

  if (loading) {
    return <GoalsLoading />;
  }

  /* ------------------------------------------------------------------------
     ERROR
  ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------------ */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F7F3EA]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);

              await loadGoals();
            }}
            tintColor={COLORS.green}
          />
        }
        contentContainerStyle={{
          paddingBottom: 45,
        }}
      >
        {/* ================================================================
            HEADER
        ================================================================ */}

        <GoalsHeader onCreate={() => router.push("/(main)/goal-create")} />

        {/* ================================================================
            JOURNEY
        ================================================================ */}

        <JourneyCard
          averageProgress={averageProgress}
          active={stats.active}
          total={stats.total}
        />

        {/* ================================================================
            QUICK STATS
        ================================================================ */}

        <View className="mt-3 flex-row px-[18px]">
          <MiniStat icon="layers-outline" label="Total" value={stats.total} />

          <View className="w-2" />

          <MiniStat
            icon="radio-button-on-outline"
            label="Active"
            value={stats.active}
            active
          />

          <View className="w-2" />

          <MiniStat
            icon="checkmark-circle-outline"
            label="Done"
            value={stats.completed}
          />
        </View>

        {/* ================================================================
            GOALS SECTION
        ================================================================ */}

        <View className="mt-8 px-[18px]">
          <View className="flex-row items-end justify-between">
            <View className="flex-1">
              <Text className="font-serif text-[19px] font-bold text-[#263128]">
                Your intentions
              </Text>

              <Text className="mt-1 text-[9px] text-[#8B8E86]">
                {filteredGoals.length}{" "}
                {filteredGoals.length === 1 ? "goal" : "goals"} showing
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="sparkles-outline"
                size={12}
                color={COLORS.green}
              />

              <Text className="ml-1 text-[8px] font-semibold text-[#718071]">
                One step at a time
              </Text>
            </View>
          </View>

          {/* ==============================================================
              FILTERS
          ============================================================== */}

          <View className="mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

          {/* ==============================================================
              LIST
          ============================================================== */}

          <View className="mt-4">
            {filteredGoals.length === 0 ? (
              <EmptyGoals
                filter={filter}
                onCreate={() => router.push("/(main)/goal-create")}
              />
            ) : (
              filteredGoals.map((goal) => (
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
              ))
            )}
          </View>
        </View>

        {/* ================================================================
            BOTTOM NOTE
        ================================================================ */}

        {filteredGoals.length > 0 ? (
          <View className="items-center px-10 pb-3 pt-5">
            <Ionicons name="leaf-outline" size={17} color="#A5A99F" />

            <Text className="mt-2 text-center font-serif text-[13px] text-[#858980]">
              Progress is not about perfection.
            </Text>

            <Text className="mt-1 text-center text-[8px] leading-[13px] text-[#A0A29A]">
              Keep showing up for yourself, one day at a time.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
