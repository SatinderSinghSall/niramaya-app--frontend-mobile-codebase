import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getProgressHistory,
  getProgressSummary,
} from "@/services/progress.service";
import { ProgressEntry, ProgressSummary } from "@/types/progress";

const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFFFF",
  text: "#263128",
  muted: "#7C827A",
  softMuted: "#A4A89F",
  green: "#4D6A50",
  darkGreen: "#304B36",
  lightGreen: "#EAF1E8",
  border: "#E5E3DB",
  red: "#C85C5C",
  lightRed: "#F8EAEA",
};

type DateFilter = "7" | "30" | "90" | "all";
type QuickFilter = "all" | "activity" | "notes" | "wellness";

const PAGE_SIZE = 7;

const getTodayString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getFilterStartDate = (filter: DateFilter) => {
  if (filter === "all") return undefined;

  const date = new Date();
  date.setDate(date.getDate() - (Number(filter) - 1));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getFilterEndDate = () => getTodayString();

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const formatMinutes = (minutes: number) => {
  if (!minutes) return "0 min";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
};

const getDateSearchValue = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.toLowerCase();
  }

  return [
    value,
    date.toLocaleDateString("en-IN"),
    date.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  ]
    .join(" ")
    .toLowerCase();
};

const getEntrySearchText = (entry: ProgressEntry) =>
  [
    getDateSearchValue(entry.date),
    entry.notes ?? "",
    ...(entry.completedActivities ?? []),
    entry.mood !== undefined ? `mood ${entry.mood}` : "",
    entry.energyLevel !== undefined ? `energy ${entry.energyLevel}` : "",
    entry.stressLevel !== undefined ? `stress ${entry.stressLevel}` : "",
    entry.sleepHours !== undefined ? `sleep ${entry.sleepHours}` : "",
    entry.sleepQuality !== undefined
      ? `sleep quality ${entry.sleepQuality}`
      : "",
    entry.waterIntakeLiters !== undefined
      ? `water ${entry.waterIntakeLiters}`
      : "",
    entry.steps !== undefined ? `steps ${entry.steps}` : "",
    entry.exerciseMinutes !== undefined
      ? `exercise ${entry.exerciseMinutes}`
      : "",
    entry.yogaMinutes !== undefined ? `yoga ${entry.yogaMinutes}` : "",
    entry.meditationMinutes !== undefined
      ? `meditation ${entry.meditationMinutes}`
      : "",
    entry.weightKg !== undefined ? `weight ${entry.weightKg}` : "",
  ]
    .join(" ")
    .toLowerCase();

const MetricCard = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit?: string;
}) => (
  <View className="w-[48.5%] rounded-[18px] border border-[#E5E3DB] bg-white px-4 py-4">
    <View className="flex-row items-center">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1E8]">
        <Ionicons name={icon} size={17} color={COLORS.green} />
      </View>
      <Text className="ml-2.5 flex-1 text-[11px] font-medium text-[#7C827A]">
        {label}
      </Text>
    </View>

    <View className="mt-3 flex-row items-baseline">
      <Text className="text-[20px] font-bold text-[#263128]">{value}</Text>
      {unit ? (
        <Text className="ml-1 text-[10px] text-[#7C827A]">{unit}</Text>
      ) : null}
    </View>
  </View>
);

const RatingBar = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | null;
  icon: keyof typeof Ionicons.glyphMap;
}) => {
  const percentage = Math.min(((value ?? 0) / 5) * 100, 100);

  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name={icon} size={15} color={COLORS.muted} />
          <Text className="ml-2 text-[12px] font-medium text-[#4E574F]">
            {label}
          </Text>
        </View>

        <Text className="text-[12px] font-bold text-[#263128]">
          {value !== null ? `${value}/5` : "—"}
        </Text>
      </View>

      <View className="h-1.5 overflow-hidden rounded-full bg-[#ECECE6]">
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: COLORS.green,
          }}
        />
      </View>
    </View>
  );
};

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="mr-2 rounded-full px-4 py-2.5"
    style={{
      backgroundColor: active ? COLORS.darkGreen : COLORS.surface,
      borderWidth: 1,
      borderColor: active ? COLORS.darkGreen : COLORS.border,
    }}
  >
    <Text
      className="text-[11px] font-semibold"
      style={{ color: active ? "#FFFFFF" : COLORS.muted }}
    >
      {label}
    </Text>
  </Pressable>
);

