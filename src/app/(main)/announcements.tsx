import {
  AlertCircle,
  BellRing,
  Check,
  ChevronLeft,
  Info,
  Megaphone,
  RefreshCw,
  Search,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react-native";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import AnnouncementDetailSheet from "@/components/announcements/AnnouncementDetailSheet";
import { getActiveAnnouncements } from "@/services/announcement.service";
import type { Announcement, AnnouncementType } from "@/types/announcement";

type FilterType = "all" | AnnouncementType;

const FILTERS: {
  key: FilterType;
  label: string;
  icon: typeof Info;
}[] = [
  {
    key: "all",
    label: "All",
    icon: Megaphone,
  },
  {
    key: "info",
    label: "Info",
    icon: Info,
  },
  {
    key: "success",
    label: "Success",
    icon: Check,
  },
  {
    key: "warning",
    label: "Warning",
    icon: TriangleAlert,
  },
  {
    key: "feature",
    label: "Features",
    icon: Sparkles,
  },
];

const FILTER_COLORS: Record<
  FilterType,
  {
    activeBg: string;
    activeText: string;
    icon: string;
  }
> = {
  all: {
    activeBg: "bg-slate-900",
    activeText: "text-white",
    icon: "#FFFFFF",
  },
  info: {
    activeBg: "bg-blue-600",
    activeText: "text-white",
    icon: "#FFFFFF",
  },
  success: {
    activeBg: "bg-emerald-600",
    activeText: "text-white",
    icon: "#FFFFFF",
  },
  warning: {
    activeBg: "bg-amber-500",
    activeText: "text-white",
    icon: "#FFFFFF",
  },
  feature: {
    activeBg: "bg-violet-600",
    activeText: "text-white",
    icon: "#FFFFFF",
  },
};

/* ==========================================================================
   LOADING SKELETON
========================================================================== */

function AnnouncementSkeleton() {
  return (
    <View className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-start">
        <View className="h-11 w-11 rounded-xl bg-slate-100" />

        <View className="ml-3 flex-1">
          <View className="h-5 w-24 rounded-full bg-slate-100" />

          <View className="mt-3 h-4 w-4/5 rounded-md bg-slate-100" />

          <View className="mt-2 h-4 w-3/5 rounded-md bg-slate-100" />
        </View>
      </View>

      <View className="mt-4 h-4 w-full rounded-md bg-slate-100" />

      <View className="mt-2 h-4 w-11/12 rounded-md bg-slate-100" />

      <View className="mt-2 h-4 w-3/4 rounded-md bg-slate-100" />

      <View className="mt-4 border-t border-slate-100 pt-3">
        <View className="h-3 w-24 rounded-md bg-slate-100" />
      </View>
    </View>
  );
}

/* ==========================================================================
   EMPTY STATE
========================================================================== */

function EmptyState({
  hasSearch,
  hasFilter,
  onClear,
}: {
  hasSearch: boolean;
  hasFilter: boolean;
  onClear: () => void;
}) {
  const filtered = hasSearch || hasFilter;

  return (
    <View className="mt-8 items-center rounded-3xl border border-slate-200 bg-white px-6 py-10">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Megaphone size={28} color="#64748B" />
      </View>

      <Text className="mt-5 text-center text-lg font-bold text-slate-900">
        {filtered ? "No announcements found" : "No announcements yet"}
      </Text>

      <Text className="mt-2 max-w-[300px] text-center text-sm leading-6 text-slate-500">
        {filtered
          ? "Try changing your search or selecting a different announcement type."
          : "There are currently no active announcements from Niramaya."}
      </Text>

      {filtered ? (
        <Pressable
          onPress={onClear}
          className="mt-5 flex-row items-center rounded-xl bg-slate-900 px-4 py-2.5"
        >
          <X size={15} color="#FFFFFF" />

          <Text className="ml-2 text-sm font-bold text-white">
            Clear filters
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ==========================================================================
   ERROR STATE
========================================================================== */

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View className="mt-8 items-center rounded-3xl border border-red-100 bg-red-50 px-6 py-10">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
        <AlertCircle size={27} color="#DC2626" />
      </View>

      <Text className="mt-5 text-center text-lg font-bold text-slate-900">
        Unable to load announcements
      </Text>

      <Text className="mt-2 max-w-[320px] text-center text-sm leading-6 text-slate-500">
        {message || "Something went wrong while loading announcements."}
      </Text>

      <Pressable
        onPress={onRetry}
        className="mt-5 flex-row items-center rounded-xl bg-slate-900 px-5 py-3"
      >
        <RefreshCw size={15} color="#FFFFFF" />

        <Text className="ml-2 text-sm font-bold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

/* ==========================================================================
   ANNOUNCEMENT STATISTICS
========================================================================== */

function AnnouncementStats({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const stats = useMemo(() => {
    let info = 0;
    let success = 0;
    let warning = 0;
    let feature = 0;

    for (const announcement of announcements) {
      switch (announcement.type) {
        case "info":
          info += 1;
          break;

        case "success":
          success += 1;
          break;

        case "warning":
          warning += 1;
          break;

        case "feature":
          feature += 1;
          break;
      }
    }

    return {
      total: announcements.length,
      info,
      success,
      warning,
      feature,
    };
  }, [announcements]);

  const cards = [
    {
      key: "total",
      label: "Total",
      count: stats.total,
      icon: Megaphone,
      iconColor: "#475569",
      iconBg: "bg-slate-100",
      border: "border-slate-200",
    },
    {
      key: "info",
      label: "Info",
      count: stats.info,
      icon: Info,
      iconColor: "#2563EB",
      iconBg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      key: "success",
      label: "Success",
      count: stats.success,
      icon: Check,
      iconColor: "#059669",
      iconBg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      key: "warning",
      label: "Warning",
      count: stats.warning,
      icon: TriangleAlert,
      iconColor: "#D97706",
      iconBg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      key: "feature",
      label: "Feature",
      count: stats.feature,
      icon: Sparkles,
      iconColor: "#7C3AED",
      iconBg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  return (
    <View className="mb-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingRight: 8,
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <View
              key={card.key}
              className={`mr-2.5 w-[108px] rounded-2xl border bg-white p-3.5 ${card.border}`}
            >
              <View className="flex-row items-center justify-between">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}
                >
                  <Icon size={15} color={card.iconColor} />
                </View>

                <Text className="text-xl font-bold text-slate-900">
                  {card.count}
                </Text>
              </View>

              <Text className="mt-3 text-xs font-semibold text-slate-500">
                {card.label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ==========================================================================
   MAIN SCREEN
========================================================================== */

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const scrollViewRef = useRef<ScrollView | null>(null);

  const searchInputRef = useRef<TextInput | null>(null);

  /* ==========================================================================
     LOAD ANNOUNCEMENTS
  ========================================================================== */

  const loadAnnouncements = useCallback(async () => {
    try {
      setError("");

      const data = await getActiveAnnouncements();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

      setAnnouncements(sorted);
    } catch (err) {
      console.error("Failed to load announcements:", err);

      const message =
        err instanceof Error ? err.message : "Unable to load announcements.";

      setError(message);
      setAnnouncements([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  /* ==========================================================================
     REFRESH
  ========================================================================== */

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnnouncements();
  }, [loadAnnouncements]);

  /* ==========================================================================
     SEARCH + FILTER
  ========================================================================== */

  const filteredAnnouncements = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return announcements.filter((announcement) => {
      const matchesType =
        selectedFilter === "all" || announcement.type === selectedFilter;

      if (!matchesType) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        announcement.title.toLowerCase().includes(normalizedSearch) ||
        announcement.message.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [announcements, searchQuery, selectedFilter]);

  /* ==========================================================================
     CLEAR FILTERS
  ========================================================================== */

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedFilter("all");

    searchInputRef.current?.blur();

    Keyboard.dismiss();

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    });
  }, []);

  /* ==========================================================================
     SEARCH FOCUS
  ========================================================================== */

  const handleSearchFocus = useCallback(() => {
    setTimeout(
      () => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      },
      Platform.OS === "ios" ? 150 : 250,
    );
  }, []);

  /* ==========================================================================
     ACTION ROUTE
  ========================================================================== */

  const handleActionPress = useCallback((route: string) => {
    setSelectedAnnouncement(null);

    Keyboard.dismiss();

    if (!route) {
      return;
    }

    if (route.startsWith("/")) {
      router.push(route as never);
      return;
    }

    router.push(`/${route}` as never);
  }, []);

  const hasSearch = searchQuery.trim().length > 0;

  const hasFilter = selectedFilter !== "all";

  /* ==========================================================================
     UI
  ========================================================================== */

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-slate-50"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ====================================================================
          HEADER
      ==================================================================== */}

      <View className="border-b border-slate-200 bg-white px-4 pb-4 pt-2">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              router.back();
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
          >
            <ChevronLeft size={21} color="#0F172A" />
          </Pressable>

          <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Megaphone size={20} color="#2563EB" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-xl font-bold text-slate-900">
              Announcements
            </Text>

            <Text
              numberOfLines={1}
              className="mt-0.5 text-xs font-medium text-slate-500"
            >
              Stay updated with Niramaya
            </Text>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <BellRing size={18} color="#475569" />
          </View>
        </View>
      </View>

      {/* ====================================================================
          MAIN SCROLL VIEW
      ==================================================================== */}

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2563EB"
            colors={["#2563EB"]}
          />
        }
      >
        {/* ==================================================================
            INTRO
        ================================================================== */}

        <View className="mb-4">
          <Text className="text-sm leading-6 text-slate-500">
            Important updates, new features, helpful information and
            announcements from Niramaya.
          </Text>
        </View>

        {/* ==================================================================
            SEARCH
        ================================================================== */}

        <View className="mb-4 flex-row items-center rounded-2xl border border-slate-200 bg-white px-3.5">
          <Search size={19} color="#94A3B8" />

          <TextInput
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            placeholder="Search announcements..."
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            blurOnSubmit={false}
            className="ml-2 flex-1 py-3.5 text-sm text-slate-900"
          />

          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => {
                setSearchQuery("");

                requestAnimationFrame(() => {
                  searchInputRef.current?.focus();
                });
              }}
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-full bg-slate-100"
            >
              <X size={15} color="#64748B" />
            </Pressable>
          ) : null}
        </View>

        {/* ==================================================================
            FILTERS
        ================================================================== */}

        <View className="mb-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingRight: 8,
            }}
          >
            {FILTERS.map((filter) => {
              const active = selectedFilter === filter.key;

              const Icon = filter.icon;

              const colors = FILTER_COLORS[filter.key];

              let inactiveIconColor = "#475569";

              if (filter.key === "info") {
                inactiveIconColor = "#2563EB";
              }

              if (filter.key === "success") {
                inactiveIconColor = "#059669";
              }

              if (filter.key === "warning") {
                inactiveIconColor = "#D97706";
              }

              if (filter.key === "feature") {
                inactiveIconColor = "#7C3AED";
              }

              return (
                <Pressable
                  key={filter.key}
                  onPress={() => setSelectedFilter(filter.key)}
                  className={`
                    mr-2
                    flex-row
                    items-center
                    rounded-full
                    border
                    px-3.5
                    py-2.5
                    ${
                      active
                        ? `${colors.activeBg} border-transparent`
                        : "border-slate-200 bg-white"
                    }
                  `}
                >
                  <Icon
                    size={14}
                    color={active ? colors.icon : inactiveIconColor}
                  />

                  <Text
                    className={`
                      ml-1.5
                      text-xs
                      font-bold
                      ${active ? colors.activeText : "text-slate-600"}
                    `}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ==================================================================
            STATISTICS CARDS
        ================================================================== */}

        {!loading && !error ? (
          <AnnouncementStats announcements={announcements} />
        ) : null}

        {/* ==================================================================
            SECTION HEADER
        ================================================================== */}

        {!loading && !error ? (
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-base font-bold text-slate-900">
                Latest updates
              </Text>

              <Text className="mt-0.5 text-xs text-slate-400">
                {filteredAnnouncements.length}{" "}
                {filteredAnnouncements.length === 1
                  ? "announcement"
                  : "announcements"}
              </Text>
            </View>

            {hasSearch || hasFilter ? (
              <Pressable onPress={clearFilters}>
                <Text className="text-xs font-bold text-blue-600">Clear</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {/* ==================================================================
            CONTENT
        ================================================================== */}

        {loading ? (
          <>
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
          </>
        ) : error ? (
          <ErrorState message={error} onRetry={loadAnnouncements} />
        ) : filteredAnnouncements.length === 0 ? (
          <EmptyState
            hasSearch={hasSearch}
            hasFilter={hasFilter}
            onClear={clearFilters}
          />
        ) : (
          <>
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onPress={setSelectedAnnouncement}
              />
            ))}

            <View className="mt-2 items-center">
              <View className="flex-row items-center rounded-full bg-slate-100 px-3 py-2">
                <Info size={13} color="#94A3B8" />

                <Text className="ml-1.5 text-[11px] font-medium text-slate-400">
                  You're viewing active announcements
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* ====================================================================
          DETAIL SHEET
      ==================================================================== */}

      <AnnouncementDetailSheet
        announcement={selectedAnnouncement}
        visible={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        onActionPress={handleActionPress}
      />
    </SafeAreaView>
  );
}