const SkeletonBlock = ({ className }: { className: string }) => (
  <View className={`rounded-2xl bg-[#E9E9E2] ${className}`} />
);

const ProgressSkeleton = () => (
  <SafeAreaView
    edges={["top"]}
    className="flex-1"
    style={{ backgroundColor: COLORS.background }}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 80,
      }}
    >
      <View className="flex-row items-center justify-between pt-5">
        <View>
          <SkeletonBlock className="h-7 w-32" />
          <SkeletonBlock className="mt-2 h-3 w-52" />
        </View>
        <SkeletonBlock className="h-11 w-11 rounded-2xl" />
      </View>

      <SkeletonBlock className="mt-5 h-12 w-full rounded-[18px]" />
      <SkeletonBlock className="mt-4 h-10 w-full rounded-full" />

      <View className="mt-6 rounded-[22px] bg-white p-5">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="mt-3 h-6 w-64" />
        <View className="mt-5 flex-row">
          <View className="flex-1">
            <SkeletonBlock className="h-7 w-14" />
            <SkeletonBlock className="mt-2 h-2.5 w-20" />
          </View>
          <View className="flex-1">
            <SkeletonBlock className="h-7 w-14" />
            <SkeletonBlock className="mt-2 h-2.5 w-20" />
          </View>
          <View className="flex-1">
            <SkeletonBlock className="h-7 w-14" />
            <SkeletonBlock className="mt-2 h-2.5 w-20" />
          </View>
        </View>
      </View>

      <SkeletonBlock className="mt-7 h-5 w-40" />

      <View className="mt-3 flex-row flex-wrap justify-between gap-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="h-[105px] w-[48.5%] rounded-[18px]"
          />
        ))}
      </View>

      <SkeletonBlock className="mt-7 h-5 w-44" />
      <View className="mt-3 rounded-[22px] bg-white p-5">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="mt-5 h-2 w-full" />
        <SkeletonBlock className="mt-5 h-2 w-full" />
        <SkeletonBlock className="mt-5 h-2 w-full" />
        <SkeletonBlock className="mt-5 h-2 w-full" />
      </View>

      <SkeletonBlock className="mt-7 h-5 w-36" />
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBlock
          key={index}
          className="mt-3 h-[125px] w-full rounded-[18px]"
        />
      ))}
    </ScrollView>
  </SafeAreaView>
);

const HistoryItem = ({
  entry,
  onPress,
}: {
  entry: ProgressEntry;
  onPress: () => void;
}) => {
  const activityCount = entry.completedActivities?.length ?? 0;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-[18px] border border-[#E5E3DB] bg-white p-4 active:opacity-80"
    >
      <View className="flex-row items-center">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#EAF1E8]">
          <Ionicons name="calendar-outline" size={18} color={COLORS.green} />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-[14px] font-bold text-[#263128]">
            {formatDate(entry.date)}
          </Text>
          <Text className="mt-0.5 text-[10px] text-[#8A9088]">
            Daily check-in
          </Text>
        </View>

        <View className="flex-row items-center">
          {entry.mood !== undefined ? (
            <View className="mr-2 rounded-full bg-[#F3F5F0] px-2.5 py-1.5">
              <Text className="text-[10px] font-semibold text-[#4D6A50]">
                Mood {entry.mood}/5
              </Text>
            </View>
          ) : null}
          <Ionicons name="chevron-forward" size={17} color="#9AA097" />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap">
        {entry.sleepHours !== undefined ? (
          <View className="mb-1.5 mr-1.5 rounded-md bg-[#F5F5F0] px-2.5 py-1.5">
            <Text className="text-[10px] text-[#657067]">
              Sleep {entry.sleepHours}h
            </Text>
          </View>
        ) : null}

        {entry.steps !== undefined ? (
          <View className="mb-1.5 mr-1.5 rounded-md bg-[#F5F5F0] px-2.5 py-1.5">
            <Text className="text-[10px] text-[#657067]">
              {entry.steps.toLocaleString()} steps
            </Text>
          </View>
        ) : null}

        {activityCount > 0 ? (
          <View className="mb-1.5 mr-1.5 rounded-md bg-[#F5F5F0] px-2.5 py-1.5">
            <Text className="text-[10px] text-[#657067]">
              {activityCount} {activityCount === 1 ? "activity" : "activities"}
            </Text>
          </View>
        ) : null}

        {entry.waterIntakeLiters !== undefined ? (
          <View className="mb-1.5 mr-1.5 rounded-md bg-[#F5F5F0] px-2.5 py-1.5">
            <Text className="text-[10px] text-[#657067]">
              Water {entry.waterIntakeLiters}L
            </Text>
          </View>
        ) : null}
      </View>

      {entry.notes ? (
        <Text
          numberOfLines={1}
          className="mt-2 text-[10px] leading-4 text-[#737B73]"
        >
          {entry.notes}
        </Text>
      ) : null}
    </Pressable>
  );
};

const EmptyHistory = ({
  searchActive,
  onAdd,
}: {
  searchActive: boolean;
  onAdd: () => void;
}) => (
  <View className="items-center rounded-[20px] border border-[#E5E3DB] bg-white px-6 py-9">
    <View className="h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1E8]">
      <Ionicons
        name={searchActive ? "search-outline" : "analytics-outline"}
        size={22}
        color={COLORS.green}
      />
    </View>

    <Text className="mt-4 text-[15px] font-bold text-[#263128]">
      {searchActive ? "No matching check-ins" : "No check-ins yet"}
    </Text>

    <Text className="mt-2 max-w-[290px] text-center text-[11px] leading-5 text-[#7C827A]">
      {searchActive
        ? "Try another search or change the filters."
        : "Record your first daily check-in to start building your history."}
    </Text>

    {!searchActive ? (
      <Pressable
        onPress={onAdd}
        className="mt-4 rounded-xl bg-[#304B36] px-4 py-2.5"
      >
        <Text className="text-[11px] font-bold text-white">Add check-in</Text>
      </Pressable>
    ) : null}
  </View>
);

export default function ProgressScreen() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [history, setHistory] = useState<ProgressEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("30");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const hasLoadedOnce = useRef(false);

  const loadData = useCallback(
    async (
      requestedPage: number,
      options?: {
        showLoader?: boolean;
        showRefreshing?: boolean;
      },
    ) => {
      const showLoader = options?.showLoader ?? false;
      const showRefreshing = options?.showRefreshing ?? false;

      try {
        if (showLoader) {
          setLoading(true);
        }

        if (showRefreshing) {
          setRefreshing(true);
        }

        setError("");

        const startDate = getFilterStartDate(dateFilter);
        const endDate = getFilterEndDate();

        const [summaryData, historyData] = await Promise.all([
          getProgressSummary({
            startDate,
            endDate,
          }),
          getProgressHistory({
            startDate,
            endDate,
            page: requestedPage,
            limit: PAGE_SIZE,
          }),
        ]);

        setSummary(summaryData);
        setHistory(historyData.entries ?? []);

        const pagination = historyData.pagination;

        setPage(pagination?.page ?? requestedPage);
        setTotalPages(Math.max(pagination?.totalPages ?? 1, 1));
        setTotalEntries(pagination?.total ?? 0);
      } catch (err: any) {
        console.error("Progress loading error:", err);
        setError(
          err?.response?.data?.message ||
            "Unable to load your progress right now.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dateFilter],
  );

  useFocusEffect(
    useCallback(() => {
      const firstLoad = !hasLoadedOnce.current;
      hasLoadedOnce.current = true;

      loadData(page, {
        showLoader: firstLoad,
      });
    }, [loadData, page]),
  );

  const handleRefresh = useCallback(() => {
    loadData(page, {
      showRefreshing: true,
    });
  }, [loadData, page]);

  const tracking = summary?.tracking;

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return history.filter((entry) => {
      const matchesSearch = !query || getEntrySearchText(entry).includes(query);

      if (!matchesSearch) return false;

      if (quickFilter === "activity") {
        return (entry.completedActivities?.length ?? 0) > 0;
      }

      if (quickFilter === "notes") {
        return Boolean(entry.notes?.trim());
      }

      if (quickFilter === "wellness") {
        return (
          entry.mood !== undefined ||
          entry.energyLevel !== undefined ||
          entry.stressLevel !== undefined
        );
      }

      return true;
    });
  }, [history, search, quickFilter]);

  const todayEntry = useMemo(() => {
    const today = getTodayString();

    return (
      history.find((entry) => {
        const date = new Date(entry.date);

        if (Number.isNaN(date.getTime())) return false;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}` === today;
      }) ?? null
    );
  }, [history]);

  const hasTodayEntry = Boolean(todayEntry);

  const filterLabel = {
    "7": "Last 7 days",
    "30": "Last 30 days",
    "90": "Last 90 days",
    all: "All time",
  }[dateFilter];

  if (loading && !refreshing) {
    return <ProgressSkeleton />;
  }

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
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
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between pt-4">
          <View className="flex-1 pr-4">
            <Text className="text-[28px] font-bold text-[#263128]">
              Progress
            </Text>
            <Text className="mt-1 text-[12px] leading-5 text-[#7C827A]">
              Your wellness history and daily check-ins.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/progress-create" as any)}
            className="h-11 w-11 items-center justify-center rounded-xl bg-[#304B36] active:opacity-80"
          >
            <Ionicons name="add" size={23} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="mt-5 flex-row items-center rounded-[18px] border border-[#E5E3DB] bg-white px-4">
          <Ionicons name="search-outline" size={18} color={COLORS.softMuted} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search date, activity, note, mood..."
            placeholderTextColor="#A4A89F"
            className="h-12 flex-1 px-3 text-[13px] text-[#263128]"
            returnKeyType="search"
          />

          {search.length > 0 ? (
            <Pressable
              onPress={() => setSearch("")}
              className="h-7 w-7 items-center justify-center rounded-full bg-[#F1F2ED]"
            >
              <Ionicons name="close" size={14} color={COLORS.muted} />
            </Pressable>
          ) : null}
        </View>

        {/* Date filter */}
        <View className="mt-5">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[11px] font-semibold text-[#7C827A]">
              Time period
            </Text>
            <Text className="text-[10px] text-[#A4A89F]">{filterLabel}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FilterChip
              label="7 days"
              active={dateFilter === "7"}
              onPress={() => {
                setDateFilter("7");
                setPage(1);
              }}
            />
            <FilterChip
              label="30 days"
              active={dateFilter === "30"}
              onPress={() => {
                setDateFilter("30");
                setPage(1);
              }}
            />
            <FilterChip
              label="90 days"
              active={dateFilter === "90"}
              onPress={() => {
                setDateFilter("90");
                setPage(1);
              }}
            />
            <FilterChip
              label="All time"
              active={dateFilter === "all"}
              onPress={() => {
                setDateFilter("all");
                setPage(1);
              }}
            />
          </ScrollView>
        </View>

        {/* Error */}
        {error ? (
          <View className="mt-5 rounded-[18px] border border-[#F0D4D4] bg-[#F8EAEA] p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={COLORS.red}
              />
              <Text className="ml-2 flex-1 text-[12px] leading-5 text-[#A74E4E]">
                {error}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                loadData(page, {
                  showLoader: true,
                })
              }
              className="mt-3 self-start rounded-lg bg-white px-3.5 py-2"
            >
              <Text className="text-[10px] font-bold text-[#A74E4E]">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Summary */}
        <View className="mt-6 rounded-[22px] bg-[#304B36] p-5">
          <View className="flex-row items-start">
            <View className="flex-1 pr-3">
              <Text className="text-[10px] font-bold tracking-[1.2px] text-[#BBD0BA]">
                WELLNESS SUMMARY
              </Text>

              <Text className="mt-2 text-[21px] font-bold leading-7 text-white">
                Your recent check-ins at a glance.
              </Text>

              <Text className="mt-2 text-[11px] leading-5 text-[#D5E0D4]">
                {filterLabel} of recorded wellness information.
              </Text>
            </View>

            <View className="h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Ionicons name="stats-chart-outline" size={20} color="#DDEBDD" />
            </View>
          </View>

          <View className="mt-5 flex-row">
            <View className="flex-1">
              <Text className="text-[25px] font-bold text-white">
                {tracking?.daysTracked ?? 0}
              </Text>
              <Text className="mt-1 text-[9px] text-[#BBD0BA]">
                days tracked
              </Text>
            </View>

            <View className="mx-3 h-8 w-px bg-white/15" />

            <View className="flex-1">
              <Text className="text-[25px] font-bold text-white">
                {tracking?.averageMood ?? "—"}
              </Text>
              <Text className="mt-1 text-[9px] text-[#BBD0BA]">
                average mood
              </Text>
            </View>

            <View className="mx-3 h-8 w-px bg-white/15" />

            <View className="flex-1">
              <Text className="text-[25px] font-bold text-white">
                {totalEntries}
              </Text>
              <Text className="mt-1 text-[9px] text-[#BBD0BA]">check-ins</Text>
            </View>
          </View>
        </View>

        {/* Today */}
        <View className="mt-7">
          <View className="mb-3 flex-row items-end justify-between">
            <View>
              <Text className="text-[19px] font-bold text-[#263128]">
                Today
              </Text>
              <Text className="mt-1 text-[10px] text-[#8A9088]">
                {hasTodayEntry
                  ? "Today's check-in is already recorded."
                  : "Keep your daily check-in up to date."}
              </Text>
            </View>

            {hasTodayEntry ? (
              <View className="flex-row items-center rounded-full bg-[#EAF1E8] px-3 py-1.5">
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={COLORS.green}
                />
                <Text className="ml-1 text-[10px] font-bold text-[#4D6A50]">
                  Logged
                </Text>
              </View>
            ) : null}
          </View>

          <Pressable
            onPress={() => {
              if (todayEntry?._id) {
                router.push({
                  pathname: "/progress-create",
                  params: {
                    id: todayEntry._id,
                  },
                } as any);
              } else {
                router.push("/progress-create" as any);
              }
            }}
            className="rounded-[18px] border border-[#DDE7D9] bg-[#EAF1E8] p-4 active:opacity-80"
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                <Ionicons
                  name={hasTodayEntry ? "create-outline" : "add-circle-outline"}
                  size={21}
                  color={COLORS.green}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-bold text-[#263128]">
                  {hasTodayEntry
                    ? "Update today's progress"
                    : "Record today's progress"}
                </Text>
                <Text className="mt-1 text-[10px] leading-4 text-[#6F766E]">
                  Mood, sleep, movement and daily habits.
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={17} color={COLORS.muted} />
            </View>
          </Pressable>
        </View>

        {/* Wellness overview */}
        <View className="mt-7">
          <View className="mb-3">
            <Text className="text-[19px] font-bold text-[#263128]">
              Wellness overview
            </Text>
            <Text className="mt-1 text-[10px] text-[#8A9088]">
              Averages and totals for {filterLabel.toLowerCase()}.
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            <MetricCard
              icon="moon-outline"
              label="Average sleep"
              value={
                tracking?.averageSleepHours !== null &&
                tracking?.averageSleepHours !== undefined
                  ? String(tracking.averageSleepHours)
                  : "—"
              }
              unit="hrs"
            />

            <MetricCard
              icon="water-outline"
              label="Water intake"
              value={
                tracking?.averageWaterIntakeLiters !== null &&
                tracking?.averageWaterIntakeLiters !== undefined
                  ? String(tracking.averageWaterIntakeLiters)
                  : "—"
              }
              unit="L"
            />

            <MetricCard
              icon="walk-outline"
              label="Average steps"
              value={
                tracking?.averageSteps !== null &&
                tracking?.averageSteps !== undefined
                  ? Math.round(tracking.averageSteps).toLocaleString()
                  : "—"
              }
            />

            <MetricCard
              icon="fitness-outline"
              label="Exercise"
              value={formatMinutes(tracking?.totalExerciseMinutes ?? 0)}
            />

            <MetricCard
              icon="body-outline"
              label="Yoga"
              value={formatMinutes(tracking?.totalYogaMinutes ?? 0)}
            />

            <MetricCard
              icon="leaf-outline"
              label="Meditation"
              value={formatMinutes(tracking?.totalMeditationMinutes ?? 0)}
            />
          </View>
        </View>

        {/* Feelings */}
        <View className="mt-7 rounded-[22px] border border-[#E5E3DB] bg-white p-5">
          <Text className="text-[18px] font-bold text-[#263128]">
            Wellbeing ratings
          </Text>
          <Text className="mb-5 mt-1 text-[10px] text-[#8A9088]">
            Average ratings during {filterLabel.toLowerCase()}.
          </Text>

          <RatingBar
            label="Mood"
            value={tracking?.averageMood ?? null}
            icon="happy-outline"
          />
          <RatingBar
            label="Energy"
            value={tracking?.averageEnergyLevel ?? null}
            icon="flash-outline"
          />
          <RatingBar
            label="Stress"
            value={tracking?.averageStressLevel ?? null}
            icon="pulse-outline"
          />
          <RatingBar
            label="Sleep quality"
            value={tracking?.averageSleepQuality ?? null}
            icon="moon-outline"
          />
        </View>

        {/* Goals */}
        {summary?.goals?.length ? (
          <View className="mt-7">
            <View className="mb-3 flex-row items-end justify-between">
              <View>
                <Text className="text-[19px] font-bold text-[#263128]">
                  Active goals
                </Text>
                <Text className="mt-1 text-[10px] text-[#8A9088]">
                  Current progress from your goals.
                </Text>
              </View>

              <Pressable onPress={() => router.push("/goals" as any)}>
                <Text className="text-[11px] font-bold text-[#4D6A50]">
                  View all
                </Text>
              </Pressable>
            </View>

            {summary.goals.slice(0, 3).map((goal) => (
              <View
                key={goal.id}
                className="mb-3 rounded-[18px] border border-[#E5E3DB] bg-white p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    numberOfLines={1}
                    className="flex-1 pr-4 text-[13px] font-bold text-[#263128]"
                  >
                    {goal.title}
                  </Text>
                  <Text className="text-[12px] font-bold text-[#4D6A50]">
                    {goal.progressPercentage}%
                  </Text>
                </View>

                <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EEF0EB]">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(goal.progressPercentage, 100)}%`,
                      backgroundColor: COLORS.green,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Check-ins */}
        <View className="mt-7">
          <View className="mb-3">
            <Text className="text-[19px] font-bold text-[#263128]">
              Check-ins
            </Text>
            <Text className="mt-1 text-[10px] text-[#8A9088]">
              {search.trim()
                ? `Showing matches in the current page`
                : `${totalEntries} ${
                    totalEntries === 1 ? "check-in" : "check-ins"
                  } in ${filterLabel.toLowerCase()}`}
            </Text>
          </View>

          {/* Quick filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
          >
            <FilterChip
              label="All"
              active={quickFilter === "all"}
              onPress={() => setQuickFilter("all")}
            />
            <FilterChip
              label="Activities"
              active={quickFilter === "activity"}
              onPress={() => setQuickFilter("activity")}
            />
            <FilterChip
              label="Notes"
              active={quickFilter === "notes"}
              onPress={() => setQuickFilter("notes")}
            />
            <FilterChip
              label="Mood / energy"
              active={quickFilter === "wellness"}
              onPress={() => setQuickFilter("wellness")}
            />
          </ScrollView>

          {filteredHistory.length === 0 ? (
            <EmptyHistory
              searchActive={Boolean(search.trim()) || quickFilter !== "all"}
              onAdd={() => router.push("/progress-create" as any)}
            />
          ) : (
            filteredHistory.map((entry) => (
              <HistoryItem
                key={entry._id}
                entry={entry}
                onPress={() =>
                  router.push({
                    pathname: "/progress/[id]",
                    params: {
                      id: entry._id,
                    },
                  })
                }
              />
            ))
          )}
        </View>

        {/* Pagination */}
        {totalPages > 1 ? (
          <View className="mt-2 flex-row items-center justify-between rounded-[18px] border border-[#E5E3DB] bg-white px-3 py-3">
            <Pressable
              disabled={page <= 1 || loading}
              onPress={() => {
                if (page > 1) {
                  setPage((current) => current - 1);
                }
              }}
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{
                backgroundColor: page <= 1 ? "#F3F3EE" : COLORS.lightGreen,
                opacity: page <= 1 ? 0.45 : 1,
              }}
            >
              <Ionicons name="chevron-back" size={16} color={COLORS.green} />
            </Pressable>

            <View className="items-center">
              <Text className="text-[11px] font-bold text-[#263128]">
                Page {page} of {totalPages}
              </Text>
              <Text className="mt-0.5 text-[9px] text-[#A4A89F]">
                {totalEntries} total check-ins
              </Text>
            </View>

            <Pressable
              disabled={page >= totalPages || loading}
              onPress={() => {
                if (page < totalPages) {
                  setPage((current) => current + 1);
                }
              }}
              className="h-9 w-9 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  page >= totalPages ? "#F3F3EE" : COLORS.lightGreen,
                opacity: page >= totalPages ? 0.45 : 1,
              }}
            >
              <Ionicons name="chevron-forward" size={16} color={COLORS.green} />
            </Pressable>
          </View>
        ) : null}

        <View className="mt-6 items-center">
          <Text className="text-[9px] text-[#A4A89F]">
            Pull down anytime to refresh your progress.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
